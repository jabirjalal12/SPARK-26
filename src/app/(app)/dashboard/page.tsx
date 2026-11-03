"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRDisplay } from "@/components/qr/qr-display";
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
  Award,
  ArrowRight,
  TrendingUp,
  Sliders,
  ChevronRight,
  Clock,
  MapPin,
  Bot,
  Wrench,
  Gavel,
} from "lucide-react";

export default function DashboardPage() {
  const {
    currentProfile,
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

  const [scannerOpen, setScannerOpen] = useState(false);

  const role = currentProfile.role;

  // Aggregate stats
  const totalSchools = schools.length;
  const approvedSchools = schools.filter((s) => s.approved).length;
  const arrivedSchools = schools.filter((s) => s.checked_in).length;
  const totalStudents = students.length;
  const arrivedStudents = students.filter((s) => s.checked_in).length;
  const openIssues = issueReports.filter((i) => i.status !== "resolved").length;

  // Student specific data
  const currentStudent = students[0] || null;
  const studentSchool = currentStudent
    ? schools.find((s) => s.id === currentStudent.school_id)
    : null;
  const studentTrack = currentStudent
    ? tracks.find((t) => t.id === currentStudent.track_id)
    : null;
  const studentTeam = currentStudent
    ? teams.find((t) => t.id === currentStudent.team_id)
    : null;

  // Faculty specific data
  const facultySchool = schools.find((s) => s.id === currentProfile.school_id) || schools[0];
  const facultyStudents = facultySchool
    ? students.filter((s) => s.school_id === facultySchool.id)
    : [];
  const facultyTeams = facultySchool
    ? teams.filter((t) => t.school_id === facultySchool.id)
    : [];

  // Volunteer specific data
  const myDuties = volunteerDuties.filter((d) => d.volunteer_id === currentProfile.id);

  // Judge specific data
  const judgeTrack = tracks.find((t) => t.id === currentProfile.assigned_track_id) || tracks[0];
  const judgeTeams = judgeTrack
    ? teams.filter((t) => t.track_id === judgeTrack.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Dashboard Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Live Fest Command
            </span>
            <span className="text-xs text-slate-500">•</span>
            <Badge variant="outline">{currentProfile.role.toUpperCase()}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {role === "organizer" && "Organizer Control Tower"}
            {role === "faculty" && `Faculty Hub — ${facultySchool?.name || "Institution"}`}
            {role === "volunteer" && "Volunteer Operations Deck"}
            {role === "judge" && `Jury Scoring Deck — ${judgeTrack?.name || "Track"}`}
            {role === "participant" && `Welcome, ${currentStudent?.full_name || "Participant"}!`}
          </h1>
        </div>

        {/* Quick context action buttons */}
        <div className="flex items-center gap-2">
          {role === "volunteer" && (
            <Button variant="primary" onClick={() => setScannerOpen(true)}>
              <Scan className="h-4 w-4 mr-1.5" />
              <span>Open QR Scanner</span>
            </Button>
          )}
          {role === "organizer" && (
            <Button
              variant={resultsPublished ? "danger" : "gradient"}
              size="sm"
              onClick={togglePublishResults}
            >
              <Trophy className="h-4 w-4 mr-1.5" />
              <span>{resultsPublished ? "Unpublish Results" : "Publish Final Results"}</span>
            </Button>
          )}
          {role === "participant" && (
            <Link href="/certificates">
              <Button variant="secondary" size="sm">
                <Award className="h-4 w-4 mr-1.5" />
                <span>My Certificate</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 1. ORGANIZER DASHBOARD VIEW */}
      {/* -------------------------------------------------------------------- */}
      {role === "organizer" && (
        <div className="space-y-6">
          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-4 sm:p-5" glow="blue">
              <div className="flex items-center justify-between text-blue-400 mb-2">
                <School className="h-5 w-5" />
                <span className="text-xs font-bold font-mono">
                  {Math.round((arrivedSchools / (totalSchools || 1)) * 100)}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {arrivedSchools} <span className="text-sm font-normal text-slate-400">/ {totalSchools}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Schools Checked In</p>
            </GlassCard>

            <GlassCard className="p-4 sm:p-5" glow="green">
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <Users className="h-5 w-5" />
                <span className="text-xs font-bold font-mono">
                  {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {arrivedStudents} <span className="text-sm font-normal text-slate-400">/ {totalStudents}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Students Verified</p>
            </GlassCard>

            <GlassCard className="p-4 sm:p-5" glow="purple">
              <div className="flex items-center justify-between text-purple-400 mb-2">
                <Trophy className="h-5 w-5" />
                <Badge variant={resultsPublished ? "success" : "warning"}>
                  {resultsPublished ? "Live" : "Draft"}
                </Badge>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {teams.length}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Competing Teams</p>
            </GlassCard>

            <GlassCard className="p-4 sm:p-5" glow={openIssues > 0 ? "red" : "none"}>
              <div className="flex items-center justify-between text-rose-400 mb-2">
                <AlertTriangle className="h-5 w-5" />
                {openIssues > 0 && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {openIssues}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">Open Ground Issues</p>
            </GlassCard>
          </div>

          {/* Quick Management Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <GlassCard className="p-5" glow="blue">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">School Approvals</h3>
                  <p className="text-xs text-slate-400">
                    {totalSchools - approvedSchools} schools awaiting approval
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Verify institution credentials, authorize faculty accounts, and unlock student rosters.
              </p>
              <Link href="/organizer/schools">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Review Schools ({totalSchools})
                </Button>
              </Link>
            </GlassCard>

            <GlassCard className="p-5" glow="purple">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Schedule Editor</h3>
                  <p className="text-xs text-slate-400">Live time slots & venues</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Update rounds, delay start times, and notify coordinators instantly with real-time sync.
              </p>
              <Link href="/organizer/schedule">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Manage Schedule
                </Button>
              </Link>
            </GlassCard>

            <GlassCard className="p-5" glow="green">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Data Export & Audit</h3>
                  <p className="text-xs text-slate-400">CSV & security logs</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Download attendee sheets, scores per track, and inspect immutable audit trail logs.
              </p>
              <Link href="/organizer/export">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Export Data
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 2. FACULTY DASHBOARD VIEW */}
      {/* -------------------------------------------------------------------- */}
      {role === "faculty" && (
        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8" glow="blue">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={facultySchool?.approved ? "success" : "warning"}>
                    {facultySchool?.approved ? "Approved Institution" : "Approval In Review"}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                    Code: {facultySchool?.code}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">{facultySchool?.name}</h2>
                <p className="text-xs text-slate-300 mt-1">{facultySchool?.address}, {facultySchool?.city}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href="/faculty/students">
                  <Button variant="primary" size="sm">
                    <Users className="h-4 w-4 mr-1.5" />
                    <span>Manage Students ({facultyStudents.length})</span>
                  </Button>
                </Link>
                <Link href="/faculty/qr-passes">
                  <Button variant="secondary" size="sm">
                    <QrCode className="h-4 w-4 mr-1.5" />
                    <span>All QR Passes</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick summary strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400">Registered Students</p>
                <p className="text-xl font-bold text-white mt-0.5">{facultyStudents.length}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400">Formed Teams</p>
                <p className="text-xl font-bold text-white mt-0.5">{facultyTeams.length} / 3 Tracks</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400">Campus Check-in Status</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">
                  {facultySchool?.checked_in ? "Arrived on Campus" : "Awaiting Arrival"}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Teams registered for this school */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-white">Your Registered Track Teams</h3>
              <Link href="/faculty/teams">
                <Button variant="secondary" size="sm" className="text-xs">
                  Create / Edit Teams
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {facultyTeams.map((team) => {
                const tr = tracks.find((t) => t.id === team.track_id);
                return (
                  <GlassCard key={team.id} className="p-4" glow="purple">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-400">{tr?.name}</span>
                      <span className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded text-white">
                        Table: {team.table_number || "TBD"}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-white">{team.name}</h4>
                    <p className="text-xs text-slate-300 font-medium mt-1">{team.project_title}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{team.project_summary}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 3. VOLUNTEER DASHBOARD VIEW */}
      {/* -------------------------------------------------------------------- */}
      {role === "volunteer" && (
        <div className="space-y-6">
          {/* Big Quick Scanner Banner */}
          <GlassCard className="p-6 sm:p-8 text-center" glow="green">
            <div className="max-w-md mx-auto space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <Scan className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-white">Fast Pass Scanner Active</h2>
              <p className="text-xs text-slate-300">
                Scan student badge or school registration QR for instant sub-5-second check-in.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full text-base py-3"
                  onClick={() => setScannerOpen(true)}
                >
                  <Scan className="h-5 w-5 mr-2" />
                  <span>Launch Camera Scanner</span>
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Assigned Duties */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-white">My Duty Roster</h3>
              <Link href="/volunteer/duties">
                <Button variant="secondary" size="sm" className="text-xs">
                  Full Roster
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myDuties.map((d) => (
                <GlassCard key={d.id} className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={d.status === "completed" ? "success" : "warning"}>
                      {d.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      {d.starts_at ? new Date(d.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Shift 1"}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-white">{d.duty}</h4>
                  <p className="text-xs text-slate-300 mt-1">{d.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 4. JUDGE DASHBOARD VIEW */}
      {/* -------------------------------------------------------------------- */}
      {role === "judge" && (
        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8" glow="purple">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Badge variant="track-blue" className="mb-2">ASSIGNED JURY TRACK</Badge>
                <h2 className="text-2xl font-black text-white">{judgeTrack?.name}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-md">{judgeTrack?.description}</p>
              </div>
              <Link href="/judge">
                <Button variant="primary">
                  <Gavel className="h-4 w-4 mr-1.5" />
                  <span>Score Competing Teams</span>
                </Button>
              </Link>
            </div>
          </GlassCard>

          {/* Teams to Score */}
          <div>
            <h3 className="font-bold text-lg text-white mb-3">Teams in Your Track ({judgeTeams.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {judgeTeams.map((team) => {
                const school = schools.find((s) => s.id === team.school_id);
                return (
                  <GlassCard key={team.id} className="p-4">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-indigo-300 font-mono">Table: {team.table_number || "TBD"}</span>
                      {team.score_total ? (
                        <span className="font-bold text-emerald-400 font-mono">{team.score_total}/10</span>
                      ) : (
                        <span className="text-amber-400 text-[11px]">Unscored</span>
                      )}
                    </div>
                    <h4 className="font-bold text-base text-white">{team.name}</h4>
                    <p className="text-xs text-slate-400">{school?.name}</p>
                    <p className="text-xs text-slate-300 mt-2 font-medium">{team.project_title}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 5. PARTICIPANT (STUDENT) DASHBOARD VIEW */}
      {/* -------------------------------------------------------------------- */}
      {role === "participant" && (
        <div className="space-y-6 max-w-xl mx-auto">
          {currentStudent ? (
            <GlassCard className="p-6 text-center" glow="purple">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <Badge variant={currentStudent.checked_in ? "success" : "warning"}>
                  {currentStudent.checked_in ? "Checked In & Verified" : "Ready for Gate Scan"}
                </Badge>
                <span className="font-mono text-xs text-indigo-300 font-semibold">
                  {studentSchool?.name}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">{currentStudent.full_name}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Track: <span className="font-bold text-white">{studentTrack?.name || "General"}</span>
              </p>

              <div className="my-5">
                <QRDisplay
                  value={currentStudent.qr_token}
                  title={currentStudent.full_name}
                  subtitle={`Pass Token: ${currentStudent.qr_token}`}
                  size={190}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left text-xs bg-white/5 border border-white/10 rounded-xl p-3 mb-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Your Team</span>
                  <span className="font-bold text-white truncate block">{studentTeam?.name || "Solo"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Work Table</span>
                  <span className="font-mono font-bold text-indigo-300 block">{studentTeam?.table_number || "TBD"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/schedule" className="flex-1">
                  <Button variant="secondary" className="w-full text-xs">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Schedule</span>
                  </Button>
                </Link>
                <Link href="/certificates" className="flex-1">
                  <Button variant="primary" className="w-full text-xs">
                    <Award className="h-3.5 w-3.5 mr-1" />
                    <span>My Certificate</span>
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 text-center">
              <p className="text-slate-300 text-sm">No student pass claimed yet.</p>
              <Link href="/join" className="mt-4 inline-block">
                <Button variant="primary">Join with School Code</Button>
              </Link>
            </GlassCard>
          )}
        </div>
      )}

      {/* QR Scanner Modal component */}
      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
