"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { School } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Award,
  Sparkles,
  Bot,
  Wrench,
  Zap,
  Layers,
  Search,
  Radio,
  ShieldCheck,
  School as SchoolIcon,
  Maximize2,
  Sliders,
} from "lucide-react";

export default function LeaderboardPage() {
  const {
    tracks,
    teams,
    schools,
    resultsPublished,
    togglePublishResults,
    isSuperAdmin,
    isJudge,
  } = useFestStore();

  const [viewMode, setViewMode] = useState<"tracks" | "overall">("tracks");
  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Ranked Teams for the active individual event
  const trackTeams = useMemo(() => {
    if (!activeTrack) return [];
    return teams
      .filter((t) => t.track_id === activeTrack.id)
      .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
  }, [teams, activeTrack]);

  // Filtered teams based on search query
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return trackTeams;
    const q = searchQuery.toLowerCase();
    return trackTeams.filter((t) => {
      const s = schools.find((sch) => sch.id === t.school_id);
      return (
        t.name.toLowerCase().includes(q) ||
        (t.project_title && t.project_title.toLowerCase().includes(q)) ||
        (s && s.name.toLowerCase().includes(q))
      );
    });
  }, [trackTeams, searchQuery, schools]);

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

  // Filtered overall school standings based on search query
  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) return overallSchoolStandings;
    const q = searchQuery.toLowerCase();
    return overallSchoolStandings.filter(
      (entry) =>
        entry.school.name.toLowerCase().includes(q) ||
        entry.school.city.toLowerCase().includes(q) ||
        entry.school.code.toLowerCase().includes(q)
    );
  }, [overallSchoolStandings, searchQuery]);

  const getTrackIcon = (trackName: string) => {
    const lower = trackName.toLowerCase();
    if (lower.includes("robo")) return <Bot className="w-4 h-4 text-black" />;
    if (lower.includes("scrap")) return <Wrench className="w-4 h-4 text-black" />;
    if (lower.includes("quiz")) return <Trophy className="w-4 h-4 text-black" />;
    if (lower.includes("idea")) return <Sparkles className="w-4 h-4 text-black" />;
    if (lower.includes("science")) return <Zap className="w-4 h-4 text-black" />;
    if (lower.includes("article")) return <Award className="w-4 h-4 text-black" />;
    if (lower.includes("poster")) return <Layers className="w-4 h-4 text-black" />;
    return <Sparkles className="w-4 h-4 text-black" />;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans text-black">
      {/* Top Neubrutalist Header Banner */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#FFEB3B] text-black border border-black shadow-[2px_2px_0px_#000000]">
                LIVE ARENA LEADERBOARD
              </span>
              <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#4CAF50] text-black border border-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]">
                <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                {resultsPublished ? "Official Verified Results" : "Live Active Scoring"}
              </span>
              <span className="text-xs font-bold text-slate-800">
                SPARK 2026 Inter-School Fest
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight flex items-center gap-2.5">
              <Trophy className="w-8 h-8 text-[#9C27B0]" />
              <span>
                {viewMode === "tracks"
                  ? `Track Standings — ${activeTrack?.name}`
                  : "🏆 SPARK Rolling Trophy — Overall School Championship"}
              </span>
            </h1>

            <p className="text-xs font-bold text-slate-800 mt-1 max-w-2xl">
              Real-time competitive standings calculated from official jury evaluation rubrics.
              Minor privacy protected (team squad and institution names only).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/tv"
              target="_blank"
              className="px-3 py-2 bg-[#FFEB3B] hover:bg-black hover:text-[#FFEB3B] text-black border-2 border-black font-black text-xs flex items-center gap-1.5 shadow-[3px_3px_0px_#000000] transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              <span>TV Kiosk Mode</span>
            </Link>

            {isSuperAdmin && (
              <Button
                size="sm"
                variant={resultsPublished ? "secondary" : "yellow"}
                onClick={togglePublishResults}
                className="text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000000]"
              >
                <Trophy className="h-4 w-4 mr-1.5" />
                <span>{resultsPublished ? "Unpublish Results" : "Publish Official Winners"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Mode Toggle: Event Tracks vs Overall School Standings */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <button
          onClick={() => setViewMode("tracks")}
          className={`py-2.5 px-4 text-xs font-black border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            viewMode === "tracks"
              ? "bg-black text-[#FFEB3B] border-black shadow-[3px_3px_0px_#2196F3] -translate-x-0.5 -translate-y-0.5"
              : "bg-white text-black border-transparent hover:bg-[#FFFBEB]"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Individual Event Tracks ({tracks.length} Events)</span>
        </button>

        <button
          onClick={() => setViewMode("overall")}
          className={`py-2.5 px-4 text-xs font-black border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            viewMode === "overall"
              ? "bg-[#9C27B0] text-white border-black shadow-[3px_3px_0px_#FFEB3B] -translate-x-0.5 -translate-y-0.5"
              : "bg-white text-black border-transparent hover:bg-[#FFFBEB]"
          }`}
        >
          <Trophy className="w-4 h-4 text-[#FFEB3B]" />
          <span>🏆 SPARK Rolling Trophy (Overall Schools)</span>
        </button>
      </div>

      {/* Event Track Selector (When in 'tracks' mode) */}
      {viewMode === "tracks" && (
        <div className="p-4 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000]">
          <p className="text-xs font-black uppercase tracking-wider text-black mb-3">
            Select Competition Track:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tracks.map((t, idx) => {
              const isSelected = t.id === activeTrack?.id;
              const count = teams.filter((tm) => tm.track_id === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTrackId(t.id)}
                  className={`p-2.5 border-2 border-black text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] -translate-x-0.5 -translate-y-0.5 font-black"
                      : "bg-[#FFFBEB] text-black hover:bg-white shadow-[2px_2px_0px_#000000] font-bold"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="p-1 bg-white border border-black flex-shrink-0">
                      {getTrackIcon(t.name)}
                    </div>
                    <span className="text-xs truncate">
                      {idx + 1}. {t.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 bg-black text-white flex-shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              viewMode === "tracks"
                ? "Search team squad, school, project..."
                : "Search school name or city..."
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs font-bold border-2 border-black bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="text-xs font-black uppercase text-slate-700">
          {viewMode === "tracks" ? (
            <span>Showing {filteredTeams.length} of {trackTeams.length} Squads</span>
          ) : (
            <span>Showing {filteredSchools.length} of {overallSchoolStandings.length} Institutions</span>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* VIEW A: TRACK-SPECIFIC STANDINGS (PODIUM + RANKINGS LIST)          */}
      {/* =================================================================== */}
      {viewMode === "tracks" && (
        <>
          {/* Top 3 Olympic Podium (If teams exist) */}
          {trackTeams.length >= 3 && !searchQuery && (
            <div className="grid grid-cols-3 gap-3 items-end pt-4">
              {/* #2 Silver Runner Up */}
              <div className="p-4 bg-[#E0E0E0] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] h-48 flex flex-col justify-between">
                <div className="w-8 h-8 bg-white border-2 border-black font-black text-sm flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                  🥈
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    Runner Up (#2)
                  </span>
                  <h3 className="text-sm font-black text-black truncate mt-1">
                    {trackTeams[1]?.name || "Evaluating"}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {schools.find((s) => s.id === trackTeams[1]?.school_id)?.name || "—"}
                  </p>
                </div>
                <div className="p-1.5 bg-white border-2 border-black font-black text-base text-black shadow-[2px_2px_0px_#000000]">
                  {trackTeams[1]?.score_total ? trackTeams[1].score_total.toFixed(2) : "0.00"} pts
                </div>
              </div>

              {/* #1 Gold Champion */}
              <div className="p-5 bg-[#FFEB3B] border-[3px] border-black text-center shadow-[6px_6px_0px_#000000] h-60 flex flex-col justify-between -translate-y-2">
                <div className="w-10 h-10 bg-black text-[#FFEB3B] border-2 border-black font-black text-lg flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000000]">
                  🥇
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider bg-black text-[#FFEB3B] px-2 py-0.5 inline-block border border-black">
                    EVENT CHAMPION (#1)
                  </span>
                  <h3 className="text-base font-black text-black truncate mt-1">
                    {trackTeams[0]?.name || "Evaluating"}
                  </h3>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {schools.find((s) => s.id === trackTeams[0]?.school_id)?.name || "—"}
                  </p>
                  {trackTeams[0]?.project_title && (
                    <p className="text-[11px] font-bold text-slate-800 truncate mt-0.5">
                      Project: {trackTeams[0].project_title}
                    </p>
                  )}
                </div>
                <div className="p-2 bg-white border-2 border-black font-black text-xl text-black shadow-[3px_3px_0px_#000000]">
                  {trackTeams[0]?.score_total ? trackTeams[0].score_total.toFixed(2) : "0.00"} pts
                </div>
              </div>

              {/* #3 Bronze 2nd Runner Up */}
              <div className="p-4 bg-[#FFCCBC] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] h-44 flex flex-col justify-between">
                <div className="w-8 h-8 bg-white border-2 border-black font-black text-sm flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                  🥉
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    2nd Runner Up (#3)
                  </span>
                  <h3 className="text-sm font-black text-black truncate mt-1">
                    {trackTeams[2]?.name || "Evaluating"}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {schools.find((s) => s.id === trackTeams[2]?.school_id)?.name || "—"}
                  </p>
                </div>
                <div className="p-1.5 bg-white border-2 border-black font-black text-base text-black shadow-[2px_2px_0px_#000000]">
                  {trackTeams[2]?.score_total ? trackTeams[2].score_total.toFixed(2) : "0.00"} pts
                </div>
              </div>
            </div>
          )}

          {/* Full Standings List */}
          <div className="space-y-3">
            {filteredTeams.length === 0 ? (
              <div className="p-12 text-center bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
                <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-black text-black">No teams evaluated yet in this track</h3>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Once judges submit marks from the Jury Arena, official standings will populate here live.
                </p>
              </div>
            ) : (
              filteredTeams.map((team, idx) => {
                const rank = idx + 1;
                const school = schools.find((s) => s.id === team.school_id);

                return (
                  <div
                    key={team.id}
                    className={`p-5 border-[3px] border-black shadow-[5px_5px_0px_#000000] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      rank === 1
                        ? "bg-[#FFF9C4]"
                        : rank === 2
                        ? "bg-[#F5F5F5]"
                        : rank === 3
                        ? "bg-[#FBE9E7]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Rank Indicator */}
                      <div
                        className={`w-12 h-12 border-2 border-black flex items-center justify-center font-black text-base flex-shrink-0 shadow-[2px_2px_0px_#000000] ${
                          rank === 1
                            ? "bg-[#FFEB3B] text-black"
                            : rank === 2
                            ? "bg-[#E0E0E0] text-black"
                            : rank === 3
                            ? "bg-[#FFCCBC] text-black"
                            : "bg-black text-white"
                        }`}
                      >
                        {rank === 1 ? "🥇 #1" : rank === 2 ? "🥈 #2" : rank === 3 ? "🥉 #3" : `#${rank}`}
                      </div>

                      {/* Team Details */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-base text-black truncate">{team.name}</h3>
                          <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 border border-black">
                            TABLE {team.table_number || "TBD"}
                          </span>
                        </div>

                        {team.project_title && (
                          <p className="text-xs font-bold text-black bg-[#FFFBEB] p-1.5 border border-black inline-block">
                            <strong>Project:</strong> {team.project_title}
                          </p>
                        )}

                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <SchoolIcon className="w-3.5 h-3.5 text-slate-600" />
                          <span>{school?.name || "Independent Delegation"}</span>
                          <span className="text-[10px] text-slate-600">({school?.city || "Campus"})</span>
                        </p>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="text-right flex-shrink-0 pl-3">
                      <div className="p-2 bg-black text-[#FFEB3B] border-2 border-black shadow-[3px_3px_0px_#000000] font-mono font-black text-xl">
                        {team.score_total ? team.score_total.toFixed(2) : "0.00"} <span className="text-xs text-white">pts</span>
                      </div>
                      <span className="block text-[10px] text-slate-700 uppercase font-black mt-1">
                        Weighted Total
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* =================================================================== */}
      {/* VIEW B: OVERALL INSTITUTIONAL CHAMPIONSHIP TABLE (ROLLING TROPHY)   */}
      {/* =================================================================== */}
      {viewMode === "overall" && (
        <div className="space-y-4">
          {/* Institutional Trophy Podium for Top 3 Schools */}
          {overallSchoolStandings.length >= 3 && !searchQuery && (
            <div className="grid grid-cols-3 gap-3 items-end pt-4">
              {/* #2 School Silver */}
              <div className="p-4 bg-[#E0E0E0] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] h-48 flex flex-col justify-between">
                <div className="w-8 h-8 bg-white border-2 border-black font-black text-sm flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                  🥈
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    2nd Overall
                  </span>
                  <h3 className="text-sm font-black text-black truncate mt-1">
                    {overallSchoolStandings[1]?.school.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {overallSchoolStandings[1]?.school.city} • {overallSchoolStandings[1]?.teamCount} Squads
                  </p>
                </div>
                <div className="p-1.5 bg-white border-2 border-black font-black text-base text-black shadow-[2px_2px_0px_#000000]">
                  {overallSchoolStandings[1]?.totalPoints.toFixed(2)} pts
                </div>
              </div>

              {/* #1 Champion Institution */}
              <div className="p-5 bg-[#FFEB3B] border-[3px] border-black text-center shadow-[6px_6px_0px_#000000] h-60 flex flex-col justify-between -translate-y-2">
                <div className="w-10 h-10 bg-black text-[#FFEB3B] border-2 border-black font-black text-lg flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000000]">
                  🏆
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider bg-black text-[#FFEB3B] px-2 py-0.5 inline-block border border-black">
                    ROLLING TROPHY CHAMPION
                  </span>
                  <h3 className="text-base font-black text-black truncate mt-1">
                    {overallSchoolStandings[0]?.school.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {overallSchoolStandings[0]?.school.city} • {overallSchoolStandings[0]?.golds} Golds
                  </p>
                </div>
                <div className="p-2 bg-white border-2 border-black font-black text-xl text-black shadow-[3px_3px_0px_#000000]">
                  {overallSchoolStandings[0]?.totalPoints.toFixed(2)} pts
                </div>
              </div>

              {/* #3 School Bronze */}
              <div className="p-4 bg-[#FFCCBC] border-[3px] border-black text-center shadow-[4px_4px_0px_#000000] h-44 flex flex-col justify-between">
                <div className="w-8 h-8 bg-white border-2 border-black font-black text-sm flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
                  🥉
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    3rd Overall
                  </span>
                  <h3 className="text-sm font-black text-black truncate mt-1">
                    {overallSchoolStandings[2]?.school.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {overallSchoolStandings[2]?.school.city} • {overallSchoolStandings[2]?.teamCount} Squads
                  </p>
                </div>
                <div className="p-1.5 bg-white border-2 border-black font-black text-base text-black shadow-[2px_2px_0px_#000000]">
                  {overallSchoolStandings[2]?.totalPoints.toFixed(2)} pts
                </div>
              </div>
            </div>
          )}

          {/* School Rankings Table */}
          <div className="border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] overflow-hidden">
            <div className="p-4 bg-black text-[#FFEB3B] border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFEB3B]" />
                <h3 className="font-black text-sm uppercase tracking-wider">
                  Official Institutional Standings (All 8 Tracks Aggregated)
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-300">
                {overallSchoolStandings.length} Participating Delegations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFBEB] text-black font-black uppercase text-[11px] border-b-2 border-black">
                  <tr>
                    <th className="p-3 w-16 text-center">Rank</th>
                    <th className="p-3">School / College Delegation</th>
                    <th className="p-3 text-center">Code</th>
                    <th className="p-3 text-center">Squads Fielded</th>
                    <th className="p-3 text-center">Gold Medals</th>
                    <th className="p-3 text-right">Aggregate Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {filteredSchools.map((entry, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr
                        key={entry.school.id}
                        className={`font-bold transition-colors ${
                          rank === 1
                            ? "bg-[#FFF9C4]"
                            : rank === 2
                            ? "bg-[#F5F5F5]"
                            : rank === 3
                            ? "bg-[#FBE9E7]"
                            : "bg-white hover:bg-[#FFFBEB]"
                        }`}
                      >
                        <td className="p-3 text-center font-black">
                          {rank === 1 ? "🥇 #1" : rank === 2 ? "🥈 #2" : rank === 3 ? "🥉 #3" : `#${rank}`}
                        </td>
                        <td className="p-3">
                          <span className="font-black text-black block text-sm">{entry.school.name}</span>
                          <span className="text-[10px] text-slate-700 block">{entry.school.city}</span>
                        </td>
                        <td className="p-3 text-center font-mono font-black">{entry.school.code}</td>
                        <td className="p-3 text-center font-black">{entry.teamCount} Squads</td>
                        <td className="p-3 text-center font-black">
                          {entry.golds > 0 ? (
                            <span className="px-2 py-0.5 bg-[#FFEB3B] text-black border border-black">
                              {entry.golds} 🥇
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-black text-sm text-black font-mono">
                          {entry.totalPoints.toFixed(2)} pts
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
    </div>
  );
}
