"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Users,
  Plus,
  Upload,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Bot,
  Wrench,
  Sparkles,
} from "lucide-react";

export default function FacultyStudentsPage() {
  const { currentProfile, schools, students, tracks, teams, addStudent, deleteStudent } = useFestStore();

  const facultySchool = schools.find((s) => s.id === currentProfile.school_id) || schools[0];
  const schoolStudents = facultySchool
    ? students.filter((s) => s.school_id === facultySchool.id)
    : [];

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvStatus, setCsvStatus] = useState<string | null>(null);

  // Minor Privacy: Strictly name, class, trackId, teamId. NO email, NO phone!
  const [formData, setFormData] = useState({
    name: "",
    classGrade: "12-A",
    trackId: tracks[0]?.id || "",
    teamId: "",
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addStudent({
      school_id: facultySchool.id,
      name: formData.name,
      class: formData.classGrade,
      track_id: formData.trackId,
      team_id: formData.teamId || null,
    });

    setFormData({ name: "", classGrade: "12-A", trackId: tracks[0]?.id || "", teamId: "" });
    setAddModalOpen(false);
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) return;

    try {
      const lines = csvText.trim().split("\n");
      let count = 0;

      lines.forEach((line) => {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length >= 1 && parts[0] && !parts[0].toLowerCase().includes("name")) {
          const name = parts[0];
          const classGrade = parts[1] || "12-A";
          const trackSlug = (parts[2] || "").toLowerCase();

          const matchedTrack =
            tracks.find((t) => t.slug.includes(trackSlug) || t.name.toLowerCase().includes(trackSlug)) ||
            tracks[0];

          addStudent({
            school_id: facultySchool.id,
            name,
            class: classGrade,
            track_id: matchedTrack?.id || tracks[0].id,
          });
          count++;
        }
      });

      setCsvStatus(`Successfully enrolled ${count} students!`);
      setTimeout(() => {
        setCsvModalOpen(false);
        setCsvStatus(null);
        setCsvText("");
      }, 1200);
    } catch {
      setCsvStatus("Error parsing CSV. Format: Full Name, Class/Grade, Track");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            DELEGATION ROSTER
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {facultySchool?.name || "Institution"} Squad
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered students arriving with your faculty delegation. (Total: {schoolStudents.length})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCsvModalOpen(true)}
            className="text-xs"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            <span>CSV Bulk Upload</span>
          </Button>
          <Button
            size="sm"
            variant="gradient"
            onClick={() => setAddModalOpen(true)}
            className="text-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      {/* Minor Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-indigo-400" />
        <p>
          <strong>Minor Student Privacy Enforced:</strong> As per fest rules, no minor student emails or contact numbers are collected. Verification is managed strictly via your single School Ticket QR code.
        </p>
      </div>

      {/* Students List Table */}
      <GlassCard className="p-5 border-white/15 overflow-hidden">
        {schoolStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base">No Students Enrolled Yet</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Add your visiting student participants individually or paste a CSV list.
            </p>
            <Button size="sm" variant="gradient" onClick={() => setAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              <span>Enroll First Student</span>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-3">Student Name</th>
                  <th className="pb-3 px-3">Class / Grade</th>
                  <th className="pb-3 px-3">Assigned Track</th>
                  <th className="pb-3 px-3">Team</th>
                  <th className="pb-3 px-3">Arrival Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {schoolStudents.map((student) => {
                  const track = tracks.find((t) => t.id === student.track_id);
                  const team = teams.find((t) => t.id === student.team_id);

                  return (
                    <tr key={student.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{student.name}</span>
                          {student.is_walkin && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                              Walk-in
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono">
                        {student.class}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-200">
                          {track?.name || "Unassigned"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {team ? team.name : <span className="text-slate-500 italic">Individual</span>}
                      </td>
                      <td className="py-3 px-3">
                        {student.checked_in ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Checked In</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Expected</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title="Remove student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Manual Add Student Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Enroll Student Participant"
        description="Add a student to your visiting school squad. No phone or email required."
      >
        <form onSubmit={handleManualAdd} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Class / Grade *
              </label>
              <input
                type="text"
                required
                value={formData.classGrade}
                onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                placeholder="e.g. 11-A or Grade 12"
                className="w-full px-3 py-2.5 glass-input text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Track *
              </label>
              <select
                value={formData.trackId}
                onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                className="w-full px-3 py-2.5 glass-input text-xs bg-slate-900 text-white"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Assign to Team (Optional)
            </label>
            <select
              value={formData.teamId}
              onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
              className="w-full px-3 py-2.5 glass-input text-xs bg-slate-900 text-white"
            >
              <option value="" className="bg-slate-900 text-white">-- None (Individual / Unassigned) --</option>
              {teams
                .filter((t) => t.school_id === facultySchool.id)
                .map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name} ({tracks.find((tr) => tr.id === t.track_id)?.name})
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* CSV Bulk Upload Modal */}
      <Modal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        title="CSV Bulk Student Import"
        description="Format: Full Name, Class/Grade, Track (One student per line)"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 font-mono">
            Example:<br />
            Aarav Nair, 12-A, Robotics<br />
            Kavya Menon, 11-B, Build from Scrap<br />
            Tanvi Joshi, 12-C, Useless Projects
          </div>

          <textarea
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Paste your CSV roster here..."
            className="w-full p-3 glass-input text-xs font-mono"
          />

          {csvStatus && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs">
              {csvStatus}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setCsvModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="gradient" size="sm" onClick={handleCsvImport}>
              Import Roster
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
