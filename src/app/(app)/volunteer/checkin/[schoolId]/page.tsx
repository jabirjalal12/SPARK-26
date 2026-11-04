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
  ShieldAlert,
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
    isVolunteer,
    isRegistrationHead,
    isSuperAdmin,
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

  // Route Guard: Volunteer, Registration Head & Super Admin Only
  const canCheckin = isVolunteer || isRegistrationHead || isSuperAdmin;
  if (!canCheckin) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] text-center">
        <div className="w-12 h-12 bg-[#FF5252] border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#000]">
          <ShieldAlert className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-xl font-black text-black">Desk Check-in Clearance Required</h2>
        <p className="text-xs font-bold text-slate-700 mt-2">
          Only registration desk volunteers, registration heads, and administrators can verify attending student rosters.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
          <AlertTriangle className="w-12 h-12 text-black mx-auto mb-3" />
          <h2 className="text-xl font-black text-black">School Not Found</h2>
          <p className="text-xs font-bold text-slate-800 mt-1 mb-6">
            No institutional record matches the scanned code.
          </p>
          <Link href="/volunteer/scan">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Return to Scanner</span>
            </Button>
          </Link>
        </div>
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
          className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFEB3B] px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to QR Scanner</span>
        </Link>
        <span className="text-xs font-mono font-black text-black bg-[#FFEB3B] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000000]">
          {school.code}
        </span>
      </div>

      {/* Duplicate Scan Warning Banner */}
      {school.arrived && (
        <div className="p-4 border-[3px] border-black bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-black mt-0.5" />
          <div>
            <p className="font-black text-black uppercase tracking-wide">
              Duplicate Scan Notice: Delegation Already Arrived
            </p>
            <p className="text-xs font-bold text-slate-900 mt-0.5">
              This institution was already checked in earlier. Currently <strong>{alreadyCheckedInCount} of {schoolStudents.length} students</strong> have verified passes. You can check in any late-arriving squad members below.
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {feedback && (
        <div className="p-4 border-[3px] border-black bg-[#4CAF50] text-black text-xs flex items-center justify-between shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span className="font-black">{feedback.message}</span>
          </div>
          <Button size="sm" variant="secondary" onClick={() => router.push("/volunteer/scan")} className="text-xs h-8">
            Scan Next School
          </Button>
        </div>
      )}

      {/* Institution Details Header Card */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={school.arrived ? "success" : "warning"}>
                {school.arrived ? "Delegation Arrived" : "Awaiting Arrival"}
              </Badge>
              <span className="text-xs font-bold text-slate-800">{school.city}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">
              {school.name}
            </h1>
            <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-4">
              <span>Contact: {school.contact_phone}</span>
              <span>• Email: {school.contact_email}</span>
            </p>
          </div>

          <Button
            size="sm"
            variant="yellow"
            onClick={() => setWalkinModalOpen(true)}
            className="text-xs self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>Add Walk-in Student</span>
          </Button>
        </div>
      </div>

      {/* Student Delegation Checklist */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black mb-5">
          <div>
            <h2 className="text-lg font-black text-black flex items-center gap-2">
              <Users className="w-5 h-5 text-black" />
              <span>Student Delegation Checklist</span>
            </h2>
            <p className="text-xs font-bold text-slate-800 mt-0.5">
              Mark individual students present before confirming delegation check-in.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleSelectAll}
              className="text-black font-black underline hover:bg-[#FFEB3B] px-1 cursor-pointer"
            >
              Select All
            </button>
            <span className="font-bold">•</span>
            <button
              onClick={handleDeselectAll}
              className="text-slate-800 font-bold hover:bg-[#FFEB3B] px-1 cursor-pointer"
            >
              Deselect All
            </button>
            <span className="ml-2 font-mono font-black text-black bg-[#FFEB3B] border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
              {selectedStudentIds.length} / {schoolStudents.length} Selected
            </span>
          </div>
        </div>

        {schoolStudents.length === 0 ? (
          <div className="text-center py-8 text-xs font-bold text-slate-800">
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
                  className={`p-3.5 border-2 border-black transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] -translate-x-0.5 -translate-y-0.5"
                      : "bg-[#FFFBEB] text-black hover:bg-white shadow-[2px_2px_0px_#000000]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Controlled by row click
                      className="w-5 h-5 border-2 border-black accent-black cursor-pointer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-black">{student.name}</span>
                        {student.is_walkin && (
                          <span className="text-[10px] px-1.5 py-0.5 border border-black bg-[#FF9800] text-black font-black uppercase">
                            Walk-in
                          </span>
                        )}
                        {student.checked_in && (
                          <span className="text-[10px] px-1.5 py-0.5 border border-black bg-[#4CAF50] text-black font-black uppercase">
                            Arrived
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        Class: <span className="font-mono">{student.class}</span> • Track: <span>{track?.name || "General"}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black">
                    {isChecked ? (
                      <span className="bg-black text-white px-2 py-0.5">Marked Present</span>
                    ) : (
                      <span className="text-slate-600">Absent</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Check-in Action Bar */}
        <div className="mt-8 pt-5 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-800">
            Scanning volunteer: <strong className="text-black font-black">Farhan Siddiqui</strong>
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={handleConfirmCheckin}
            disabled={selectedStudentIds.length === 0}
            className="w-full sm:w-auto text-sm px-8"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span>Check In Delegation ({selectedStudentIds.length} Present)</span>
          </Button>
        </div>
      </div>

      {/* Desk Walk-in Registration Modal */}
      <Modal
        isOpen={walkinModalOpen}
        onClose={() => setWalkinModalOpen(false)}
        title="Add Walk-in Student"
        description={`Direct registration at desk for ${school.name}`}
      >
        <form onSubmit={handleAddWalkin} className="space-y-4">
          <div>
            <label className="text-xs font-black text-black block mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              value={walkinData.name}
              onChange={(e) => setWalkinData({ ...walkinData, name: e.target.value })}
              placeholder="e.g. Vikram Joseph"
              className="w-full px-3 py-2.5 nb-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-black block mb-1">
                Class / Grade *
              </label>
              <input
                type="text"
                required
                value={walkinData.classGrade}
                onChange={(e) => setWalkinData({ ...walkinData, classGrade: e.target.value })}
                placeholder="e.g. 12-A"
                className="w-full px-3 py-2.5 nb-input text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-black text-black block mb-1">
                Track *
              </label>
              <select
                value={walkinData.trackId}
                onChange={(e) => setWalkinData({ ...walkinData, trackId: e.target.value })}
                className="w-full px-3 py-2.5 nb-input text-xs bg-white text-black"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id} className="bg-white text-black">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button type="button" variant="ghost" size="sm" onClick={() => setWalkinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow" size="sm">
              Enroll & Check In Walk-in
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}