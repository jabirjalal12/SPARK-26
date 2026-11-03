"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Bot,
  Wrench,
  Flame,
  Calendar,
  Trophy,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const { tracks, schedule } = useFestStore();

  // Target event date: Nov 20, 2026
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
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex flex-col">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-60 left-1/3 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[130px]" />
      </div>

      {/* Top Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-black text-xl text-white tracking-tight leading-none block">
                SPARK
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">
                Tech Fest 2026
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#tracks" className="hover:text-white transition-colors">Tracks</a>
            <a href="#rules" className="hover:text-white transition-colors">Rules</a>
            <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
            <a href="#helpline" className="hover:text-white transition-colors">Helpline</a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/join">
              <Button size="sm" variant="secondary" className="text-xs">
                Student Pass
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" variant="primary" className="text-xs">
                Enter App
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-16 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/15 backdrop-blur-md mb-8 animate-in fade-in duration-500">
          <span className="h-2 w-2 rounded-full bg-pink-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
            Inter-School College Tech Showdown
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          BUILD IT. BREAK IT.{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
            RE-ENGINEER IT.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Three brutal arenas. 50+ schools. One faculty mentor and student squads competing for technical glory, absurd contraptions, and total innovation.
        </p>

        {/* Live Countdown Timer */}
        <div className="mt-10 max-w-lg mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            Countdown to Fest Kickoff
          </p>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Mins", value: timeLeft.minutes },
              { label: "Secs", value: timeLeft.seconds },
            ].map((item) => (
              <GlassCard key={item.label} className="p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-4xl font-black text-white font-mono">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 mt-1">
                  {item.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/join">
            <Button size="lg" variant="primary" className="text-base px-8 shadow-xl shadow-purple-600/30">
              Student Join with School Code
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base px-7">
              Faculty School Registration
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-base px-5">
              Staff & Jury Login
            </Button>
          </Link>
        </div>

        {/* Quick event highlights bar */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Date</p>
              <p className="text-sm font-bold text-white">Nov 20, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Venue</p>
              <p className="text-sm font-bold text-white">St. Andrews Campus</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Cash Pool</p>
              <p className="text-sm font-bold text-white">₹1,50,000 + Trophies</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Format</p>
              <p className="text-sm font-bold text-white">1 Faculty + Squad</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKS SECTION */}
      <section id="tracks" className="px-4 sm:px-6 py-16 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-3">
            COMPETITION ARENAS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Three Distinct Tracks. Infinite Engineering.
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Each visiting school fields one team per track. Choose where your students will conquer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track) => {
            const Icon = trackIcons[track.slug as keyof typeof trackIcons] || Bot;
            const glowColor =
              track.slug === "robotics"
                ? "blue"
                : track.slug === "build-from-scrap"
                ? "green"
                : "red";

            return (
              <GlassCard
                key={track.id}
                glow={glowColor}
                interactive
                className="p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      style={{ backgroundColor: `${track.color}20`, borderColor: `${track.color}40`, color: track.color }}
                      className="p-3.5 rounded-2xl border flex items-center justify-center"
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <span
                      style={{ color: track.color, borderColor: `${track.color}40` }}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border bg-white/5"
                    >
                      {track.slug.replace("-", " ")}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tight">{track.name}</h3>
                  <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                    {track.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Key Directives
                    </p>
                    <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                      {track.rules?.split("\n").slice(0, 3).map((r, i) => (
                        <p key={i} className="truncate">
                          {r}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link href={`/dashboard`}>
                    <Button
                      variant="outline"
                      className="w-full text-xs font-bold uppercase tracking-wider"
                      style={{ borderColor: `${track.color}50` }}
                    >
                      <span>Explore Teams & Scores</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* SCHEDULE PREVIEW */}
      <section id="schedule" className="px-4 sm:px-6 py-16 bg-slate-900/40 border-y border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <Badge variant="info" className="mb-2">EVENT ITINERARY</Badge>
              <h2 className="text-3xl font-black text-white tracking-tight">Timeline & Arenas</h2>
            </div>
            <Link href="/schedule">
              <Button variant="secondary" size="sm">
                Full Interactive Schedule
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {schedule.slice(0, 5).map((item) => (
              <GlassCard key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                    {new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <Badge variant={item.type === "competition" ? "danger" : item.type === "ceremony" ? "warning" : "default"}>
                  {item.type}
                </Badge>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* HELPLINE & FOOTER */}
      <footer id="helpline" className="px-4 sm:px-6 py-14 max-w-7xl mx-auto w-full mt-auto">
        <GlassCard className="p-8 sm:p-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="warning" className="mb-2">COORDINATOR SUPPORT</Badge>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Traveling or Need Help on Arrival?
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md">
                Our volunteer team is stationed at transit points, campus gates, and tech blocks to guide all visiting teams and faculty coordinators.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Emergency Helpline</p>
                  <p className="text-sm font-bold text-white">+91 98765 43210</p>
                </div>
              </a>
              <a
                href="mailto:support@spark.tech"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Official Desk</p>
                  <p className="text-sm font-bold text-white">support@spark.tech</p>
                </div>
              </a>
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-6 border-t border-white/10">
          <p>© 2026 SPARK. St. Andrews College of Engineering & Technology.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white transition-colors">Admin Portal</Link>
            <Link href="/schedule" className="hover:text-white transition-colors">Schedule</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
