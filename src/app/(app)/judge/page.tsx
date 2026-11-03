"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Gavel,
  CheckCircle2,
  Lock,
  Sparkles,
  Trophy,
  Sliders,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function JudgeScoringPage() {
  const { currentProfile, tracks, criteria, teams, schools, scores, saveScore, resultsPublished } =
    useFestStore();

  const assignedTrack =
    tracks.find((t) => t.id === currentProfile.assigned_track_id) || tracks[0];

  const [activeTrackId, setActiveTrackId] = useState(assignedTrack.id);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [scoringModalOpen, setScoringModalOpen] = useState(false);

  // Criteria for selected track
  const trackCriteria = criteria.filter((c) => c.track_id === activeTrackId);
  const trackTeams = teams.filter((t) => t.track_id === activeTrackId);

  // Active scoring state for modal
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openScoringForm = (team: any) => {
    setSelectedTeam(team);

    // Populate existing scores if already entered by this judge
    const initialScores: Record<string, number> = {};
    let existingFeedback = "";

    trackCriteria.forEach((crit) => {
      const match = scores.find(
        (s) => s.team_id === team.id && s.criterion_id === crit.id && s.judge_id === currentProfile.id
      );
      if (match) {
        initialScores[crit.id] = match.value;
        if (match.feedback) existingFeedback = match.feedback;
      } else {
        initialScores[crit.id] = 8.0; // default initial slider value
      }
    });

    setCriterionScores(initialScores);
    setFeedback(existingFeedback);
    setScoringModalOpen(true);
  };

  // Compute live weighted total
  const computeWeightedTotal = () => {
    let totalWeighted = 0;
    let totalWeight = 0;

    trackCriteria.forEach((crit) => {
      const val = criterionScores[crit.id] ?? 0;
      totalWeighted += val * crit.weight;
      totalWeight += crit.weight;
    });

    return totalWeight > 0 ? (totalWeighted / totalWeight).toFixed(2) : "0.00";
  };

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    trackCriteria.forEach((crit) => {
      saveScore({
        team_id: selectedTeam.id,
        criterion_id: crit.id,
        value: criterionScores[crit.id] ?? 0,
        feedback,
      });
    });

    setScoringModalOpen(false);
    setToastMessage(`Scores successfully locked and submitted for ${selectedTeam.name}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedTrackObj = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="track-blue">OFFICIAL JURY PANEL</Badge>
            {resultsPublished && (
              <Badge variant="danger">
                <Lock className="h-3 w-3 mr-1" />
                Results Published (Locked)
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Jury Scoring Deck — {selectedTrackObj.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Score each prototype against weighted technical rubrics. Weighted total is auto-calculated live.
          </p>
        </div>

        {/* Track switcher tabs */}
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTrackId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTrackId === t.id
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Criteria Breakdown Card */}
      <GlassCard className="p-5" glow="blue">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Scoring Rubric for {selectedTrackObj.name}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trackCriteria.map((crit) => (
            <div key={crit.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white">{crit.name}</span>
                <span className="font-mono text-indigo-400 font-bold">{Math.round(crit.weight * 100)}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">{crit.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Competing Teams Grid */}
      <div>
        <h2 className="text-lg font-black text-white mb-3">
          Competing Teams ({trackTeams.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trackTeams.map((team) => {
            const school = schools.find((s) => s.id === team.school_id);
            const teamScores = scores.filter((s) => s.team_id === team.id && s.judge_id === currentProfile.id);
            const isScored = teamScores.length > 0;

            return (
              <GlassCard key={team.id} className="p-5 flex flex-col justify-between" glow="purple">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-indigo-300 bg-white/5 px-2 py-0.5 rounded">
                      Table: {team.table_number || "TBD"}
                    </span>
                    <Badge variant={isScored ? "success" : "warning"}>
                      {isScored ? "Scored" : "Pending Score"}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">{team.name}</h3>
                  <p className="text-xs text-slate-400">{school?.name}</p>

                  <div className="my-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs font-bold text-indigo-300">{team.project_title}</p>
                    <p className="text-xs text-slate-300 line-clamp-3 mt-1 leading-relaxed">
                      {team.project_summary}
                    </p>
                  </div>

                  {team.score_total ? (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Current Average:</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        {team.score_total} / 10.0
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 pt-3 border-t border-white/10">
                  <Button
                    size="sm"
                    variant={isScored ? "secondary" : "primary"}
                    className="w-full text-xs"
                    disabled={resultsPublished}
                    onClick={() => openScoringForm(team)}
                  >
                    <Gavel className="h-3.5 w-3.5 mr-1" />
                    <span>{isScored ? "Update Score" : "Score This Team"}</span>
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Scoring Modal with Sliders & Realtime Weight Calculation */}
      <Modal
        isOpen={scoringModalOpen}
        onClose={() => setScoringModalOpen(false)}
        title={`Score Evaluation: ${selectedTeam?.name || "Team"}`}
        description={`Invention: ${selectedTeam?.project_title || "Project"}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitScore} className="space-y-5">
          {/* Realtime Live Score Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Calculated Weighted Total
              </p>
              <p className="text-[11px] text-slate-400">Sum of (Value × Weight) / Total Weight</p>
            </div>
            <div className="text-3xl font-black text-white font-mono bg-white/10 px-4 py-1.5 rounded-xl border border-white/20">
              {computeWeightedTotal()} <span className="text-xs font-normal text-slate-400">/ 10</span>
            </div>
          </div>

          {/* Criteria Sliders */}
          <div className="space-y-4">
            {trackCriteria.map((crit) => {
              const currentVal = criterionScores[crit.id] ?? 8.0;
              return (
                <div key={crit.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{crit.name}</span>
                      <span className="text-indigo-400 ml-2 font-mono">
                        (Weight: {Math.round(crit.weight * 100)}%)
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                      {currentVal.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{crit.description}</p>

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
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 (Unacceptable)</span>
                    <span>5 (Average)</span>
                    <span>10 (Outstanding)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Judge Comments */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Feedback & Deliberation Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Highlight strong engineering points, design flaws, or presentation nuances..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setScoringModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Lock & Submit Scores
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
