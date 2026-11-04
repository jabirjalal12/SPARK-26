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
} from "lucide-react";

export default function TvDisplayPage() {
  const { tracks, teams, schools, announcements, resultsPublished } = useFestStore();

  const [activeTab, setActiveTab] = useState<"leaderboard" | "announcements" | "split">("split");
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotateCountdown, setRotateCountdown] = useState(15);
  const [currentTime, setCurrentTime] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeTrack = tracks[activeTrackIndex] || tracks[0];

  // Live Clock
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
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Auto-Rotation Timer
  useEffect(() => {
    if (!autoRotate) return;

    const timer = setInterval(() => {
      setRotateCountdown((prev) => {
        if (prev <= 1) {
          if (tracks.length > 0) {
            setActiveTrackIndex((tIndex) => {
              const nextIndex = (tIndex + 1) % tracks.length;
              if (nextIndex === 0) {
                setActiveTab((currTab) => (currTab === "leaderboard" ? "split" : "leaderboard"));
              }
              return nextIndex;
            });
          }
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRotate, tracks.length]);

  // Ranked teams for current track
  const trackTeams = useMemo(() => {
    if (!activeTrack) return [];
    return teams
      .filter((t) => t.track_id === activeTrack.id)
      .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
  }, [teams, activeTrack]);

  const top3 = trackTeams.slice(0, 3);
  const urgentAnnouncements = announcements.filter((a) => a.urgent);

  return (
    <div className="space-y-6 pb-20">
      {/* TV Header Bar */}
      <div className="p-4 sm:p-5 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#00E5FF] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center font-black">
            <Radio className="w-6 h-6 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FFEB3B] text-black border border-black text-[10px] font-black uppercase tracking-wider">
                Venue Display
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-black text-black">
                <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-ping" />
                Live Telemetry Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              SPARK 2026 — Central Arena Screen
            </h1>
          </div>
        </div>

        {/* Control toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Clock Display */}
          <div className="px-3 py-1.5 bg-[#FFFBEB] border-2 border-black font-mono text-xs sm:text-sm font-black flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
            <Clock className="w-4 h-4 text-black" />
            <span>{currentTime || "00:00:00"}</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-2 border-black bg-[#FFFBEB] p-0.5 shadow-[2px_2px_0px_#000000]">
            <button
              onClick={() => setActiveTab("split")}
              className={`px-3 py-1 text-xs font-black transition-colors ${
                activeTab === "split" ? "bg-black text-[#FFEB3B]" : "text-black hover:bg-white"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-3 py-1 text-xs font-black transition-colors ${
                activeTab === "leaderboard" ? "bg-black text-[#FFEB3B]" : "text-black hover:bg-white"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-3 py-1 text-xs font-black transition-colors ${
                activeTab === "announcements" ? "bg-black text-[#FFEB3B]" : "text-black hover:bg-white"
              }`}
            >
              Announcements
            </button>
          </div>

          {/* Auto-Rotation Control */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 border-2 border-black font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer ${
              autoRotate ? "bg-[#4CAF50] text-black" : "bg-[#FFEB3B] text-black"
            }`}
            title="Toggle automatic screen cycling"
          >
            {autoRotate ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Auto ({rotateCountdown}s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Auto</span>
              </>
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-black text-[#FFEB3B] hover:bg-slate-800 border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Track Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#FFFBEB] border-2 border-black shadow-[3px_3px_0px_#000000]">
        <span className="text-xs font-black uppercase text-black px-2 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-black" />
          <span>Active Track:</span>
        </span>
        {tracks.map((track, idx) => (
          <button
            key={track.id}
            onClick={() => {
              setActiveTrackIndex(idx);
              setRotateCountdown(15);
            }}
            className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
              idx === activeTrackIndex
                ? "bg-black text-[#FFEB3B] border-black shadow-[2px_2px_0px_#2196F3]"
                : "bg-white text-black border-black hover:bg-[#FFEB3B]"
            }`}
          >
            {track.name}
          </button>
        ))}
      </div>

      {/* Split Screen View */}
      {activeTab === "split" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Leaderboard (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-black" />
                  <h2 className="text-lg font-black text-black">
                    Live Standings: {activeTrack?.name || "All Events"}
                  </h2>
                </div>
                <span className="px-2 py-0.5 bg-[#FFEB3B] border border-black text-[10px] font-black uppercase">
                  {resultsPublished ? "Official Verified" : "Live Scoring"}
                </span>
              </div>

              {/* Podium Display */}
              <div className="grid grid-cols-3 gap-2 mb-4 pt-4">
                {/* 2nd Place */}
                <div className="p-3 bg-[#E0E0E0] border-2 border-black text-center shadow-[3px_3px_0px_#000000] flex flex-col justify-end mt-4">
                  <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto mb-1">
                    🥈
                  </div>
                  <p className="text-[10px] font-bold uppercase text-slate-800">2nd Place</p>
                  <p className="text-xs font-black text-black truncate">{top3[1]?.name || "Pending"}</p>
                  <p className="text-[10px] font-bold text-slate-700 truncate">
                    {schools.find((s) => s.id === top3[1]?.school_id)?.name || "—"}
                  </p>
                  <p className="text-sm font-black text-black mt-1">{top3[1]?.score_total || 0} pts</p>
                </div>

                {/* 1st Place */}
                <div className="p-4 bg-[#FFEB3B] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] flex flex-col justify-end">
                  <div className="w-9 h-9 bg-black text-[#FFEB3B] border-2 border-black font-black text-base flex items-center justify-center mx-auto mb-1 shadow-[2px_2px_0px_#000000]">
                    🥇
                  </div>
                  <p className="text-[11px] font-black uppercase text-black">CHAMPION</p>
                  <p className="text-sm font-black text-black truncate">{top3[0]?.name || "Pending"}</p>
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {schools.find((s) => s.id === top3[0]?.school_id)?.name || "—"}
                  </p>
                  <p className="text-base font-black text-black mt-1 bg-white border border-black px-1">
                    {top3[0]?.score_total || 0} pts
                  </p>
                </div>

                {/* 3rd Place */}
                <div className="p-3 bg-[#FFCCBC] border-2 border-black text-center shadow-[3px_3px_0px_#000000] flex flex-col justify-end mt-6">
                  <div className="w-7 h-7 bg-white border-2 border-black font-black text-xs flex items-center justify-center mx-auto mb-1">
                    🥉
                  </div>
                  <p className="text-[10px] font-bold uppercase text-slate-800">3rd Place</p>
                  <p className="text-xs font-black text-black truncate">{top3[2]?.name || "Pending"}</p>
                  <p className="text-[10px] font-bold text-slate-700 truncate">
                    {schools.find((s) => s.id === top3[2]?.school_id)?.name || "—"}
                  </p>
                  <p className="text-sm font-black text-black mt-1">{top3[2]?.score_total || 0} pts</p>
                </div>
              </div>

              {/* Ranks Table */}
              <div className="border-2 border-black overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black text-white font-black uppercase text-[10px]">
                    <tr>
                      <th className="p-2 w-12 text-center">Rank</th>
                      <th className="p-2">Team & School</th>
                      <th className="p-2 text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {trackTeams.slice(0, 7).map((team, idx) => {
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
                              : "hover:bg-[#FFFBEB]"
                          }`}
                        >
                          <td className="p-2 text-center font-black">
                            {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                          </td>
                          <td className="p-2">
                            <span className="font-black text-black block">{team.name}</span>
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

          {/* Right: Announcements Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-black" />
                  <h2 className="text-lg font-black text-black">Official Bulletins</h2>
                </div>
                <span className="px-2 py-0.5 bg-[#FF5252] text-black border border-black text-[10px] font-black uppercase">
                  Live Feed
                </span>
              </div>

              {/* Urgent Alert Banner if any */}
              {urgentAnnouncements.length > 0 && (
                <div className="mb-4 p-3 bg-[#FF5252] border-2 border-black text-black shadow-[3px_3px_0px_#000000]">
                  <div className="flex items-center gap-1.5 font-black text-xs uppercase mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Urgent Alert</span>
                  </div>
                  <h3 className="font-black text-sm">{urgentAnnouncements[0].title}</h3>
                  <p className="text-xs font-bold mt-1 text-black">{urgentAnnouncements[0].body}</p>
                </div>
              )}

              {/* Announcements list */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000000]"
                  >
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-800 mb-1">
                      <span className="px-1.5 py-0.5 bg-[#FFEB3B] border border-black">
                        Audience: {item.audience}
                      </span>
                      <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className="font-black text-sm text-black">{item.title}</h4>
                    <p className="text-xs font-bold text-slate-800 mt-1">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard View */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          <div className="p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
              <div>
                <span className="px-2.5 py-0.5 bg-[#FFEB3B] text-black border border-black text-xs font-black uppercase">
                  Arena Telemetry
                </span>
                <h2 className="text-2xl font-black text-black tracking-tight mt-1">
                  Full Arena Leaderboard: {activeTrack?.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800">Verified Teams:</span>
                <span className="ml-2 font-black text-base text-black">{trackTeams.length}</span>
              </div>
            </div>

            {/* Large Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Silver */}
              <div className="p-4 bg-[#E0E0E0] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] flex flex-col justify-end mt-8">
                <div className="w-10 h-10 bg-white border-2 border-black font-black text-xl flex items-center justify-center mx-auto mb-2">
                  🥈
                </div>
                <span className="text-xs font-black uppercase text-slate-800">Runner Up (#2)</span>
                <h3 className="text-base font-black text-black mt-1 truncate">{top3[1]?.name || "Pending"}</h3>
                <p className="text-xs font-bold text-slate-700 truncate">
                  {schools.find((s) => s.id === top3[1]?.school_id)?.name || "—"}
                </p>
                <div className="mt-3 p-1.5 bg-white border-2 border-black font-black text-lg text-black">
                  {top3[1]?.score_total || 0} pts
                </div>
              </div>

              {/* Gold */}
              <div className="p-6 bg-[#FFEB3B] border-[4px] border-black text-center shadow-[6px_6px_0px_#000000] flex flex-col justify-end">
                <div className="w-14 h-14 bg-black text-[#FFEB3B] border-[3px] border-black font-black text-2xl flex items-center justify-center mx-auto mb-2 shadow-[3px_3px_0px_#000000]">
                  🥇
                </div>
                <span className="text-sm font-black uppercase tracking-wider text-black">Fest Champion (#1)</span>
                <h3 className="text-xl font-black text-black mt-1 truncate">{top3[0]?.name || "Pending"}</h3>
                <p className="text-xs font-black text-slate-900 truncate">
                  {schools.find((s) => s.id === top3[0]?.school_id)?.name || "—"}
                </p>
                <div className="mt-3 p-2 bg-white border-2 border-black font-black text-2xl text-black">
                  {top3[0]?.score_total || 0} pts
                </div>
              </div>

              {/* Bronze */}
              <div className="p-4 bg-[#FFCCBC] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] flex flex-col justify-end mt-12">
                <div className="w-10 h-10 bg-white border-2 border-black font-black text-xl flex items-center justify-center mx-auto mb-2">
                  🥉
                </div>
                <span className="text-xs font-black uppercase text-slate-800">2nd Runner Up (#3)</span>
                <h3 className="text-base font-black text-black mt-1 truncate">{top3[2]?.name || "Pending"}</h3>
                <p className="text-xs font-bold text-slate-700 truncate">
                  {schools.find((s) => s.id === top3[2]?.school_id)?.name || "—"}
                </p>
                <div className="mt-3 p-1.5 bg-white border-2 border-black font-black text-lg text-black">
                  {top3[2]?.score_total || 0} pts
                </div>
              </div>
            </div>

            {/* Standings Table */}
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
                  {trackTeams.map((team, idx) => {
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
                            : idx % 2 === 0
                            ? "bg-white"
                            : "bg-[#FFFBEB]"
                        }`}
                      >
                        <td className="p-3 text-center font-black text-base">
                          {idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : `#${idx + 1}`}
                        </td>
                        <td className="p-3 font-black text-black">{team.name}</td>
                        <td className="p-3 font-bold text-slate-800">{school?.name || "Independent"}</td>
                        <td className="p-3 text-right font-black text-lg text-black">
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

      {/* Full Announcements View */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <div className="p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
              <div className="flex items-center gap-3">
                <Radio className="w-7 h-7 text-black animate-pulse" />
                <div>
                  <h2 className="text-2xl font-black text-black tracking-tight">
                    Official Fest Announcements & Bulletins
                  </h2>
                  <p className="text-xs font-bold text-slate-800">
                    Broadcasting live updates to teams, visiting faculty, and delegates
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#4CAF50] text-black border-2 border-black text-xs font-black uppercase">
                {announcements.length} Notices Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border-[3px] border-black shadow-[4px_4px_0px_#000000] ${
                    item.urgent ? "bg-[#FF5252] text-black" : "bg-[#FFFBEB] text-black"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-black text-[#FFEB3B] text-[10px] font-black uppercase">
                      Audience: {item.audience}
                    </span>
                    <span className="text-[11px] font-black">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="text-sm font-bold mt-2 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Ticker Bar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black text-[#FFEB3B] border-t-[3px] border-black py-2 px-4 shadow-[0px_-4px_0px_#000000]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-black">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-2 py-0.5 bg-[#FF5252] text-black uppercase tracking-wider text-[10px]">
              Breaking Ticker
            </span>
            <span className="hidden sm:inline">📢</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="inline-block animate-marquee">
              {announcements.length > 0
                ? announcements.map((a) => `[${a.title}: ${a.body}]`).join("   ★   ")
                : "Welcome to SPARK 2026 Inter-School College Tech Fest! Standings and announcements update live."}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 text-[10px] text-white">
            <span className="h-2 w-2 rounded-full bg-[#4CAF50] inline-block animate-pulse" />
            <span>TV STREAM ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
