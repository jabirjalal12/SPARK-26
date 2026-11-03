"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Users,
  AlertTriangle,
  UserPlus,
  Building2,
  Phone,
  Mail,
  Bot,
  Wrench,
  Sparkles,
} from "lucide-react";

export default function SchoolCheckinPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const {
    schools,
    students,
    tracks,
    checkInBatch,
    addWalkinStudent,
  } = useFestStore();

  const school = schools.find((s) => s.id === schoolId || s.code.toLowerCase() === schoolId?.toLowerCase());
  const schoolStudents = useMemo(() => {
    return school ? students.filter((s) => s.school_id === school.id) : [];
  }, [students, school]);

  // Track checked checkboxes for present students
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() => {
    return schoolStudents.map((s) => s.id);
  });

  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [walkinData, setWalkinData] = useState({
    name: "",
    classGrade: "12-A",
    trackId: tracks[0]?.id || "",
  });

  if (!school) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <GlassCard className="p-8 border-white/15">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">School Not Found</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            No institutional record matches the scanned code.
          </p>
          <Link href="/volunteer/scan">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Return to Scanner</span>
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudentIds(schoolStudents.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedStudentIds([]);
  };

  const handleConfirmCheckin = () => {
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one student present from the delegation.");
      return;
    }

    const res = checkInBatch(school.id, selectedStudentIds);
    setFeedback({
      success: res.success,
      message: res.message,
    });
  };

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinData.name) return;

    const newStudent = addWalkinStudent({
      school_id: school.id,
      track_id: walkinData.trackId,
      name: walkinData.name,
      class: walkinData.classGrade,
    });

    setSelectedStudentIds((prev) => [...prev, newStudent.id]);
    setWalkinData({ name: "", classGrade: "12-A", trackId: tracks[0]?.id || "" });
    setWalkinModalOpen(false);
    setFeedback({
      success: true,
      message: `Enrolled walk-in student ${newStudent.name} and verified attendance.`,
    });
  };

  const alreadyCheckedInCount = schoolStudents.filter((s) => s.checked_in).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/volunteer/scan"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to QR Scanner</span>
        </Link>
        <span className="text-xs font-mono font-bold text-indigo-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
          {school.code}
        </span>
      </div>

      {/* Duplicate Scan Warning Banner */}
      {school.arrived && (
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-bold text-white uppercase tracking-wide">
              Duplicate Scan Notice: Delegation Already Arrived
            </p>
            <p className="text-xs text-amber-200/90 mt-0.5">
              This institution was already checked in earlier. Currently <strong>{alreadyCheckedInCount} of {schoolStudents.length} students</strong> have verified passes. You can check in any late-arriving squad members below.
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => router.push("/volunteer/scan")} className="text-xs h-8">
            Scan Next School
          </Button>
        </div>
      )}

      {/* Institution Details Header Card */}
      <GlassCard className="p-6 border-white/15 bg-gradient-to-br from-slate-900/90 to-indigo-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={school.arrived ? "success" : "warning"}>
                {school.arrived ? "Delegation Arrived" : "Awaiting Arrival"}
              </Badge>
              <span className="text-xs text-slate-400">{school.city}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {school.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-4">
              <span>Contact: {school.contact_phone}</span>
              <span>â¢ Email: {school.contact_email}</span>
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setWalkinModalOpen(true)}
            className="text-xs self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>Add Walk-in Student</span>
          </Button>
        </div>
      </GlassCard>

      {/* Student Delegation Checklist */}
      <GlassCard className="p-6 border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Student Delegation Checklist</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mark individual students present before confirming delegation check-in.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleSelectAll}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Select All
            </button>
            <span className="text-slate-600">â¢</span>
            <button
              onClick={handleDeselectAll}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Deselect All
            </button>
            <span className="ml-2 font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
              {selectedStudentIds.length} / {schoolStudents.length} Selected
            </span>
          </div>
        </div>

        {schoolStudents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No students registered in roster for this institution. Use "Add Walk-in Student" to add members at the desk.
          </div>
        ) : (
          <div className="space-y-2.5">
            {schoolStudents.map((student) => {
              const isChecked = selectedStudentIds.includes(student.id);
              const track = tracks.find((t) => t.id === student.track_id);

              return (
                <div
                  key={student.id}
                  onClick={() => handleToggleStudent(student.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? "bg-indigo-950/40 border-indigo-500/40 text-white"
                      : "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Controlled by row click
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{student.name}</span>
                        {student.is_walkin && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Walk-in
                          </span>
                        )}
                        {student.checked_in && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            Previously Checked In
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Class: <span className="text-slate-300 font-mono">{student.class}</span> â¢ Track: <span className="text-slate-300">{track?.name || "General"}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    {isChecked ? (
                      <span className="text-indigo-400">Marked Present</span>
                    ) : (
                      <span>Absent</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Check-in Action Bar */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Scanning volunteer: <strong className="text-white">Farhan Siddiqui</strong>
          </div>

          <Button
            size="lg"
            variant="gradient"
            onClick={handleConfirmCheckin}
            disabled={selectedStudentIds.length === 0}
            className="w-full sm:w-auto text-sm px-8"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span>Check In Delegation ({selectedStudentIds.length} Present)</span>
          </Button>
        </div>
      </GlassCard>

      {/* Desk Walk-in Registration Modal */}
      <Modal
        isOpen={walkinModalOpen}
        onClose={() => setWalkinModalOpen(false)}
        title="Add Walk-in Student"
        description={`Direct registration at desk for ${school.name}`}
      >
        <form onSubmit={handleAddWalkin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              value={walkinData.name}
              onChange={(e) => setWalkinData({ ...walkinData, name: e.target.value })}
              placeholder="e.g. Vikram Joseph"
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
                value={walkinData.classGrade}
                onChange={(e) => setWalkinData({ ...walkinData, classGrade: e.target.value })}
                placeholder="e.g. 12-A"
                className="w-full px-3 py-2.5 glass-input text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Track *
              </label>
              <select
                value={walkinData.trackId}
                onChange={(e) => setWalkinData({ ...walkinData, trackId: e.target.value })}
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

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setWalkinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Enroll & Check In Walk-in
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
