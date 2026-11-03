"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRScannerModal } from "@/components/qr/qr-scanner-modal";
import {
  Scan,
  School,
  Users,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function VolunteerScanPage() {
  const { schools, students, checkInSchool, checkInStudent } = useFestStore();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const totalSchools = schools.length;
  const arrivedSchools = schools.filter((s) => s.checked_in).length;
  const totalStudents = students.length;
  const arrivedStudents = students.filter((s) => s.checked_in).length;

  const handleQuickCheckinSchool = (schoolId: string) => {
    const res = checkInSchool(schoolId);
    setFeedback(res);
  };

  const handleQuickCheckinStudent = (tokenId: string) => {
    const res = checkInStudent(tokenId);
    setFeedback(res);
  };

  const pendingSchools = schools.filter((s) => !s.checked_in);
  const pendingStudents = students.filter((s) => !s.checked_in);

  const filteredPendingSchools = searchQuery.trim()
    ? pendingSchools.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pendingSchools;

  const filteredPendingStudents = searchQuery.trim()
    ? pendingStudents.filter(
        (s) =>
          s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.qr_token.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pendingStudents.slice(0, 8);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Live Checkin Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="success" className="mb-1.5">FAST-PASS DESK</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Arrivals & QR Check-In
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Scan badges with camera or tap any pending record below to verify in under 5s.
          </p>
        </div>

        <Button
          size="lg"
          variant="primary"
          onClick={() => setScannerOpen(true)}
          className="shadow-xl shadow-emerald-600/25"
        >
          <Scan className="h-5 w-5 mr-2" />
          <span>Launch Camera Scanner</span>
        </Button>
      </div>

      {/* Live Arrival Counters */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 sm:p-5" glow="green">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <School className="h-5 w-5" />
            <span className="text-xs font-mono font-bold">
              {Math.round((arrivedSchools / (totalSchools || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {arrivedSchools} <span className="text-base font-normal text-slate-400">/ {totalSchools}</span>
          </div>
          <p className="text-xs text-slate-300 font-semibold mt-1">Schools Arrived on Campus</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(arrivedSchools / (totalSchools || 1)) * 100}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5" glow="blue">
          <div className="flex items-center justify-between text-blue-400 mb-1">
            <Users className="h-5 w-5" />
            <span className="text-xs font-mono font-bold">
              {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {arrivedStudents} <span className="text-base font-normal text-slate-400">/ {totalStudents}</span>
          </div>
          <p className="text-xs text-slate-300 font-semibold mt-1">Students Verified</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(arrivedStudents / (totalStudents || 1)) * 100}%` }}
            />
          </div>
        </GlassCard>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between animate-in fade-in ${
            feedback.success
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
              : "bg-rose-500/20 border-rose-500/40 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs underline text-slate-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Instant Search Bar */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type school name, code (e.g. STJ771), or student name for 1-tap checkin..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </GlassCard>

      {/* Pending Schools List */}
      <div>
        <h2 className="text-base font-black text-white mb-3 flex items-center justify-between">
          <span>Pending School Check-Ins ({pendingSchools.length})</span>
          <span className="text-xs font-normal text-slate-400">Tap to mark arrived</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPendingSchools.map((school) => (
            <GlassCard
              key={school.id}
              className="p-4 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{school.name}</span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-indigo-300 font-bold">{school.code}</span>
                  <span>• {school.city}</span>
                </p>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => handleQuickCheckinSchool(school.id)}
                className="text-xs flex-shrink-0"
              >
                <span>Check In</span>
              </Button>
            </GlassCard>
          ))}

          {filteredPendingSchools.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-slate-400 bg-white/5 rounded-2xl border border-white/10">
              All schools have completed arrival check-in! 🎉
            </div>
          )}
        </div>
      </div>

      {/* Pending Students Quick Check-in */}
      <div>
        <h2 className="text-base font-black text-white mb-3 flex items-center justify-between">
          <span>Pending Student Passes ({pendingStudents.length})</span>
          <span className="text-xs font-normal text-slate-400">1-click manual verification</span>
        </h2>

        <div className="space-y-2">
          {filteredPendingStudents.map((stud) => {
            const sc = schools.find((s) => s.id === stud.school_id);
            return (
              <GlassCard
                key={stud.id}
                className="p-3.5 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-sm text-white">{stud.full_name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-indigo-300">{stud.qr_token}</span>
                    <span>• {sc?.name}</span>
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="gradient"
                  onClick={() => handleQuickCheckinStudent(stud.qr_token)}
                  className="text-xs"
                >
                  Verify Pass
                </Button>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Camera scanner modal */}
      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
