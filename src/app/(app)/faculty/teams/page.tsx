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
} from "lucide-react";

export default function FacultyTeamsPage() {
  const { currentProfile, schools, teams, tracks, students, addTeam, updateTeam } = useFestStore();

  const facultySchool = schools.find((s) => s.id === currentProfile.school_id) || schools[0];
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
        table_number: formData.tableNumber || "TBD",
      });
    } else {
      updateTeam(editingTeamId, {
        name: formData.name,
        track_id: formData.trackId,
        project_title: formData.projectTitle,
        project_summary: formData.projectSummary,
        table_number: formData.tableNumber,
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#FFEB3B] text-black border-2 border-black font-black">
            SQUAD ROSTER
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Teams — {facultySchool?.name}
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Configure your school squad for each track (1 team per track allowed).
          </p>
        </div>

        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Register Team</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {schoolTeams.map((team) => {
          const track = tracks.find((t) => t.id === team.track_id);
          const squadMembers = students.filter((s) => s.team_id === team.id || (s.school_id === facultySchool.id && s.track_id === team.track_id));

          return (
            <GlassCard key={team.id} variant="white" className="p-6 flex flex-col justify-between border-4 border-black shadow-[6px_6px_0px_#000]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 border-2 border-black bg-[#2196F3] text-black shadow-[2px_2px_0px_#000]">
                    {track?.name}
                  </span>
                  <span className="font-mono text-xs font-bold bg-[#FFEB3B] text-black px-2 py-0.5 border border-black">
                    Table: {team.table_number || "TBD"}
                  </span>
                </div>

                <h3 className="text-xl font-black text-black uppercase tracking-tight">{team.name}</h3>
                <p className="text-sm font-bold text-black mt-1 bg-[#FFFBEB] p-1 border border-black">{team.project_title}</p>
                <p className="text-xs text-neutral-800 font-medium mt-2 leading-relaxed">{team.project_summary}</p>

                {/* Team members count */}
                <div className="mt-4 pt-3 border-t-2 border-black">
                  <div className="flex items-center gap-2 text-xs font-black text-black uppercase mb-2">
                    <Users className="h-4 w-4" />
                    <span>Members ({squadMembers.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {squadMembers.map((m) => (
                      <span key={m.id} className="text-[11px] bg-white border border-black px-2 py-0.5 text-black font-bold shadow-[1px_1px_0px_#000]">
                        {m.full_name}
                      </span>
                    ))}
                    {squadMembers.length === 0 && (
                      <span className="text-xs text-neutral-500 italic">No students assigned to track</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t-2 border-black flex justify-end">
                <Button size="sm" variant="secondary" className="text-xs font-bold" onClick={() => openEditModal(team)}>
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  <span>Edit Team Info</span>
                </Button>
              </div>
            </GlassCard>
          );
        })}

        {schoolTeams.length === 0 && (
          <GlassCard variant="white" className="col-span-full p-8 text-center text-black font-bold text-xs border-4 border-black shadow-[6px_6px_0px_#000]">
            No teams created yet. Register a team for Robotics, Build from Scrap, or Useless Projects.
          </GlassCard>
        )}
      </div>

      {/* Modal for creating/editing team */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTeamId ? "Edit Team Details" : "Register School Team"}
        description="Assign track, project title, and table number."
      >
        <form onSubmit={handleSaveTeam} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Team Squad Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Apex Botsmiths"
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Track *</label>
            <select
              disabled={!!editingTeamId}
              value={formData.trackId}
              onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3] disabled:opacity-60"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Project Invention Title *</label>
            <input
              type="text"
              required
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              placeholder="e.g. VortexCrawler X4"
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Project Concept / Pitch *</label>
            <textarea
              required
              rows={3}
              value={formData.projectSummary}
              onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
              placeholder="Brief summary for judges..."
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-white bg-[#FF5252] border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
              {error}
            </p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Squad
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
