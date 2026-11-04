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
  Award,
  CheckCircle2,
  Clock,
  QrCode,
  Sliders,
  ChevronRight,
  TrendingUp,
  School,
  FileText,
  Save,
  Search,
  Filter,
} from "lucide-react";

export default function JudgeScoringArena() {
  const {
    currentProfile,
    tracks,
    criteria,
    teams,
    schools,
    scores,
    saveScore,
    isJudge,
    isSuperAdmin,
    isEventCoordinator,
  } = useFestStore();

  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id || "");
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "scored" | "pending">("all");

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];
  const trackCriteria = criteria.filter((c) => c.track_id === activeTrack?.id);
  const trackTeams = teams.filter((t) => t.track_id === activeTrack?.id);

  // Helper to get team's current evaluation status
  const getTeamEvaluation = (teamId: string) => {
    const teamScores = scores.filter((s) => s.team_id === teamId);
    if (teamScores.length === 0) return { isScored: false, total: 0 };

    let total = 0;
    trackCriteria.forEach((crit) => {
      const match = teamScores.find((s) => s.criterion_id === crit.id);
      if (match) {
        total += match.value * crit.weight;
      }
    });

    return {
      isScored: teamScores.length >= trackCriteria.length,
      total: Number(total.toFixed(2)),
    };
  };

  // Open scoring modal for selected team
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

  // Calculate live weighted mark
  const computeLiveTotal = () => {
    let total = 0;
    trackCriteria.forEach((crit) => {
      const val = criterionScores[crit.id] ?? 8.0;
      total += val * crit.weight;
    });
    return total.toFixed(2);
  };

  // Save marks
  const handleSaveMarks = (e: React.FormEvent) => {
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
    setToastMessage(`Marks successfully recorded for team "${selectedTeam.name}"!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered teams list
  const filteredTeams = trackTeams.filter((team) => {
    const school = schools.find((s) => s.id === team.school_id);
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.project_title && team.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (school && school.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const evalStatus = getTeamEvaluation(team.id);
    if (filterStatus === "scored") return matchesSearch && evalStatus.isScored;
    if (filterStatus === "pending") return matchesSearch && !evalStatus.isScored;
    return matchesSearch;
  });

  // Evaluation statistics
  const scoredCount = trackTeams.filter((t) => getTeamEvaluation(t.id).isScored).length;
  const pendingCount = trackTeams.length - scoredCount;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#4CAF50] text-black border-[3px] border-black px-4 py-3 shadow-[6px_6px_0px_#000000] flex items-center gap-2 text-xs font-black uppercase animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-[3px] border-black bg-[#9C27B0] text-white shadow-[6px_6px_0px_#000000]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFEB3B] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
              OFFICIAL JURY PORTAL
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 border border-black">
              SPARK 2026
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5">
            <Award className="w-8 h-8 text-[#FFEB3B]" />
            <span>Judge Evaluation &amp; Scoring Arena</span>
          </h1>
          <p className="text-xs font-bold text-purple-100 mt-1 max-w-xl">
            Logged in as <strong>{currentProfile.full_name || "Official Fest Judge"}</strong>. Evaluate squad submissions against weighted academic rubrics and lock final competitive marks.
          </p>
        </div>

        <Link href="/judge/pass">
          <Button
            variant="yellow"
            className="font-black text-xs px-4 py-2.5 flex items-center gap-2 shadow-[4px_4px_0px_#000000]"
          >
            <QrCode className="w-4 h-4 text-black" />
            <span>My Judge ID Pass</span>
          </Button>
        </Link>
      </div>

      {/* Track & Event Selection Tabs */}
      <div className="border-[3px] border-black bg-white p-4 shadow-[6px_6px_0px_#000000]">
        <p className="text-xs font-black uppercase tracking-wider text-black mb-3">
          Select Competition Event / Track to Judge:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {tracks.map((tr) => {
            const isSelected = tr.id === activeTrack?.id;
            const teamsInTrack = teams.filter((t) => t.track_id === tr.id);
            const scoredInTrack = teamsInTrack.filter((t) => getTeamEvaluation(t.id).isScored).length;

            return (
              <button
                key={tr.id}
                onClick={() => setActiveTrackId(tr.id)}
                className={`p-3 border-[3px] border-black text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000] -translate-x-0.5 -translate-y-0.5"
                    : "bg-[#FFFBEB] hover:bg-slate-100 shadow-[2px_2px_0px_#000000]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm uppercase tracking-tight">{tr.name}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 bg-black text-white">
                    {scoredInTrack}/{teamsInTrack.length}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-700 line-clamp-1">
                  {tr.description || "Official competitive track"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-slate-600 block">TOTAL SQUADS</span>
          <span className="text-2xl font-black text-black">{trackTeams.length}</span>
        </div>
        <div className="p-3.5 border-[3px] border-black bg-[#4CAF50] text-black shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">EVALUATED</span>
          <span className="text-2xl font-black">{scoredCount}</span>
        </div>
        <div className="p-3.5 border-[3px] border-black bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">PENDING MARK</span>
          <span className="text-2xl font-black">{pendingCount}</span>
        </div>
        <div className="p-3.5 border-[3px] border-black bg-[#2196F3] text-black shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">RUBRIC CRITERIA</span>
          <span className="text-2xl font-black">{trackCriteria.length} Items</span>
        </div>
      </div>

      {/* Evaluation Rubric Info Box */}
      <div className="p-4 border-2 border-black bg-[#FFFBEB] shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            Active Rubric Criteria for {activeTrack?.name}:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trackCriteria.map((c) => (
            <div key={c.id} className="bg-white border-2 border-black px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_#000000]">
              <span className="text-black">{c.name}</span>
              <span className="ml-1.5 text-[10px] bg-black text-[#FFEB3B] px-1 py-0.2 font-mono font-black">
                {(c.weight * 100).toFixed(0)}% WT (Max {c.max_score})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team, school, or project..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-bold nb-input"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
              filterStatus === "all" ? "bg-black text-white" : "bg-white hover:bg-slate-100"
            }`}
          >
            All ({trackTeams.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
              filterStatus === "pending" ? "bg-[#FFEB3B] text-black" : "bg-white hover:bg-slate-100"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("scored")}
            className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
              filterStatus === "scored" ? "bg-[#4CAF50] text-black" : "bg-white hover:bg-slate-100"
            }`}
          >
            Scored ({scoredCount})
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="space-y-3">
        {filteredTeams.length === 0 ? (
          <div className="p-8 text-center bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
            <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-black text-black">No competing teams found in this view.</p>
            <p className="text-xs text-slate-600 mt-1">Teams registered by visiting schools will appear here automatically.</p>
          </div>
        ) : (
          filteredTeams.map((team) => {
            const school = schools.find((s) => s.id === team.school_id);
            const evalStatus = getTeamEvaluation(team.id);

            return (
              <div
                key={team.id}
                className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                      TABLE {team.table_number || "T-00"}
                    </span>
                    <span className="text-base font-black text-black">{team.name}</span>
                    {evalStatus.isScored ? (
                      <span className="text-[10px] font-black uppercase bg-[#4CAF50] text-black border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000000]">
                        ✓ SCORED: {evalStatus.total} / 100
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase bg-[#FFEB3B] text-black border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000000]">
                        PENDING EVALUATION
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    <School className="w-3.5 h-3.5 inline mr-1 text-slate-600" />
                    {school?.name || "Independent Institution"} ({school?.city || "Campus"})
                  </p>

                  {team.project_title && (
                    <p className="text-xs font-bold text-slate-900 bg-[#FFFBEB] p-2 border border-black inline-block">
                      <strong>Project:</strong> {team.project_title}
                      {team.project_summary && <span className="block text-[11px] text-slate-700 mt-0.5 font-normal">{team.project_summary}</span>}
                    </p>
                  )}
                </div>

                <Button
                  variant={evalStatus.isScored ? "secondary" : "yellow"}
                  className="font-black text-xs py-2.5 px-4 flex-shrink-0 shadow-[3px_3px_0px_#000000]"
                  onClick={() => openScoringModal(team)}
                >
                  <Sliders className="w-4 h-4 mr-1.5" />
                  <span>{evalStatus.isScored ? "Edit Marks" : "Enter Marks"}</span>
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Scoring Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Jury Evaluation: ${selectedTeam?.name || "Team"}`}
      >
        {selectedTeam && (
          <form onSubmit={handleSaveMarks} className="space-y-5 text-black">
            <div className="p-3 bg-[#FFFBEB] border-2 border-black text-xs font-bold space-y-1">
              <p><strong>School:</strong> {schools.find((s) => s.id === selectedTeam.school_id)?.name}</p>
              <p><strong>Track:</strong> {activeTrack?.name}</p>
              {selectedTeam.project_title && (
                <p><strong>Project:</strong> {selectedTeam.project_title}</p>
              )}
            </div>

            {/* Criteria Sliders */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase text-black bg-[#FFEB3B] border border-black px-2 py-0.5 inline-block">
                Evaluate Criteria Marks:
              </p>

              {trackCriteria.map((crit) => {
                const currentScore = criterionScores[crit.id] ?? 8.0;

                return (
                  <div key={crit.id} className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] space-y-2">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span>{crit.name}</span>
                      <span className="font-mono text-sm bg-black text-[#FFEB3B] px-2 py-0.5">
                        {currentScore.toFixed(1)} / {crit.max_score}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={crit.max_score}
                        step="0.5"
                        value={currentScore}
                        onChange={(e) =>
                          setCriterionScores({
                            ...criterionScores,
                            [crit.id]: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-black cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0"
                        max={crit.max_score}
                        step="0.1"
                        value={currentScore}
                        onChange={(e) =>
                          setCriterionScores({
                            ...criterionScores,
                            [crit.id]: Math.min(crit.max_score, Math.max(0, parseFloat(e.target.value) || 0)),
                          })
                        }
                        className="w-16 px-2 py-1 text-xs font-mono font-black border-2 border-black text-center"
                      />
                    </div>

                    <p className="text-[10px] text-slate-600 font-bold">
                      Weight: {(crit.weight * 100).toFixed(0)}% of total track score
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Live Weighted Score Display */}
            <div className="p-4 bg-black text-white border-2 border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FFEB3B] uppercase tracking-wider block">
                  COMPUTED WEIGHTED MARK
                </span>
                <span className="text-xs font-bold text-slate-300">Sum of weighted criteria</span>
              </div>
              <span className="text-3xl font-mono font-black text-[#FFEB3B]">
                {computeLiveTotal()} <span className="text-base text-white">/ 100</span>
              </span>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-1">
              <label className="text-xs font-black text-black block">
                Jury Feedback &amp; Constructive Remarks (Optional)
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Remarks on innovation, circuit stability, code structure, or presentation..."
                className="w-full p-2.5 text-xs font-bold nb-input"
              />
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="text-xs font-black"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="yellow"
                className="text-xs font-black px-6"
              >
                <Save className="w-4 h-4 mr-1.5" />
                <span>Save &amp; Submit Mark</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
