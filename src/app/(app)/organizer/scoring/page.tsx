"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Sparkles,
  Bot,
  Wrench,
  Lock,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function OrganizerScoringPage() {
  const {
    tracks,
    criteria,
    teams,
    schools,
    scores,
    saveScore,
    isSuperAdmin,
    isEventCoordinator,
  } = useFestStore();

  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canScore = isSuperAdmin || isEventCoordinator;
  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];
  const trackCriteria = criteria.filter((c) => c.track_id === activeTrackId);
  const trackTeams = teams.filter((t) => t.track_id === activeTrackId);
  const isLocked = activeTrack?.scores_locked;

  const openScoringModal = (team: any) => {
    setSelectedTeam(team);
    const initialScores: Record<string, number> = {};
    let existingFeedback = "";

    trackCriteria.forEach((crit) => {
      const match = scores.find((s) => s.team_id === team.id && s.criterion_id === crit.id);
      if (match) {
        initialScores[crit.id] = match.value;
        if (match.feedback) existingFeedback = match.feedback;
      } else {
        initialScores[crit.id] = 8.0;
      }
    });

    setCriterionScores(initialScores);
    setFeedback(existingFeedback);
    setModalOpen(true);
  };

  const computeWeightedTotal = () => {
    let total = 0;
    let totalWeight = 0;
    trackCriteria.forEach((crit) => {
      const val = criterionScores[crit.id] || 0;
      total += val * crit.weight;
      totalWeight += crit.weight;
    });
    return totalWeight > 0 ? (total / totalWeight).toFixed(2) : "0.00";
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || isLocked) return;

    trackCriteria.forEach((crit) => {
      saveScore({
        team_id: selectedTeam.id,
        criterion_id: crit.id,
        value: criterionScores[crit.id] ?? 8.0,
        feedback,
      });
    });

    setModalOpen(false);
    setToastMessage(`Scores updated for "${selectedTeam.name}"!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            COMPETITION JURY & EVALUATION
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Score Entry by Track
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin and Event Coordinators evaluate teams across all 3 tracks.
          </p>
        </div>

        {isLocked && (
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Scores Locked by Super Admin
          </span>
        )}
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Track Tabs */}
      <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10 overflow-x-auto">
        {tracks.map((t) => {
          const isActive = t.id === activeTrackId;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTrackId(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{t.name}</span>
              {t.scores_locked && <Lock className="w-3 h-3 text-rose-400" />}
            </button>
          );
        })}
      </div>

      {/* Track Criteria Overview Bar */}
      <GlassCard className="p-4 border-white/10">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Scoring Weights for {activeTrack?.name}:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {trackCriteria.map((crit) => (
            <div key={crit.id} className="p-2.5 rounded-lg bg-white/[0.04] border border-white/10">
              <span className="font-semibold text-white block truncate">{crit.name}</span>
              <span className="text-indigo-400 font-mono text-[11px]">Weight: {(crit.weight * 100).toFixed(0)}% • Max 10 pts</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Teams Scoring List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trackTeams.map((team) => {
          const school = schools.find((s) => s.id === team.school_id);
          const hasScore = (team.score_total || 0) > 0;

          return (
            <GlassCard key={team.id} className="p-5 border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono text-indigo-300 bg-white/10 px-2 py-0.5 rounded">
                    Table: {team.table_number || "TBD"}
                  </span>
                  <Badge variant={hasScore ? "success" : "warning"}>
                    {hasScore ? "Scored" : "Pending Evaluation"}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-white mb-0.5">{team.name}</h3>
                <p className="text-xs font-semibold text-indigo-300 mb-1">{team.project_title}</p>
                <p className="text-xs text-slate-400 mb-4">{school?.name}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Weighted Score</span>
                  <span className="text-xl font-black font-mono text-white">
                    {team.score_total ? team.score_total.toFixed(2) : "0.00"}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isLocked ? "outline" : "gradient"}
                  disabled={isLocked || !canScore}
                  onClick={() => openScoringModal(team)}
                  className="text-xs h-9 px-4"
                >
                  {isLocked ? (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  ) : (
                    <span>{hasScore ? "Update Score" : "Enter Score"}</span>
                  )}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Scoring Modal with Weighted Rubric */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Score Entry: ${selectedTeam?.name}`}
        description={`Track: ${activeTrack?.name} • All criteria are weighted automatically.`}
      >
        <form onSubmit={handleSaveAll} className="space-y-5">
          {trackCriteria.map((crit) => {
            const currentVal = criterionScores[crit.id] ?? 8.0;
            return (
              <div key={crit.id} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{crit.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({(crit.weight * 100).toFixed(0)}% weight)</span>
                  </div>
                  <span className="font-mono font-black text-indigo-300 text-sm">{currentVal.toFixed(1)} / 10</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={currentVal}
                  onChange={(e) =>
                    setCriterionScores({
                      ...criterionScores,
                      [crit.id]: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            );
          })}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Jury Feedback & Technical Notes
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Strengths, mechanism durability, suggestions for improvement..."
              className="w-full p-2.5 glass-input text-xs"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Total Computed Weighted Score:</span>
            <span className="text-xl font-black font-mono text-indigo-300">{computeWeightedTotal()} / 10</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save & Apply Score
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
