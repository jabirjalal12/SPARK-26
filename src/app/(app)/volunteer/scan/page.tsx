"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  ShieldAlert,
} from "lucide-react";

export default function VolunteerScanPage() {
  const router = useRouter();
  const { schools, students, schoolTickets, isVolunteer, isRegistrationHead, isSuperAdmin } = useFestStore();
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <Badge variant="default" className="mb-1.5">
            REGISTRATION FAST-PASS DESK
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-black">
            School QR Check-In
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1">
            Scan institutional pass or select below to open the student delegation checklist.
          </p>
        </div>

        <Button
          size="lg"
          variant="yellow"
          onClick={() => setScannerOpen(true)}
          className="text-sm py-3 px-6"
        >
          <Scan className="h-5 w-5 mr-2" />
          <span>Launch Camera Scanner</span>
        </Button>
      </div>

      {/* Live Telemetry Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 border-[3px] border-black bg-[#2196F3] text-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between mb-1">
            <School className="h-5 w-5 text-black" />
            <span className="text-xs font-mono font-black bg-white px-2 py-0.5 border border-black">
              {Math.round((arrivedSchools / (totalSchools || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-black">
            {arrivedSchools} <span className="text-base font-bold">/ {totalSchools}</span>
          </div>
          <p className="text-xs font-black uppercase mt-1">Schools Arrived</p>
          <div className="w-full bg-white border border-black h-2 mt-3 overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${(arrivedSchools / (totalSchools || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 border-[3px] border-black bg-[#4CAF50] text-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between mb-1">
            <Users className="h-5 w-5 text-black" />
            <span className="text-xs font-mono font-black bg-white px-2 py-0.5 border border-black">
              {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
            </span>
          </div>
          <div className="text-3xl font-black text-black">
            {arrivedStudents} <span className="text-base font-bold">/ {totalStudents}</span>
          </div>
          <p className="text-xs font-black uppercase mt-1">Students Verified</p>
          <div className="w-full bg-white border border-black h-2 mt-3 overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${(arrivedStudents / (totalStudents || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 border-[3px] border-black bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between mb-1">
            <Zap className="h-5 w-5 text-black" />
            <span className="text-xs font-mono font-black bg-white px-2 py-0.5 border border-black">Gate</span>
          </div>
          <div className="text-3xl font-black text-black">{walkinStudents}</div>
          <p className="text-xs font-black uppercase mt-1">Desk Walk-in Students</p>
          <p className="text-[11px] font-bold text-slate-800 mt-2">Added directly at registration gate</p>
        </div>
      </div>

      {/* 1-Click Test Simulation Bar for Evaluators */}
      <div className="p-5 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000]">
        <p className="text-xs font-black uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-black" />
          <span>Quick Test Simulation (1-Click Scan Any School Ticket)</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {schools.slice(0, 4).map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant="outline"
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
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-black text-black flex items-center gap-2">
            <School className="w-4 h-4 text-black" />
            <span>Select Institution Manually</span>
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school name or code..."
              className="w-full pl-9 pr-3 py-2 nb-input text-xs"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredSchools.map((s) => {
            const schoolDelegation = students.filter((stu) => stu.school_id === s.id);
            const arrivedCount = schoolDelegation.filter((stu) => stu.checked_in).length;

            return (
              <div
                key={s.id}
                onClick={() => router.push(`/volunteer/checkin/${s.id}`)}
                className="p-3.5 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center font-mono font-black text-xs text-black shadow-[1px_1px_0px_#000]">
                    {s.code.slice(0, 3)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm text-black truncate">{s.name}</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      Code: <span className="font-mono text-black">{s.code}</span> • {s.city} • Contact: {s.contact_phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className={`text-xs font-black block ${s.arrived ? "text-[#4CAF50]" : "text-[#FF9800]"}`}>
                      {s.arrived ? "Arrived" : "Expected"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">
                      {arrivedCount} / {schoolDelegation.length} Students
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanSuccess}
      />
    </div>
  );
}