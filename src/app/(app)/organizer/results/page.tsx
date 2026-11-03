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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <Badge variant="warning" className="mb-1.5">
            SUPER ADMIN PRIVILEGE
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-black">
            Score Locks & Results Publishing
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1">
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
        <div className="p-3.5 border-2 border-black bg-[#FFEB3B] text-black text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
          <AlertTriangle className="w-4 h-4 text-black flex-shrink-0" />
          <span>
            You are viewing this panel in read-only mode. Only <strong>Super Admin</strong> can lock scores and publish official winners.
          </span>
        </div>
      )}

      {/* Track Score Lock Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <div key={track.id} className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  {track.name}
                </span>
                <Badge variant={track.scores_locked ? "danger" : "success"}>
                  {track.scores_locked ? "Scores Locked" : "Scoring Open"}
                </Badge>
              </div>
              <p className="text-xs font-bold text-slate-800 mb-4">
                {teams.filter((t) => t.track_id === track.id).length} teams entered in this track.
              </p>
            </div>

            {isSuperAdmin && (
              <Button
                size="sm"
                variant={track.scores_locked ? "secondary" : "danger"}
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
          </div>
        ))}
      </div>

      {/* Official Results Standings per Track */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-black flex items-center gap-2">
          <Award className="w-5 h-5 text-black" />
          <span>Track Results Standings</span>
        </h2>

        {tracks.map((track) => {
          const trackTeams = teams
            .filter((t) => t.track_id === track.id)
            .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

          return (
            <div key={track.id} className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                <h3 className="font-black text-black text-base">{track.name} Track</h3>
                <span className="text-xs text-black font-mono font-bold bg-[#FFEB3B] border border-black px-2 py-0.5">
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
                      className={`p-3.5 border-2 border-black flex items-center justify-between ${
                        rank === 1
                          ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000]"
                          : rank === 2
                          ? "bg-white text-black shadow-[2px_2px_0px_#000000]"
                          : rank === 3
                          ? "bg-[#FF9800]/20 text-black shadow-[2px_2px_0px_#000000]"
                          : "bg-[#FFFBEB] text-black"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-7 h-7 border-2 border-black flex items-center justify-center font-black text-xs flex-shrink-0 ${
                            rank === 1
                              ? "bg-black text-white"
                              : rank === 2
                              ? "bg-white text-black"
                              : rank === 3
                              ? "bg-[#FF9800] text-black"
                              : "bg-transparent text-black"
                          }`}
                        >
                          {rank}
                        </span>
                        <div className="min-w-0">
                          <p className="font-black text-sm text-black truncate">{team.name}</p>
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {team.project_title} • {school?.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-3">
                        <span className="font-mono font-black text-base text-black">
                          {team.score_total ? team.score_total.toFixed(2) : "0.00"}
                        </span>
                        <span className="block text-[10px] text-black font-bold uppercase">Weighted Pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
          <p className="text-xs font-bold text-slate-800 leading-relaxed">
            {resultsPublished
              ? "Unpublishing will hide the final standings from the public leaderboard and return them to draft state."
              : "Publishing will immediately expose the official winners and track standings on the public landing page and generate certificates for attending students."}
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
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