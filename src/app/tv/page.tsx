"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFestStore } from "@/lib/store";
import { School } from "@/lib/types/database";
import {
  Trophy,
  Radio,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  AlertTriangle,
  Sparkles,
  Bot,
  Wrench,
  Award,
  Zap,
  Layers,
} from "lucide-react";

export default function StandaloneTvPage() {
  const { tracks, teams, schools, announcements, resultsPublished, publishedTrackIds, results } = useFestStore();

  // ONLY events that have been updated / published by admin will appear on the TV display!
  const updatedTracks = useMemo(() => {
    return tracks.filter((track) => {
      const isExplicitlyPublished = (publishedTrackIds || []).includes(track.id);
      const hasPublishedResults = (results || []).some((r) => r.track_id === track.id && r.is_published);
      return isExplicitlyPublished || hasPublishedResults;
    });
  }, [tracks, publishedTrackIds, results]);

  const [currentStage, setCurrentStage] = useState(0);

  const hasUpdatedTracks = updatedTracks.length > 0;
  // If no updated events, 1 stage (waiting kiosk); if updated tracks exist, stages = 0..(updatedTracks.length - 1) for events, and updatedTracks.length for overall championship
  const totalStages = hasUpdatedTracks ? updatedTracks.length + 1 : 1;
  const isOverallStage = hasUpdatedTracks && currentStage === updatedTracks.length;
  const currentTrack = hasUpdatedTracks && !isOverallStage ? updatedTracks[currentStage] || updatedTracks[0] : null;
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Fullscreen helper
  const enterFullscreen = () => {
    if (typeof document !== "undefined" && !document.fullscreenElement) {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      }
    }
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Fullscreen Listener & Automatic Fullscreen Trigger
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    // Initial check
    setIsFullscreen(!!document.fullscreenElement);

    // 1. Attempt to enter fullscreen immediately on page load
    enterFullscreen();

    // 2. Automatically trigger fullscreen on ANY user click, touch, or keypress anywhere on screen
    const handleFirstGesture = () => {
      enterFullscreen();
    };

    window.addEventListener("click", handleFirstGesture);
    window.addEventListener("touchstart", handleFirstGesture);
    window.addEventListener("keydown", handleFirstGesture);
    window.addEventListener("pointerdown", handleFirstGesture);

    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
    };
  }, []);

  // Keyboard Shortcuts (F = Fullscreen, Space = Play/Pause, ArrowRight/Left = Next/Prev stage)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === "Space") {
        e.preventDefault();
        setAutoRotate((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalStages]);

  const nextStage = () => {
    setCurrentStage((prev) => (prev + 1) % totalStages);
    setAnimKey((k) => k + 1);
  };

  const prevStage = () => {
    setCurrentStage((prev) => (prev - 1 + totalStages) % totalStages);
    setAnimKey((k) => k + 1);
  };

  // Automatic Rotation: Strict 12-second cycle per stage (silent background cycling)
  // Sequence: Event 1 -> Event 2 -> Event 3 -> Event 4 -> Event 5 -> Event 6 -> Event 7 -> Event 8 -> Overall Championship -> Loop
  useEffect(() => {
    if (!autoRotate || totalStages <= 1) return;

    const stageTimer = setTimeout(() => {
      setCurrentStage((prev) => (prev + 1) % totalStages);
      setAnimKey((k) => k + 1);
    }, 12000);

    return () => clearTimeout(stageTimer);
  }, [autoRotate, totalStages, currentStage]);

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
    if (lower.includes("quiz")) return <Trophy className="w-6 h-6 text-black" />;
    if (lower.includes("idea")) return <Sparkles className="w-6 h-6 text-black" />;
    if (lower.includes("science")) return <Zap className="w-6 h-6 text-black" />;
    if (lower.includes("article")) return <Award className="w-6 h-6 text-black" />;
    if (lower.includes("poster")) return <Layers className="w-6 h-6 text-black" />;
    return <Sparkles className="w-6 h-6 text-black" />;
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#FFFBEB] text-black font-sans select-none">
      {/* Kiosk Auto-Fullscreen Banner (Shown when not in fullscreen to guide user) */}
      {!isFullscreen && (
        <div
          onClick={enterFullscreen}
          className="w-full bg-[#FFEB3B] text-black border-b-[3px] border-black px-4 py-2 flex items-center justify-between text-xs font-black shadow-md cursor-pointer hover:bg-black hover:text-[#FFEB3B] transition-colors flex-shrink-0 animate-pulse"
          title="Click anywhere on screen to enter full screen presentation mode"
        >
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            <span>KIOSK AUTO-FULLSCREEN READY — Click anywhere on screen to expand full screen</span>
          </div>
          <span className="px-2 py-0.5 bg-black text-[#FFEB3B] text-[10px] font-mono uppercase">
            Click to Expand [F]
          </span>
        </div>
      )}

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

        {/* Right Controls: Auto Cycle Toggle & Fullscreen (no countdowns or clocks) */}
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
                <span>Cycling</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>

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
        <div className="grid grid-cols-12 gap-5 h-[calc(100vh-125px)]">
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
                    <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
                      {!hasUpdatedTracks
                        ? "⚡ SPARK Tech Fest 2026 — Live Arena Telemetry"
                        : isOverallStage
                        ? "🏆 SPARK Rolling Trophy — Overall School Championship"
                        : currentTrack?.name}
                    </h2>
                    {hasUpdatedTracks && !isOverallStage && (
                      <p className="text-[10px] font-bold text-slate-700">Official Event Leaderboard & Podium</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-[#4CAF50] text-black border border-black text-xs font-black uppercase">
                    {!hasUpdatedTracks ? "Arenas Active" : "Verified Standings"}
                  </span>
                </div>
              </div>

              {/* IF NO EVENTS UPDATED YET: DISPLAY ACTIVE ARENA WAITING DISPLAY */}
              {!hasUpdatedTracks && (
                <div className="p-8 my-6 border-[3px] border-dashed border-black bg-[#FFFBEB] text-center space-y-4">
                  <div className="w-16 h-16 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto animate-bounce">
                    <Trophy className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-black tracking-tight">
                    ARENAS IN PROGRESS • JURY SCRUTINY UNDERWAY
                  </h3>
                  <p className="text-xs font-bold text-slate-800 max-w-md mx-auto leading-relaxed">
                    Student squads are competing across all 8 campus arenas. Official event podium standings will stream live on this kiosk as soon as each event is published by the festival marshals.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#FFEB3B] border border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
                    <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-ping" />
                    <span>Awaiting Event Leaderboard Releases</span>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* STAGE CASE A: INDIVIDUAL TRACK EVENT PODIUM & TABLE                */}
              {/* =================================================================== */}
              {hasUpdatedTracks && !isOverallStage && (
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
                        <span className="text-xs font-black uppercase tracking-wider text-black">CHAMPION (#1)</span>
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

            {/* Bottom Event Navigator (Shows ONLY Updated Events) */}
            {hasUpdatedTracks && (
              <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black mt-2">
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {updatedTracks.map((tr, idx) => (
                    <button
                      key={tr.id}
                      onClick={() => {
                        setCurrentStage(idx);
                        setAnimKey((k) => k + 1);
                      }}
                      className={`px-2 py-0.5 text-[10px] uppercase font-black border border-black cursor-pointer transition-all ${
                        currentStage === idx ? "bg-black text-[#FFEB3B]" : "bg-white text-black hover:bg-[#FFEB3B]"
                      }`}
                    >
                      {tr.name}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCurrentStage(updatedTracks.length);
                      setAnimKey((k) => k + 1);
                    }}
                    className={`px-2 py-0.5 text-[10px] uppercase font-black border border-black cursor-pointer transition-all ${
                      isOverallStage ? "bg-black text-[#FFEB3B]" : "bg-white text-black hover:bg-[#FFEB3B]"
                    }`}
                  >
                    🏆 Overall
                  </button>
                </div>

                <span className="text-[10px] font-mono text-black font-black bg-[#FFFBEB] px-1.5 py-0.5 border border-black">
                  Stage {currentStage + 1} / {totalStages}
                </span>
              </div>
            )}
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
                      {(item.audience || "ALL").toUpperCase()}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#4CAF50] text-black font-black">
                      LIVE
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
