"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Trophy,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function OrganizerResultsPage() {
  const {
    tracks,
    teams,
    schools,
    results,
    resultsPublished,
    togglePublishResults,
    lockTrackScores,
    isSuperAdmin,
  } = useFestStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleToggleLock = (trackId: string, currentLocked: boolean, trackName: string) => {
    if (!isSuperAdmin) {
      alert("Permission denied. Only Super Admin can lock scores.");
      return;
    }
    const next = !currentLocked;
    lockTrackScores(trackId, next);
  };

  const handlePublishConfirm = () => {
    if (!isSuperAdmin) {
      alert("Permission denied. Only Super Admin can publish results.");
      return;
    }
    togglePublishResults();
    setConfirmModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5 border-amber-500/40 text-amber-300">
            SUPER ADMIN PRIVILEGE
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Score Locks & Results Publishing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin locks scoring, resolves ties, and toggles public result visibility.
          </p>
        </div>

        {isSuperAdmin && (
          <Button
            size="lg"
            variant={resultsPublished ? "danger" : "green"}
            onClick={() => setConfirmModalOpen(true)}
            className="text-xs py-3"
          >
            <Trophy className="w-4 h-4 mr-2" />
            <span>{resultsPublished ? "Unpublish Fest Results" : "Publish Official Fest Results"}</span>
          </Button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            You are viewing this panel in read-only mode. Only <strong>Super Admin</strong> can lock scores and publish official winners.
          </span>
        </div>
      )}

      {/* Track Score Lock Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <GlassCard key={track.id} className="p-5 border-white/15 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {track.name}
                </span>
                <Badge variant={track.scores_locked ? "danger" : "success"}>
                  {track.scores_locked ? "Scores Locked" : "Scoring Open"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {teams.filter((t) => t.track_id === track.id).length} teams entered in this track.
              </p>
            </div>

            {isSuperAdmin && (
              <Button
                size="sm"
                variant={track.scores_locked ? "outline" : "danger"}
                onClick={() => handleToggleLock(track.id, track.scores_locked, track.name)}
                className="w-full text-xs"
              >
                {track.scores_locked ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlock Scoring</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Scoring</span>
                  </span>
                )}
              </Button>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Official Results Standings per Track */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Track Results Standings</span>
        </h2>

        {tracks.map((track) => {
          const trackTeams = teams
            .filter((t) => t.track_id === track.id)
            .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

          return (
            <GlassCard key={track.id} className="p-6 border-white/15">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-bold text-white text-base">{track.name} Track</h3>
                <span className="text-xs text-indigo-400 font-mono">
                  Status: {resultsPublished ? "Published Globally" : "Draft"}
                </span>
              </div>

              <div className="space-y-2.5">
                {trackTeams.map((team, idx) => {
                  const school = schools.find((s) => s.id === team.school_id);
                  const rank = idx + 1;

                  return (
                    <div
                      key={team.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between ${
                        rank === 1
                          ? "bg-amber-500/10 border-amber-500/30 text-white"
                          : rank === 2
                          ? "bg-slate-300/10 border-slate-300/30 text-white"
                          : rank === 3
                          ? "bg-amber-800/10 border-amber-700/30 text-white"
                          : "bg-white/[0.02] border-white/10 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            rank === 1
                              ? "bg-amber-500 text-slate-950"
                              : rank === 2
                              ? "bg-slate-300 text-slate-950"
                              : rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {rank}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">{team.name}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {team.project_title} • {school?.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-3">
                        <span className="font-mono font-bold text-base text-indigo-300">
                          {team.score_total ? team.score_total.toFixed(2) : "0.00"}
                        </span>
                        <span className="block text-[10px] text-slate-500 uppercase">Weighted Pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={resultsPublished ? "Unpublish Fest Results?" : "Publish Official Fest Results?"}
        description="This action is restricted to Super Admin."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            {resultsPublished
              ? "Unpublishing will hide the final standings from the public leaderboard and return them to draft state."
              : "Publishing will immediately expose the official winners and track standings on the public landing page and generate certificates for attending students."}
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button variant="ghost" size="sm" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={resultsPublished ? "danger" : "green"}
              size="sm"
              onClick={handlePublishConfirm}
            >
              Confirm & {resultsPublished ? "Unpublish" : "Publish Results"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
