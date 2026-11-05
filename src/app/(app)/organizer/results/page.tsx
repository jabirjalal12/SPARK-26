"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Team, School } from "@/lib/types/database";
import {
  Trophy,
  Award,
  Lock,
  Unlock,
  Radio,
  Monitor,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  School as SchoolIcon,
  ExternalLink,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react";

export default function OrganizerResultsPage() {
  const {
    tracks,
    teams,
    schools,
    scores,
    results,
    publishedTrackIds,
    toggleTrackPublish,
    updateTeamLeaderboard,
    addLeaderboardTeam,
    deleteTeam,
    lockTrackScores,
    isSuperAdmin,
  } = useFestStore();

  const [activeTrackId, setActiveTrackId] = useState<string>(tracks[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"tracks" | "overview">("tracks");
  const [addWinnerModalOpen, setAddWinnerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form for manually typing a new winner / team
  const [manualForm, setManualForm] = useState({
    name: "",
    schoolId: schools[0]?.id || "",
    projectTitle: "",
    scoreTotal: 90,
  });

  // Track currently selected
  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];
  const isTrackPublishedOnTv = (publishedTrackIds || []).includes(activeTrack?.id);

  // Teams in the active track sorted by score
  const activeTrackTeams = useMemo(() => {
    if (!activeTrack) return [];
    return teams
      .filter((t) => t.track_id === activeTrack.id)
      .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
  }, [teams, activeTrack]);

  // Local draft state for in-line editable rows: teamId -> { name, school_id, project_title, score_total }
  const [editedTeams, setEditedTeams] = useState<
    Record<string, { name: string; school_id: string; project_title: string; score_total: number }>
  >({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get field value from local edits or fallback to team model
  const getFieldValue = (team: Team, field: "name" | "school_id" | "project_title" | "score_total") => {
    if (editedTeams[team.id] && editedTeams[team.id][field] !== undefined) {
      return editedTeams[team.id][field];
    }
    if (field === "score_total") return team.score_total ?? 0;
    if (field === "name") return team.name;
    if (field === "school_id") return team.school_id;
    return team.project_title;
  };

  const handleFieldChange = (
    teamId: string,
    team: Team,
    field: "name" | "school_id" | "project_title" | "score_total",
    value: any
  ) => {
    setEditedTeams((prev) => {
      const current = prev[teamId] || {
        name: team.name,
        school_id: team.school_id,
        project_title: team.project_title,
        score_total: team.score_total ?? 0,
      };
      return {
        ...prev,
        [teamId]: {
          ...current,
          [field]: field === "score_total" ? parseFloat(value) || 0 : value,
        },
      };
    });
  };

  // Commit in-line edited team
  const handleSaveTeam = async (teamId: string, team: Team) => {
    const edits = editedTeams[teamId];
    if (!edits) return;

    await updateTeamLeaderboard(teamId, {
      name: edits.name,
      school_id: edits.school_id,
      project_title: edits.project_title,
      score_total: edits.score_total,
    });

    setEditedTeams((prev) => {
      const next = { ...prev };
      delete next[teamId];
      return next;
    });

    showToast(`Updated "${edits.name}" standings and synced with TV!`);
  };

  // Handle adding a brand new manual team / podium winner
  const handleAddManualWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !activeTrack) return;

    await addLeaderboardTeam({
      track_id: activeTrack.id,
      name: manualForm.name.trim(),
      school_id: manualForm.schoolId || schools[0]?.id || "",
      project_title: manualForm.projectTitle.trim() || "Event Submission",
      score_total: Number(manualForm.scoreTotal) || 0,
    });

    setManualForm({
      name: "",
      schoolId: schools[0]?.id || "",
      projectTitle: "",
      scoreTotal: 90,
    });

    setAddWinnerModalOpen(false);
    showToast(`Added new team to ${activeTrack.name} leaderboard!`);
  };

  // Toggle TV Publishing for current track
  const handleToggleTvPublish = async (trackId: string) => {
    const isCurrentlyOn = (publishedTrackIds || []).includes(trackId);
    await toggleTrackPublish(trackId, !isCurrentlyOn);
    showToast(
      !isCurrentlyOn
        ? `Published event to TV Display! In TV mode, this event will now stream live.`
        : `Hidden event from TV Display. Only active published events will appear on TV.`
    );
  };

  // Pre-load scores from judges if teams have 0 points
  const handleSyncFromJudgeScores = async () => {
    if (!activeTrack) return;
    let syncCount = 0;

    for (const team of activeTrackTeams) {
      const teamScores = scores.filter((s) => s.team_id === team.id);
      if (teamScores.length > 0) {
        let weightedSum = 0;
        teamScores.forEach((sc) => {
          weightedSum += sc.value;
        });
        const calculated = Number((weightedSum / teamScores.length).toFixed(2));
        await updateTeamLeaderboard(team.id, { score_total: calculated });
        syncCount++;
      }
    }

    showToast(`Synced ${syncCount} team marks from judge evaluations!`);
  };

  // Route Guard: Super Admin Only
  if (!isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] text-center">
        <div className="w-12 h-12 bg-[#FF5252] border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#000]">
          <Lock className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-xl font-black text-black">Super Admin Clearance Required</h2>
        <p className="text-xs font-bold text-slate-700 mt-2">
          Only Super Administrators can manage official event leaderboards, type custom participant names, and broadcast results to the TV kiosk.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span>View Public Leaderboard</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Count how many events are currently published to TV
  const totalTvPublishedEvents = tracks.filter((t) => (publishedTrackIds || []).includes(t.id)).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 border-[3px] border-black bg-[#4CAF50] text-black text-xs font-black shadow-[4px_4px_0px_#000000] flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#FFEB3B] border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-black text-[#FFEB3B] px-2.5 py-0.5 text-xs font-black uppercase tracking-wider">
              SUPER ADMIN LEADERBOARD DESK
            </span>
            <span className="bg-white text-black px-2 py-0.5 text-xs font-black border border-black">
              {totalTvPublishedEvents} of {tracks.length} Events on TV
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Event Leaderboard & TV Display Manager
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
            Update rankings per event, manually type team names and scores, and control which events appear on the venue TV screens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <Link
            href="/tv"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-[#FFEB3B] border-2 border-black font-black text-xs shadow-[3px_3px_0px_#000000] hover:bg-white hover:text-black hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Monitor className="w-4 h-4" />
            <span>Open TV Kiosk (/tv)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-black border-2 border-black font-black text-xs shadow-[3px_3px_0px_#000000] hover:bg-[#FFFBEB] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>Public Leaderboard</span>
          </Link>
        </div>
      </div>

      {/* Global TV Active Events Control Bar */}
      <div className="p-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b-2 border-black mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-black animate-pulse" />
            <span className="text-xs font-black uppercase text-black">
              TV Display Broadcast Status (Only green events show on TV)
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-700">
            Click any event badge below to toggle TV broadcast on / off
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tracks.map((t) => {
            const isLive = (publishedTrackIds || []).includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => handleToggleTvPublish(t.id)}
                className={`px-3 py-1.5 text-xs font-black border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                  isLive
                    ? "bg-[#4CAF50] text-black"
                    : "bg-[#F5F5F5] text-slate-600 hover:bg-[#FFEB3B] hover:text-black"
                }`}
                title={isLive ? "Click to hide from TV" : "Click to show on TV"}
              >
                {isLive ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{t.name}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 border border-black uppercase ${
                    isLive ? "bg-black text-[#FFEB3B]" : "bg-white text-slate-700"
                  }`}
                >
                  {isLive ? "ON TV" : "DRAFT"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tabs: By Event vs All Events Overview */}
      <div className="flex gap-2 p-1.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] overflow-x-auto">
        <button
          onClick={() => setActiveTab("tracks")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "tracks"
              ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
              : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          🏆 Event Leaderboard & Manual Entry
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
              : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          📊 All Events TV Overview
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: INDIVIDUAL EVENT LEADERBOARD & MANUAL NAME TYPE UPDATING       */}
      {/* ===================================================================== */}
      {activeTab === "tracks" && (
        <div className="space-y-6">
          {/* Horizontal Track Selector */}
          <div className="flex gap-2 p-1.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] overflow-x-auto">
            {tracks.map((t) => {
              const isActive = t.id === activeTrack?.id;
              const isLive = (publishedTrackIds || []).includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTrackId(t.id)}
                  className={`px-3 py-2 text-xs font-black border-2 border-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? "bg-black text-[#FFEB3B] shadow-[3px_3px_0px_#2196F3] -translate-x-0.5 -translate-y-0.5"
                      : "bg-[#FFFBEB] text-black hover:bg-[#FFEB3B]"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full border border-black ${isLive ? "bg-[#4CAF50]" : "bg-slate-400"}`} />
                  <span>{t.name}</span>
                  {isLive && <span className="text-[9px] bg-[#4CAF50] text-black px-1 border border-black">TV</span>}
                </button>
              );
            })}
          </div>

          {/* Active Event Banner & Controls */}
          {activeTrack && (
            <div className="p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-black">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="px-2 py-0.5 text-[10px] font-black uppercase text-white border border-black"
                      style={{ backgroundColor: activeTrack.color || "#1E40AF" }}
                    >
                      {activeTrack.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black uppercase border border-black ${
                        isTrackPublishedOnTv
                          ? "bg-[#4CAF50] text-black"
                          : "bg-[#FFFBEB] text-slate-800"
                      }`}
                    >
                      {isTrackPublishedOnTv ? "🟢 Active on TV Display" : "⚪ Hidden From TV (Draft)"}
                    </span>
                    {activeTrack.scores_locked && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#FF5252] text-black border border-black flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-black">{activeTrack.name} Leaderboard</h2>
                  <p className="text-xs font-bold text-slate-700 mt-1 max-w-xl">
                    {activeTrack.description || "Official tech fest competition track."}
                  </p>
                </div>

                {/* Event Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    size="sm"
                    variant={isTrackPublishedOnTv ? "danger" : "green"}
                    onClick={() => handleToggleTvPublish(activeTrack.id)}
                    className="text-xs uppercase font-black border-2 border-black shadow-[3px_3px_0px_#000000]"
                  >
                    {isTrackPublishedOnTv ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1.5" />
                        <span>Hide from TV Display</span>
                      </>
                    ) : (
                      <>
                        <Monitor className="w-4 h-4 mr-1.5" />
                        <span>Publish to TV Display</span>
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => lockTrackScores(activeTrack.id, !activeTrack.scores_locked)}
                    className="text-xs uppercase font-black border-2 border-black shadow-[3px_3px_0px_#000000] bg-white"
                  >
                    {activeTrack.scores_locked ? (
                      <>
                        <Unlock className="w-4 h-4 mr-1" />
                        <span>Unlock Scores</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        <span>Lock Scores</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Manual Name Type Updating Toolbar */}
              <div className="p-4 bg-[#FFFBEB] border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#000000]">
                <div>
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-black" />
                    <span className="text-xs font-black uppercase text-black">
                      Manual Name & Score Typing
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                    Type or update team names, project titles, and scores directly. Changes take effect on the leaderboard and TV immediately.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={() => setAddWinnerModalOpen(true)}
                    className="text-xs uppercase font-black bg-[#FFEB3B] text-black border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>+ Add Winner (Type Name)</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSyncFromJudgeScores}
                    className="text-xs uppercase font-black bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000000]"
                    title="Load calculated marks from judge entries"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    <span>Load Judge Marks</span>
                  </Button>
                </div>
              </div>

              {/* Editable Teams / Standings Table */}
              <div className="space-y-3 pt-2">
                {activeTrackTeams.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-black bg-white text-center space-y-3">
                    <Trophy className="w-8 h-8 text-black mx-auto opacity-50" />
                    <p className="text-sm font-black text-black">No Teams or Winners Configured in this Event</p>
                    <p className="text-xs font-bold text-slate-600 max-w-sm mx-auto">
                      Click "+ Add Winner (Type Name)" above to manually type the 1st, 2nd, and 3rd place winners for this event.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setAddWinnerModalOpen(true)}
                      className="bg-[#FFEB3B] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000]"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add First Winner
                    </Button>
                  </div>
                ) : (
                  activeTrackTeams.map((team, idx) => {
                    const rank = idx + 1;
                    const isEdited = !!editedTeams[team.id];
                    const currentName = getFieldValue(team, "name");
                    const currentSchoolId = getFieldValue(team, "school_id");
                    const currentTitle = getFieldValue(team, "project_title");
                    const currentScore = getFieldValue(team, "score_total");

                    return (
                      <div
                        key={team.id}
                        className={`p-4 border-2 border-black shadow-[3px_3px_0px_#000000] transition-all ${
                          rank === 1
                            ? "bg-[#FFF9C4]"
                            : rank === 2
                            ? "bg-[#F5F5F5]"
                            : rank === 3
                            ? "bg-[#FBE9E7]"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                          {/* Rank Badge */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className={`w-8 h-8 border-2 border-black flex items-center justify-center font-black text-xs ${
                                rank === 1
                                  ? "bg-black text-[#FFEB3B] shadow-[2px_2px_0px_#FFEB3B]"
                                  : rank === 2
                                  ? "bg-[#9E9E9E] text-white"
                                  : rank === 3
                                  ? "bg-[#FF9800] text-black"
                                  : "bg-[#FFFBEB] text-black"
                              }`}
                            >
                              {rank === 1 ? "🥇 1" : rank === 2 ? "🥈 2" : rank === 3 ? "🥉 3" : `#${rank}`}
                            </span>
                          </div>

                          {/* Editable Inputs Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-1 w-full text-xs">
                            {/* Team / Participant Name (Manual Typing) */}
                            <div className="sm:col-span-4">
                              <label className="text-[10px] font-black uppercase text-slate-700 block mb-0.5">
                                Team / Participant Name *
                              </label>
                              <input
                                type="text"
                                value={currentName}
                                onChange={(e) => handleFieldChange(team.id, team, "name", e.target.value)}
                                placeholder="Type Participant / Team Name"
                                className="w-full px-2.5 py-1.5 border-2 border-black bg-white font-black text-black text-xs shadow-[1px_1px_0px_#000]"
                              />
                            </div>

                            {/* Institution / School */}
                            <div className="sm:col-span-4">
                              <label className="text-[10px] font-black uppercase text-slate-700 block mb-0.5">
                                School / Institution *
                              </label>
                              <select
                                value={currentSchoolId}
                                onChange={(e) => handleFieldChange(team.id, team, "school_id", e.target.value)}
                                className="w-full px-2.5 py-1.5 border-2 border-black bg-white font-bold text-black text-xs shadow-[1px_1px_0px_#000]"
                              >
                                {schools.map((sch) => (
                                  <option key={sch.id} value={sch.id}>
                                    {sch.name} ({sch.code})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Project / Submission Title */}
                            <div className="sm:col-span-3">
                              <label className="text-[10px] font-black uppercase text-slate-700 block mb-0.5">
                                Project / Submission Title
                              </label>
                              <input
                                type="text"
                                value={currentTitle}
                                onChange={(e) => handleFieldChange(team.id, team, "project_title", e.target.value)}
                                placeholder="Type Project Title"
                                className="w-full px-2.5 py-1.5 border-2 border-black bg-white font-medium text-black text-xs shadow-[1px_1px_0px_#000]"
                              />
                            </div>

                            {/* Points / Score */}
                            <div className="sm:col-span-1">
                              <label className="text-[10px] font-black uppercase text-slate-700 block mb-0.5">
                                Pts *
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={currentScore}
                                onChange={(e) => handleFieldChange(team.id, team, "score_total", e.target.value)}
                                className="w-full px-2 py-1.5 border-2 border-black bg-[#FFEB3B] font-mono font-black text-black text-xs text-right shadow-[1px_1px_0px_#000]"
                              />
                            </div>
                          </div>

                          {/* Row Actions */}
                          <div className="flex items-center gap-1.5 flex-shrink-0 self-end lg:self-center">
                            <Button
                              size="sm"
                              disabled={!isEdited}
                              onClick={() => handleSaveTeam(team.id, team)}
                              className={`text-xs uppercase font-black border-2 border-black h-8 px-3 ${
                                isEdited
                                  ? "bg-[#4CAF50] text-black shadow-[2px_2px_0px_#000000] hover:bg-[#81C784]"
                                  : "bg-slate-200 text-slate-500 border-slate-400"
                              }`}
                            >
                              <Save className="w-3.5 h-3.5 mr-1" />
                              <span>Save</span>
                            </Button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete "${team.name}" from ${activeTrack.name}?`)) {
                                  deleteTeam(team.id);
                                  showToast(`Removed team from leaderboard.`);
                                }
                              }}
                              className="p-1.5 border-2 border-black bg-[#FF5252] text-black shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer h-8 w-8 flex items-center justify-center"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Live Olympic Podium Preview (Shows TV appearance in real-time) */}
              {activeTrackTeams.length > 0 && (
                <div className="pt-4 border-t-2 border-black mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-black" />
                      <span>Live TV Kiosk Podium Preview ({activeTrack.name})</span>
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${
                        isTrackPublishedOnTv ? "bg-[#4CAF50] text-black" : "bg-black text-[#FFEB3B]"
                      }`}
                    >
                      {isTrackPublishedOnTv ? "STREAMING LIVE ON TV DISPLAY" : "PREVIEW ONLY (CLICK PUBLISH TO SHOW ON TV)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 bg-[#FFFBEB] border-2 border-black shadow-[3px_3px_0px_#000000] items-end">
                    {/* #2 Silver */}
                    <div className="p-3 bg-[#E0E0E0] border-2 border-black text-center shadow-[2px_2px_0px_#000000] h-32 flex flex-col justify-between">
                      <div className="w-6 h-6 bg-white border border-black font-black text-xs flex items-center justify-center mx-auto">
                        🥈
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-800">Runner Up (#2)</span>
                        <h4 className="text-xs font-black text-black truncate">{activeTrackTeams[1]?.name || "—"}</h4>
                        <p className="text-[10px] font-bold text-slate-700 truncate">
                          {schools.find((s) => s.id === activeTrackTeams[1]?.school_id)?.name || "—"}
                        </p>
                      </div>
                      <div className="p-0.5 bg-white border border-black font-black text-xs text-black">
                        {activeTrackTeams[1]?.score_total || 0} pts
                      </div>
                    </div>

                    {/* #1 Gold */}
                    <div className="p-3 bg-[#FFEB3B] border-2 border-black text-center shadow-[4px_4px_0px_#000000] h-40 flex flex-col justify-between">
                      <div className="w-7 h-7 bg-black text-[#FFEB3B] border border-black font-black text-sm flex items-center justify-center mx-auto">
                        🥇
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-black">CHAMPION (#1)</span>
                        <h4 className="text-sm font-black text-black truncate">{activeTrackTeams[0]?.name || "—"}</h4>
                        <p className="text-[10px] font-bold text-slate-800 truncate">
                          {schools.find((s) => s.id === activeTrackTeams[0]?.school_id)?.name || "—"}
                        </p>
                      </div>
                      <div className="p-1 bg-white border border-black font-black text-sm text-black">
                        {activeTrackTeams[0]?.score_total || 0} pts
                      </div>
                    </div>

                    {/* #3 Bronze */}
                    <div className="p-3 bg-[#FFCCBC] border-2 border-black text-center shadow-[2px_2px_0px_#000000] h-28 flex flex-col justify-between">
                      <div className="w-6 h-6 bg-white border border-black font-black text-xs flex items-center justify-center mx-auto">
                        🥉
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-800">2nd Runner Up (#3)</span>
                        <h4 className="text-xs font-black text-black truncate">{activeTrackTeams[2]?.name || "—"}</h4>
                        <p className="text-[10px] font-bold text-slate-700 truncate">
                          {schools.find((s) => s.id === activeTrackTeams[2]?.school_id)?.name || "—"}
                        </p>
                      </div>
                      <div className="p-0.5 bg-white border border-black font-black text-xs text-black">
                        {activeTrackTeams[2]?.score_total || 0} pts
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: ALL EVENTS TV BROADCAST OVERVIEW                               */}
      {/* ===================================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="p-5 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
            <h2 className="text-lg font-black text-black mb-1">Campus TV Broadcast Status Matrix</h2>
            <p className="text-xs font-bold text-slate-700 mb-4">
              Events with "Published to TV" enabled rotate automatically on the TV displays. Un-updated events remain hidden.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tracks.map((track) => {
                const isLive = (publishedTrackIds || []).includes(track.id);
                const trackTeams = teams
                  .filter((t) => t.track_id === track.id)
                  .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
                const topWinner = trackTeams[0];

                return (
                  <div
                    key={track.id}
                    className={`p-4 border-[3px] border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between ${
                      isLive ? "bg-[#FFF9C4]" : "bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="px-2 py-0.5 text-[10px] font-black uppercase text-white border border-black"
                          style={{ backgroundColor: track.color || "#1E40AF" }}
                        >
                          {track.name}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 border border-black text-[9px] font-black uppercase ${
                            isLive ? "bg-[#4CAF50] text-black" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {isLive ? "ON TV" : "DRAFT"}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 mb-2">
                        {trackTeams.length} teams evaluated
                      </p>

                      <div className="p-2 border border-black bg-white text-xs mb-3">
                        <span className="text-[10px] font-bold text-slate-600 block uppercase">Current 1st Place:</span>
                        <strong className="text-black block truncate">{topWinner ? topWinner.name : "None yet"}</strong>
                        <span className="text-[11px] font-mono font-bold text-slate-800">
                          {topWinner ? `${topWinner.score_total || 0} pts` : "0.00 pts"}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isLive ? "danger" : "green"}
                      onClick={() => handleToggleTvPublish(track.id)}
                      className="w-full text-[11px] uppercase font-black border-2 border-black shadow-[2px_2px_0px_#000000]"
                    >
                      {isLive ? "Hide from TV" : "Publish to TV"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM PODIUM WINNER / TEAM (MANUAL TYPE) */}
      <Modal
        isOpen={addWinnerModalOpen}
        onClose={() => setAddWinnerModalOpen(false)}
        title={`Add Winner / Team: ${activeTrack?.name}`}
        description="Manually type participant name, select school institution, and enter final score."
      >
        <form onSubmit={handleAddManualWinner} className="space-y-4 font-sans text-black">
          <div>
            <label className="text-xs font-black text-black block mb-1">
              Participant / Team Name *
            </label>
            <input
              type="text"
              required
              value={manualForm.name}
              onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
              placeholder="e.g. Apex Rovers / Sneha & Rohit"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">
              School / Institution *
            </label>
            <select
              value={manualForm.schoolId}
              onChange={(e) => setManualForm({ ...manualForm, schoolId: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code} • {s.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">
              Project / Submission Title
            </label>
            <input
              type="text"
              value={manualForm.projectTitle}
              onChange={(e) => setManualForm({ ...manualForm, projectTitle: e.target.value })}
              placeholder="e.g. Autonomous Maze Solver"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-medium text-black"
            />
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">
              Final Score / Points *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={manualForm.scoreTotal}
              onChange={(e) => setManualForm({ ...manualForm, scoreTotal: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border-2 border-black bg-[#FFEB3B] font-mono text-xs font-black text-black"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddWinnerModalOpen(false)}
              className="border-2 border-black text-xs font-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#4CAF50] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase hover:bg-[#81C784]"
            >
              Save to Event Leaderboard
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
