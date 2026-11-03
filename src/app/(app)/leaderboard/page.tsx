"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Award,
  Sparkles,
  ShieldCheck,
  Bot,
  Wrench,
  Lock,
} from "lucide-react";

export default function LeaderboardPage() {
  const {
    tracks,
    teams,
    schools,
    resultsPublished,
    togglePublishResults,
    isSuperAdmin,
  } = useFestStore();

  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id || "");
  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  const trackTeams = teams
    .filter((t) => t.track_id === activeTrack?.id)
    .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={resultsPublished ? "success" : "warning"}>
              {resultsPublished ? "Official Verified Standings" : "Live Unofficial Telemetry"}
            </Badge>
            <span className="text-xs text-slate-300 font-mono font-medium flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Track Standings — {activeTrack?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional project rankings. Minor privacy protected (team & school names only).
          </p>
        </div>

        {isSuperAdmin && (
          <Button
            size="sm"
            variant={resultsPublished ? "danger" : "gradient"}
            onClick={togglePublishResults}
            className="text-xs"
          >
            <Trophy className="h-4 w-4 mr-1.5" />
            <span>{resultsPublished ? "Unpublish Results" : "Publish Official Winners"}</span>
          </Button>
        )}
      </div>

      {/* Track Selection Pills */}
      <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/10 overflow-x-auto gap-2">
        {tracks.map((t) => {
          const isActive = t.id === activeTrack?.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTrackId(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{t.name}</span>
              <span className="text-[10px] font-mono opacity-70">
                ({teams.filter((tm) => tm.track_id === t.id).length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Standings List */}
      <div className="space-y-3">
        {trackTeams.length === 0 ? (
          <GlassCard className="p-12 text-center text-xs text-slate-400 border-white/15">
            No teams evaluated yet in this track.
          </GlassCard>
        ) : (
          trackTeams.map((team, idx) => {
            const rank = idx + 1;
            const school = schools.find((s) => s.id === team.school_id);

            return (
              <GlassCard
                key={team.id}
                className={`p-5 border transition-all ${
                  rank === 1
                    ? "border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-slate-900/80 shadow-lg shadow-amber-950/30"
                    : rank === 2
                    ? "border-slate-300/30 bg-gradient-to-r from-slate-900/60 to-slate-900/40"
                    : rank === 3
                    ? "border-amber-700/30 bg-gradient-to-r from-amber-950/10 to-slate-900/40"
                    : "border-white/10 bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        rank === 1
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40"
                          : rank === 2
                          ? "bg-slate-300 text-slate-950 shadow-md shadow-slate-300/40"
                          : rank === 3
                          ? "bg-amber-700 text-white shadow-md shadow-amber-700/40"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {rank}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base truncate">{team.name}</h3>
                        <span className="text-[11px] font-mono text-indigo-300 bg-white/10 px-2 py-0.5 rounded">
                          Table: {team.table_number || "TBD"}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 font-semibold mt-0.5 truncate">{team.project_title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{school?.name}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-3">
                    <span className="font-mono font-black text-xl text-white">
                      {team.score_total ? team.score_total.toFixed(2) : "0.00"}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Weighted Pts</span>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
