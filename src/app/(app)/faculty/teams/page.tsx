"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Sparkles,
  Plus,
  Users,
  Edit2,
  Bot,
  Wrench,
  Table,
  Building2,
} from "lucide-react";

export default function FacultyTeamsPage() {
  const { currentProfile, schools, teams, tracks, students, addTeam, updateTeam, setFacultySchoolId } = useFestStore();

  const facultySchool =
    schools.find((s) => s.id === currentProfile.school_id) ||
    schools.find((s) => s.contact_email?.toLowerCase() === currentProfile.email?.toLowerCase()) ||
    schools[0];
  const schoolTeams = facultySchool
    ? teams.filter((t) => t.school_id === facultySchool.id)
    : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    trackId: tracks[0]?.id || "",
    projectTitle: "",
    projectSummary: "",
    tableNumber: "",
  });

  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingTeamId(null);
    setFormData({
      name: "",
      trackId: tracks[0]?.id || "",
      projectTitle: "",
      projectSummary: "",
      tableNumber: "",
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (team: any) => {
    setEditingTeamId(team.id);
    setFormData({
      name: team.name,
      trackId: team.track_id,
      projectTitle: team.project_title || "",
      projectSummary: team.project_summary || "",
      tableNumber: team.table_number || "",
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.projectTitle) {
      setError("Team name and Project title are required.");
      return;
    }

    // Rule: Each school sends ONE team per track
    if (!editingTeamId) {
      const existingTeamInTrack = schoolTeams.find((t) => t.track_id === formData.trackId);
      if (existingTeamInTrack) {
        setError("Your school already has a team entered in this track. Edit existing team instead.");
        return;
      }

      addTeam({
        school_id: facultySchool.id,
        track_id: formData.trackId,
        name: formData.name,
        project_title: formData.projectTitle,
        project_summary: formData.projectSummary,
        table_number: formData.tableNumber || undefined,
      });
    } else {
      updateTeam(editingTeamId, {
        name: formData.name,
        project_title: formData.projectTitle,
        project_summary: formData.projectSummary,
        table_number: formData.tableNumber || undefined,
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            COMPETITION SQUADS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Track Teams</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure one team per track for {facultySchool?.name}.
          </p>
        </div>

        <Button size="sm" variant="gradient" onClick={openCreateModal} className="text-xs">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Create Track Team</span>
        </Button>
      </div>

      {/* Active Delegation Switcher */}
      {schools.length > 0 && (
        <div className="p-4 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-black">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000]">
              <Building2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-600 block">Assigned Visiting Delegation</span>
              <span className="text-base font-black text-black">{facultySchool?.name || "No School Assigned"}</span>
              <span className="text-xs text-slate-700 block font-bold">{facultySchool?.city} • Code: {facultySchool?.code}</span>
            </div>
          </div>
          {schools.length > 1 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-black text-black uppercase">Switch Delegation:</span>
              <select
                value={facultySchool?.id}
                onChange={(e) => setFacultySchoolId(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-black border-2 border-black bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shadow-[2px_2px_0px_#000000]"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code} - {s.city})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Grid of Teams */}
      {schoolTeams.length === 0 ? (
        <GlassCard className="p-12 text-center border-white/15">
          <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">No Teams Created Yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            Form your team for Robotics, Build from Scrap, or Useless Projects.
          </p>
          <Button size="sm" variant="gradient" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" />
            <span>Create First Team</span>
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schoolTeams.map((team) => {
            const track = tracks.find((t) => t.id === team.track_id);
            const teamMembers = students.filter((s) => s.team_id === team.id);

            let glow: "blue" | "green" | "red" = "blue";
            if (track?.slug === "build-from-scrap") glow = "green";
            if (track?.slug === "useless-projects") glow = "red";

            return (
              <GlassCard key={team.id} glow={glow} className="p-6 border-white/15 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white">
                      {track?.name || "Track"}
                    </span>
                    <button
                      onClick={() => openEditModal(team)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit team"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                  <p className="text-sm font-semibold text-indigo-300 mb-3">{team.project_title}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {team.project_summary || "No project summary provided."}
                  </p>

                  <div className="rounded-xl bg-black/40 border border-white/10 p-3 mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Squad Members ({teamMembers.length})</span>
                      <span className="text-[11px] font-mono">Table: {team.table_number || "TBD"}</span>
                    </div>
                    {teamMembers.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No students assigned to this team yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {teamMembers.map((m) => (
                          <span key={m.id} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                            {m.name} ({m.class})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Score:</span>
                  <span className="font-mono font-bold text-indigo-300 text-sm">
                    {team.score_total ? team.score_total.toFixed(2) : "0.00"} pts
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTeamId ? "Edit Track Team" : "Register Track Team"}
        description="Visiting delegations field 1 team per track."
      >
        <form onSubmit={handleSaveTeam} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Select Track *
            </label>
            <select
              disabled={!!editingTeamId}
              value={formData.trackId}
              onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
              className="w-full px-3 py-2.5 glass-input text-xs bg-slate-900 text-white disabled:opacity-50"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Team Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Joseph MechStrikers"
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              placeholder="e.g. Pneumatic Payload Gripper"
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Project Summary / Pitch</label>
            <textarea
              rows={3}
              value={formData.projectSummary}
              onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
              placeholder="Brief description of mechanism, design, or purpose..."
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Allotted Table Number</label>
            <input
              type="text"
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              placeholder="e.g. ROBO-02 (leave blank if not yet allotted)"
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
