"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { QRDisplay } from "@/components/qr/qr-display";
import {
  School as SchoolIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

export default function StudentJoinPage() {
  const { schools, students, tracks, teams, switchRole } = useFestStore();

  const [schoolCode, setSchoolCode] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<any | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLookupCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const code = schoolCode.trim().toUpperCase();

    if (code.length < 5) {
      setErrorMessage("Please enter a valid 6-character school code.");
      return;
    }

    const school = schools.find((s) => s.code.toUpperCase() === code);
    if (!school) {
      setErrorMessage(`No approved school found with code "${code}". Check with your faculty advisor.`);
      return;
    }

    setSelectedSchool(school);
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    switchRole("participant");
  };

  const schoolStudents = selectedSchool
    ? students.filter((s) => s.school_id === selectedSchool.id)
    : [];

  const studentTrack = selectedStudent
    ? tracks.find((t) => t.id === selectedStudent.track_id)
    : null;

  const studentTeam = selectedStudent
    ? teams.find((t) => t.id === selectedStudent.team_id)
    : null;

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-black flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      <div className="w-full max-w-md">
        {/* Header link */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFEB3B] px-2 py-1 border border-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Landing</span>
          </Link>
          <span className="text-xs font-black bg-[#FFEB3B] text-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000]">
            STUDENT PASS
          </span>
        </div>

        {/* STEP 1: Enter School Code */}
        {!selectedSchool && (
          <GlassCard className="p-6 sm:p-8 bg-white" color="white">
            <div className="text-center mb-6">
              <div className="h-14 w-14 bg-[#FFEB3B] border-[3px] border-black shadow-[4px_4px_0px_#000000] mx-auto flex items-center justify-center mb-3">
                <SchoolIcon className="h-7 w-7 text-black" />
              </div>
              <h1 className="text-2xl font-black text-black tracking-tight">Enter School Code</h1>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Your faculty coordinator was issued a 6-character code upon fest registration.
              </p>
            </div>

            <form onSubmit={handleLookupCode} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-black block mb-2">
                  6-Digit Join Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STJ771"
                  className="w-full px-4 py-3 border-[3px] border-black text-center font-mono text-2xl font-black tracking-widest text-black bg-white shadow-[4px_4px_0px_#000000] focus:outline-none focus:ring-4 focus:ring-black"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-black font-bold bg-[#FF5252] border-2 border-black p-2.5 shadow-[2px_2px_0px_#000000] text-center">
                  {errorMessage}
                </p>
              )}

              <Button type="submit" variant="primary" className="w-full">
                <span>Find My Institution</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t-2 border-black">
              <p className="text-xs text-black text-center font-bold mb-2">
                Sample Demo Codes to test:
              </p>
              <div className="flex flex-wrap justify-center gap-2 font-mono text-xs">
                {schools.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSchoolCode(s.code);
                      setSelectedSchool(s);
                    }}
                    className="px-2.5 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-[#FFEB3B] font-bold text-black transition-all cursor-pointer"
                  >
                    {s.code} ({s.name.split(" ")[0]})
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* STEP 2: Pick Student Name */}
        {selectedSchool && !selectedStudent && (
          <GlassCard className="p-6 sm:p-8 bg-white" color="white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#2196F3] text-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                  School Verified
                </span>
                <h2 className="text-lg font-black text-black leading-tight mt-1">{selectedSchool.name}</h2>
                <p className="text-xs font-semibold text-slate-700">{selectedSchool.city}</p>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="text-xs font-bold text-black bg-[#FFEB3B] px-2 py-1 border border-black shadow-[2px_2px_0px_#000] hover:bg-white"
              >
                Change
              </button>
            </div>

            <p className="text-xs font-bold text-black mb-3">
              Select your name from the registered roster:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {schoolStudents.map((s) => {
                const tr = tracks.find((t) => t.id === s.track_id);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStudent(s)}
                    className="w-full flex items-center justify-between p-3.5 border-2 border-black bg-white shadow-[3px_3px_0px_#000000] hover:bg-[#FFEB3B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 text-left transition-all cursor-pointer"
                  >
                    <div>
                      <p className="font-black text-sm text-black">{s.full_name}</p>
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs bg-slate-100 px-1 border border-black">{s.qr_token}</span>
                        {tr && <span>• {tr.name}</span>}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-black" />
                  </button>
                );
              })}

              {schoolStudents.length === 0 && (
                <div className="text-center py-6 text-slate-700 font-bold text-xs bg-[#FFFBEB] border-2 border-black">
                  No students uploaded yet by your faculty coordinator.
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* STEP 3: Student Pass Ready */}
        {selectedStudent && (
          <GlassCard className="p-6 sm:p-8 text-center bg-white" color="white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4CAF50] text-black border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000000] mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <span>VERIFIED PARTICIPANT PASS</span>
            </div>

            <h2 className="text-2xl font-black text-black">{selectedStudent.full_name}</h2>
            <p className="text-xs font-bold text-slate-700 mt-0.5">{selectedSchool.name}</p>

            <div className="my-5">
              <QRDisplay
                value={selectedStudent.qr_token}
                title={`${selectedStudent.full_name} Pass`}
                subtitle={`Track: ${studentTrack?.name || "General"} | Code: ${selectedStudent.qr_token}`}
                size={180}
              />
            </div>

            <div className="space-y-2 text-left bg-[#FFFBEB] border-2 border-black p-3.5 text-xs mb-6 shadow-[3px_3px_0px_#000000]">
              <div className="flex justify-between py-1 border-b border-black">
                <span className="font-bold text-slate-700">Assigned Track:</span>
                <span className="font-black text-black">{studentTrack?.name || "General Track"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black">
                <span className="font-bold text-slate-700">Team:</span>
                <span className="font-black text-black">{studentTeam?.name || "Solo Participant"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-bold text-slate-700">Table Number:</span>
                <span className="font-black text-black font-mono">{studentTeam?.table_number || "TBD"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href="/dashboard" className="flex-1">
                <Button variant="primary" className="w-full">
                  <span>Enter Student Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}