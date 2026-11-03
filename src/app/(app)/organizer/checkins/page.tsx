"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Users,
  School as SchoolIcon,
  Filter,
} from "lucide-react";

export default function OrganizerCheckinsPage() {
  const {
    students,
    schools,
    tracks,
    undoCheckin,
    isSuperAdmin,
    isRegistrationHead,
  } = useFestStore();

  const [search, setSearch] = useState("");
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>("all");
  const canUndo = isSuperAdmin || isRegistrationHead;

  const checkedInStudents = students.filter((s) => s.checked_in);

  const filteredStudents = checkedInStudents
    .filter((s) => (selectedSchoolFilter === "all" ? true : s.school_id === selectedSchoolFilter))
    .filter((s) => {
      const school = schools.find((sc) => sc.id === s.school_id);
      return (
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase()) ||
        (school && school.name.toLowerCase().includes(search.toLowerCase()))
      );
    });

  const handleUndo = (studentId: string, studentName: string) => {
    if (!canUndo) {
      alert("Permission denied. Only Registration Head and Super Admin can undo check-ins.");
      return;
    }

    if (confirm(`Are you sure you want to revert check-in for "${studentName}"?`)) {
      const res = undoCheckin(studentId);
      if (res.success) {
        alert(res.message);
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            DESK AUDIT & CORRECTION
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Arrivals Log & Check-In Undo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review verified arrivals and revert mistaken desk check-ins (SA & Registration Head only).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
            {checkedInStudents.length} / {students.length} Verified Present
          </span>
        </div>
      </div>

      {/* Permission alert */}
      {!canUndo && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            You are viewing this log in read-only mode. Only <strong>Registration Head</strong> and <strong>Super Admin</strong> are authorized to undo check-ins.
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-white/15">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified student name..."
            className="w-full pl-10 pr-4 py-2 glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSchoolFilter}
            onChange={(e) => setSelectedSchoolFilter(e.target.value)}
            className="px-3 py-2 glass-input text-xs bg-slate-900 text-white w-full sm:w-auto"
          >
            <option value="all">All Visiting Schools ({schools.length})</option>
            {schools.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name} ({sc.code})
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Verified Arrivals Table */}
      <GlassCard className="p-5 border-white/15 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No checked-in students matched your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-3">Student Name</th>
                  <th className="pb-3 px-3">Class</th>
                  <th className="pb-3 px-3">Institution</th>
                  <th className="pb-3 px-3">Track</th>
                  <th className="pb-3 px-3">Arrival Timestamp</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student) => {
                  const school = schools.find((s) => s.id === student.school_id);
                  const track = tracks.find((t) => t.id === student.track_id);

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
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {student.class}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {school?.name || "Institution"}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {track?.name || "General"}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                        {student.checked_in_at
                          ? new Date(student.checked_in_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                          : "08:35 AM"}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {canUndo ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUndo(student.id, student.name)}
                            className="text-xs h-7 px-2.5"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            <span>Undo Check-in</span>
                          </Button>
                        ) : (
                          <span className="text-slate-600 italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
