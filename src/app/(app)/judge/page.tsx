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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-[#2196F3] text-black border-2 border-black font-black">
              OFFICIAL JURY PANEL
            </Badge>
            {resultsPublished && (
              <Badge variant="danger" className="border-2 border-black font-black">
                <Lock className="h-3 w-3 mr-1" />
                Results Published (Locked)
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Jury Scoring Deck — {selectedTrackObj.name}
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Score each prototype against weighted technical rubrics. Weighted total is auto-calculated live.
          </p>
        </div>

        {/* Track switcher tabs */}
        <div className="flex p-1.5 bg-white border-3 border-black shadow-[4px_4px_0px_#000] gap-2">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTrackId(t.id)}
              className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all ${
                activeTrackId === t.id
                  ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000] -translate-x-0.5 -translate-y-0.5"
                  : "bg-white text-black hover:bg-[#FFFBEB]"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-[#4CAF50] text-black border-3 border-black shadow-[4px_4px_0px_#000] text-xs font-black uppercase flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Criteria Breakdown Card */}
      <GlassCard variant="white" className="p-5 border-4 border-black shadow-[6px_6px_0px_#000]">
        <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3">
          Scoring Rubric for {selectedTrackObj.name}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trackCriteria.map((crit) => (
            <div key={crit.id} className="p-3 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-black text-black uppercase">{crit.name}</span>
                <span className="font-mono text-black font-black bg-[#FFEB3B] px-1.5 py-0.5 border border-black">
                  {Math.round(crit.weight * 100)}%
                </span>
              </div>
              <p className="text-xs text-neutral-800 font-medium leading-tight">{crit.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Competing Teams Grid */}
      <div>
        <h2 className="text-lg font-black text-black uppercase mb-3">
          Competing Teams ({trackTeams.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trackTeams.map((team) => {
            const school = schools.find((s) => s.id === team.school_id);
            const teamScores = scores.filter((s) => s.team_id === team.id && s.judge_id === currentProfile.id);
            const isScored = teamScores.length > 0;

            return (
              <GlassCard key={team.id} variant="white" className="p-5 flex flex-col justify-between border-3 border-black shadow-[5px_5px_0px_#000]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black bg-[#FFEB3B] text-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                      Table: {team.table_number || "TBD"}
                    </span>
                    <Badge variant={isScored ? "success" : "warning"}>
                      {isScored ? "Scored" : "Pending Score"}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-black text-black uppercase tracking-tight">{team.name}</h3>
                  <p className="text-xs font-bold text-neutral-600">{school?.name}</p>

                  <div className="my-3 p-3 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000]">
                    <p className="text-xs font-black text-black uppercase">{team.project_title}</p>
                    <p className="text-xs text-neutral-800 font-medium line-clamp-3 mt-1 leading-relaxed">
                      {team.project_summary}
                    </p>
                  </div>

                  {team.score_total ? (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-neutral-700">Current Average:</span>
                      <span className="text-base font-black text-black bg-[#4CAF50] px-2 py-0.5 border border-black font-mono">
                        {team.score_total} / 10.0
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 pt-3 border-t-2 border-black">
                  <Button
                    size="sm"
                    variant={isScored ? "secondary" : "primary"}
                    className="w-full text-xs font-black"
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
          <div className="p-4 bg-[#FFEB3B] border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black">
                Calculated Weighted Total
              </p>
              <p className="text-xs text-neutral-800 font-bold">Sum of (Value × Weight) / Total Weight</p>
            </div>
            <div className="text-3xl font-black text-black font-mono bg-white px-4 py-1.5 border-3 border-black shadow-[2px_2px_0px_#000]">
              {computeWeightedTotal()} <span className="text-xs font-bold text-neutral-700">/ 10</span>
            </div>
          </div>

          {/* Criteria Sliders */}
          <div className="space-y-4">
            {trackCriteria.map((crit) => {
              const currentVal = criterionScores[crit.id] ?? 8.0;
              return (
                <div key={crit.id} className="p-3.5 bg-[#FFFBEB] border-3 border-black shadow-[3px_3px_0px_#000] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-black uppercase text-sm">{crit.name}</span>
                      <span className="text-black font-black ml-2 font-mono bg-[#FFEB3B] px-1 border border-black">
                        {Math.round(crit.weight * 100)}%
                      </span>
                    </div>
                    <span className="font-mono text-base font-black text-black bg-white px-2 py-0.5 border-2 border-black">
                      {currentVal.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-800 font-medium">{crit.description}</p>

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
                    className="w-full accent-black cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-black font-black uppercase font-mono">
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
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">
              Feedback & Deliberation Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Highlight strong engineering points, design flaws, or presentation nuances..."
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-xs font-medium placeholder-neutral-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setScoringModalOpen(false)}>
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
