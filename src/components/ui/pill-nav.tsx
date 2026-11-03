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
          { href: "/announcements", label: "Broadcast", icon: Bell },
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
    organizer: "bg-[#FFEB3B] text-black border-black",
    faculty: "bg-[#2196F3] text-black border-black",
    volunteer: "bg-[#4CAF50] text-black border-black",
    judge: "bg-[#FF9800] text-black border-black",
    participant: "bg-[#FF5252] text-black border-black",
  };

  return (
    <>
      {/* Top Banner / Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b-[3px] border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-black tracking-tight leading-none">
                SPARK
              </span>
              <span className="text-[10px] uppercase tracking-widest text-black font-bold mt-0.5 bg-[#FFEB3B] px-1 border border-black inline-block">
                TECH FEST 2026
              </span>
            </div>
          </Link>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-black border-[3px] shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black",
                roleColors[role]
              )}
              title="Click to switch preview roles"
            >
              <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
              <span>Role: {roleLabels[role]}</span>
              <ChevronDown className="h-3.5 w-3.5 text-black" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-none border-[3px] border-black bg-white p-2 shadow-[6px_6px_0px_#000000] z-50 animate-in fade-in"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-black uppercase tracking-wider text-black border-b-2 border-black bg-[#FFEB3B]">
                  Switch Role Preview
                </div>
                <div className="space-y-1 mt-1">
                  {(["organizer", "faculty", "volunteer", "judge", "participant"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-left border-2 transition-all cursor-pointer",
                        role === r
                          ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                          : "text-black border-transparent hover:bg-[#FFEB3B] hover:border-black"
                      )}
                    >
                      <span>{roleLabels[r]}</span>
                      {role === r && <span className="text-[10px] bg-white text-black px-1.5 py-0.2 font-black">ACTIVE</span>}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t-2 border-black">
                  <Link
                    href="/"
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#FF5252] transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Public Landing Page</span>
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
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-2 rounded-none border-[3px] border-black bg-[#FFFBEB] shadow-[6px_6px_0px_#000000] overflow-x-auto max-w-full no-scrollbar">
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
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-black")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
