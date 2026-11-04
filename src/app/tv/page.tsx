"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFestStore } from "@/lib/store";
import { School, Team, Track } from "@/lib/types/database";
import {
  Trophy,
  Radio,
  Maximize2,
  Minimize2,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  Sparkles,
  Bot,
  Wrench,
  Award,
  ShieldCheck,
  Building2,
  Zap,
} from "lucide-react";

export default function StandaloneTvPage() {
  const { tracks, teams, schools, announcements, resultsPublished } = useFestStore();

  // Sequence stages: 0..(tracks.length - 1) = individual tracks, tracks.length = overall school leaderboard
  const [currentStage, setCurrentStage] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [countdown, setCountdown] = useState(12);
  const [currentTime, setCurrentTime] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const totalStages = Math.max(1, tracks.length + 1);
  const isOverallStage = currentStage === tracks.length;
  const currentTrack = !isOverallStage ? tracks[currentStage] || tracks[0] : null;

  // Real-time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen Listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard Shortcuts (F = Fullscreen, Space = Play/Pause, ArrowRight = Next stage)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.code === "Space") {
        e.preventDefault();
        setAutoRotate((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        nextStage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalStages]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const nextStage = () => {
    setCurrentStage((prev) => (prev + 1) % totalStages);
    setAnimKey((k) => k + 1);
    setCountdown(12);
  };

  // Automatic Rotation: Event 1 -> Event 2 -> Event 3 -> Overall Leaderboard -> Loop Repeat
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentStage((curr) => (curr + 1) % totalStages);
          setAnimKey((k) => k + 1);
          return 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRotate, totalStages]);

  // Ranked Teams for the active individual event
  const trackTeams = useMemo(() => {
    if (!currentTrack) return [];
    return teams
      .filter((t) => t.track_id === currentTrack.id)
      .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
  }, [teams, currentTrack]);

  // Aggregated Overall Institutional Leaderboard (All Schools)
  const overallSchoolStandings = useMemo(() => {
    const map = new Map<string, { school: School; totalPoints: number; teamCount: number; golds: number }>();

    schools.forEach((s) => {
      map.set(s.id, { school: s, totalPoints: 0, teamCount: 0, golds: 0 });
    });

    teams.forEach((t) => {
      if (!t.school_id) return;
      let entry = map.get(t.school_id);
      if (!entry) {
        const fallbackSchool: School = {
          id: t.school_id,
          name: "Independent Delegation",
          code: "IND",
          address: null,
          city: "Campus",
          contact_email: "",
          contact_phone: "",
          status: "approved",
          approved_by: null,
          approved_at: null,
          arrived: true,
          created_at: "",
          updated_at: "",
        };
        entry = { school: fallbackSchool, totalPoints: 0, teamCount: 0, golds: 0 };
        map.set(t.school_id, entry);
      }
      entry.totalPoints += t.score_total || 0;
      entry.teamCount += 1;
    });

    // Count gold medals per school
    tracks.forEach((track) => {
      const topInTrack = teams
        .filter((t) => t.track_id === track.id && (t.score_total || 0) > 0)
        .sort((a, b) => (b.score_total || 0) - (a.score_total || 0))[0];
      if (topInTrack?.school_id && map.has(topInTrack.school_id)) {
        map.get(topInTrack.school_id)!.golds += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [schools, teams, tracks]);

  // Announcements
  const urgentAnnouncements = announcements.filter((a) => a.urgent);

  // Helper icons for tracks
  const getTrackIcon = (trackName: string) => {
    const lower = trackName.toLowerCase();
    if (lower.includes("robo")) return <Bot className="w-6 h-6 text-black" />;
    if (lower.includes("scrap")) return <Wrench className="w-6 h-6 text-black" />;
    return <Sparkles className="w-6 h-6 text-black" />;
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#FFFBEB] text-black font-sans select-none">
      {/* Top Countdown Animation Line */}
      <div className="w-full h-1.5 bg-black/10 overflow-hidden flex-shrink-0">
        <div
          className="h-full bg-[#FF5252] transition-all duration-1000 ease-linear"
          style={{ width: `${((12 - countdown) / 12) * 100}%` }}
        />
      </div>

      {/* Main Kiosk Header Bar */}
      <header className="px-6 py-3 bg-white border-b-[3px] border-black flex items-center justify-between gap-4 flex-shrink-0 shadow-[0_3px_0px_#000000]">
        {/* Brand & Live Pill */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center font-black flex-shrink-0">
            <Radio className="w-6 h-6 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-[#FFEB3B] text-[10px] font-black uppercase tracking-wider">
                LIVE VENUE ARENA DISPLAY
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-black text-black">
                <span className="h-2 w-2 rounded-full bg-[#4CAF50] inline-block animate-ping" />
                Telemetry Streaming
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-none mt-1">
              SPARK 2026 — Inter-School Tech Fest
            </h1>
          </div>
        </div>

        {/* Center: Stage Sequence Navigator (Animated Events + Overall Trophy) */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000000]">
          {tracks.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setCurrentStage(idx);
                setAnimKey((k) => k + 1);
                setCountdown(12);
              }}
              className={`px-3 py-1 text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                currentStage === idx
                  ? "bg-black text-[#FFEB3B] border-black shadow-[2px_2px_0px_#2196F3]"
                  : "bg-white text-black border-transparent hover:border-black"
              }`}
            >
              <span>Event {idx + 1}: {t.name}</span>
              {currentStage === idx && <span className="text-[10px] bg-[#FFEB3B] text-black px-1 rounded-sm">{countdown}s</span>}
            </button>
          ))}
          <button
            onClick={() => {
              setCurrentStage(tracks.length);
              setAnimKey((k) => k + 1);
              setCountdown(12);
            }}
            className={`px-3 py-1 text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
              isOverallStage
                ? "bg-[#9C27B0] text-white border-black shadow-[2px_2px_0px_#FFEB3B]"
                : "bg-white text-black border-transparent hover:border-black"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-[#FFEB3B]" />
            <span>🏆 Overall Championship</span>
            {isOverallStage && <span className="text-[10px] bg-[#FFEB3B] text-black px-1 rounded-sm">{countdown}s</span>}
          </button>
        </div>

        {/* Right Controls: Auto Cycle Toggle, Clock & Fullscreen */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 border-2 border-black font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer ${
              autoRotate ? "bg-[#4CAF50] text-black" : "bg-[#FFEB3B] text-black"
            }`}
            title="Press SPACE to toggle auto-rotation"
          >
            {autoRotate ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Cycling ({countdown}s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>

          <div className="px-3 py-1.5 bg-black text-[#FFEB3B] font-mono text-xs sm:text-sm font-black border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FFEB3B]" />
            <span>{currentTime || "00:00:00"}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-[#FFEB3B] hover:bg-black hover:text-[#FFEB3B] text-black border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer transition-colors"
            title="Press F for Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Split Screen Area: Edge-to-Edge Animated Windows */}
      <main className="flex-1 p-5 overflow-hidden">
        <div className="grid grid-cols-12 gap-5 h-[calc(100vh-130px)]">
          {/* ========================================================================= */}
          {/* LEFT WINDOW: ANIMATED LEADERBOARD (CYCLES THROUGH EACH EVENT & OVERALL) */}
          {/* ========================================================================= */}
          <div
            key={`left-${animKey}-${currentStage}`}
            className="col-span-7 flex flex-col justify-between p-5 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] overflow-hidden animate-event-left"
          >
            <div>
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000]">
                    {isOverallStage ? (
                      <Trophy className="w-6 h-6 text-black animate-trophy" />
                    ) : (
                      getTrackIcon(currentTrack?.name || "")
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-black text-[#FFEB3B]">
                        {isOverallStage ? "FINAL TROPHY STANDINGS" : `EVENT ${currentStage + 1} OF ${tracks.length}`}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {isOverallStage ? "All Tracks Aggregated" : "Track Standings"}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
                      {isOverallStage
                        ? "🏆 SPARK Rolling Trophy — Overall School Championship"
                        : currentTrack?.name}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-[#4CAF50] text-black border border-black text-xs font-black uppercase">
                    {resultsPublished ? "Official Verified" : "Live Scoring Active"}
                  </span>
                </div>
              </div>

              {/* =================================================================== */}
              {/* STAGE CASE A: INDIVIDUAL TRACK EVENT PODIUM & TABLE                */}
              {/* =================================================================== */}
              {!isOverallStage && (
                <>
                  {/* Olympic Podium for Track */}
                  <div className="grid grid-cols-3 gap-3 mb-4 items-end">
                    {/* #2 Silver */}
                    <div className="animate-podium-2 p-3 bg-[#E0E0E0] border-[3px] border-black text-center shadow-[3px_3px_0px_#000000] h-36 flex flex-col justify-between">
                      <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto">
                        🥈
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-800">Runner Up (#2)</span>
                        <h3 className="text-sm font-black text-black truncate">{trackTeams[1]?.name || "Evaluating"}</h3>
                        <p className="text-[10px] font-bold text-slate-800 truncate">
                          {schools.find((s) => s.id === trackTeams[1]?.school_id)?.name || "—"}
                        </p>
                      </div>
                      <div className="p-1 bg-white border border-black font-black text-sm text-black">
                        {trackTeams[1]?.score_total || 0} pts
                      </div>
                    </div>

                    {/* #1 Gold Champion */}
                    <div className="animate-podium-1 p-4 bg-[#FFEB3B] border-[3px] border-black text-center shadow-[5px_5px_0px_#000000] h-48 flex flex-col justify-between animate-gold-glow">
                      <div className="w-9 h-9 bg-black text-[#FFEB3B] border-2 border-black font-black text-base flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                        🥇
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-black">EVENT CHAMPION (#1)</span>
                        <h3 className="text-base font-black text-black truncate">{trackTeams[0]?.name || "Evaluating"}</h3>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {schools.find((s) => s.id === trackTeams[0]?.school_id)?.name || "—"}
                        </p>
                      </div>
                      <div className="p-1.5 bg-white border-2 border-black font-black text-lg text-black">
                        {trackTeams[0]?.score_total || 0} pts
                      </div>
                    </div>

                    {/* #3 Bronze */}
                    <div className="animate-podium-3 p-3 bg-[#FFCCBC] border-[3px] border-black text-center shadow-[3px_3px_0px_#000000] h-32 flex flex-col justify-between">
                      <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto">
                        🥉
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-800">2nd Runner Up (#3)</span>
                        <h3 className="text-sm font-black text-black truncate">{trackTeams[2]?.name || "Evaluating"}</h3>
                        <p className="text-[10px] font-bold text-slate-800 truncate">
                          {schools.find((s) => s.id === trackTeams[2]?.school_id)?.name || "—"}
                        </p>
                      </div>
                      <div className="p-1 bg-white border border-black font-black text-sm text-black">
                        {trackTeams[2]?.score_total || 0} pts
                      </div>
                    </div>
                  </div>

                  {/* Track Table */}
                  <div className="border-[3px] border-black overflow-hidden shadow-[3px_3px_0px_#000000]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black text-[#FFEB3B] font-black uppercase text-[10px]">
                        <tr>
                          <th className="p-2 w-14 text-center">Rank</th>
                          <th className="p-2">Team Squad</th>
                          <th className="p-2">Institution</th>
                          <th className="p-2 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black">
                        {trackTeams.slice(0, 5).map((team, idx) => {
                          const school = schools.find((s) => s.id === team.school_id);
                          return (
                            <tr
                              key={team.id}
                              className={`font-bold transition-colors ${
                                idx === 0
                                  ? "bg-[#FFF9C4]"
                                  : idx === 1
                                  ? "bg-[#F5F5F5]"
                                  : idx === 2
                                  ? "bg-[#FBE9E7]"
                                  : "bg-white"
                              }`}
                            >
                              <td className="p-2 text-center font-black">
                                {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                              </td>
                              <td className="p-2 font-black text-black">{team.name}</td>
                              <td className="p-2 font-bold text-slate-800 truncate">{school?.name || "Independent"}</td>
                              <td className="p-2 text-right font-black text-sm text-black">
                                {team.score_total || 0} pts
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* =================================================================== */}
              {/* STAGE CASE B: OVERALL SCHOOL CHAMPIONSHIP PODIUM & TABLE           */}
              {/* =================================================================== */}
              {isOverallStage && (
                <>
                  {/* Overall Schools Podium */}
                  <div className="grid grid-cols-3 gap-3 mb-4 items-end">
                    {/* #2 School Silver */}
                    <div className="animate-podium-2 p-3 bg-[#E0E0E0] border-[3px] border-black text-center shadow-[3px_3px_0px_#000000] h-36 flex flex-col justify-between">
                      <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto">
                        🥈
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-800">2nd Overall</span>
                        <h3 className="text-sm font-black text-black truncate">
                          {overallSchoolStandings[1]?.school.name || "School 2"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-700">
                          {overallSchoolStandings[1]?.school.city || "Campus"} • {overallSchoolStandings[1]?.teamCount || 0} Squads
                        </p>
                      </div>
                      <div className="p-1 bg-white border border-black font-black text-sm text-black">
                        {overallSchoolStandings[1]?.totalPoints || 0} total pts
                      </div>
                    </div>

                    {/* #1 School Gold Champion */}
                    <div className="animate-podium-1 p-4 bg-[#FFEB3B] border-[3px] border-black text-center shadow-[5px_5px_0px_#000000] h-48 flex flex-col justify-between animate-gold-glow">
                      <div className="w-9 h-9 bg-black text-[#FFEB3B] border-2 border-black font-black text-base flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                        🏆
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-black">ROLLING TROPHY WINNER</span>
                        <h3 className="text-base font-black text-black truncate">
                          {overallSchoolStandings[0]?.school.name || "Leading Institution"}
                        </h3>
                        <p className="text-xs font-bold text-slate-900">
                          {overallSchoolStandings[0]?.school.city || "Campus"} • {overallSchoolStandings[0]?.golds || 0} Golds
                        </p>
                      </div>
                      <div className="p-1.5 bg-white border-2 border-black font-black text-lg text-black">
                        {overallSchoolStandings[0]?.totalPoints || 0} total pts
                      </div>
                    </div>

                    {/* #3 School Bronze */}
                    <div className="animate-podium-3 p-3 bg-[#FFCCBC] border-[3px] border-black text-center shadow-[3px_3px_0px_#000000] h-32 flex flex-col justify-between">
                      <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto">
                        🥉
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-800">3rd Overall</span>
                        <h3 className="text-sm font-black text-black truncate">
                          {overallSchoolStandings[2]?.school.name || "School 3"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-700">
                          {overallSchoolStandings[2]?.school.city || "Campus"} • {overallSchoolStandings[2]?.teamCount || 0} Squads
                        </p>
                      </div>
                      <div className="p-1 bg-white border border-black font-black text-sm text-black">
                        {overallSchoolStandings[2]?.totalPoints || 0} total pts
                      </div>
                    </div>
                  </div>

                  {/* Overall Schools Rankings Table */}
                  <div className="border-[3px] border-black overflow-hidden shadow-[3px_3px_0px_#000000]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black text-[#FFEB3B] font-black uppercase text-[10px]">
                        <tr>
                          <th className="p-2 w-14 text-center">Rank</th>
                          <th className="p-2">School Institution</th>
                          <th className="p-2 text-center">Squads Fielded</th>
                          <th className="p-2 text-right">Aggregate Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black">
                        {overallSchoolStandings.slice(0, 5).map((entry, idx) => (
                          <tr
                            key={entry.school.id}
                            className={`font-bold transition-colors ${
                              idx === 0
                                ? "bg-[#FFF9C4]"
                                : idx === 1
                                ? "bg-[#F5F5F5]"
                                : idx === 2
                                ? "bg-[#FBE9E7]"
                                : "bg-white"
                            }`}
                          >
                            <td className="p-2 text-center font-black">
                              {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                            </td>
                            <td className="p-2">
                              <span className="font-black text-black block text-xs">{entry.school.name}</span>
                              <span className="text-[10px] text-slate-700 block">{entry.school.city} • Code: {entry.school.code}</span>
                            </td>
                            <td className="p-2 text-center font-black">{entry.teamCount} Teams</td>
                            <td className="p-2 text-right font-black text-sm text-black">
                              {entry.totalPoints} pts
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT WINDOW: ANIMATED BROADCAST ANNOUNCEMENTS & BULLETIN BOARD           */}
          {/* ========================================================================= */}
          <div
            key={`right-${animKey}-${currentStage}`}
            className="col-span-5 flex flex-col p-5 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] overflow-hidden animate-slide-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black flex-shrink-0">
              <div className="flex items-center gap-2">
                <Radio className="w-6 h-6 text-black animate-pulse" />
                <div>
                  <h2 className="text-xl font-black text-black leading-tight">Broadcast Announcements</h2>
                  <p className="text-[10px] font-bold text-slate-700">Official Campus & Stage Notices</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-[#FF5252] text-black border border-black text-[10px] font-black uppercase">
                {announcements.length} Live Notices
              </span>
            </div>

            {/* Featured Urgent Callout Banner */}
            {urgentAnnouncements.length > 0 && (
              <div className="mb-3 p-3.5 bg-[#FF5252] border-[3px] border-black text-black shadow-[4px_4px_0px_#000000] flex-shrink-0">
                <div className="flex items-center gap-1.5 font-black text-xs uppercase mb-1">
                  <AlertTriangle className="w-4 h-4 text-black" />
                  <span>URGENT MARSHAL NOTICE</span>
                </div>
                <h3 className="font-black text-sm">{urgentAnnouncements[0].title}</h3>
                <p className="text-xs font-bold mt-1 text-black leading-snug">{urgentAnnouncements[0].body}</p>
              </div>
            )}

            {/* Scrolling Feed of Announcements */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {announcements.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-all ${
                    idx === currentStage % Math.max(1, announcements.length)
                      ? "bg-[#FFF9C4] border-black ring-2 ring-black"
                      : "bg-[#FFFBEB]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-800 mb-1">
                    <span className="px-1.5 py-0.5 bg-black text-[#FFEB3B]">
                      {item.audience.toUpperCase()}
                    </span>
                    <span>
                      {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-black">{item.title}</h4>
                  <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Animated Marquee Ticker at Bottom */}
      <footer className="h-10 bg-black text-[#FFEB3B] border-t-[3px] border-black flex items-center px-4 flex-shrink-0 z-50 shadow-[0_-3px_0px_#000000]">
        <div className="flex items-center gap-2 flex-shrink-0 mr-4">
          <span className="px-2 py-0.5 bg-[#FF5252] text-black text-[10px] font-black uppercase tracking-wider">
            BREAKING MARQUEE
          </span>
          <span className="text-sm">📢</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-block animate-marquee font-black text-xs">
            {announcements.length > 0
              ? announcements.map((a) => `[${a.title.toUpperCase()}: ${a.body}]`).join("     ★★★     ")
              : "WELCOME TO SPARK 2026 INTER-SCHOOL COLLEGE TECH FEST! ALL ARENAS LIVE AND ACTIVE."}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-4 text-[10px] text-white font-mono">
          <span className="h-2 w-2 rounded-full bg-[#4CAF50] inline-block animate-pulse" />
          <span>STAGE STREAM ONLINE</span>
        </div>
      </footer>
    </div>
  );
}
