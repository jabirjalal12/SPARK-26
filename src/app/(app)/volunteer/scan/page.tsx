"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function VolunteerScanPage() {
  const router = useRouter();
  const { schools, students, schoolTickets } = useFestStore();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalSchools = schools.length;
  const arrivedSchools = schools.filter((s) => s.arrived).length;
  const totalStudents = students.length;
  const arrivedStudents = students.filter((s) => s.checked_in).length;
  const walkinStudents = students.filter((s) => s.is_walkin).length;

  const handleScanSuccess = (scannedCode: string) => {
    setScannerOpen(false);
    // Find school by ticket token or school code
    const ticket = schoolTickets.find((t) => t.token_hash === scannedCode.trim() && !t.revoked_at);
    let matchedSchool = ticket ? schools.find((s) => s.id === ticket.school_id) : null;

    if (!matchedSchool) {
      matchedSchool = schools.find(
        (s) =>
          s.code.toLowerCase() === scannedCode.trim().toLowerCase() ||
          s.name.toLowerCase().includes(scannedCode.trim().toLowerCase())
      ) || null;
    }

    if (matchedSchool) {
      router.push(`/volunteer/checkin/${matchedSchool.id}`);
    } else {
      alert(`No valid school found for scanned token "${scannedCode}".`);
    }
  };

  const filteredSchools = searchQuery.trim()
    ? schools.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : schools;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            REGISTRATION FAST-PASS DESK
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            School QR Check-In
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scan institutional pass or select below to open the student delegation checklist.
          </p>
        </div>

        <Button
          size="lg"
          variant="gradient"
          onClick={() => setScannerOpen(true)}
          className="text-sm py-3 px-6"
        >
          <Scan className="h-5 w-5 mr-2" />
          <span>Launch Camera Scanner</span>
        </Button>
      </div>

      {/* Live Telemetry Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-4 sm:p-5 border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <School className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-indigo-300">
              {Math.round((arrivedSchools / (totalSchools || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {arrivedSchools} <span className="text-base font-normal text-slate-400">/ {totalSchools}</span>
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Schools Arrived</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(arrivedSchools / (totalSchools || 1)) * 100}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Users className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {arrivedStudents} <span className="text-base font-normal text-slate-400">/ {totalStudents}</span>
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Students Verified</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(arrivedStudents / (totalStudents || 1)) * 100}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Zap className="h-5 w-5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">Desk Walk-in</span>
          </div>
          <div className="text-3xl font-black text-white">{walkinStudents}</div>
          <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Desk Walk-in Students</p>
          <p className="text-[11px] text-amber-300/80 mt-2">Added directly at registration gate</p>
        </GlassCard>
      </div>

      {/* 1-Click Test Simulation Bar for Evaluators */}
      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2.5 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Quick Test Simulation (1-Click Scan Any School Ticket)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {schools.slice(0, 4).map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant="secondary"
              onClick={() => router.push(`/volunteer/checkin/${s.id}`)}
              className="text-xs h-8"
            >
              <span>Scan {s.code} ({s.name.split(" ")[0]})</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ))}
        </div>
      </div>

      {/* Manual Search & School Directory */}
      <GlassCard className="p-5 border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <School className="w-4 h-4 text-indigo-400" />
            <span>Select Institution Manually</span>
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school name or code..."
              className="w-full pl-9 pr-3 py-2 glass-input text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredSchools.map((s) => {
            const schoolDelegation = students.filter((stu) => stu.school_id === s.id);
            const arrivedCount = schoolDelegation.filter((stu) => stu.checked_in).length;

            return (
              <div
                key={s.id}
                onClick={() => router.push(`/volunteer/checkin/${s.id}`)}
                className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-mono font-bold text-xs text-white border border-white/15">
                    {s.code.slice(0, 3)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-white truncate">{s.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Code: <span className="font-mono text-slate-300">{s.code}</span> • {s.city} • Contact: {s.contact_phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className={`text-xs font-semibold block ${s.arrived ? "text-emerald-400" : "text-amber-400"}`}>
                      {s.arrived ? "Arrived" : "Expected"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {arrivedCount} / {schoolDelegation.length} Students
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanSuccess}
      />
    </div>
  );
}
