"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { UserRole } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Calendar,
  Trophy,
  Bell,
  Award,
  Users,
  QrCode,
  Scan,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  Gavel,
  Sliders,
  ChevronDown,
  LogOut,
  Home,
} from "lucide-react";

export function PillNav() {
  const pathname = usePathname();
  const { currentProfile, switchRole } = useFestStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const role = currentProfile.role;

  // Role navigation configuration
  const getNavLinks = () => {
    switch (role) {
      case "faculty":
        return [
          { href: "/dashboard", label: "Overview", icon: Home },
          { href: "/faculty/students", label: "Students", icon: Users },
          { href: "/faculty/teams", label: "Teams", icon: Sparkles },
          { href: "/faculty/qr-passes", label: "QR Passes", icon: QrCode },
          { href: "/schedule", label: "Schedule", icon: Calendar },
          { href: "/announcements", label: "Notices", icon: Bell },
        ];
      case "volunteer":
        return [
          { href: "/dashboard", label: "Status", icon: Home },
          { href: "/volunteer/scan", label: "QR Scanner", icon: Scan },
          { href: "/volunteer/duties", label: "My Duties", icon: ClipboardList },
          { href: "/volunteer/issues", label: "Issues", icon: AlertTriangle },
          { href: "/schedule", label: "Schedule", icon: Calendar },
        ];
      case "judge":
        return [
          { href: "/dashboard", label: "Overview", icon: Home },
          { href: "/judge", label: "Score Teams", icon: Gavel },
          { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
          { href: "/schedule", label: "Schedule", icon: Calendar },
        ];
      case "organizer":
        return [
          { href: "/dashboard", label: "Live Stats", icon: Home },
          { href: "/organizer/schools", label: "Approvals", icon: ShieldCheck },
          { href: "/organizer/schedule", label: "Schedule", icon: Calendar },
          { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
          { href: "/organizer/announcements", label: "Broadcast", icon: Bell },
          { href: "/organizer/export", label: "Export", icon: Sliders },
        ];
      case "participant":
      default:
        return [
          { href: "/dashboard", label: "My Pass", icon: QrCode },
          { href: "/schedule", label: "Schedule", icon: Calendar },
          { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
          { href: "/announcements", label: "Announcements", icon: Bell },
          { href: "/certificates", label: "Certificate", icon: Award },
        ];
    }
  };

  const links = getNavLinks();

  const roleLabels: Record<UserRole, string> = {
    organizer: "Organizer (Admin)",
    faculty: "Faculty Lead",
    volunteer: "Volunteer",
    judge: "Judge",
    participant: "Student",
  };

  const roleColors: Record<UserRole, string> = {
    organizer: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    faculty: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    volunteer: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    judge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    participant: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  };

  return (
    <>
      {/* Top Banner / Role Preview Selector */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm tracking-tighter">{"M//B"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white text-base leading-none group-hover:text-indigo-400 transition-colors">
                MAKE//BREAK
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                Tech Fest 2026
              </span>
            </div>
          </Link>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400",
                roleColors[role]
              )}
              title="Click to switch preview roles"
            >
              <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
              <span>Role: {roleLabels[role]}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/15 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-300 border-b border-white/10">
                  Switch Role Preview
                </div>
                {(["organizer", "faculty", "volunteer", "judge", "participant"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors",
                      role === r
                        ? "bg-indigo-600 text-white font-semibold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span>{roleLabels[r]}</span>
                    {role === r && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                ))}
                <div className="mt-1 pt-1 border-t border-white/10">
                  <Link
                    href="/"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Exit to Public Landing</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Pill Nav for Mobile & Desktop */}
      <nav
        aria-label="App navigation"
        className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 rounded-full border border-white/20 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-x-auto max-w-full no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-300")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
