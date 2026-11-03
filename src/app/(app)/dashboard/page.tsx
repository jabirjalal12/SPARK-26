"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function DashboardPage() {
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
    if (activeOrganizerSubRole === "super_admin") return "Super Admin (Organizer)";
    if (activeOrganizerSubRole === "event_coordinator") return "Event Coordinator (Organizer)";
    return "Registration Head (Organizer)";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <GlassCard className="p-6 border-white/15 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-indigo-500/40 text-indigo-300">
                {getSubRoleTitle()}
              </Badge>
              <span className="text-xs text-slate-400">Campus Live Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentProfile.full_name}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              MAKE//BREAK 2026 Inter-School Tech Fest • Real-time coordination hub
            </p>
          </div>

          {/* Quick context CTA */}
          <div className="flex items-center gap-2">
            {role === "organizer" && isSuperAdmin && (
              <Link href="/organizer/results">
                <Button size="sm" variant={resultsPublished ? "green" : "gradient"} className="text-xs">
                  <Trophy className="w-4 h-4 mr-1.5" />
                  <span>{resultsPublished ? "Results Published" : "Publish Results"}</span>
                </Button>
              </Link>
            )}
            {role === "volunteer" && (
              <Link href="/volunteer/scan">
                <Button size="sm" variant="gradient" className="text-xs">
                  <Scan className="w-4 h-4 mr-1.5" />
                  <span>Open QR Scanner</span>
                </Button>
              </Link>
            )}
            {role === "faculty" && (
              <Link href="/faculty/ticket">
                <Button size="sm" variant="gradient" className="text-xs">
                  <QrCode className="w-4 h-4 mr-1.5" />
                  <span>View School Ticket</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Main Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <GlassCard className="p-4 border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <School className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-mono text-blue-300">{approvedSchools} Approved</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {arrivedSchools} <span className="text-sm font-normal text-slate-400">/ {totalSchools}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Schools Arrived</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-300">
              {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {arrivedStudents} <span className="text-sm font-normal text-slate-400">/ {totalStudents}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Students Verified</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-mono text-amber-300">At Desk</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{walkinStudents}</div>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Desk Walk-ins</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] font-mono text-purple-300">3 Tracks</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{teams.length}</div>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Active Teams</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/10 bg-slate-900/60 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-[11px] font-mono text-rose-300">{openIssues === 0 ? "All Clear" : "Pending"}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{openIssues}</div>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-1">Ground Issues</p>
        </GlassCard>
      </div>

      {/* Role-Adaptive Content Section */}
      {role === "organizer" && (
        <div className="space-y-6">
          {/* Sub-Role Quick Action Dashboard */}
          <GlassCard className="p-5 border-white/15">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{getSubRoleTitle()} Command Panel</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {(isSuperAdmin || isRegistrationHead) && (
                <Link href="/organizer/schools" className="block">
                  <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-indigo-400 mb-2" />
                    <p className="font-bold text-white">School Approvals</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Approve & Issue Tickets</p>
                  </div>
                </Link>
              )}

              {(isSuperAdmin || isRegistrationHead) && (
                <Link href="/organizer/checkins" className="block">
                  <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors">
                    <RotateCcw className="w-5 h-5 text-amber-400 mb-2" />
                    <p className="font-bold text-white">Desk Arrivals & Undo</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Undo mistaken check-ins</p>
                  </div>
                </Link>
              )}

              {(isSuperAdmin || isEventCoordinator) && (
                <Link href="/organizer/scoring" className="block">
                  <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors">
                    <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="font-bold text-white">Score Entry</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Score all 3 track arenas</p>
                  </div>
                </Link>
              )}

              {(isSuperAdmin || isEventCoordinator) && (
                <Link href="/organizer/schedule" className="block">
                  <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors">
                    <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="font-bold text-white">Schedule Editor</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Edit timelines & venues</p>
                  </div>
                </Link>
              )}

              {isSuperAdmin && (
                <Link href="/organizer/results" className="block">
                  <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors">
                    <Trophy className="w-5 h-5 text-yellow-400 mb-2" />
                    <p className="font-bold text-white">Lock & Publish</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">SA Result Publishing</p>
                  </div>
                </Link>
              )}

              <Link href="/organizer/export" className="block">
                <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors">
                  <Sliders className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="font-bold text-white">Export CSV</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Download full roster logs</p>
                </div>
              </Link>
            </div>
          </GlassCard>

          {/* Live Standings & Arrival Stream Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Track Leaders */}
            <GlassCard className="p-5 border-white/15">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Track Standings Summary</span>
                </h3>
                <Link href="/leaderboard" className="text-xs text-indigo-400 hover:underline">
                  Full Leaderboard
                </Link>
              </div>

              <div className="space-y-3">
                {tracks.map((track) => {
                  const topTeam = teams
                    .filter((t) => t.track_id === track.id)
                    .sort((a, b) => (b.score_total || 0) - (a.score_total || 0))[0];

                  return (
                    <div key={track.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{track.name}</span>
                        <span className="text-slate-400 text-[11px]">
                          Leader: <strong className="text-indigo-300">{topTeam ? topTeam.name : "Pending scores"}</strong>
                        </span>
                      </div>
                      <span className="font-mono font-bold text-indigo-300">
                        {topTeam?.score_total ? topTeam.score_total.toFixed(2) : "0.00"} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Recent School Arrival Logs */}
            <GlassCard className="p-5 border-white/15">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <School className="w-4 h-4 text-emerald-400" />
                  <span>Institutional Arrival Stream</span>
                </h3>
                <Link href="/organizer/checkins" className="text-xs text-indigo-400 hover:underline">
                  All Arrivals
                </Link>
              </div>

              <div className="space-y-2.5">
                {schools.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{s.name}</p>
                      <p className="text-[11px] text-slate-400">Code: {s.code} • {s.city}</p>
                    </div>
                    <Badge variant={s.arrived ? "success" : "warning"}>
                      {s.arrived ? "Checked In" : "Expected"}
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Faculty Portal View */}
      {role === "faculty" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 border-white/15 md:col-span-2">
              <h2 className="text-base font-bold text-white mb-2">Delegation Status</h2>
              <p className="text-xs text-slate-300 mb-6">
                Institution: <strong>{facultySchool?.name}</strong> (Code: {facultySchool?.code})
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-xs text-slate-400 block">Enrolled Students</span>
                  <span className="text-xl font-bold text-white mt-1 block">{facultyStudents.length}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-xs text-slate-400 block">Track Teams</span>
                  <span className="text-xl font-bold text-indigo-300 mt-1 block">{facultyTeams.length}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-xs text-slate-400 block">Gate Status</span>
                  <span className={`text-sm font-bold mt-1 block ${facultySchool?.arrived ? "text-emerald-400" : "text-amber-400"}`}>
                    {facultySchool?.arrived ? "Arrived" : "Expected"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/faculty/ticket">
                  <Button size="sm" variant="gradient" className="text-xs">
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
            </GlassCard>

            <GlassCard className="p-6 border-white/15">
              <h3 className="font-bold text-white text-sm mb-3">Check-in Instructions</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Students do not need individual passes or devices. Present your official School QR pass at Registration Desk Booth 1 upon campus arrival. The desk volunteer will verify and mark your delegation present.
              </p>
              <Link href="/faculty/ticket" className="text-xs text-indigo-400 font-semibold hover:underline">
                Open QR Ticket →
              </Link>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Volunteer View */}
      {role === "volunteer" && (
        <div className="space-y-6">
          <GlassCard className="p-6 border-white/15 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white">Registration Desk Scanner Active</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                Scan incoming visiting school QR passes. Mark attending students on the digital delegation checklist to check in the delegation in seconds.
              </p>
            </div>
            <Link href="/volunteer/scan">
              <Button size="lg" variant="gradient" className="text-sm px-6">
                <Scan className="w-5 h-5 mr-2" />
                <span>Launch QR Scanner</span>
              </Button>
            </Link>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
