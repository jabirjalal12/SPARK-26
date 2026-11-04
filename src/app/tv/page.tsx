"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFestStore } from "@/lib/store";
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
  Layers,
  ChevronRight,
  Flame,
} from "lucide-react";

export default function StandaloneTvPage() {
  const { tracks, teams, schools, announcements, resultsPublished } = useFestStore();

  const [activeWindow, setActiveWindow] = useState<"leaderboard" | "announcements" | "split">("split");
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotateCountdown, setRotateCountdown] = useState(15);
  const [currentTime, setCurrentTime] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const activeTrack = tracks[activeTrackIndex] || tracks[0];

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

  // Keyboard shortcut for presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.code === "Space") {
        setAutoRotate((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Auto-Cycle Timer with window animation trigger
  useEffect(() => {
    if (!autoRotate) return;

    const timer = setInterval(() => {
      setRotateCountdown((prev) => {
        if (prev <= 1) {
          // Rotate to next track or toggle between windows
          if (tracks.length > 0) {
            setActiveTrackIndex((tIndex) => {
              const nextIndex = (tIndex + 1) % tracks.length;
              if (nextIndex === 0) {
                // Switch window type smoothly
                setActiveWindow((curr) => {
                  if (curr === "split") return "leaderboard";
                  if (curr === "leaderboard") return "announcements";
                  return "split";
                });
              }
              return nextIndex;
            });
          }
          setAnimationKey((k) => k + 1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRotate, tracks.length]);

  // Ranked teams for active track
  const trackTeams = useMemo(() => {
    if (!activeTrack) return [];
    return teams
      .filter((t) => t.track_id === activeTrack.id)
      .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
  }, [teams, activeTrack]);

  const top3 = trackTeams.slice(0, 3);
  const urgentAnnouncements = announcements.filter((a) => a.urgent);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#FFFBEB] text-black font-sans select-none">
      {/* Top Animation Progress Bar */}
      <div className="w-full h-1.5 bg-black/10 overflow-hidden">
        <div
          className="h-full bg-[#FF5252] transition-all duration-1000 ease-linear"
          style={{ width: `${((15 - rotateCountdown) / 15) * 100}%` }}
        />
      </div>

      {/* Edge-to-Edge Venue Header */}
      <header className="px-6 py-3.5 bg-white border-b-[3px] border-black flex items-center justify-between gap-4 flex-shrink-0 shadow-[0_3px_0px_#000000]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center font-black">
            <Radio className="w-6 h-6 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-[#FFEB3B] text-[10px] font-black uppercase tracking-wider">
                LIVE VENUE DISPLAY
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-black text-black">
                <span className="h-2 w-2 rounded-full bg-[#4CAF50] inline-block animate-ping" />
                Realtime Stream
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-none mt-1">
              SPARK 2026 — Inter-School Tech Fest
            </h1>
          </div>
        </div>

        {/* Center: Track Indicator pills */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000000]">
          {tracks.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTrackIndex(idx);
                setAnimationKey((k) => k + 1);
                setRotateCountdown(15);
              }}
              className={`px-3 py-1 text-xs font-black border transition-all cursor-pointer ${
                idx === activeTrackIndex
                  ? "bg-black text-[#FFEB3B] border-black shadow-[2px_2px_0px_#2196F3]"
                  : "bg-white text-black border-transparent hover:border-black"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Right: Controls & Real-Time Clock */}
        <div className="flex items-center gap-3">
          {/* Mode Tabs */}
          <div className="hidden sm:flex border-2 border-black bg-[#FFFBEB] p-0.5 shadow-[2px_2px_0px_#000000]">
            <button
              onClick={() => {
                setActiveWindow("split");
                setAnimationKey((k) => k + 1);
              }}
              className={`px-3 py-1 text-xs font-black transition-colors ${
                activeWindow === "split" ? "bg-black text-[#FFEB3B]" : "text-black hover:bg-white"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => {
                setActiveWindow("leaderboard");
                setAnimationKey((k) => k + 1);
              }}
              className={`px-3 py-1 text-xs font-black transition-colors ${
                activeWindow === "leaderboard" ? "bg-black text-[#FFEB3B]" : "text-black hover:bg-white"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => {
                setActiveWindow("announcements");
                setAnimationKey((k) => k + 1);
              }}
              className={`px-3 py-1 text-xs font-black transition-colors ${
                activeWindow === "announcements" ? "bg-black text-[#FFEB3B]" : "text-black hover:bg-white"
              }`}
            >
              Announcements
            </button>
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 border-2 border-black font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer ${
              autoRotate ? "bg-[#4CAF50] text-black" : "bg-[#FFEB3B] text-black"
            }`}
            title="Press SPACE to toggle auto-cycling"
          >
            {autoRotate ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Auto ({rotateCountdown}s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>

          {/* Live Digital Clock */}
          <div className="px-3 py-1.5 bg-black text-[#FFEB3B] font-mono text-sm font-black border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FFEB3B]" />
            <span>{currentTime || "00:00:00"}</span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-[#FFEB3B] hover:bg-black hover:text-[#FFEB3B] text-black border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer transition-colors"
            title="Press F for Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Animated Windows Container */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col justify-between">
        {/* WINDOW 1: SPLIT SCREEN (Leaderboard on left, Announcements on right) */}
        {activeWindow === "split" && (
          <div
            key={`split-${animationKey}-${activeTrackIndex}`}
            className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-window"
          >
            {/* Left Column: Podium & Leaderboard Table (7 Cols) */}
            <div className="col-span-7 flex flex-col justify-between p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-black" />
                    <h2 className="text-xl font-black text-black">
                      Standings: {activeTrack?.name || "Robotics Arena"}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#FFEB3B] border border-black text-xs font-black uppercase">
                    {resultsPublished ? "Official Verified" : "Live Scoring Telemetry"}
                  </span>
                </div>

                {/* Animated Olympic Podium */}
                <div className="grid grid-cols-3 gap-3 mb-5 items-end">
                  {/* #2 Silver */}
                  <div className="animate-podium-2 p-3 bg-[#E0E0E0] border-[3px] border-black text-center shadow-[3px_3px_0px_#000000] h-36 flex flex-col justify-between">
                    <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto">
                      🥈
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-700">Rank #2</span>
                      <h3 className="text-sm font-black text-black truncate">{top3[1]?.name || "Evaluating"}</h3>
                      <p className="text-[10px] font-bold text-slate-800 truncate">
                        {schools.find((s) => s.id === top3[1]?.school_id)?.name || "—"}
                      </p>
                    </div>
                    <div className="p-1 bg-white border border-black font-black text-sm text-black">
                      {top3[1]?.score_total || 0} pts
                    </div>
                  </div>

                  {/* #1 Champion Gold */}
                  <div className="animate-podium-1 p-4 bg-[#FFEB3B] border-[3px] border-black text-center shadow-[5px_5px_0px_#000000] h-48 flex flex-col justify-between animate-gold-glow">
                    <div className="w-9 h-9 bg-black text-[#FFEB3B] border-2 border-black font-black text-base flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                      🥇
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-black">CURRENT LEADER</span>
                      <h3 className="text-base font-black text-black truncate">{top3[0]?.name || "Evaluating"}</h3>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {schools.find((s) => s.id === top3[0]?.school_id)?.name || "—"}
                      </p>
                    </div>
                    <div className="p-1.5 bg-white border-2 border-black font-black text-lg text-black">
                      {top3[0]?.score_total || 0} pts
                    </div>
                  </div>

                  {/* #3 Bronze */}
                  <div className="animate-podium-3 p-3 bg-[#FFCCBC] border-[3px] border-black text-center shadow-[3px_3px_0px_#000000] h-32 flex flex-col justify-between">
                    <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto">
                      🥉
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-700">Rank #3</span>
                      <h3 className="text-sm font-black text-black truncate">{top3[2]?.name || "Evaluating"}</h3>
                      <p className="text-[10px] font-bold text-slate-800 truncate">
                        {schools.find((s) => s.id === top3[2]?.school_id)?.name || "—"}
                      </p>
                    </div>
                    <div className="p-1 bg-white border border-black font-black text-sm text-black">
                      {top3[2]?.score_total || 0} pts
                    </div>
                  </div>
                </div>

                {/* Ranked List Table */}
                <div className="border-[3px] border-black overflow-hidden shadow-[3px_3px_0px_#000000]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black text-[#FFEB3B] font-black uppercase text-[10px]">
                      <tr>
                        <th className="p-2 w-14 text-center">Pos</th>
                        <th className="p-2">Squad / Delegation</th>
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
                            <td className="p-2">
                              <span className="font-black text-black text-xs block">{team.name}</span>
                              <span className="text-[10px] text-slate-700 block truncate">{school?.name || "Independent"}</span>
                            </td>
                            <td className="p-2 text-right font-black text-sm text-black">
                              {team.score_total || 0} pts
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Live Bulletins & Urgent Alerts (5 Cols) */}
            <div className="col-span-5 flex flex-col p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Radio className="w-6 h-6 text-black animate-pulse" />
                  <h2 className="text-xl font-black text-black">Broadcast Announcements</h2>
                </div>
                <span className="px-2.5 py-0.5 bg-[#FF5252] text-black border border-black text-xs font-black uppercase">
                  {announcements.length} Live
                </span>
              </div>

              {/* Urgent Callout Banner */}
              {urgentAnnouncements.length > 0 && (
                <div className="mb-4 p-4 bg-[#FF5252] border-[3px] border-black text-black shadow-[4px_4px_0px_#000000] flex-shrink-0">
                  <div className="flex items-center gap-2 font-black text-xs uppercase mb-1">
                    <AlertTriangle className="w-5 h-5 text-black" />
                    <span>URGENT MARSHAL BROADCAST</span>
                  </div>
                  <h3 className="font-black text-base">{urgentAnnouncements[0].title}</h3>
                  <p className="text-xs font-bold mt-1 text-black leading-relaxed">{urgentAnnouncements[0].body}</p>
                </div>
              )}

              {/* Feed of Announcements */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {announcements.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000000] transition-transform hover:scale-[1.01]"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-800 mb-1">
                      <span className="px-1.5 py-0.5 bg-[#FFEB3B] border border-black">
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
        )}

        {/* WINDOW 2: FULL LEADERBOARD WINDOW */}
        {activeWindow === "leaderboard" && (
          <div
            key={`lead-${animationKey}-${activeTrackIndex}`}
            className="p-8 bg-white border-[3px] border-black shadow-[8px_8px_0px_#000000] h-[calc(100vh-140px)] flex flex-col justify-between animate-window"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
                <div>
                  <span className="px-3 py-1 bg-[#FFEB3B] text-black border border-black text-xs font-black uppercase">
                    Central Arena Telemetry
                  </span>
                  <h2 className="text-3xl font-black text-black tracking-tight mt-1">
                    Full Leaderboard — {activeTrack?.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black uppercase text-slate-700">Participating Squads:</span>
                  <span className="ml-2 font-black text-2xl text-black">{trackTeams.length}</span>
                </div>
              </div>

              {/* Expanded Olympic Podium */}
              <div className="grid grid-cols-3 gap-6 mb-6 items-end">
                {/* 2nd Place */}
                <div className="animate-podium-2 p-5 bg-[#E0E0E0] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] h-48 flex flex-col justify-between">
                  <div className="w-10 h-10 bg-white border-2 border-black font-black text-base flex items-center justify-center mx-auto">
                    🥈
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-slate-800">Runner Up (#2)</span>
                    <h3 className="text-lg font-black text-black truncate">{top3[1]?.name || "Evaluating"}</h3>
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {schools.find((s) => s.id === top3[1]?.school_id)?.name || "—"}
                    </p>
                  </div>
                  <div className="p-2 bg-white border-2 border-black font-black text-lg text-black">
                    {top3[1]?.score_total || 0} pts
                  </div>
                </div>

                {/* 1st Place */}
                <div className="animate-podium-1 p-6 bg-[#FFEB3B] border-[4px] border-black text-center shadow-[6px_6px_0px_#000000] h-60 flex flex-col justify-between animate-gold-glow">
                  <div className="w-14 h-14 bg-black text-[#FFEB3B] border-[3px] border-black font-black text-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000000]">
                    🥇
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase tracking-wider text-black">CHAMPION LEAD (#1)</span>
                    <h3 className="text-2xl font-black text-black truncate">{top3[0]?.name || "Evaluating"}</h3>
                    <p className="text-sm font-black text-slate-900 truncate">
                      {schools.find((s) => s.id === top3[0]?.school_id)?.name || "—"}
                    </p>
                  </div>
                  <div className="p-2 bg-white border-2 border-black font-black text-2xl text-black">
                    {top3[0]?.score_total || 0} pts
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="animate-podium-3 p-5 bg-[#FFCCBC] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] h-44 flex flex-col justify-between">
                  <div className="w-10 h-10 bg-white border-2 border-black font-black text-base flex items-center justify-center mx-auto">
                    🥉
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-slate-800">2nd Runner Up (#3)</span>
                    <h3 className="text-lg font-black text-black truncate">{top3[2]?.name || "Evaluating"}</h3>
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {schools.find((s) => s.id === top3[2]?.school_id)?.name || "—"}
                    </p>
                  </div>
                  <div className="p-2 bg-white border-2 border-black font-black text-lg text-black">
                    {top3[2]?.score_total || 0} pts
                  </div>
                </div>
              </div>

              {/* Ranks Table */}
              <div className="border-[3px] border-black overflow-hidden shadow-[4px_4px_0px_#000000]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-[#FFEB3B] font-black uppercase text-xs">
                    <tr>
                      <th className="p-3 w-16 text-center">Rank</th>
                      <th className="p-3">Team Name</th>
                      <th className="p-3">Institution / School</th>
                      <th className="p-3 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {trackTeams.slice(0, 6).map((team, idx) => {
                      const school = schools.find((s) => s.id === team.school_id);
                      return (
                        <tr
                          key={team.id}
                          className={`font-bold ${
                            idx === 0 ? "bg-[#FFF9C4]" : idx === 1 ? "bg-[#F5F5F5]" : idx === 2 ? "bg-[#FBE9E7]" : "bg-white"
                          }`}
                        >
                          <td className="p-3 text-center font-black text-base">
                            {idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : `#${idx + 1}`}
                          </td>
                          <td className="p-3 font-black text-black text-base">{team.name}</td>
                          <td className="p-3 font-bold text-slate-800">{school?.name || "Independent"}</td>
                          <td className="p-3 text-right font-black text-xl text-black">
                            {team.score_total || 0} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WINDOW 3: FULL ANNOUNCEMENTS WINDOW */}
        {activeWindow === "announcements" && (
          <div
            key={`ann-${animationKey}`}
            className="p-8 bg-white border-[3px] border-black shadow-[8px_8px_0px_#000000] h-[calc(100vh-140px)] flex flex-col justify-between animate-window"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
                <div className="flex items-center gap-3">
                  <Radio className="w-8 h-8 text-black animate-pulse" />
                  <div>
                    <h2 className="text-3xl font-black text-black tracking-tight">
                      Official Bulletins & Notices
                    </h2>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      Broadcasting schedule changes, stage announcements, and guidelines
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#4CAF50] text-black border-2 border-black text-xs font-black uppercase">
                  {announcements.length} Live Notices
                </span>
              </div>

              {/* Grid of Announcements */}
              <div className="grid grid-cols-2 gap-5 max-h-[500px] overflow-y-auto">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className={`p-5 border-[3px] border-black shadow-[4px_4px_0px_#000000] ${
                      item.urgent ? "bg-[#FF5252] text-black" : "bg-[#FFFBEB] text-black"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-black text-[#FFEB3B] text-xs font-black uppercase">
                        Audience: {item.audience}
                      </span>
                      <span className="text-xs font-black">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <h3 className="text-xl font-black">{item.title}</h3>
                    <p className="text-sm font-bold mt-2 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Animated Marquee Ticker at Bottom */}
      <footer className="h-10 bg-black text-[#FFEB3B] border-t-[3px] border-black flex items-center px-4 flex-shrink-0 z-50 shadow-[0_-3px_0px_#000000]">
        <div className="flex items-center gap-2 flex-shrink-0 mr-4">
          <span className="px-2 py-0.5 bg-[#FF5252] text-black text-[10px] font-black uppercase tracking-wider">
            BREAKING NEWS
          </span>
          <span className="text-sm">📢</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-block animate-marquee">
            {announcements.length > 0
              ? announcements.map((a) => `[${a.title.toUpperCase()}: ${a.body}]`).join("     ★★★     ")
              : "WELCOME TO SPARK 2026 INTER-SCHOOL COLLEGE TECH FEST! ALL ARENAS LIVE AND ACTIVE."}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-4 text-[10px] text-white">
          <span className="h-2 w-2 rounded-full bg-[#4CAF50] inline-block animate-pulse" />
          <span className="font-mono">PROJECTOR KIOSK ONLINE</span>
        </div>
      </footer>
    </div>
  );
}
