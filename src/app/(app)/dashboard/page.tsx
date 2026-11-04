"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRScannerModal } from "@/components/qr/qr-scanner-modal";
import {
  Users,
  School,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Scan,
  Trophy,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Sliders,
  ChevronRight,
  Clock,
  RotateCcw,
  Zap,
  Lock,
  FileText,
  Settings,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const {
    currentProfile,
    activeOrganizerSubRole,
    isSuperAdmin,
    isEventCoordinator,
    isRegistrationHead,
    schools,
    students,
    teams,
    tracks,
    scores,
    issueReports,
    resultsPublished,
    togglePublishResults,
    volunteerDuties,
  } = useFestStore();

  const role = currentProfile.role;

  useEffect(() => {
    if (role === "tv_display") {
      router.replace("/tv");
    } else if (role === "judge") {
      router.replace("/judge");
    }
  }, [role, router]);

  // Aggregate stats
  const totalSchools = schools.length;
  const approvedSchools = schools.filter((s) => s.status === "approved").length;
  const arrivedSchools = schools.filter((s) => s.arrived).length;
  const totalStudents = students.length;
  const arrivedStudents = students.filter((s) => s.checked_in).length;
  const walkinStudents = students.filter((s) => s.is_walkin).length;
  const openIssues = issueReports.filter((i) => i.status !== "resolved").length;

  // Faculty specific data
  const facultySchool = schools.find((s) => s.id === currentProfile.school_id) || schools[0];
  const facultyStudents = facultySchool
    ? students.filter((s) => s.school_id === facultySchool.id)
    : [];
  const facultyTeams = facultySchool
    ? teams.filter((t) => t.school_id === facultySchool.id)
    : [];

  const getSubRoleTitle = () => {
    if (role === "faculty") return "Visiting Faculty Coordinator";
    if (role === "volunteer") return "Registration Desk Volunteer";
    if (role === "judge") return "Official Fest Judge";
    if (role === "event_coordinator") return "Event Coordinator";
    if (role === "registration_head") return "Registration Head Desk";
    if (role === "super_admin" || role === "admin" || role === "organizer") return "Super Administrator";
    return "Staff Official";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#FFEB3B] text-black border border-black shadow-[1px_1px_0px_#000]">
                {getSubRoleTitle()}
              </span>
              <span className="text-xs font-bold text-slate-700">Campus Live Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Welcome back, {currentProfile.full_name}
            </h1>
            <p className="text-xs font-bold text-slate-800 mt-1">
              SPARK 2026 Inter-School Tech Fest • Real-time coordination hub
            </p>
          </div>

          {/* Quick context CTA */}
          <div className="flex items-center gap-2">
            {role === "organizer" && isSuperAdmin && (
              <Link href="/organizer/results">
                <Button size="sm" variant={resultsPublished ? "green" : "yellow"} className="text-xs">
                  <Trophy className="w-4 h-4 mr-1.5" />
                  <span>{resultsPublished ? "Results Published" : "Publish Results"}</span>
                </Button>
              </Link>
            )}
            {role === "volunteer" && (
              <Link href="/volunteer/scan">
                <Button size="sm" variant="yellow" className="text-xs">
                  <Scan className="w-4 h-4 mr-1.5" />
                  <span>Open QR Scanner</span>
                </Button>
              </Link>
            )}
            {role === "faculty" && (
              <Link href="/faculty/ticket">
                <Button size="sm" variant="yellow" className="text-xs">
                  <QrCode className="w-4 h-4 mr-1.5" />
                  <span>View School Ticket</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 border-[3px] border-black bg-[#2196F3] text-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between mb-1">
            <School className="w-5 h-5 text-black" />
            <span className="text-[11px] font-mono font-black bg-white px-1.5 py-0.2 border border-black">{approvedSchools} Approved</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            {arrivedSchools} <span className="text-sm font-bold">/ {totalSchools}</span>
          </div>
          <p className="text-[11px] font-black uppercase mt-1">Schools Arrived</p>
        </div>

        <div className="p-4 border-[3px] border-black bg-[#4CAF50] text-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between mb-1">
            <Users className="w-5 h-5 text-black" />
            <span className="text-[11px] font-mono font-black bg-white px-1.5 py-0.2 border border-black">
              {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            {arrivedStudents} <span className="text-sm font-bold">/ {totalStudents}</span>
          </div>
          <p className="text-[11px] font-black uppercase mt-1">Students Verified</p>
        </div>

        <div className="p-4 border-[3px] border-black bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between mb-1">
            <Zap className="w-5 h-5 text-black" />
            <span className="text-[11px] font-mono font-black bg-white px-1.5 py-0.2 border border-black">At Desk</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">{walkinStudents}</div>
          <p className="text-[11px] font-black uppercase mt-1">Desk Walk-ins</p>
        </div>

        <div className="p-4 border-[3px] border-black bg-[#FF9800] text-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center justify-between mb-1">
            <Sparkles className="w-5 h-5 text-black" />
            <span className="text-[11px] font-mono font-black bg-white px-1.5 py-0.2 border border-black">3 Tracks</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">{teams.length}</div>
          <p className="text-[11px] font-black uppercase mt-1">Active Teams</p>
        </div>

        <div className="p-4 border-[3px] border-black bg-[#FF5252] text-black shadow-[4px_4px_0px_#000000] col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <AlertTriangle className="w-5 h-5 text-black" />
            <span className="text-[11px] font-mono font-black bg-white px-1.5 py-0.2 border border-black">{openIssues === 0 ? "All Clear" : "Pending"}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">{openIssues}</div>
          <p className="text-[11px] font-black uppercase mt-1">Ground Issues</p>
        </div>
      </div>

      {/* Role-Adaptive Content Section */}
      {role === "organizer" && (
        <div className="space-y-6">
          {/* Sub-Role Quick Action Dashboard */}
          <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
            <h2 className="text-sm font-black uppercase tracking-wider text-black mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{getSubRoleTitle()} Command Panel</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {(isSuperAdmin || isRegistrationHead) && (
                <Link href="/organizer/schools" className="block">
                  <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                    <ShieldCheck className="w-5 h-5 text-black mb-2" />
                    <p className="font-black text-black">School Approvals</p>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">Approve & Issue Tickets</p>
                  </div>
                </Link>
              )}

              {(isSuperAdmin || isRegistrationHead) && (
                <Link href="/organizer/checkins" className="block">
                  <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                    <RotateCcw className="w-5 h-5 text-black mb-2" />
                    <p className="font-black text-black">Desk Arrivals & Undo</p>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">Undo mistaken check-ins</p>
                  </div>
                </Link>
              )}

              {(isSuperAdmin || isEventCoordinator) && (
                <Link href="/organizer/scoring" className="block">
                  <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                    <Sparkles className="w-5 h-5 text-black mb-2" />
                    <p className="font-black text-black">Score Entry</p>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">Score all 3 track arenas</p>
                  </div>
                </Link>
              )}

              {(isSuperAdmin || isEventCoordinator) && (
                <Link href="/organizer/schedule" className="block">
                  <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                    <Calendar className="w-5 h-5 text-black mb-2" />
                    <p className="font-black text-black">Schedule Editor</p>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">Edit timelines & venues</p>
                  </div>
                </Link>
              )}

              {isSuperAdmin && (
                <Link href="/organizer/results" className="block">
                  <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                    <Trophy className="w-5 h-5 text-black mb-2" />
                    <p className="font-black text-black">Lock & Publish</p>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">SA Result Publishing</p>
                  </div>
                </Link>
              )}

              <Link href="/organizer/export" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Sliders className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Export CSV</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Download full roster logs</p>
                </div>
              </Link>

              {isSuperAdmin && (
                <Link href="/organizer/settings" className="block">
                  <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FF5252]/20 shadow-[2px_2px_0px_#000000] transition-all">
                    <Settings className="w-5 h-5 text-black mb-2" />
                    <p className="font-black text-black">Settings & Reset</p>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">Factory reset & system controls</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Live Standings & Arrival Stream Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Track Leaders */}
            <div className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                <h3 className="font-black text-black text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-black" />
                  <span>Track Standings Summary</span>
                </h3>
                <Link href="/leaderboard" className="text-xs font-bold text-black underline hover:bg-[#FFEB3B] px-1">
                  Full Leaderboard
                </Link>
              </div>

              <div className="space-y-3">
                {tracks.map((track) => {
                  const topTeam = teams
                    .filter((t) => t.track_id === track.id)
                    .sort((a, b) => (b.score_total || 0) - (a.score_total || 0))[0];

                  return (
                    <div key={track.id} className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-black block">{track.name}</span>
                        <span className="text-slate-800 text-[11px] font-bold">
                          Leader: <strong className="text-black">{topTeam ? topTeam.name : "Pending scores"}</strong>
                        </span>
                      </div>
                      <span className="font-mono font-black text-black bg-[#FFEB3B] border border-black px-2 py-0.5">
                        {topTeam?.score_total ? topTeam.score_total.toFixed(2) : "0.00"} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent School Arrival Logs */}
            <div className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                <h3 className="font-black text-black text-sm flex items-center gap-2">
                  <School className="w-4 h-4 text-black" />
                  <span>Institutional Arrival Stream</span>
                </h3>
                <Link href="/organizer/checkins" className="text-xs font-bold text-black underline hover:bg-[#FFEB3B] px-1">
                  All Arrivals
                </Link>
              </div>

              <div className="space-y-2.5">
                {schools.map((s) => (
                  <div key={s.id} className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-black text-black">{s.name}</p>
                      <p className="text-[11px] font-bold text-slate-700">Code: {s.code} • {s.city}</p>
                    </div>
                    <Badge variant={s.arrived ? "success" : "warning"}>
                      {s.arrived ? "Checked In" : "Expected"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Portal View */}
      {role === "faculty" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] md:col-span-2">
              <h2 className="text-base font-black text-black mb-2">Delegation Status</h2>
              <p className="text-xs font-bold text-slate-800 mb-6">
                Institution: <strong>{facultySchool?.name}</strong> (Code: {facultySchool?.code})
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
                  <span className="text-xs font-bold text-slate-700 block uppercase">Enrolled Students</span>
                  <span className="text-2xl font-black text-black mt-1 block">{facultyStudents.length}</span>
                </div>
                <div className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
                  <span className="text-xs font-bold text-slate-700 block uppercase">Track Teams</span>
                  <span className="text-2xl font-black text-black mt-1 block">{facultyTeams.length}</span>
                </div>
                <div className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
                  <span className="text-xs font-bold text-slate-700 block uppercase">Gate Status</span>
                  <span className={`text-sm font-black mt-1 block ${facultySchool?.arrived ? "text-[#4CAF50]" : "text-[#FF9800]"}`}>
                    {facultySchool?.arrived ? "Arrived" : "Expected"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/faculty/ticket">
                  <Button size="sm" variant="yellow" className="text-xs">
                    <QrCode className="w-4 h-4 mr-1.5" />
                    <span>View Single School QR Ticket</span>
                  </Button>
                </Link>
                <Link href="/faculty/students">
                  <Button size="sm" variant="secondary" className="text-xs">
                    <Users className="w-4 h-4 mr-1.5" />
                    <span>Manage Students</span>
                  </Button>
                </Link>
                <Link href="/faculty/info-sheet">
                  <Button size="sm" variant="outline" className="text-xs">
                    <FileText className="w-4 h-4 mr-1.5" />
                    <span>Print 1-Page Info Sheet</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <h3 className="font-black text-black text-base mb-3">Check-in Instructions</h3>
              <p className="text-xs font-bold text-slate-800 leading-relaxed mb-4 bg-[#FFFBEB] border-2 border-black p-3">
                Students do not need individual passes or devices. Present your official School QR pass at Registration Desk Booth 1 upon campus arrival. The desk volunteer will verify and mark your delegation present.
              </p>
              <Link href="/faculty/ticket" className="text-xs text-black font-black underline hover:bg-[#FFEB3B] px-1">
                Open QR Ticket →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer View */}
      {role === "volunteer" && (
        <div className="space-y-6">
          <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black text-black">Registration Desk Scanner Active</h2>
              <p className="text-xs font-bold text-slate-800 mt-1 max-w-lg">
                Scan incoming visiting school QR passes. Mark attending students on the digital delegation checklist to check in the delegation in seconds.
              </p>
            </div>
            <Link href="/volunteer/scan">
              <Button size="lg" variant="yellow" className="text-sm px-6">
                <Scan className="w-5 h-5 mr-2" />
                <span>Launch QR Scanner</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}