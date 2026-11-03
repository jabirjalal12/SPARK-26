"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Bot,
  Wrench,
  Calendar,
  Trophy,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Building2,
  Users,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  const { tracks, schedule, teams, schools, resultsPublished } = useFestStore();

  const targetDate = new Date("2026-11-20T08:30:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const trackIcons = {
    robotics: Bot,
    "build-from-scrap": Wrench,
    "useless-projects": Sparkles,
  };

  return (
    <div className="min-h-screen text-slate-100 relative flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="glass-nav border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              M//B
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight leading-none block">
                MAKE<span className="text-rose-500">//</span>BREAK
              </span>
              <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider block mt-0.5">
                Tech Fest 2026
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#tracks" className="hover:text-white transition-colors">Tracks</a>
            <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
            <a href="#leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
            <a href="#helpline" className="hover:text-white transition-colors">Helpline</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button size="sm" variant="secondary" className="text-xs">
                Register School
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" variant="primary" className="text-xs">
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Official Inter-School College Tech Fest â¢ November 20, 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            MAKE IT WORK. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent">
              BREAK THE LIMITS.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            An adrenaline-fueled engineering showcase uniting school innovators. Compete in <strong>Robotics</strong>, build miraculous contraptions from <strong>Scrap</strong>, or celebrate delightfully absurdity in <strong>Useless Projects</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button size="lg" variant="gradient" className="gap-2 text-base">
                <span>Register Visiting School</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-base">
                Open Fest Dashboard
              </Button>
            </Link>
          </div>

          {/* Countdown Clock */}
          <div className="max-w-3xl mx-auto grid grid-cols-4 gap-3 sm:gap-6">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINUTES", value: timeLeft.minutes },
              { label: "SECONDS", value: timeLeft.seconds },
            ].map((item, idx) => (
              <GlassCard key={idx} className="p-4 sm:p-6 text-center border-white/10 bg-white/[0.04]">
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-indigo-300 tracking-wider mt-1 uppercase">
                  {item.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="py-16 sm:py-24 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-3">Official Arenas</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Three High-Stakes Tracks</h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm sm:text-base">
              Each visiting delegation fields dedicated student teams in one or more tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {tracks.map((track) => {
              const Icon = trackIcons[track.slug as keyof typeof trackIcons] || Bot;
              let glow: "blue" | "green" | "red" = "blue";
              let badgeColor = "track-blue";

              if (track.slug === "build-from-scrap") {
                glow = "green";
                badgeColor = "track-green";
              } else if (track.slug === "useless-projects") {
                glow = "red";
                badgeColor = "track-red";
              }

              return (
                <GlassCard
                  key={track.id}
                  glow={glow}
                  interactive
                  className="p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant={badgeColor as any}>{track.slug.replace("-", " ")}</Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{track.name}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {track.description}
                    </p>

                    <div className="rounded-xl bg-black/40 border border-white/10 p-4 mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Core Regulations
                      </h4>
                      <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {track.rules}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Teams Enrolled: {teams.filter((t) => t.track_id === track.id).length}</span>
                    <span className="text-emerald-400 font-semibold">Live Scored</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Public Leaderboard (Team & School Standings Only - Zero Student Names for Minor Privacy) */}
      <section id="leaderboard" className="py-16 sm:py-24 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="warning" className="mb-2">Official Results & Standings</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Live Track Leaderboard</h2>
              <p className="text-slate-400 text-sm mt-1">
                Displaying institutional team standings. {resultsPublished ? "?? Official results published!" : "Live telemetry updates."}
              </p>
            </div>
            <Link href="/leaderboard">
              <Button size="sm" variant="secondary" className="gap-1.5 self-start">
                <span>Full Leaderboard</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tracks.map((track) => {
              const trackTeams = teams
                .filter((t) => t.track_id === track.id)
                .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

              return (
                <GlassCard key={track.id} className="p-5 border-white/10">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <h3 className="font-bold text-white text-lg">{track.name}</h3>
                    <span className="text-xs text-indigo-400 font-semibold">{trackTeams.length} Teams</span>
                  </div>

                  <div className="space-y-3">
                    {trackTeams.slice(0, 3).map((team, idx) => {
                      const school = schools.find((s) => s.id === team.school_id);
                      return (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0",
                              idx === 0 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                              idx === 1 ? "bg-slate-400/20 text-slate-200 border border-slate-400/40" :
                              "bg-amber-800/20 text-amber-500 border border-amber-800/40"
                            )}>
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-white truncate">{team.name}</p>
                              <p className="text-xs text-slate-400 truncate">{school?.name || "Institution"}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="font-mono font-bold text-sm text-indigo-300">
                              {team.score_total ? team.score_total.toFixed(2) : "0.00"}
                            </span>
                            <span className="block text-[10px] text-slate-500 uppercase">Pts</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Helplines & Venue Desk */}
      <section id="helpline" className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Event Support & Helplines</h2>
            <p className="text-slate-400 text-sm mt-1">24/7 on-campus tech fest desk for visiting faculty and delegations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <GlassCard className="p-6 text-center border-white/10">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Registration Desk Hotline</h3>
              <p className="text-sm text-indigo-300 font-mono mt-1">+91 98765 00001</p>
              <p className="text-xs text-slate-400 mt-2">Central Quadrangle Booth 1</p>
            </GlassCard>

            <GlassCard className="p-6 text-center border-white/10">
              <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Campus Medical Emergency</h3>
              <p className="text-sm text-rose-300 font-mono mt-1">+91 98765 00099</p>
              <p className="text-xs text-slate-400 mt-2">Health Center Ground Floor</p>
            </GlassCard>

            <GlassCard className="p-6 text-center border-white/10">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Visiting Faculty Hospitality</h3>
              <p className="text-sm text-emerald-300 font-mono mt-1">+91 94471 23456</p>
              <p className="text-xs text-slate-400 mt-2">Academic Block Room 102</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-black/40 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MAKE//BREAK Inter-School Tech Fest. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Faculty Registration</Link>
            <Link href="/schedule" className="hover:text-white transition-colors">Schedule</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

