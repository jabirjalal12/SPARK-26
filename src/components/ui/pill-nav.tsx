"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { UserRole, OrganizerSubRole } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Award,
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
  Settings,
  Monitor,
  Radio,
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
    if (role === "tv_display") {
      return [
        { href: "/tv", label: "TV Kiosk Display", icon: Monitor },
        { href: "/leaderboard", label: "Live Leaderboard", icon: Trophy },
        { href: "/announcements", label: "Announcements Ticker", icon: Radio },
      ];
    }

    if (role === "faculty") {
      return [
        { href: "/dashboard", label: "Overview", icon: Home },
        { href: "/faculty/students", label: "Event Squads (4 Members)", icon: Users },
        { href: "/faculty/ticket", label: "Passes & Tickets", icon: QrCode },
        { href: "/faculty/info-sheet", label: "Info Sheet", icon: FileText },
        { href: "/schedule", label: "Schedule", icon: Calendar },
        { href: "/announcements", label: "Notices", icon: Bell },
      ];
    }

    if (role === "volunteer") {
      return [
        { href: "/dashboard", label: "Desk Status", icon: Home },
        { href: "/volunteer/scan", label: "Fast Scanner", icon: Scan },
        { href: "/volunteer/pass", label: "Duty Pass", icon: QrCode },
        { href: "/volunteer/duties", label: "Duty Roster", icon: ClipboardList },
        { href: "/volunteer/issues", label: "Report Issue", icon: AlertTriangle },
        { href: "/schedule", label: "Schedule", icon: Calendar },
        { href: "/announcements", label: "Notices", icon: Bell },
      ];
    }

    if (role === "judge") {
      return [
        { href: "/judge", label: "Enter Marks", icon: Sparkles },
        { href: "/judge/pass", label: "Judge Pass", icon: QrCode },
        { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
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
        { href: "/organizer/scoring", label: "Scoring", icon: Sparkles },
        { href: "/passes", label: "Passes Terminal", icon: QrCode },
        { href: "/organizer/pass", label: "Executive Pass", icon: ShieldCheck },
        { href: "/organizer/results", label: "Publish", icon: Trophy },
        { href: "/announcements", label: "Notices", icon: Bell },
        { href: "/organizer/export", label: "Export", icon: Sliders },
        { href: "/organizer/audit", label: "Audit Log", icon: History },
        { href: "/organizer/settings", label: "Settings", icon: Settings },
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
    if (role === "tv_display") return "📺 Venue TV Display";
    if (role === "faculty") return "Visiting Faculty Lead";
    if (role === "volunteer") return "Registration Desk Volunteer";
    if (role === "judge") return "Official Fest Judge";
    if (activeOrganizerSubRole === "super_admin") return "Super Admin (Organizer)";
    if (activeOrganizerSubRole === "event_coordinator") return "Event Coordinator (Organizer)";
    return "Registration Head (Organizer)";
  };

  const getMyPassHref = () => {
    if (role === "tv_display") return "/tv";
    if (role === "faculty") return "/faculty/ticket";
    if (role === "volunteer") return "/volunteer/pass";
    if (role === "judge") return "/judge/pass";
    return "/organizer/pass";
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b-[3px] border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center font-black text-black group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-xl text-black">
                SPARK
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-black bg-[#FFEB3B] border border-black px-1 inline-block leading-tight">
                TECH FEST 2026
              </span>
            </div>
          </Link>

          {/* Organizer Sub-role Switcher (If in organizer mode) */}
          {role === "organizer" && (
            <div className="hidden lg:flex items-center gap-1 bg-[#FFFBEB] border-2 border-black p-1 shadow-[2px_2px_0px_#000000]">
              <button
                onClick={() => switchOrganizerSubRole("super_admin")}
                className={cn(
                  "px-3 py-1 text-xs font-black transition-all cursor-pointer border",
                  activeOrganizerSubRole === "super_admin"
                    ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                    : "text-black border-transparent hover:bg-[#FFEB3B]"
                )}
              >
                Super Admin
              </button>
              <button
                onClick={() => switchOrganizerSubRole("event_coordinator")}
                className={cn(
                  "px-3 py-1 text-xs font-black transition-all cursor-pointer border",
                  activeOrganizerSubRole === "event_coordinator"
                    ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                    : "text-black border-transparent hover:bg-[#FFEB3B]"
                )}
              >
                Event Coordinator
              </button>
              <button
                onClick={() => switchOrganizerSubRole("registration_head")}
                className={cn(
                  "px-3 py-1 text-xs font-black transition-all cursor-pointer border",
                  activeOrganizerSubRole === "registration_head"
                    ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                    : "text-black border-transparent hover:bg-[#FFEB3B]"
                )}
              >
                Registration Head
              </button>
            </div>
          )}

          {/* Role Switcher Pill & Dropdown */}
          <div className="flex items-center gap-2">
            <Link
              href={getMyPassHref()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFEB3B] hover:bg-black hover:text-white border-[3px] border-black shadow-[3px_3px_0px_#000000] text-xs font-black text-black hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>My ID Pass</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-white hover:bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] text-xs font-black text-black hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] border border-black animate-pulse" />
                <span>{getRoleBadgeLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-black" />
              </button>

            {/* Role Switcher Modal / Dropdown */}
            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-none border-4 border-black bg-white p-3 shadow-[6px_6px_0px_#000000] z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2.5 border-b-2 border-black bg-[#FFEB3B] mb-2">
                  <p className="text-xs font-black text-black uppercase tracking-wider">{currentProfile.full_name || "Authorized User"}</p>
                  <p className="text-[11px] font-bold text-slate-800 truncate">{currentProfile.email}</p>
                  <div className="mt-1.5 inline-block bg-black text-[#FFEB3B] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    {getRoleBadgeLabel()}
                  </div>
                </div>

                <div className="space-y-1 mb-2 pb-2 border-b-2 border-black">
                  <p className="text-[10px] font-black uppercase tracking-wider text-black px-2 pt-1">
                    Switch Active Role
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        switchRole("organizer");
                        switchOrganizerSubRole("super_admin");
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "text-left px-2 py-1 text-[11px] font-black border transition-colors cursor-pointer",
                        role === "organizer" ? "bg-black text-white border-black" : "bg-white hover:bg-[#FFFBEB] border-slate-300"
                      )}
                    >
                      Organizer
                    </button>
                    <button
                      onClick={() => {
                        switchRole("judge");
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "text-left px-2 py-1 text-[11px] font-black border transition-colors cursor-pointer",
                        role === "judge" ? "bg-[#9C27B0] text-white border-black" : "bg-white hover:bg-[#FFFBEB] border-slate-300"
                      )}
                    >
                      Judge (Jury)
                    </button>
                    <button
                      onClick={() => {
                        switchRole("faculty");
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "text-left px-2 py-1 text-[11px] font-black border transition-colors cursor-pointer",
                        role === "faculty" ? "bg-[#4CAF50] text-black border-black" : "bg-white hover:bg-[#FFFBEB] border-slate-300"
                      )}
                    >
                      Faculty
                    </button>
                    <button
                      onClick={() => {
                        switchRole("volunteer");
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "text-left px-2 py-1 text-[11px] font-black border transition-colors cursor-pointer",
                        role === "volunteer" ? "bg-[#2196F3] text-black border-black" : "bg-white hover:bg-[#FFFBEB] border-slate-300"
                      )}
                    >
                      Volunteer
                    </button>
                    <button
                      onClick={() => {
                        switchRole("tv_display");
                        setRoleMenuOpen(false);
                        window.location.href = "/tv";
                      }}
                      className={cn(
                        "text-left px-2 py-1 text-[11px] font-black border transition-colors cursor-pointer col-span-2",
                        role === "tv_display" ? "bg-[#00E5FF] text-black border-black" : "bg-white hover:bg-[#FFFBEB] border-slate-300"
                      )}
                    >
                      📺 TV Display Screen
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <Link
                    href={getMyPassHref()}
                    onClick={() => setRoleMenuOpen(false)}
                    className="w-full px-3 py-1.5 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black flex items-center justify-between text-xs font-black transition-colors"
                  >
                    <span>View My Official ID Pass</span>
                    <QrCode className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {role === "organizer" && (
                  <div className="space-y-1 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-black px-2 pt-1">
                      Active Sub-Role View
                    </p>
                    <button
                      onClick={() => {
                        switchOrganizerSubRole("super_admin");
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between border-2 transition-colors cursor-pointer",
                        activeOrganizerSubRole === "super_admin"
                          ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                          : "text-black border-transparent hover:bg-[#FFFBEB] hover:border-black"
                      )}
                    >
                      <span>Super Admin</span>
                      {activeOrganizerSubRole === "super_admin" && <CheckCircle2 className="w-3.5 h-3.5 text-[#FFEB3B]" />}
                    </button>
                    <button
                      onClick={() => {
                        switchOrganizerSubRole("event_coordinator");
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between border-2 transition-colors cursor-pointer",
                        activeOrganizerSubRole === "event_coordinator"
                          ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                          : "text-black border-transparent hover:bg-[#FFFBEB] hover:border-black"
                      )}
                    >
                      <span>Event Coordinator</span>
                      {activeOrganizerSubRole === "event_coordinator" && <CheckCircle2 className="w-3.5 h-3.5 text-[#FFEB3B]" />}
                    </button>
                    <button
                      onClick={() => {
                        switchOrganizerSubRole("registration_head");
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between border-2 transition-colors cursor-pointer",
                        activeOrganizerSubRole === "registration_head"
                          ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                          : "text-black border-transparent hover:bg-[#FFFBEB] hover:border-black"
                      )}
                    >
                      <span>Registration Head</span>
                      {activeOrganizerSubRole === "registration_head" && <CheckCircle2 className="w-3.5 h-3.5 text-[#FFEB3B]" />}
                    </button>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t-2 border-black flex justify-between items-center text-xs font-bold">
                  <Link href="/" className="text-black hover:underline" onClick={() => setRoleMenuOpen(false)}>
                    Public Landing
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                      } catch {}
                      setRoleMenuOpen(false);
                      window.location.href = "/login";
                    }}
                    className="text-black hover:bg-[#FF5252] px-2.5 py-1 border-2 border-black flex items-center gap-1.5 font-black uppercase text-[11px] shadow-[2px_2px_0px_#000000] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Floating Bottom Pill Navigation Bar */}
      <nav aria-label="App navigation" className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-2 rounded-none border-[3px] border-black bg-[#FFFBEB] shadow-[6px_6px_0px_#000000] overflow-x-auto max-w-full">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-bold whitespace-nowrap border-2 transition-all duration-100 select-none",
                  isActive
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_#2196F3] -translate-x-0.5 -translate-y-0.5"
                    : "text-black border-black bg-white hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-black")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}