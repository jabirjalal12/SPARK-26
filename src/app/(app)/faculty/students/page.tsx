"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Users,
  Plus,
  QrCode,
  ArrowRight,
  Upload,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Bot,
  Wrench,
  Sparkles,
  Edit2,
  Building2,
  Layers,
  School,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function FacultyStudentsPage() {
  const {
    currentProfile,
    schools,
    students,
    tracks,
    teams,
    saveEventSquad,
    setFacultySchoolId,
  } = useFestStore();

  const facultySchool =
    schools.find((s) => s.id === currentProfile.school_id) ||
    schools.find((s) => s.contact_email?.toLowerCase() === currentProfile.email?.toLowerCase()) ||
    schools[0];
  const schoolStudents = facultySchool
    ? students.filter((s) => s.school_id === facultySchool.id)
    : [];
  const schoolTeams = facultySchool
    ? teams.filter((s) => s.school_id === facultySchool.id)
    : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<any>(tracks[0] || null);

  const [formData, setFormData] = useState({
    teamName: "",
    projectTitle: "",
    projectSummary: "",
    members: [
      { name: "", class: "12-A" },
      { name: "", class: "12-A" },
      { name: "", class: "11-A" },
      { name: "", class: "11-B" },
    ],
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Open modal to configure 4-member squad for a specific track
  const openConfigureSquad = (track: any) => {
    setSelectedTrack(track);
    setError(null);

    const existingTeam = schoolTeams.find((t) => t.track_id === track.id);
    const existingMembers = existingTeam
      ? students.filter((s) => s.team_id === existingTeam.id)
      : [];

    const defaultMembers = [
      { name: existingMembers[0]?.name || "", class: existingMembers[0]?.class || "12-A" },
      { name: existingMembers[1]?.name || "", class: existingMembers[1]?.class || "12-A" },
      { name: existingMembers[2]?.name || "", class: existingMembers[2]?.class || "11-A" },
      { name: existingMembers[3]?.name || "", class: existingMembers[3]?.class || "11-B" },
    ];

    setFormData({
      teamName: existingTeam?.name || `${facultySchool?.name || "School"} ${track.name.split(" ")[0]} Squad`,
      projectTitle: existingTeam?.project_title || "",
      projectSummary: existingTeam?.project_summary || "",
      members: defaultMembers,
    });

    setModalOpen(true);
  };

  const handleMemberChange = (index: number, field: "name" | "class", value: string) => {
    const updated = [...formData.members];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, members: updated });
  };

  // Quick fill sample names for rapid testing
  const handleQuickFill = () => {
    setFormData({
      ...formData,
      teamName: formData.teamName || `${facultySchool?.name || "School"} ${selectedTrack?.name.split(" ")[0]} Squad`,
      projectTitle: formData.projectTitle || `Advanced ${selectedTrack?.name} System`,
      members: [
        { name: "Rahul Sharma", class: "12-A" },
        { name: "Ananya Patel", class: "12-B" },
        { name: "Karthik Verma", class: "11-A" },
        { name: "Sneha Nair", class: "11-A" },
      ],
    });
  };

  const handleSaveSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.teamName.trim()) {
      setError("Please enter a team name for your squad.");
      return;
    }

    // Verify at least the first member has a name
    const validMembers = formData.members.filter((m) => m.name.trim().length > 0);
    if (validMembers.length === 0) {
      setError("Please enter at least 1 student member name.");
      return;
    }

    try {
      await saveEventSquad({
        school_id: facultySchool.id,
        track_id: selectedTrack.id,
        team_name: formData.teamName.trim(),
        project_title: formData.projectTitle.trim(),
        project_summary: formData.projectSummary.trim(),
        members: formData.members,
      });

      setModalOpen(false);
      setToastMessage(`${selectedTrack.name} 4-Member Squad saved successfully!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setError(err?.message || "Failed saving squad.");
    }
  };

  const totalMembersEntered = schoolStudents.length;
  const configuredTracksCount = schoolTeams.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#4CAF50] text-black border-[3px] border-black px-4 py-3 shadow-[6px_6px_0px_#000000] flex items-center gap-2 text-xs font-black uppercase animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <div className="inline-block bg-[#FFEB3B] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase mb-1.5 shadow-[2px_2px_0px_#000000]">
            VISITING FACULTY DELEGATION ROSTER
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
            Event Squads (4 Members per Program)
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1 max-w-2xl">
            Each participating school fields a <strong>4-member student squad</strong> for each event (Robotics, Build from Scrap, etc.). Enter your student names directly under each corresponding program.
          </p>
        </div>

        <Link href="/faculty/ticket">
          <Button variant="yellow" className="text-xs font-black py-2.5 px-4 shadow-[4px_4px_0px_#000000]">
            <QrCode className="w-4 h-4 mr-1.5 text-black" />
            <span>Open Ticket Window →</span>
          </Button>
        </Link>
      </div>

      {/* Active Delegation Switcher */}
      {schools.length > 0 && (
        <div className="p-4 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

      {/* Institutional Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-slate-600 block">INSTITUTION</span>
          <span className="text-sm font-black text-black truncate block">{facultySchool?.name}</span>
          <span className="text-[10px] font-mono text-slate-700">{facultySchool?.city} • {facultySchool?.code}</span>
        </div>
        <div className="p-3.5 border-[3px] border-black bg-[#4CAF50] text-black shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">ENROLLED STUDENTS</span>
          <span className="text-2xl font-black">{totalMembersEntered} Members</span>
        </div>
        <div className="p-3.5 border-[3px] border-black bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">CONFIGURED SQUADS</span>
          <span className="text-2xl font-black">{configuredTracksCount} / {tracks.length} Events</span>
        </div>
        <div className="p-3.5 border-[3px] border-black bg-[#2196F3] text-black shadow-[4px_4px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">SQUAD SIZE</span>
          <span className="text-2xl font-black">4 per Event</span>
        </div>
      </div>

      {/* Next Step Guidance Banner */}
      <div className="p-4 border-[3px] border-black bg-[#FFEB3B] text-black shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-black text-[#FFEB3B] font-mono font-black text-xs px-2 py-0.5">
              STEP 2 OF 3
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Enter 4 Members for Each Competition Program
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 leading-relaxed max-w-2xl">
            Click &ldquo;Configure Squad Members&rdquo; on each program below to enter your 4 student participants. Once entered, open the <strong>Ticket</strong> window to download your official Delegation QR Pass.
          </p>
        </div>

        <Link href="/faculty/ticket" className="flex-shrink-0">
          <Button variant="primary" className="text-xs font-black uppercase shadow-[3px_3px_0px_#000000]">
            <QrCode className="w-4 h-4 mr-1.5" />
            <span>Generate QR Pass</span>
          </Button>
        </Link>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        {tracks.map((track) => {
          const team = schoolTeams.find((t) => t.track_id === track.id);
          const teamMembers = team
            ? students.filter((s) => s.team_id === team.id)
            : [];
          const isComplete = teamMembers.length >= 4;

          let headerBg = "bg-[#1E40AF]"; // Default Blue
          if (track.slug.includes("scrap")) headerBg = "bg-[#166534]"; // Green
          if (track.slug.includes("useless")) headerBg = "bg-[#991B1B]"; // Red

          return (
            <div
              key={track.id}
              className="border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] overflow-hidden"
            >
              {/* Event Header Banner */}
              <div className={`${headerBg} text-white p-4 border-b-[3px] border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFEB3B] px-2 py-0.5 border border-black">
                      PROGRAM TRACK
                    </span>
                    <span className="text-base sm:text-lg font-black uppercase tracking-tight">
                      {track.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-1 max-w-xl">
                    {track.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <span className="text-xs font-black bg-[#4CAF50] text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000000] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      4/4 MEMBERS READY
                    </span>
                  ) : teamMembers.length > 0 ? (
                    <span className="text-xs font-black bg-[#FFEB3B] text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000000]">
                      {teamMembers.length}/4 MEMBERS ENTERED
                    </span>
                  ) : (
                    <span className="text-xs font-black bg-white text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000000]">
                      SQUAD NOT CONFIGURED
                    </span>
                  )}

                  <Button
                    variant="yellow"
                    size="sm"
                    className="font-black text-xs py-2 px-3 shadow-[2px_2px_0px_#000000]"
                    onClick={() => openConfigureSquad(track)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    <span>{team ? "Edit Squad Members" : "Enter 4 Squad Members"}</span>
                  </Button>
                </div>
              </div>

              {/* Squad Details & 4 Members Box */}
              <div className="p-5 space-y-4">
                {team ? (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-3 border-b-2 border-black">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-600 block">SQUAD / TEAM NAME</span>
                        <span className="text-base font-black text-black">{team.name}</span>
                      </div>
                      {team.project_title && (
                        <div className="text-right sm:text-right">
                          <span className="text-[10px] font-black uppercase text-slate-600 block">PROJECT TITLE</span>
                          <span className="text-xs font-black text-black bg-[#FFFBEB] px-2 py-0.5 border border-black inline-block">
                            {team.project_title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 4 Member Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[0, 1, 2, 3].map((idx) => {
                        const member = teamMembers[idx];
                        const isLead = idx === 0;

                        return (
                          <div
                            key={idx}
                            className={`p-3 border-2 border-black shadow-[3px_3px_0px_#000000] ${
                              member ? "bg-[#FFFBEB]" : "bg-slate-50 border-dashed border-slate-400"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono font-black bg-black text-[#FFEB3B] px-1.5 py-0.2">
                                MEMBER {idx + 1} {isLead && "• LEAD"}
                              </span>
                              {member ? (
                                <span className="text-[10px] font-black text-emerald-800">✓ Enrolled</span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400">Empty</span>
                              )}
                            </div>

                            {member ? (
                              <div>
                                <p className="font-black text-xs text-black leading-snug">{member.name}</p>
                                <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                                  Grade/Class: {member.class}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs font-bold text-slate-400 italic">Click Edit Squad to add</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-[#FFFBEB] border-2 border-dashed border-black text-center space-y-2">
                    <Users className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-black text-black">
                      No 4-member squad configured yet for {track.name}.
                    </p>
                    <p className="text-xs font-bold text-slate-700 max-w-md mx-auto">
                      Click below to enter the 4 student participants from {facultySchool?.name} representing this track.
                    </p>
                    <Button
                      variant="yellow"
                      size="sm"
                      className="font-black text-xs shadow-[3px_3px_0px_#000000] mt-1"
                      onClick={() => openConfigureSquad(track)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      <span>Configure 4 Squad Members</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Enter 4 Members for Event Squad */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Squad Setup: ${selectedTrack?.name || "Program"}`}
      >
        <form onSubmit={handleSaveSquad} className="space-y-4 text-black">
          {error && (
            <div className="p-3 bg-[#FF5252] border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_#000000] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Helper */}
          <div className="flex items-center justify-between p-2.5 bg-[#FFFBEB] border-2 border-black text-xs font-bold">
            <span>Entering 4 student participants for <strong>{facultySchool?.name}</strong></span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[10px] font-black uppercase bg-white hover:bg-[#FFEB3B] px-2 py-1 border border-black shadow-[1px_1px_0px_#000000] cursor-pointer"
            >
              Fill Sample Names
            </button>
          </div>

          {/* Team / Squad Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b-2 border-black">
            <div>
              <label className="text-xs font-black text-black block mb-1">
                Squad / Team Name *
              </label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="e.g. Apex Titans"
                className="w-full px-3 py-2 text-xs font-bold nb-input"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">
                Project Title / Machine Name
              </label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                placeholder="e.g. Junkyard Solar Rover"
                className="w-full px-3 py-2 text-xs font-bold nb-input"
              />
            </div>
          </div>

          {/* The 4 Team Members */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-black bg-[#FFEB3B] border border-black px-2 py-0.5 inline-block">
              Squad Roster (Strictly 4 Students):
            </p>

            <div className="space-y-2.5">
              {[0, 1, 2, 3].map((idx) => {
                const isLead = idx === 0;

                return (
                  <div
                    key={idx}
                    className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <span className="w-24 text-[10px] font-mono font-black bg-black text-[#FFEB3B] px-2 py-1 flex-shrink-0 text-center">
                      MEMBER {idx + 1} {isLead && "• LEAD"}
                    </span>

                    <div className="flex-1 w-full sm:w-auto">
                      <input
                        type="text"
                        required={idx < 2}
                        value={formData.members[idx]?.name || ""}
                        onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                        placeholder={`Member ${idx + 1} Full Name *`}
                        className="w-full px-3 py-1.5 text-xs font-bold nb-input"
                      />
                    </div>

                    <div className="w-full sm:w-32 flex-shrink-0">
                      <input
                        type="text"
                        value={formData.members[idx]?.class || "12-A"}
                        onChange={(e) => handleMemberChange(idx, "class", e.target.value)}
                        placeholder="Class (12-A)"
                        className="w-full px-3 py-1.5 text-xs font-bold nb-input text-center"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
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
              className="text-xs font-black px-5 shadow-[3px_3px_0px_#000000]"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Save 4-Member Event Squad</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
