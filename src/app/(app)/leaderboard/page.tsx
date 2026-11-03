"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Medal,
  Sparkles,
  Bot,
  Wrench,
  Award,
  Lock,
  Flame,
  CheckCircle2,
} from "lucide-react";

export default function LeaderboardPage() {
  const { tracks, teams, schools, resultsPublished, togglePublishResults, currentProfile } =
    useFestStore();

  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id || "");

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Get teams in this track sorted by total score descending
  const trackTeams = teams
    .filter((t) => t.track_id === activeTrack.id)
    .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

  const rankIcons = [
    { rank: 1, label: "1st Place (Champion)", color: "text-amber-400 border-amber-400/40 bg-amber-400/10" },
    { rank: 2, label: "2nd Place (Runner Up)", color: "text-slate-300 border-slate-300/40 bg-slate-300/10" },
    { rank: 3, label: "3rd Place", color: "text-amber-600 border-amber-600/40 bg-amber-600/10" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={resultsPublished ? "success" : "warning"}>
              {resultsPublished ? "Official Verified Standings" : "Live Unofficial Telemetry"}
            </Badge>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Track Leaderboard — {activeTrack.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Scores dynamically calculated using weighted jury criteria and realtime submissions.
          </p>
        </div>

        {/* Organizer toggle button */}
        {currentProfile.role === "organizer" && (
          <Button
            size="sm"
            variant={resultsPublished ? "danger" : "gradient"}
            onClick={togglePublishResults}
          >
            <Trophy className="h-4 w-4 mr-1.5" />
            <span>{resultsPublished ? "Unpublish Results" : "Publish Official Winners"}</span>
          </Button>
        )}
      </div>

      {/* Track Selection Pills */}
      <div className="flex p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto max-w-full">
        {tracks.map((t) => {
          const isSelected = activeTrackId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTrackId(t.id)}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Podium for Top 3 */}
      {trackTeams.length >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          {trackTeams[1] && (
            <GlassCard className="p-5 text-center flex flex-col justify-between sm:order-1" glow="blue">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-slate-300 border border-slate-400/30 bg-slate-400/10 mb-3">
                  🥈 2nd Place
                </div>
                <h3 className="font-black text-xl text-white">{trackTeams[1].name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {schools.find((s) => s.id === trackTeams[1].school_id)?.name}
                </p>
                <p className="text-xs text-indigo-300 font-semibold mt-2">{trackTeams[1].project_title}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-2xl font-black text-white">
                {trackTeams[1].score_total || "—"}{" "}
                <span className="text-xs font-normal text-slate-400">/ 10</span>
              </div>
            </GlassCard>
          )}

          {/* Rank 1 (Gold - Taller/Highlighted) */}
          {trackTeams[0] && (
            <GlassCard
              className="p-6 text-center flex flex-col justify-between sm:order-2 border-amber-500/40 bg-slate-900/90 shadow-2xl shadow-amber-500/10"
              glow="purple"
            >
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-400/40 bg-amber-400/15 mb-3 animate-pulse">
                  🏆 1st Place (Champion)
                </div>
                <h3 className="font-black text-2xl text-white">{trackTeams[0].name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {schools.find((s) => s.id === trackTeams[0].school_id)?.name}
                </p>
                <p className="text-xs text-amber-300 font-semibold mt-2">{trackTeams[0].project_title}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-3xl font-black text-amber-300">
                {trackTeams[0].score_total || "—"}{" "}
                <span className="text-xs font-normal text-slate-400">/ 10</span>
              </div>
            </GlassCard>
          )}

          {/* Rank 3 (Bronze) */}
          {trackTeams[2] && (
            <GlassCard className="p-5 text-center flex flex-col justify-between sm:order-3" glow="red">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-amber-500 border border-amber-600/30 bg-amber-600/10 mb-3">
                  🥉 3rd Place
                </div>
                <h3 className="font-black text-xl text-white">{trackTeams[2].name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {schools.find((s) => s.id === trackTeams[2].school_id)?.name}
                </p>
                <p className="text-xs text-indigo-300 font-semibold mt-2">{trackTeams[2].project_title}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-2xl font-black text-white">
                {trackTeams[2].score_total || "—"}{" "}
                <span className="text-xs font-normal text-slate-400">/ 10</span>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Complete Rankings Table */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Full Track Roster Standings</h3>
          <span className="text-xs text-slate-400 font-mono">{trackTeams.length} Teams Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Squad & Project</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4 text-right">Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trackTeams.map((team, idx) => {
                const school = schools.find((s) => s.id === team.school_id);
                return (
                  <tr key={team.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-sm text-white">
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{team.name}</div>
                      <div className="text-[11px] text-indigo-300 font-medium font-sans">
                        {team.project_title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{school?.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{team.table_number || "TBD"}</td>
                    <td className="py-3.5 px-4 text-right">
                      {team.score_total ? (
                        <span className="font-mono font-black text-sm text-emerald-400">
                          {team.score_total.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Evaluating</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
