"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const { tracks, teams, schools, resultsPublished, togglePublishResults, currentProfile } =
    useFestStore();

  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id || "");

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Get teams in this track sorted by total score descending
  const trackTeams = teams
    .filter((t) => t.track_id === activeTrack.id)
    .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={resultsPublished ? "success" : "warning"}>
              {resultsPublished ? "Official Verified Standings" : "Live Unofficial Telemetry"}
            </Badge>
            <span className="text-xs text-black font-mono font-bold flex items-center gap-1.5 bg-[#4CAF50]/20 px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
              <span className="h-2 w-2 rounded-full bg-[#4CAF50] border border-black animate-pulse" />
              Realtime Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Track Leaderboard — {activeTrack.name}
          </h1>
          <p className="text-xs font-semibold text-neutral-700 mt-1">
            Scores dynamically calculated using weighted jury criteria and realtime submissions.
          </p>
        </div>

        {/* Organizer toggle button */}
        {currentProfile.role === "organizer" && (
          <Button
            size="sm"
            variant={resultsPublished ? "danger" : "primary"}
            onClick={togglePublishResults}
          >
            <Trophy className="h-4 w-4 mr-1.5" />
            <span>{resultsPublished ? "Unpublish Results" : "Publish Official Winners"}</span>
          </Button>
        )}
      </div>

      {/* Track Selection Pills */}
      <div className="flex p-1.5 bg-white border-3 border-black shadow-[4px_4px_0px_#000] overflow-x-auto max-w-full gap-2">
        {tracks.map((t) => {
          const isSelected = activeTrackId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTrackId(t.id)}
              className={`flex-1 py-2 px-4 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
                isSelected
                  ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000] -translate-x-0.5 -translate-y-0.5"
                  : "bg-white text-neutral-800 hover:bg-[#FFFBEB]"
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
            <GlassCard variant="white" className="p-5 text-center flex flex-col justify-between sm:order-1 border-4 border-black shadow-[6px_6px_0px_#000]">
              <div>
                <div className="inline-block px-3 py-1 text-xs font-black uppercase text-black border-2 border-black bg-white shadow-[2px_2px_0px_#000] mb-3">
                  🥈 2nd Place
                </div>
                <h3 className="font-black text-xl text-black uppercase">{trackTeams[1].name}</h3>
                <p className="text-xs font-bold text-neutral-600 mt-0.5">
                  {schools.find((s) => s.id === trackTeams[1].school_id)?.name}
                </p>
                <p className="text-xs text-black font-black bg-[#2196F3] border border-black inline-block px-2 py-0.5 mt-2">
                  {trackTeams[1].project_title}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-3 border-black font-mono text-3xl font-black text-black">
                {trackTeams[1].score_total || "—"}{" "}
                <span className="text-xs font-bold text-neutral-700">/ 10</span>
              </div>
            </GlassCard>
          )}

          {/* Rank 1 (Gold - Taller/Highlighted) */}
          {trackTeams[0] && (
            <GlassCard
              variant="yellow"
              className="p-6 text-center flex flex-col justify-between sm:order-2 border-4 border-black shadow-[8px_8px_0px_#000]"
            >
              <div>
                <div className="inline-block px-3.5 py-1 text-xs font-black uppercase text-black border-2 border-black bg-white shadow-[3px_3px_0px_#000] mb-3">
                  🏆 1st Place (Champion)
                </div>
                <h3 className="font-black text-2xl text-black uppercase">{trackTeams[0].name}</h3>
                <p className="text-xs font-bold text-neutral-700 mt-0.5">
                  {schools.find((s) => s.id === trackTeams[0].school_id)?.name}
                </p>
                <p className="text-xs text-black font-black bg-white border border-black inline-block px-2 py-0.5 mt-2">
                  {trackTeams[0].project_title}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-3 border-black font-mono text-4xl font-black text-black">
                {trackTeams[0].score_total || "—"}{" "}
                <span className="text-xs font-bold text-neutral-700">/ 10</span>
              </div>
            </GlassCard>
          )}

          {/* Rank 3 (Bronze) */}
          {trackTeams[2] && (
            <GlassCard variant="white" className="p-5 text-center flex flex-col justify-between sm:order-3 border-4 border-black shadow-[6px_6px_0px_#000]">
              <div>
                <div className="inline-block px-3 py-1 text-xs font-black uppercase text-black border-2 border-black bg-[#FF9800] shadow-[2px_2px_0px_#000] mb-3">
                  🥉 3rd Place
                </div>
                <h3 className="font-black text-xl text-black uppercase">{trackTeams[2].name}</h3>
                <p className="text-xs font-bold text-neutral-600 mt-0.5">
                  {schools.find((s) => s.id === trackTeams[2].school_id)?.name}
                </p>
                <p className="text-xs text-black font-black bg-[#FF5252] border border-black inline-block px-2 py-0.5 mt-2">
                  {trackTeams[2].project_title}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-3 border-black font-mono text-3xl font-black text-black">
                {trackTeams[2].score_total || "—"}{" "}
                <span className="text-xs font-bold text-neutral-700">/ 10</span>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Complete Rankings Table */}
      <GlassCard variant="white" className="overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] p-0">
        <div className="p-4 border-b-3 border-black bg-[#FFFBEB] flex items-center justify-between">
          <h3 className="font-black text-sm uppercase text-black">Full Track Roster Standings</h3>
          <span className="text-xs font-mono font-bold bg-[#FFEB3B] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
            {trackTeams.length} Teams Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFEB3B] uppercase tracking-wider text-black font-black border-b-3 border-black">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Squad & Project</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4 text-right">Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black bg-white">
              {trackTeams.map((team, idx) => {
                const school = schools.find((s) => s.id === team.school_id);
                return (
                  <tr key={team.id} className="hover:bg-[#FFFBEB] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-sm bg-black text-white px-2 py-0.5">
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-black">
                      <div className="text-sm uppercase">{team.name}</div>
                      <div className="text-[11px] font-bold text-neutral-700 font-sans">
                        {team.project_title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-black font-bold">{school?.name}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{team.table_number || "TBD"}</td>
                    <td className="py-3.5 px-4 text-right">
                      {team.score_total ? (
                        <span className="font-mono font-black text-sm bg-[#4CAF50] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                          {team.score_total.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-neutral-500 font-bold italic">Evaluating</span>
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
