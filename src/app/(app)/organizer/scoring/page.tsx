"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    trackCriteria.forEach((crit) => {
      const val = criterionScores[crit.id] ?? 8.0;
      total += val * crit.weight;
    });
    return total.toFixed(2);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

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

  // Route Guard: Event Coordinator & Super Admin Only
  if (!canScore) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] text-center">
        <div className="w-12 h-12 bg-[#FF5252] border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#000]">
          <Lock className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-xl font-black text-black">Scoring Clearance Required</h2>
        <p className="text-xs font-bold text-slate-700 mt-2">
          Only Event Coordinators and Super Administrators have clearance to oversee and submit official track scores.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span>Return to Operations Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <Badge variant="default" className="mb-1.5">
            COMPETITION JURY & EVALUATION
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-black">
            Score Entry by Track
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1">
            Super Admin and Event Coordinators evaluate teams across all competition tracks.
          </p>
        </div>

        {isLocked && (
          <span className="px-3 py-1 bg-[#FF5252] text-black border-2 border-black shadow-[2px_2px_0px_#000000] text-xs font-black uppercase flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Scores Locked by Super Admin
          </span>
        )}
      </div>

      {toastMessage && (
        <div className="p-3.5 border-2 border-black bg-[#4CAF50] text-black text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#000000]">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Track Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] overflow-x-auto">
        {tracks.map((t) => {
          const isActive = t.id === activeTrackId;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTrackId(t.id)}
              className={`px-4 py-2 text-xs font-black border-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                  : "bg-[#FFFBEB] text-black border-black hover:bg-[#FFEB3B]"
              }`}
            >
              <span>{t.name}</span>
              {t.scores_locked && <Lock className="w-3 h-3 text-[#FF5252]" />}
            </button>
          );
        })}
      </div>

      {/* Track Criteria Overview Bar */}
      <div className="p-5 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000]">
        <p className="text-xs font-black uppercase tracking-wider text-black mb-3">
          Scoring Weights for {activeTrack?.name}:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {trackCriteria.map((crit) => (
            <div key={crit.id} className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
              <span className="font-black text-black block truncate">{crit.name}</span>
              <span className="text-black font-mono font-bold text-[11px] block mt-0.5">Weight: {(crit.weight * 100).toFixed(0)}% • Max 10 pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Teams Scoring List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trackTeams.map((team) => {
          const school = schools.find((s) => s.id === team.school_id);
          const hasScore = (team.score_total || 0) > 0;

          return (
            <div key={team.id} className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-black text-black bg-[#FFEB3B] border border-black px-2 py-0.5">
                    Table: {team.table_number || "TBD"}
                  </span>
                  <Badge variant={hasScore ? "success" : "warning"}>
                    {hasScore ? "Scored" : "Pending Evaluation"}
                  </Badge>
                </div>

                <h3 className="text-lg font-black text-black mb-0.5">{team.name}</h3>
                <p className="text-xs font-bold text-black mb-1 underline">{team.project_title}</p>
                <p className="text-xs font-medium text-slate-800 mb-4">{school?.name}</p>
              </div>

              <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block uppercase">Weighted Score</span>
                  <span className="text-xl font-black font-mono text-black">
                    {team.score_total ? team.score_total.toFixed(2) : "0.00"}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isLocked ? "outline" : "yellow"}
                  disabled={isLocked || !canScore}
                  onClick={() => openScoringModal(team)}
                  className="text-xs h-9 px-4"
                >
                  {isLocked ? (
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  ) : (
                    <span>{hasScore ? "Update Score" : "Enter Score"}</span>
                  )}
                </Button>
              </div>
            </div>
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
              <div key={crit.id} className="p-3.5 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-black">{crit.name}</span>
                    <span className="text-slate-800 font-bold text-[11px] ml-2">({(crit.weight * 100).toFixed(0)}% weight)</span>
                  </div>
                  <span className="font-mono font-black text-black text-sm bg-[#FFEB3B] border border-black px-1.5">{currentVal.toFixed(1)} / 10</span>
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
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            );
          })}

          <div>
            <label className="text-xs font-black text-black block mb-1">
              Jury Feedback & Technical Notes
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Strengths, mechanism durability, suggestions for improvement..."
              className="w-full p-2.5 nb-input text-xs"
            />
          </div>

          <div className="p-3.5 border-2 border-black bg-[#FFEB3B] flex items-center justify-between text-xs shadow-[2px_2px_0px_#000000]">
            <span className="font-black text-black">Total Computed Weighted Score:</span>
            <span className="text-xl font-black font-mono text-black">{computeWeightedTotal()} / 10</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t-2 border-black">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save & Apply Score
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}