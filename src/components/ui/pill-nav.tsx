"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { UserRole, OrganizerSubRole } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Calendar,
  Trophy,
  Bell,
  Users,
  QrCode,
  Scan,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  Sliders,
  ChevronDown,
  LogOut,
  Home,
  FileText,
  History,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function PillNav() {
  const pathname = usePathname();
  const {
    currentProfile,
    activeOrganizerSubRole,
    switchRole,
    switchOrganizerSubRole,
    isSuperAdmin,
    isEventCoordinator,
    isRegistrationHead,
  } = useFestStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const role = currentProfile.role;

  // Active navigation tabs per role & organizer sub-role
  const getNavLinks = () => {
    if (role === "faculty") {
      return [
        { href: "/dashboard", label: "Overview", icon: Home },
        { href: "/faculty/students", label: "Students", icon: Users },
        { href: "/faculty/teams", label: "Teams", icon: Sparkles },
        { href: "/faculty/ticket", label: "School Pass", icon: QrCode },
        { href: "/faculty/info-sheet", label: "Info Sheet", icon: FileText },
        { href: "/schedule", label: "Schedule", icon: Calendar },
        { href: "/announcements", label: "Notices", icon: Bell },
      ];
    }

    if (role === "volunteer") {
      return [
        { href: "/dashboard", label: "Desk Status", icon: Home },
        { href: "/volunteer/scan", label: "Fast Scanner", icon: Scan },
        { href: "/volunteer/duties", label: "Duty Roster", icon: ClipboardList },
        { href: "/volunteer/issues", label: "Report Issue", icon: AlertTriangle },
        { href: "/schedule", label: "Schedule", icon: Calendar },
        { href: "/announcements", label: "Notices", icon: Bell },
      ];
    }

    // Organizer sub-role links
    if (isSuperAdmin) {
      return [
        { href: "/dashboard", label: "Telemetry", icon: Home },
        { href: "/organizer/schools", label: "Approvals", icon: ShieldCheck },
        { href: "/organizer/checkins", label: "Desk Arrivals", icon: RotateCcw },
        { href: "/organizer/schedule", label: "Schedule", icon: Calendar },
        { href: "/organizer/scoring", label: "Scoring", icon: Sparkles },
        { href: "/organizer/results", label: "Publish", icon: Trophy },
        { href: "/announcements", label: "Notices", icon: Bell },
        { href: "/organizer/export", label: "Export", icon: Sliders },
        { href: "/organizer/audit", label: "Audit Log", icon: History },
      ];
    }

    if (isRegistrationHead) {
      return [
        { href: "/dashboard", label: "Telemetry", icon: Home },
        { href: "/organizer/schools", label: "Approvals", icon: ShieldCheck },
        { href: "/organizer/checkins", label: "Arrivals & Undo", icon: RotateCcw },
        { href: "/faculty/students", label: "Rosters", icon: Users },
        { href: "/organizer/export", label: "Export Roster", icon: Sliders },
        { href: "/announcements", label: "Notices", icon: Bell },
      ];
    }

    // Event Coordinator
    return [
      { href: "/dashboard", label: "Telemetry", icon: Home },
      { href: "/organizer/schedule", label: "Schedule", icon: Calendar },
      { href: "/organizer/scoring", label: "Scoring", icon: Sparkles },
      { href: "/volunteer/issues", label: "Issues", icon: AlertTriangle },
      { href: "/announcements", label: "Broadcast", icon: Bell },
      { href: "/organizer/export", label: "Export", icon: Sliders },
      { href: "/organizer/audit", label: "Audit Log", icon: History },
    ];
  };

  const links = getNavLinks();

  const getRoleBadgeLabel = () => {
    if (role === "faculty") return "Visiting Faculty";
    if (role === "volunteer") return "Registration Desk Volunteer";
    if (activeOrganizerSubRole === "super_admin") return "Super Admin (Organizer)";
    if (activeOrganizerSubRole === "event_coordinator") return "Event Coordinator (Organizer)";
    return "Registration Head (Organizer)";
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full glass-nav border-b border-white/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              M//B
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-white group-hover:text-indigo-300 transition-colors">
                MAKE<span className="text-rose-500">//</span>BREAK
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Inter-School Tech Fest 2026
              </span>
            </div>
          </Link>

          {/* Organizer Sub-role Switcher (If in organizer mode) */}
          {role === "organizer" && (
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.06] border border-white/15 p-1 rounded-xl">
              <button
                onClick={() => switchOrganizerSubRole("super_admin")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeOrganizerSubRole === "super_admin"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Super Admin
              </button>
              <button
                onClick={() => switchOrganizerSubRole("event_coordinator")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeOrganizerSubRole === "event_coordinator"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Event Coordinator
              </button>
              <button
                onClick={() => switchOrganizerSubRole("registration_head")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  activeOrganizerSubRole === "registration_head"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                )}
              >
                Registration Head
              </button>
            </div>
          )}

          {/* Role Switcher Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{getRoleBadgeLabel()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Modal / Dropdown */}
            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel-elevated p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Switch Test Role</p>
                  <p className="text-[11px] text-slate-400">Evaluate each portal without logging out</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-1">
                    Organizer Sub-Roles
                  </p>
                  <button
                    onClick={() => {
                      switchOrganizerSubRole("super_admin");
                      setRoleMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                      role === "organizer" && activeOrganizerSubRole === "super_admin"
                        ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-bold"
                        : "text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>Super Admin (Full Control)</span>
                    {role === "organizer" && activeOrganizerSubRole === "super_admin" && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchOrganizerSubRole("event_coordinator");
                      setRoleMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                      role === "organizer" && activeOrganizerSubRole === "event_coordinator"
                        ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-bold"
                        : "text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>Event Coordinator</span>
                    {role === "organizer" && activeOrganizerSubRole === "event_coordinator" && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchOrganizerSubRole("registration_head");
                      setRoleMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                      role === "organizer" && activeOrganizerSubRole === "registration_head"
                        ? "bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-bold"
                        : "text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>Registration Head</span>
                    {role === "organizer" && activeOrganizerSubRole === "registration_head" && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2">
                    External Leads
                  </p>
                  <button
                    onClick={() => {
                      switchRole("faculty");
                      setRoleMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                      role === "faculty"
                        ? "bg-blue-600/30 text-blue-200 border border-blue-500/30 font-bold"
                        : "text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>Visiting Faculty Lead</span>
                    {role === "faculty" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole("volunteer");
                      setRoleMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors",
                      role === "volunteer"
                        ? "bg-emerald-600/30 text-emerald-200 border border-emerald-500/30 font-bold"
                        : "text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <span>Registration Desk Volunteer</span>
                    {role === "volunteer" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                  <Link href="/" className="text-indigo-400 hover:underline">
                    Public Landing
                  </Link>
                  <Link href="/login" className="text-slate-400 hover:text-white flex items-center gap-1">
                    <LogOut className="w-3 h-3" />
                    <span>Login Page</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Bottom Pill Navigation Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-full px-3">
        <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full glass-panel-elevated border border-white/20 shadow-2xl backdrop-blur-2xl">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
