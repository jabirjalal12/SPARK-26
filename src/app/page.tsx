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

  const trackBgColors: Record<string, string> = {
    robotics: "bg-[#2196F3]",
    "build-from-scrap": "bg-[#4CAF50]",
    "useless-projects": "bg-[#FF5252]",
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-black relative flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="border-b-[3px] border-black bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div>
              <span className="font-black text-2xl text-black tracking-tight leading-none block">
                SPARK
              </span>
              <span className="text-[10px] text-black font-black uppercase tracking-widest block mt-0.5 bg-[#FFEB3B] px-1 border border-black">
                TECH FEST 2026
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-black">
            <a href="#tracks" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Tracks</a>
            <a href="#rules" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Rules</a>
            <a href="#leaderboard" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Leaderboard</a>
            <a href="#schedule" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Schedule</a>
            <a href="#helpline" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Helpline</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button size="sm" variant="secondary" className="text-xs">
                Register School
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" variant="primary" className="text-xs">
                <span>Enter App</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-16 pb-16 max-w-5xl mx-auto text-center">
        <div className="inline-block bg-[#FFEB3B] border-[3px] border-black px-4 py-1.5 shadow-[4px_4px_0px_#000000] mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-black">
            ⚡ INTER-SCHOOL COLLEGE TECH SHOWDOWN
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-black leading-[1.08] max-w-4xl mx-auto">
          BUILD IT. BREAK IT. <br />
          <span className="bg-[#FFEB3B] px-3 sm:px-4 border-[3px] border-black shadow-[6px_6px_0px_#000000] inline-block mt-2">
            IGNITE THE SPARK.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl font-bold text-black max-w-2xl mx-auto leading-relaxed bg-white border-[3px] border-black p-4 shadow-[5px_5px_0px_#000000]">
          Three brutal arenas: Robotics, Build from Scrap, and Useless Projects. Visiting schools field one faculty lead and student squads for technical glory.
        </p>

        {/* Live Countdown Timer */}
        <div className="mt-10 max-w-lg mx-auto">
          <div className="inline-block bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest mb-3 border-2 border-black shadow-[2px_2px_0px_#FFEB3B]">
            <Clock className="h-3.5 w-3.5 inline mr-1 text-[#FFEB3B]" />
            Countdown to Kickoff
          </div>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {[
              { label: "Days", value: timeLeft.days, color: "bg-[#FFEB3B]" },
              { label: "Hours", value: timeLeft.hours, color: "bg-[#2196F3]" },
              { label: "Mins", value: timeLeft.minutes, color: "bg-[#FF5252]" },
              { label: "Secs", value: timeLeft.seconds, color: "bg-[#4CAF50]" },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-3 sm:p-4 text-center border-[3px] border-black shadow-[4px_4px_0px_#000000] ${item.color} text-black`}
              >
                <div className="text-3xl sm:text-5xl font-black font-mono">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[11px] sm:text-xs uppercase font-black tracking-wider mt-1 border-t-2 border-black pt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" variant="yellow" className="text-base px-8">
              Faculty School Registration
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="primary" className="text-base px-7">
              Staff & Faculty Login
            </Button>
          </Link>
          <Link href="/join">
            <Button size="lg" variant="secondary" className="text-base px-6">
              Student Information
            </Button>
          </Link>
        </div>

        {/* Event highlights bar */}
        <div className="mt-14 pt-8 border-t-[3px] border-black grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-white border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center gap-3">
            <div className="p-2 bg-[#2196F3] border-2 border-black text-black">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-700 font-bold uppercase">Date</p>
              <p className="text-sm font-black text-black">Nov 20, 2026</p>
            </div>
          </div>
          <div className="p-3 bg-white border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center gap-3">
            <div className="p-2 bg-[#FFEB3B] border-2 border-black text-black">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-700 font-bold uppercase">Venue</p>
              <p className="text-sm font-black text-black">Central Quad</p>
            </div>
          </div>
          <div className="p-3 bg-white border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center gap-3">
            <div className="p-2 bg-[#4CAF50] border-2 border-black text-black">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-700 font-bold uppercase">Prize Pool</p>
              <p className="text-sm font-black text-black">₹1,50,000</p>
            </div>
          </div>
          <div className="p-3 bg-white border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center gap-3">
            <div className="p-2 bg-[#FF5252] border-2 border-black text-black">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-700 font-bold uppercase">Format</p>
              <p className="text-sm font-black text-black">1 Faculty + Squad</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKS SECTION */}
      <section id="tracks" className="px-4 sm:px-6 py-16 max-w-7xl mx-auto w-full border-t-[3px] border-black">
        <div className="text-center mb-12">
          <div className="inline-block bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest border-2 border-black mb-3">
            COMPETITION ARENAS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
            Three Distinct Tracks. Infinite Engineering.
          </h2>
          <p className="text-slate-900 font-bold max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Each visiting school fields one team per track. Choose where your students will conquer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track) => {
            const Icon = trackIcons[track.slug as keyof typeof trackIcons] || Bot;
            const cardBg = trackBgColors[track.slug] || "bg-white";

            return (
              <div
                key={track.id}
                className="p-6 sm:p-8 flex flex-col justify-between border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000000] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 border-[3px] border-black text-black shadow-[3px_3px_0px_#000000] ${cardBg}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000000]">
                      {track.slug.replace("-", " ")}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-black tracking-tight">{track.name}</h3>
                  <p className="text-slate-900 text-sm font-medium mt-3 leading-relaxed">
                    {track.description}
                  </p>

                  <div className="mt-6 pt-4 border-t-2 border-black">
                    <p className="text-xs font-black uppercase tracking-wider text-black mb-2">
                      Key Regulations
                    </p>
                    <div className="space-y-1.5 text-xs text-slate-900 font-mono">
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
                      variant="secondary"
                      className="w-full text-xs font-black uppercase tracking-wider"
                    >
                      <span>Explore Teams & Scores</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Public Leaderboard (Team & School Standings Only - Zero Student Names for Minor Privacy) */}
      <section id="leaderboard" className="py-16 sm:py-24 border-t-[3px] border-black bg-[#FFFBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-block bg-[#FFEB3B] border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] mb-2">
                Official Standings
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-black">Live Track Leaderboard</h2>
              <p className="text-slate-800 font-bold text-sm mt-1">
                Displaying institutional team standings. {resultsPublished ? "Official results published!" : "Live telemetry updates."}
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
                <div key={track.id} className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
                  <div className="flex items-center justify-between pb-4 border-b-2 border-black mb-4">
                    <h3 className="font-black text-black text-lg">{track.name}</h3>
                    <span className="text-xs font-black bg-[#FFEB3B] border border-black px-2 py-0.5 text-black">
                      {trackTeams.length} Teams
                    </span>
                  </div>

                  <div className="space-y-3">
                    {trackTeams.slice(0, 3).map((team, idx) => {
                      const school = schools.find((s) => s.id === team.school_id);
                      return (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={cn(
                              "w-7 h-7 border-2 border-black flex items-center justify-center font-black text-xs flex-shrink-0",
                              idx === 0 ? "bg-[#FFEB3B] text-black shadow-[1px_1px_0px_#000]" :
                              idx === 1 ? "bg-[#2196F3] text-black shadow-[1px_1px_0px_#000]" :
                              "bg-[#FF9800] text-black shadow-[1px_1px_0px_#000]"
                            )}>
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-black text-sm text-black truncate">{team.name}</p>
                              <p className="text-xs font-bold text-slate-700 truncate">{school?.name || "Institution"}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="font-mono font-black text-sm text-black">
                              {team.score_total ? team.score_total.toFixed(2) : "0.00"}
                            </span>
                            <span className="block text-[10px] text-black font-black uppercase">Pts</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCHEDULE PREVIEW */}
      <section id="schedule" className="px-4 sm:px-6 py-16 bg-white border-t-[3px] border-black">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-block bg-[#2196F3] text-black px-3 py-1 font-black text-xs uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_#000000] mb-2">
                EVENT ITINERARY
              </div>
              <h2 className="text-3xl font-black text-black tracking-tight">Timeline & Arenas</h2>
            </div>
            <Link href="/schedule">
              <Button variant="secondary" size="sm">
                Full Interactive Schedule
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3.5">
            {schedule.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 border-[3px] border-black bg-[#FFFBEB] shadow-[4px_4px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-black text-black bg-[#FFEB3B] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000000]">
                    {new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-black">{item.title}</h4>
                    <p className="text-xs text-slate-800 font-bold mt-0.5">{item.description}</p>
                  </div>
                </div>
                <Badge variant={item.type === "competition" ? "danger" : item.type === "ceremony" ? "warning" : "default"}>
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Helplines & Venue Desk */}
      <section id="helpline" className="py-16 border-t-[3px] border-black bg-[#FFFBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-block bg-[#FF5252] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] mb-2">
              Assistance Desk
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black">Event Support & Helplines</h2>
            <p className="text-slate-800 font-bold text-sm mt-1">24/7 on-campus tech fest desk for visiting faculty and delegations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 text-center border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="w-12 h-12 border-2 border-black bg-[#2196F3] text-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-black text-black text-base">Registration Desk Hotline</h3>
              <p className="text-sm text-black font-mono font-black mt-1">+91 98765 00001</p>
              <p className="text-xs text-slate-700 font-bold mt-2">Central Quadrangle Booth 1</p>
            </div>

            <div className="p-6 text-center border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="w-12 h-12 border-2 border-black bg-[#FF5252] text-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-black text-base">Campus Medical Emergency</h3>
              <p className="text-sm text-black font-mono font-black mt-1">+91 98765 00099</p>
              <p className="text-xs text-slate-700 font-bold mt-2">Health Center Ground Floor</p>
            </div>

            <div className="p-6 text-center border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="w-12 h-12 border-2 border-black bg-[#4CAF50] text-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-black text-base">Visiting Faculty Hospitality</h3>
              <p className="text-sm text-black font-mono font-black mt-1">+91 94471 23456</p>
              <p className="text-xs text-slate-700 font-bold mt-2">Academic Block Room 102</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-black py-10 bg-white text-center text-xs text-slate-800 font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SPARK Inter-School College Tech Fest. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Staff Login</Link>
            <Link href="/register" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Faculty Registration</Link>
            <Link href="/schedule" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Schedule</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}