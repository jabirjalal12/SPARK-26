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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <Badge variant="default" className="mb-1.5">
            DESK AUDIT & CORRECTION
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-black">
            Arrivals Log & Check-In Undo
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1">
            Review verified arrivals and revert mistaken desk check-ins (SA & Registration Head only).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-black bg-[#4CAF50] border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000000]">
            {checkedInStudents.length} / {students.length} Verified Present
          </span>
        </div>
      </div>

      {/* Permission alert */}
      {!canUndo && (
        <div className="p-3.5 border-2 border-black bg-[#FFEB3B] text-black text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
          <ShieldAlert className="w-4 h-4 text-black flex-shrink-0" />
          <span>
            You are viewing this log in read-only mode. Only <strong>Registration Head</strong> and <strong>Super Admin</strong> are authorized to undo check-ins.
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified student name..."
            className="w-full pl-10 pr-4 py-2 nb-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-black" />
          <select
            value={selectedSchoolFilter}
            onChange={(e) => setSelectedSchoolFilter(e.target.value)}
            className="px-3 py-2 nb-input text-xs bg-white text-black w-full sm:w-auto"
          >
            <option value="all">All Visiting Schools ({schools.length})</option>
            {schools.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name} ({sc.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verified Arrivals Table */}
      <div className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-slate-800 font-bold text-xs">
            No checked-in students matched your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-black text-black font-black uppercase tracking-wider text-[11px] bg-[#FFEB3B]">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Institution</th>
                  <th className="p-3">Track</th>
                  <th className="p-3">Arrival Timestamp</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filteredStudents.map((student) => {
                  const school = schools.find((s) => s.id === student.school_id);
                  const track = tracks.find((t) => t.id === student.track_id);

                  return (
                    <tr key={student.id} className="hover:bg-[#FFFBEB] transition-colors">
                      <td className="p-3 font-black text-black">
                        <div className="flex items-center gap-2">
                          <span>{student.name}</span>
                          {student.is_walkin && (
                            <span className="text-[10px] px-1.5 py-0.5 border border-black bg-[#FF9800] text-black font-black uppercase">
                              Walk-in
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-black">
                        {student.class}
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        {school?.name || "Institution"}
                      </td>
                      <td className="p-3 font-bold text-black">
                        {track?.name || "General"}
                      </td>
                      <td className="p-3 font-mono text-[11px] font-bold text-slate-700">
                        {student.checked_in_at
                          ? new Date(student.checked_in_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                          : "08:35 AM"}
                      </td>
                      <td className="p-3 text-right">
                        {canUndo ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUndo(student.id, student.name)}
                            className="text-xs h-8 px-2.5"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            <span>Undo Check-in</span>
                          </Button>
                        ) : (
                          <span className="text-slate-600 font-bold italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}