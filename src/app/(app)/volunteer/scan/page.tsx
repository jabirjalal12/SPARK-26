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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#4CAF50] text-black border-2 border-black font-black">
            FAST-PASS DESK
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Arrivals & QR Check-In
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Scan badges with camera or tap any pending record below to verify in under 5s.
          </p>
        </div>

        <Button
          size="lg"
          variant="primary"
          onClick={() => setScannerOpen(true)}
          className="text-base py-3"
        >
          <Scan className="h-5 w-5 mr-2" />
          <span>Launch Camera Scanner</span>
        </Button>
      </div>

      {/* Live Arrival Counters */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard variant="green" className="p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between text-black mb-1">
            <School className="h-5 w-5" />
            <span className="text-xs font-mono font-black bg-white px-2 py-0.5 border border-black">
              {Math.round((arrivedSchools / (totalSchools || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-black">
            {arrivedSchools} <span className="text-base font-bold text-neutral-700">/ {totalSchools}</span>
          </div>
          <p className="text-xs text-black font-black uppercase mt-1">Schools Arrived on Campus</p>
          <div className="w-full bg-white border-2 border-black h-3 mt-3 overflow-hidden shadow-[1px_1px_0px_#000]">
            <div
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${(arrivedSchools / (totalSchools || 1)) * 100}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard variant="blue" className="p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between text-black mb-1">
            <Users className="h-5 w-5" />
            <span className="text-xs font-mono font-black bg-white px-2 py-0.5 border border-black">
              {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-black">
            {arrivedStudents} <span className="text-base font-bold text-neutral-700">/ {totalStudents}</span>
          </div>
          <p className="text-xs text-black font-black uppercase mt-1">Students Verified</p>
          <div className="w-full bg-white border-2 border-black h-3 mt-3 overflow-hidden shadow-[1px_1px_0px_#000]">
            <div
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${(arrivedStudents / (totalStudents || 1)) * 100}%` }}
            />
          </div>
        </GlassCard>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between ${
            feedback.success
              ? "bg-[#4CAF50] text-black"
              : "bg-[#FF5252] text-white"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-black uppercase">
            <CheckCircle2 className="h-4 w-4" />
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-black underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Instant Search Bar */}
      <GlassCard variant="white" className="p-4 border-3 border-black shadow-[4px_4px_0px_#000]">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type school name, code (e.g. STJ771), or student name for 1-tap checkin..."
            className="w-full pl-10 pr-4 py-3 bg-white border-3 border-black text-black placeholder-neutral-500 font-mono text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
          />
        </div>
      </GlassCard>

      {/* Pending Schools List */}
      <div>
        <h2 className="text-base font-black text-black uppercase mb-3 flex items-center justify-between">
          <span>Pending School Check-Ins ({pendingSchools.length})</span>
          <span className="text-xs font-bold text-neutral-600">Tap to mark arrived</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPendingSchools.map((school) => (
            <GlassCard
              key={school.id}
              variant="white"
              className="p-4 flex items-center justify-between gap-3 border-3 border-black shadow-[3px_3px_0px_#000]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-black uppercase">{school.name}</span>
                </div>
                <p className="text-xs text-neutral-700 font-bold flex items-center gap-2 mt-0.5">
                  <span className="font-mono bg-[#FFEB3B] px-1.5 py-0.5 border border-black text-black">{school.code}</span>
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
            <div className="col-span-full py-8 text-center text-xs font-black uppercase text-black bg-[#4CAF50]/30 border-3 border-black shadow-[4px_4px_0px_#000]">
              All schools have completed arrival check-in!
            </div>
          )}
        </div>
      </div>

      {/* Pending Students Quick Check-in */}
      <div>
        <h2 className="text-base font-black text-black uppercase mb-3 flex items-center justify-between">
          <span>Pending Student Passes ({pendingStudents.length})</span>
          <span className="text-xs font-bold text-neutral-600">1-click manual verification</span>
        </h2>

        <div className="space-y-2">
          {filteredPendingStudents.map((stud) => {
            const sc = schools.find((s) => s.id === stud.school_id);
            return (
              <GlassCard
                key={stud.id}
                variant="white"
                className="p-3.5 flex items-center justify-between gap-3 border-3 border-black shadow-[2px_2px_0px_#000]"
              >
                <div>
                  <p className="font-black text-sm text-black uppercase">{stud.full_name}</p>
                  <p className="text-xs text-neutral-700 font-bold flex items-center gap-2 mt-0.5">
                    <span className="font-mono bg-[#FFEB3B] px-1.5 py-0.5 border border-black text-black">{stud.qr_token}</span>
                    <span>• {sc?.name}</span>
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
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
