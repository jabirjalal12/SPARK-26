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
  Key,
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
    isSuperAdmin,
    isEventCoordinator,
    isRegistrationHead,
  } = useFestStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const role = currentProfile.role;

  // Close profile dropdown when clicking anywhere outside
  React.useEffect(() => {
    if (!roleMenuOpen) return;
    const handleOutsideClick = () => setRoleMenuOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [roleMenuOpen]);

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

    // Event Coordinator Real Role - strictly the operational windows they need
    if (role === "event_coordinator") {
      return [
        { href: "/dashboard", label: "Operations Hub", icon: Home },
        { href: "/organizer/schedule", label: "Schedule", icon: Calendar },
        { href: "/volunteer/issues", label: "Help Desk & Issues", icon: AlertTriangle },
        { href: "/announcements", label: "Broadcast", icon: Bell },
        { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
      ];
    }

    // Registration Head Real Role
    if (role === "registration_head") {
      return [
        { href: "/dashboard", label: "Telemetry", icon: Home },
        { href: "/organizer/schools", label: "Approvals", icon: ShieldCheck },
        { href: "/organizer/checkins", label: "Arrivals & Undo", icon: RotateCcw },
        { href: "/faculty/students", label: "Rosters", icon: Users },
        { href: "/organizer/export", label: "Export Roster", icon: Sliders },
        { href: "/announcements", label: "Notices", icon: Bell },
      ];
    }

    // Super Admin / Core Organizer
    return [
      { href: "/dashboard", label: "Telemetry", icon: Home },
      { href: "/organizer/schools", label: "Approvals", icon: ShieldCheck },
      { href: "/organizer/checkins", label: "Desk Arrivals", icon: RotateCcw },
      { href: "/passes", label: "Role Logins", icon: Key },
      { href: "/organizer/results", label: "Leaderboard & TV", icon: Trophy },
      { href: "/announcements", label: "Notices", icon: Bell },
      { href: "/organizer/export", label: "Export", icon: Sliders },
      { href: "/organizer/audit", label: "Audit Log", icon: History },
      { href: "/organizer/settings", label: "Settings", icon: Settings },
    ];
  };

  const links = getNavLinks();

  const getRoleBadgeLabel = () => {
    if (role === "tv_display") return "📺 Venue TV Display";
    if (role === "faculty") return "Visiting Faculty Lead";
    if (role === "volunteer") return "Registration Desk Volunteer";
    if (role === "judge") return "Official Fest Judge";
    if (role === "event_coordinator") return "Event Coordinator";
    if (role === "registration_head") return "Registration Head";
    if (role === "super_admin" || role === "admin" || role === "organizer") return "Super Administrator";
    return "Staff Official";
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

          {/* Role Switcher Pill & Dropdown */}
          <div className="flex items-center gap-2">
            {role === "faculty" && (
              <Link
                href="/faculty/ticket"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFEB3B] hover:bg-black hover:text-white border-[3px] border-black shadow-[3px_3px_0px_#000000] text-xs font-black text-black hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>School QR Ticket</span>
              </Link>
            )}

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRoleMenuOpen(!roleMenuOpen);
                }}
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

                {role === "faculty" && (
                  <div className="mb-2">
                    <Link
                      href="/faculty/ticket"
                      onClick={() => setRoleMenuOpen(false)}
                      className="w-full px-3 py-1.5 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black flex items-center justify-between text-xs font-black transition-colors"
                    >
                      <span>School QR Ticket</span>
                      <QrCode className="w-3.5 h-3.5" />
                    </Link>
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