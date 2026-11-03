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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider bg-[#FFEB3B] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
              Live Fest Command
            </span>
            <span className="text-xs font-bold text-black">•</span>
            <Badge variant="outline">{currentProfile.role.toUpperCase()}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
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
              variant={resultsPublished ? "danger" : "primary"}
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
            <GlassCard variant="blue" className="p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between text-black mb-2">
                <School className="h-5 w-5" />
                <span className="text-xs font-black font-mono bg-white px-1.5 py-0.5 border border-black">
                  {Math.round((arrivedSchools / (totalSchools || 1)) * 100)}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-black">
                {arrivedSchools} <span className="text-sm font-bold text-neutral-800">/ {totalSchools}</span>
              </div>
              <p className="text-xs text-black mt-1 font-black uppercase">Schools Checked In</p>
            </GlassCard>

            <GlassCard variant="green" className="p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between text-black mb-2">
                <Users className="h-5 w-5" />
                <span className="text-xs font-black font-mono bg-white px-1.5 py-0.5 border border-black">
                  {Math.round((arrivedStudents / (totalStudents || 1)) * 100)}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-black">
                {arrivedStudents} <span className="text-sm font-bold text-neutral-800">/ {totalStudents}</span>
              </div>
              <p className="text-xs text-black mt-1 font-black uppercase">Students Verified</p>
            </GlassCard>

            <GlassCard variant="yellow" className="p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between text-black mb-2">
                <Trophy className="h-5 w-5" />
                <Badge variant={resultsPublished ? "success" : "warning"}>
                  {resultsPublished ? "Live" : "Draft"}
                </Badge>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-black">
                {teams.length}
              </div>
              <p className="text-xs text-black mt-1 font-black uppercase">Competing Teams</p>
            </GlassCard>

            <GlassCard variant="red" className="p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between text-black mb-2">
                <AlertTriangle className="h-5 w-5" />
                {openIssues > 0 && <span className="h-2.5 w-2.5 bg-black border border-white animate-ping" />}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-black">
                {openIssues}
              </div>
              <p className="text-xs text-black mt-1 font-black uppercase">Open Ground Issues</p>
            </GlassCard>
          </div>

          {/* Quick Management Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <GlassCard variant="white" className="p-5 border-3 border-black shadow-[6px_6px_0px_#000]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-[#2196F3] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-black uppercase">School Approvals</h3>
                  <p className="text-xs font-bold text-neutral-700">
                    {totalSchools - approvedSchools} schools awaiting approval
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium text-neutral-800 mb-4">
                Verify institution credentials, authorize faculty accounts, and unlock student rosters.
              </p>
              <Link href="/organizer/schools">
                <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                  Review Schools ({totalSchools})
                </Button>
              </Link>
            </GlassCard>

            <GlassCard variant="white" className="p-5 border-3 border-black shadow-[6px_6px_0px_#000]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-[#FFEB3B] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-black uppercase">Schedule Editor</h3>
                  <p className="text-xs font-bold text-neutral-700">Live time slots & venues</p>
                </div>
              </div>
              <p className="text-xs font-medium text-neutral-800 mb-4">
                Update rounds, delay start times, and notify coordinators instantly with real-time sync.
              </p>
              <Link href="/organizer/schedule">
                <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                  Manage Schedule
                </Button>
              </Link>
            </GlassCard>

            <GlassCard variant="white" className="p-5 border-3 border-black shadow-[6px_6px_0px_#000]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-[#4CAF50] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-black uppercase">Data Export & Audit</h3>
                  <p className="text-xs font-bold text-neutral-700">CSV & security logs</p>
                </div>
              </div>
              <p className="text-xs font-medium text-neutral-800 mb-4">
                Download attendee sheets, scores per track, and inspect immutable audit trail logs.
              </p>
              <Link href="/organizer/export">
                <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
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
          <GlassCard variant="white" className="p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_#000]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={facultySchool?.approved ? "success" : "warning"}>
                    {facultySchool?.approved ? "Approved Institution" : "Approval In Review"}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-black bg-[#FFEB3B] border-2 border-black px-2.5 py-0.5 shadow-[2px_2px_0px_#000]">
                    Code: {facultySchool?.code}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-black uppercase">{facultySchool?.name}</h2>
                <p className="text-xs font-semibold text-neutral-700 mt-1">{facultySchool?.address}, {facultySchool?.city}</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t-3 border-black">
              <div className="p-3.5 bg-[#FFFBEB] border-3 border-black shadow-[3px_3px_0px_#000]">
                <p className="text-xs font-bold uppercase text-black">Registered Students</p>
                <p className="text-2xl font-black text-black mt-0.5">{facultyStudents.length}</p>
              </div>
              <div className="p-3.5 bg-[#FFFBEB] border-3 border-black shadow-[3px_3px_0px_#000]">
                <p className="text-xs font-bold uppercase text-black">Formed Teams</p>
                <p className="text-2xl font-black text-black mt-0.5">{facultyTeams.length} / 3 Tracks</p>
              </div>
              <div className="p-3.5 bg-[#FFFBEB] border-3 border-black shadow-[3px_3px_0px_#000]">
                <p className="text-xs font-bold uppercase text-black">Campus Check-in Status</p>
                <p className="text-xl font-black text-black mt-0.5">
                  {facultySchool?.checked_in ? (
                    <span className="bg-[#4CAF50] text-black px-2 py-0.5 border border-black">Arrived on Campus</span>
                  ) : (
                    <span className="bg-[#FFEB3B] text-black px-2 py-0.5 border border-black">Awaiting Arrival</span>
                  )}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Teams registered for this school */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-lg text-black uppercase">Your Registered Track Teams</h3>
              <Link href="/faculty/teams">
                <Button variant="secondary" size="sm" className="text-xs font-bold">
                  Create / Edit Teams
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {facultyTeams.map((team) => {
                const tr = tracks.find((t) => t.id === team.track_id);
                return (
                  <GlassCard key={team.id} variant="white" className="p-4 border-3 border-black shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase bg-[#2196F3] text-black px-2 py-0.5 border border-black">
                        {tr?.name}
                      </span>
                      <span className="font-mono text-xs font-bold bg-[#FFEB3B] px-2 py-0.5 border border-black text-black">
                        Table: {team.table_number || "TBD"}
                      </span>
                    </div>
                    <h4 className="font-black text-base text-black uppercase">{team.name}</h4>
                    <p className="text-xs text-neutral-800 font-bold mt-1">{team.project_title}</p>
                    <p className="text-xs text-neutral-600 line-clamp-2 mt-1">{team.project_summary}</p>
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
          <GlassCard variant="yellow" className="p-6 sm:p-8 text-center border-4 border-black shadow-[8px_8px_0px_#000]">
            <div className="max-w-md mx-auto space-y-3">
              <div className="h-16 w-16 bg-[#4CAF50] text-black border-4 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
                <Scan className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase">Fast Pass Scanner Active</h2>
              <p className="text-xs font-bold text-neutral-800">
                Scan student badge or school registration QR for instant sub-5-second check-in.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full text-base py-3 font-black"
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
              <h3 className="font-black text-lg text-black uppercase">My Duty Roster</h3>
              <Link href="/volunteer/duties">
                <Button variant="secondary" size="sm" className="text-xs font-bold">
                  Full Roster
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myDuties.map((d) => (
                <GlassCard key={d.id} variant="white" className="p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000]">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={d.status === "completed" ? "success" : "warning"}>
                      {d.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-mono font-bold bg-[#FFEB3B] text-black px-2 py-0.5 border border-black">
                      {d.starts_at ? new Date(d.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Shift 1"}
                    </span>
                  </div>
                  <h4 className="font-black text-base text-black uppercase">{d.duty}</h4>
                  <p className="text-xs font-medium text-neutral-800 mt-1">{d.description}</p>
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
          <GlassCard variant="blue" className="p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_#000]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-2 bg-white text-black font-black">
                  ASSIGNED JURY TRACK
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-black uppercase">{judgeTrack?.name}</h2>
                <p className="text-xs font-bold text-neutral-900 mt-1 max-w-md">{judgeTrack?.description}</p>
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
            <h3 className="font-black text-lg text-black uppercase mb-3">Teams in Your Track ({judgeTeams.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {judgeTeams.map((team) => {
                const school = schools.find((s) => s.id === team.school_id);
                return (
                  <GlassCard key={team.id} variant="white" className="p-4 border-3 border-black shadow-[4px_4px_0px_#000]">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-mono font-bold bg-[#FFEB3B] px-1.5 py-0.5 border border-black text-black">
                        Table: {team.table_number || "TBD"}
                      </span>
                      {team.score_total ? (
                        <span className="font-black text-black bg-[#4CAF50] px-1.5 py-0.5 border border-black font-mono">
                          {team.score_total}/10
                        </span>
                      ) : (
                        <span className="font-bold text-black bg-[#FF9800] px-1.5 py-0.5 border border-black text-[11px]">
                          Unscored
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-base text-black uppercase">{team.name}</h4>
                    <p className="text-xs font-bold text-neutral-600">{school?.name}</p>
                    <p className="text-xs text-neutral-800 mt-2 font-medium">{team.project_title}</p>
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
            <GlassCard variant="white" className="p-6 text-center border-4 border-black shadow-[8px_8px_0px_#000]">
              <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-4">
                <Badge variant={currentStudent.checked_in ? "success" : "warning"}>
                  {currentStudent.checked_in ? "Checked In & Verified" : "Ready for Gate Scan"}
                </Badge>
                <span className="font-mono text-xs text-black font-black bg-[#FFEB3B] px-2 py-0.5 border border-black">
                  {studentSchool?.name}
                </span>
              </div>

              <h2 className="text-2xl font-black text-black uppercase">{currentStudent.full_name}</h2>
              <p className="text-xs font-bold text-neutral-700 mt-0.5">
                Track: <span className="font-black bg-[#2196F3] text-black px-1.5 py-0.5 border border-black">{studentTrack?.name || "General"}</span>
              </p>

              <div className="my-5">
                <QRDisplay
                  value={currentStudent.qr_token}
                  title={currentStudent.full_name}
                  subtitle={`Pass Token: ${currentStudent.qr_token}`}
                  size={190}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left text-xs bg-[#FFFBEB] border-3 border-black p-3 mb-4 shadow-[3px_3px_0px_#000]">
                <div>
                  <span className="text-neutral-700 block text-[11px] font-black uppercase">Your Team</span>
                  <span className="font-black text-black truncate block text-sm">{studentTeam?.name || "Solo"}</span>
                </div>
                <div>
                  <span className="text-neutral-700 block text-[11px] font-black uppercase">Work Table</span>
                  <span className="font-mono font-black text-black block text-sm">{studentTeam?.table_number || "TBD"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/schedule" className="flex-1">
                  <Button variant="secondary" className="w-full text-xs font-bold">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Schedule</span>
                  </Button>
                </Link>
                <Link href="/certificates" className="flex-1">
                  <Button variant="primary" className="w-full text-xs font-bold">
                    <Award className="h-3.5 w-3.5 mr-1" />
                    <span>My Certificate</span>
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <GlassCard variant="white" className="p-8 text-center border-4 border-black shadow-[8px_8px_0px_#000]">
              <p className="text-black font-bold text-sm">No student pass claimed yet.</p>
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
