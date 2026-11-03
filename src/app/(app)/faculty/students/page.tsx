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
  Edit,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    trackId: tracks[0]?.id || "",
    teamId: "",
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) return;

    addStudent({
      school_id: facultySchool.id,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      track_id: formData.trackId,
      team_id: formData.teamId || undefined,
    });

    setFormData({ fullName: "", email: "", phone: "", trackId: tracks[0]?.id || "", teamId: "" });
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
          const email = parts[1] || "";
          const phone = parts[2] || "";
          const trackSlug = (parts[3] || "").toLowerCase();

          const matchedTrack =
            tracks.find((t) => t.slug.includes(trackSlug) || t.name.toLowerCase().includes(trackSlug)) ||
            tracks[0];

          addStudent({
            school_id: facultySchool.id,
            full_name: name,
            email,
            phone,
            track_id: matchedTrack?.id,
          });
          count++;
        }
      });

      setCsvStatus(`Successfully parsed and registered ${count} students!`);
      setTimeout(() => {
        setCsvModalOpen(false);
        setCsvStatus(null);
        setCsvText("");
      }, 1200);
    } catch {
      setCsvStatus("Error parsing CSV format. Please ensure comma-separated lines.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="info" className="mb-1.5">STUDENT DELEGATION</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Student Roster — {facultySchool?.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Add your student participants, assign competition tracks, and verify digital credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setCsvModalOpen(true)}>
            <Upload className="h-4 w-4 mr-1.5" />
            <span>CSV Bulk Upload</span>
          </Button>
          <Button variant="primary" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Track</th>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4">Pass Token</th>
                <th className="py-3.5 px-4">Arrival Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {schoolStudents.map((stud) => {
                const tr = tracks.find((t) => t.id === stud.track_id);
                const tm = teams.find((t) => t.id === stud.team_id);
                return (
                  <tr key={stud.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{stud.full_name}</div>
                      {stud.email && <div className="text-[11px] text-slate-400 font-normal">{stud.email}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">{tr?.name || "Unassigned"}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{tm?.name || "Solo Squad"}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-indigo-300 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {stud.qr_token}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={stud.checked_in ? "success" : "warning"}>
                        {stud.checked_in ? "Checked In" : "Pending Arrival"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteStudent(stud.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {schoolStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                    No students enrolled yet. Add students manually or paste a CSV roster above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Manual Add Student Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Student Participant"
        description="Enroll a student under your institutional delegation."
      >
        <form onSubmit={handleManualAdd} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Student Full Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Aarav Nair"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aarav@example.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98950 11001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Competition Track *</label>
            <select
              value={formData.trackId}
              onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* CSV Bulk Upload Modal */}
      <Modal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        title="Bulk Student CSV Import"
        description="Paste comma-separated rows: Name, Email, Phone, Track"
      >
        <div className="space-y-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300">
            Format: Aarav Nair, aarav@stj.edu, +919895011001, robotics
          </div>

          <textarea
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Aarav Nair, aarav@stj.edu, +919895011001, robotics&#10;Riya Thomas, riya@stj.edu, +919895011002, scrap&#10;Kavya Menon, kavya@stj.edu, +919895011003, useless"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {csvStatus && (
            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              {csvStatus}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setCsvModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCsvImport}>
              Import Squad Roster
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
