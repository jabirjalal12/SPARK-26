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
  Bell,
  Key,
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
    schedule,
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
          <div className="flex items-center gap-2 flex-wrap">
            {isSuperAdmin && (
              <div className="flex items-center gap-2">
                <Link href="/passes?create=true">
                  <Button size="sm" variant="yellow" className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                    <Key className="w-4 h-4 mr-1.5" />
                    <span>+ Create Role Login (ID & Pass)</span>
                  </Button>
                </Link>
                <Link href="/organizer/results">
                  <Button size="sm" variant={resultsPublished ? "green" : "secondary"} className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                    <Trophy className="w-4 h-4 mr-1.5" />
                    <span>{resultsPublished ? "Results Published" : "Publish Results"}</span>
                  </Button>
                </Link>
              </div>
            )}
            {role === "event_coordinator" && (
              <div className="flex items-center gap-2">
                <Link href="/volunteer/issues">
                  <Button size="sm" variant={openIssues > 0 ? "danger" : "yellow"} className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    <span>Help Desk & Issues ({openIssues})</span>
                  </Button>
                </Link>
                <Link href="/organizer/schedule">
                  <Button size="sm" variant="secondary" className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>Schedule Editor</span>
                  </Button>
                </Link>
                
              </div>
            )}
            {role === "registration_head" && (
              <div className="flex items-center gap-2">
                <Link href="/organizer/schools">
                  <Button size="sm" variant="yellow" className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    <span>School Approvals</span>
                  </Button>
                </Link>
                <Link href="/organizer/checkins">
                  <Button size="sm" variant="secondary" className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                    <RotateCcw className="w-4 h-4 mr-1.5" />
                    <span>Arrivals & Undo</span>
                  </Button>
                </Link>
              </div>
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

      {/* 1. EVENT COORDINATOR COMMAND PANEL - STRICTLY THEIR SPECIFIC WINDOWS */}
      {role === "event_coordinator" && (
        <div className="space-y-6">
          {/* Operations Windows Grid */}
          <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-black">
              <div>
                <h2 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-black" />
                  <span>Event Operations Control Panel</span>
                </h2>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  Streamlined command center for arena heats, judge scoring, venue timetables, and emergency field dispatches.
                </p>
              </div>
              <span className="text-xs font-black uppercase bg-[#FFEB3B] text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000000]">
                ARENA OPERATIONS HQ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Window 1: Event Schedule & Timelines */}
              <Link href="/organizer/schedule" className="block group">
                <div className="p-4 border-[3px] border-black bg-[#FFFBEB] group-hover:bg-[#FFEB3B] shadow-[3px_3px_0px_#000000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-6 h-6 text-black" />
                    <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 bg-black text-white">
                      {schedule.length} Events
                    </span>
                  </div>
                  <p className="font-black text-sm text-black">Event Schedule & Timelines</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">
                    Manage track slots, heat timetables, stage assignments, and venue auditoriums.
                  </p>
                  <div className="mt-3 font-black text-black text-[11px] flex items-center gap-1 group-hover:underline">
                    <span>Open Schedule Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Window 2: Track Scoring Oversight */}
              <Link href="/organizer/scoring" className="block group">
                <div className="p-4 border-[3px] border-black bg-[#FFFBEB] group-hover:bg-[#4CAF50]/20 shadow-[3px_3px_0px_#000000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className="w-6 h-6 text-black" />
                    <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 bg-black text-white">
                      {scores.length} Marks Entered
                    </span>
                  </div>
                  <p className="font-black text-sm text-black">Track Scoring Oversight</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">
                    Monitor live judge marks, enter evaluations across all 3 tracks, and review rubric criteria.
                  </p>
                  <div className="mt-3 font-black text-black text-[11px] flex items-center gap-1 group-hover:underline">
                    <span>Open Scoring Terminal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Window 3: Help Desk Dispatches & Field Issues */}
              <Link href="/volunteer/issues" className="block group">
                <div className={`p-4 border-[3px] border-black shadow-[3px_3px_0px_#000000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${
                  openIssues > 0 ? "bg-[#FF5252]/15 group-hover:bg-[#FF5252]/25" : "bg-[#FFFBEB] group-hover:bg-[#FFEB3B]"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className={`w-6 h-6 ${openIssues > 0 ? "text-[#D32F2F]" : "text-black"}`} />
                    <span className={`text-[10px] font-mono font-black uppercase px-1.5 py-0.5 border border-black ${
                      openIssues > 0 ? "bg-[#FF5252] text-black" : "bg-black text-white"
                    }`}>
                      {openIssues} Action Needed
                    </span>
                  </div>
                  <p className="font-black text-sm text-black">Help Desk & Field Dispatches</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">
                    Direct column for landing page attendee inquiries and ground volunteer incident reports.
                  </p>
                  <div className="mt-3 font-black text-black text-[11px] flex items-center gap-1 group-hover:underline">
                    <span>Manage Dispatches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Window 4: Arena Announcements & Stage Broadcast */}
              <Link href="/announcements" className="block group">
                <div className="p-4 border-[3px] border-black bg-[#FFFBEB] group-hover:bg-[#2196F3]/20 shadow-[3px_3px_0px_#000000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Bell className="w-6 h-6 text-black" />
                    <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 bg-black text-white">
                      Live Broadcast
                    </span>
                  </div>
                  <p className="font-black text-sm text-black">Arena Broadcasts & Stage Notices</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">
                    Push flash bulletins, podium heat summons, and schedule alerts directly to venue attendees.
                  </p>
                  <div className="mt-3 font-black text-black text-[11px] flex items-center gap-1 group-hover:underline">
                    <span>Post Stage Broadcast</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Window 5: Live Leaderboard & Standings */}
              <Link href="/leaderboard" className="block group">
                <div className="p-4 border-[3px] border-black bg-[#FFFBEB] group-hover:bg-[#FFEB3B] shadow-[3px_3px_0px_#000000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-6 h-6 text-black" />
                    <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 bg-black text-white">
                      {teams.length} Squads
                    </span>
                  </div>
                  <p className="font-black text-sm text-black">Competitive Leaderboard</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">
                    Live team standings, institutional rankings, and score tallies across all tracks.
                  </p>
                  <div className="mt-3 font-black text-black text-[11px] flex items-center gap-1 group-hover:underline">
                    <span>View Live Rankings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>


            </div>
          </div>

          {/* Coordinator Live Ops Feeds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feed 1: Help Desk & Field Dispatches Alert Box */}
            <div className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                <h3 className="font-black text-black text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-black" />
                  <span>Ground Dispatches & Inquiries</span>
                </h3>
                <Link href="/volunteer/issues" className="text-xs font-bold text-black underline hover:bg-[#FFEB3B] px-1">
                  View All ({issueReports.length})
                </Link>
              </div>

              {issueReports.filter((i) => i.status !== "resolved").length === 0 ? (
                <div className="p-6 border-2 border-dashed border-black bg-[#FFFBEB] text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#4CAF50] mx-auto mb-2" />
                  <p className="text-xs font-black text-black">All Dispatches Clear</p>
                  <p className="text-[11px] font-bold text-slate-600 mt-0.5">No open help desk questions or field incident reports at this time.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {issueReports
                    .filter((i) => i.status !== "resolved")
                    .slice(0, 4)
                    .map((issue) => {
                      const isHelpDesk = issue.title.startsWith("[Help Desk]");
                      return (
                        <div key={issue.id} className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000] flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.2 text-[10px] font-black uppercase border border-black ${
                                isHelpDesk ? "bg-[#2196F3] text-white" : "bg-[#FF5252] text-black"
                              }`}>
                                {isHelpDesk ? "Help Desk" : "Field Alert"}
                              </span>
                              <span className="font-black text-black truncate">{issue.title}</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 line-clamp-1">{issue.description}</p>
                          </div>
                          <Link href="/volunteer/issues">
                            <Button size="sm" variant="yellow" className="text-[11px] py-0.5 px-2 font-black border border-black">
                              Resolve
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Feed 2: Track Scoring Leaders Summary */}
            <div className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                <h3 className="font-black text-black text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-black" />
                  <span>Track Evaluation & Leaders</span>
                </h3>
                <Link href="/organizer/scoring" className="text-xs font-bold text-black underline hover:bg-[#FFEB3B] px-1">
                  Open Scoring Terminal
                </Link>
              </div>

              <div className="space-y-3">
                {tracks.map((track) => {
                  const trackSquads = teams.filter((t) => t.track_id === track.id);
                  const topTeam = [...trackSquads].sort((a, b) => (b.score_total || 0) - (a.score_total || 0))[0];

                  return (
                    <div key={track.id} className="p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-black block">{track.name}</span>
                        <span className="text-slate-800 text-[11px] font-bold">
                          Leading: <strong className="text-black">{topTeam?.name || "No marks yet"}</strong>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-black bg-[#FFEB3B] border border-black px-2 py-0.5 inline-block">
                          {topTeam?.score_total ? topTeam.score_total.toFixed(2) : "0.00"} pts
                        </span>
                        <p className="text-[10px] font-bold text-slate-600 mt-0.5">
                          {trackSquads.length} squads competing
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REGISTRATION HEAD COMMAND PANEL */}
      {role === "registration_head" && (
        <div className="space-y-6">
          <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
            <h2 className="text-sm font-black uppercase tracking-wider text-black mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Registration Operations Desk</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <Link href="/organizer/schools" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <ShieldCheck className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">School Approvals</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Approve & Issue Tickets</p>
                </div>
              </Link>

              <Link href="/organizer/checkins" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <RotateCcw className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Desk Arrivals & Undo</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Undo mistaken check-ins</p>
                </div>
              </Link>

              <Link href="/faculty/students" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Users className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Rosters Overview</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Student verification lists</p>
                </div>
              </Link>

              <Link href="/organizer/export" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Sliders className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Export Roster</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Download full attendee CSV</p>
                </div>
              </Link>
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
      )}

      {/* 3. SUPER ADMIN / CORE ORGANIZER HUB */}
      {(isSuperAdmin || role === "super_admin" || role === "admin" || (role === "organizer" && activeOrganizerSubRole === "super_admin")) && (
        <div className="space-y-6">
          <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
            <h2 className="text-sm font-black uppercase tracking-wider text-black mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Super Administrator Command Panel</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <Link href="/organizer/schools" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <ShieldCheck className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">School Approvals</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Approve & Issue Tickets</p>
                </div>
              </Link>

              <Link href="/organizer/checkins" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <RotateCcw className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Desk Arrivals & Undo</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Undo mistaken check-ins</p>
                </div>
              </Link>

              <Link href="/organizer/scoring" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Sparkles className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Score Entry</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Score all 3 track arenas</p>
                </div>
              </Link>

              <Link href="/organizer/schedule" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Calendar className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Schedule Editor</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Edit timelines & venues</p>
                </div>
              </Link>

              <Link href="/passes" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Key className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Role Logins (ID & Pass)</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Create & manage accounts</p>
                </div>
              </Link>

              <Link href="/organizer/results" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Trophy className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Lock & Publish</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">SA Result Publishing</p>
                </div>
              </Link>

              <Link href="/organizer/export" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] transition-all">
                  <Sliders className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Export CSV</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Download full roster logs</p>
                </div>
              </Link>

              <Link href="/organizer/settings" className="block">
                <div className="p-4 border-2 border-black bg-[#FFFBEB] hover:bg-[#FF5252]/20 shadow-[2px_2px_0px_#000000] transition-all">
                  <Settings className="w-5 h-5 text-black mb-2" />
                  <p className="font-black text-black">Settings & Reset</p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Factory reset & system controls</p>
                </div>
              </Link>
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