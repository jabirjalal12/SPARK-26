"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRDisplay } from "@/components/qr/qr-display";
import {
  Sparkles,
  ArrowRight,
  School as SchoolIcon,
  CheckCircle2,
  UserCheck,
  Search,
  ArrowLeft,
  ChevronRight,
  Calendar,
  MapPin,
} from "lucide-react";

export default function StudentJoinPage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {/* Header link back to landing */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fest Landing</span>
          </Link>
          <span className="text-xs font-bold text-indigo-400 font-mono">STUDENT PORTAL</span>
        </div>

        {/* STEP 1: Enter School Code */}
        {!selectedSchool && (
          <GlassCard className="p-6 sm:p-8" glow="purple">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-pink-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-3">
                <SchoolIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Enter School Code</h1>
              <p className="text-xs text-slate-300 mt-1">
                Your faculty coordinator was issued a 6-character code upon fest registration.
              </p>
            </div>

            <form onSubmit={handleLookupCode} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  6-Digit Join Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STJ771"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-center font-mono text-xl font-bold tracking-widest text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-center">
                  {errorMessage}
                </p>
              )}

              <Button type="submit" variant="primary" className="w-full">
                <span>Find My Institution</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-slate-400 text-center font-medium mb-2">
                Sample Demo Codes to test:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 font-mono text-xs">
                {schools.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSchoolCode(s.code);
                      setSelectedSchool(s);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-indigo-300 transition-colors"
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
          <GlassCard className="p-6 sm:p-8" glow="blue">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  School Verified
                </span>
                <h2 className="text-lg font-black text-white leading-tight">{selectedSchool.name}</h2>
                <p className="text-xs text-slate-400">{selectedSchool.city}</p>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-2"
              >
                Change
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-300 mb-3">
              Select your name from the registered roster:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {schoolStudents.map((s) => {
                const tr = tracks.find((t) => t.id === s.track_id);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStudent(s)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div>
                      <p className="font-bold text-sm text-white">{s.full_name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] text-indigo-300">{s.qr_token}</span>
                        {tr && <span>• {tr.name}</span>}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                );
              })}

              {schoolStudents.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No students uploaded yet by your faculty coordinator.
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* STEP 3: Student Pass Ready */}
        {selectedStudent && (
          <GlassCard className="p-6 sm:p-8 text-center" glow="green">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-4">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Participant Pass</span>
            </div>

            <h2 className="text-2xl font-black text-white">{selectedStudent.full_name}</h2>
            <p className="text-xs text-slate-300 mt-0.5">{selectedSchool.name}</p>

            <div className="my-5">
              <QRDisplay
                value={selectedStudent.qr_token}
                title={`${selectedStudent.full_name} Pass`}
                subtitle={`Track: ${studentTrack?.name || "General"} | Code: ${selectedStudent.qr_token}`}
                size={180}
              />
            </div>

            <div className="space-y-2 text-left bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs mb-6">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Assigned Track:</span>
                <span className="font-bold text-white">{studentTrack?.name || "General Track"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Team:</span>
                <span className="font-bold text-white">{studentTeam?.name || "Solo Participant"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Table Number:</span>
                <span className="font-bold text-indigo-300 font-mono">{studentTeam?.table_number || "TBD"}</span>
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
