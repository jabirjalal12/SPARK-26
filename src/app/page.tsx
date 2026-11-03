"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
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
  Zap,
  Flame,
  Award,
  Lock,
  Cpu,
  Layers,
  HelpCircle,
  Eye,
  Hammer,
} from "lucide-react";

export default function LandingPage() {
  const { tracks = [], schedule = [], venues = [], teams = [], schools = [], resultsPublished } = useFestStore();

  // Program starts 5/11/2026 at 7:00 AM local time
  const targetDate = new Date("2026-11-05T07:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [activeScheduleFilter, setActiveScheduleFilter] = useState<string>("all");

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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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

  const filteredSchedule = schedule.filter((item) => {
    if (activeScheduleFilter === "all") return true;
    if (activeScheduleFilter === "ceremony") return item.type === "ceremony" || item.type === "break";
    return item.track_id === activeScheduleFilter;
  });

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-black relative flex flex-col font-sans selection:bg-[#FFEB3B] selection:text-black">
      {/* Top Neubrutalist Announcement Bar */}
      <div className="bg-[#FFEB3B] border-b-[3px] border-black px-4 py-2 text-center text-xs sm:text-sm font-black text-black flex items-center justify-center gap-2">
        <span className="bg-black text-[#FFEB3B] px-2 py-0.5 text-[11px] font-black uppercase tracking-wider">
          OFFICIAL DATE
        </span>
        <span>
          SPARK 2026 Kicks Off on <strong className="underline decoration-2">05 November 2026 at 07:00 AM</strong> — Central Quadrangle
        </span>
      </div>

      {/* Top Navbar */}
      <nav className="border-b-[3px] border-black bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <div>
              <span className="font-black text-2xl sm:text-3xl text-black tracking-tight leading-none block">
                SPARK
              </span>
              <span className="text-[10px] text-black font-black uppercase tracking-widest block mt-0.5 bg-[#FFEB3B] px-1 border border-black shadow-[1px_1px_0px_#000000]">
                TECH FEST 2026
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-5 text-sm font-black text-black">
            <a href="#about" className="hover:bg-[#FFEB3B] px-2.5 py-1 border-2 border-transparent hover:border-black transition-all">About SPARK</a>
            <a href="#tracks" className="hover:bg-[#FFEB3B] px-2.5 py-1 border-2 border-transparent hover:border-black transition-all">Arenas</a>
            <a href="#schedule" className="hover:bg-[#FFEB3B] px-2.5 py-1 border-2 border-transparent hover:border-black transition-all">Schedules</a>
            <a href="#leaderboard" className="hover:bg-[#FFEB3B] px-2.5 py-1 border-2 border-transparent hover:border-black transition-all">Standings</a>
            <a href="#helpline" className="hover:bg-[#FFEB3B] px-2.5 py-1 border-2 border-transparent hover:border-black transition-all">Helpline</a>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/register">
              <Button size="sm" variant="secondary" className="text-xs font-black uppercase tracking-wider">
                Register School
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" variant="yellow" className="text-xs font-black uppercase tracking-wider">
                <span>Enter App</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#FFEB3B] border-[3px] border-black px-4 py-1.5 shadow-[4px_4px_0px_#000000] mb-6">
          <Zap className="h-4 w-4 text-black fill-black" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-black">
            PREMIER INTER-SCHOOL COLLEGE ENGINEERING SHOWDOWN
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-black leading-[1.05] max-w-4xl mx-auto">
          BUILD IT. BREAK IT. <br />
          <span className="bg-[#FFEB3B] px-3 sm:px-5 border-[4px] border-black shadow-[8px_8px_0px_#000000] inline-block mt-2">
            IGNITE THE SPARK.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl font-bold text-black max-w-2xl mx-auto leading-relaxed bg-white border-[3px] border-black p-4 sm:p-5 shadow-[6px_6px_0px_#000000]">
          Three relentless competitive tracks: <strong className="underline decoration-[#2196F3] decoration-2">Robotics Arena</strong>, <strong className="underline decoration-[#4CAF50] decoration-2">Build from Scrap</strong>, and <strong className="underline decoration-[#FF5252] decoration-2">Useless Projects</strong>. Visiting schools field one accredited faculty coordinator and student squads for collegiate engineering glory.
        </p>

        {/* Live Countdown Timer to 5/11/2026 7:00 AM */}
        <div className="mt-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-black text-[#FFEB3B] px-4 py-1.5 font-black text-xs sm:text-sm uppercase tracking-widest mb-3 border-2 border-black shadow-[3px_3px_0px_#000000]">
            <Clock className="h-4 w-4 text-[#FFEB3B]" />
            COUNTDOWN TO KICKOFF: 05 NOV 2026 • 07:00 AM
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {[
              { label: "Days", value: timeLeft.days, color: "bg-[#FFEB3B]" },
              { label: "Hours", value: timeLeft.hours, color: "bg-[#2196F3]" },
              { label: "Minutes", value: timeLeft.minutes, color: "bg-[#FF5252]" },
              { label: "Seconds", value: timeLeft.seconds, color: "bg-[#4CAF50]" },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-3 sm:p-5 text-center border-[3px] border-black shadow-[5px_5px_0px_#000000] ${item.color} text-black`}
              >
                <div className="text-3xl sm:text-6xl font-black font-mono leading-none">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[11px] sm:text-xs uppercase font-black tracking-wider mt-2 border-t-2 border-black pt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" variant="yellow" className="text-base px-8 font-black uppercase tracking-wider">
              Faculty Registration Portal
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <a href="#about">
            <Button size="lg" variant="secondary" className="text-base px-7 font-black uppercase tracking-wider">
              About The Program
            </Button>
          </a>
          <a href="#schedule">
            <Button size="lg" variant="primary" className="text-base px-7 font-black uppercase tracking-wider">
              View Schedules (07:00 AM)
            </Button>
          </a>
        </div>

        {/* Highlights banner */}
        <div className="mt-14 pt-8 border-t-[3px] border-black grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center gap-3">
            <div className="p-2.5 bg-[#FFEB3B] border-2 border-black text-black">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-wider">Event Date</p>
              <p className="text-sm font-black text-black">05 Nov 2026</p>
            </div>
          </div>

          <div className="p-3.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center gap-3">
            <div className="p-2.5 bg-[#2196F3] border-2 border-black text-black">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-wider">Start Time</p>
              <p className="text-sm font-black text-black">07:00 AM Sharp</p>
            </div>
          </div>

          <div className="p-3.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center gap-3">
            <div className="p-2.5 bg-[#4CAF50] border-2 border-black text-black">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-wider">Prize Purse</p>
              <p className="text-sm font-black text-black">₹75,000+ Cash</p>
            </div>
          </div>

          <div className="p-3.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center gap-3">
            <div className="p-2.5 bg-[#FF5252] border-2 border-black text-black">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-wider">Format</p>
              <p className="text-sm font-black text-black">1 Faculty + Squad</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: ABOUT THE SPARK PROGRAM (DETAILED, HIGH-IMPACT NEUBRUTALISM)    */}
      {/* ========================================================================= */}
      <section id="about" className="px-4 sm:px-6 py-20 bg-white border-t-[3px] border-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block bg-[#FFEB3B] text-black px-4 py-1.5 font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000000] mb-4">
              ABOUT THE FESTIVAL
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tight leading-tight">
              What is the SPARK Program?
            </h2>
            <p className="mt-4 text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
              SPARK is our premier annual inter-school college tech festival created to move beyond traditional classroom theory and unleash hands-on, high-voltage engineering.
            </p>
          </div>

          {/* Main Story Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            {/* Story Card Left */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-[#FFFBEB] border-[3px] border-black shadow-[8px_8px_0px_#000000] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#FF5252] border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center font-black text-black">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-black bg-[#FFEB3B] px-2 py-0.5 border border-black">
                      FOUNDATIONAL MISSION
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-black mt-1">
                      Pure Engineering. Zero Paperwork.
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                  <p>
                    For years, science exhibitions rewarded foam-board poster boards and canned presentations. <strong>SPARK was built to break that mold.</strong>
                  </p>
                  <p>
                    Hosted across our sprawling engineering campus, visiting high schools field their sharpest student tinkerers under the guidance of <strong>one designated faculty coordinator</strong>. Over the course of a single action-packed day starting at <strong>07:00 AM on 5/11/2026</strong>, teams will program, fabricate, solder, stress-test, and deploy functional hardware machines in front of a live arena crowd.
                  </p>
                  <p>
                    Whether it is engineering an obstacle-clearing autonomous chassis in the <em>Robotics Arena</em>, transforming industrial scrap into functional machinery in <em>Build from Scrap</em>, or writing intricate embedded logic for absurd comedy contraptions in <em>Useless Projects</em> — SPARK celebrates the raw thrill of making things work.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap items-center gap-3">
                <span className="bg-[#4CAF50] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                  ✓ 100% Tangible Working Prototypes
                </span>
                <span className="bg-[#2196F3] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                  ✓ Live Telemetry Scoring
                </span>
                <span className="bg-[#FFEB3B] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                  ✓ Institutional Rolling Trophy
                </span>
              </div>
            </div>

            {/* Delegation & Minor Privacy Feature Card Right */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#2196F3] border-[3px] border-black shadow-[8px_8px_0px_#000000] text-black flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center font-black text-black mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase bg-[#FFEB3B] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
                  THE DELEGATION PROTOCOL
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black mt-2 leading-tight">
                  1 Faculty Lead + Privacy-First Squads
                </h3>

                <div className="mt-5 space-y-3.5 text-sm font-bold text-black leading-relaxed">
                  <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                    <p className="font-black text-xs uppercase text-black">NO STUDENT PHONES OR ACCOUNTS</p>
                    <p className="text-xs text-slate-800 font-medium mt-1">
                      Students are minors and never need to register accounts, share phone numbers, or download apps. Their records are held securely by their faculty advisor.
                    </p>
                  </div>

                  <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                    <p className="font-black text-xs uppercase text-black">ONE MASTER QR PASS PER SCHOOL</p>
                    <p className="text-xs text-slate-800 font-medium mt-1">
                      Faculty leads receive a single cryptographically signed Master QR Ticket. Arriving at the desk, scanning it checks in their entire delegation in under 30 seconds.
                    </p>
                  </div>

                  <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000000]">
                    <p className="font-black text-xs uppercase text-black">FACULTY HOSPITALITY SUITE</p>
                    <p className="text-xs text-slate-800 font-medium mt-1">
                      Visiting educators receive reserved faculty lounge access, travel honorarium desks, and real-time alerts on their student teams’ status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black">
                <Link href="/register">
                  <Button variant="primary" className="w-full text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000]">
                    Register Your School Delegation
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 3 Pillars of SPARK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
              <div className="w-10 h-10 bg-[#FFEB3B] border-2 border-black flex items-center justify-center font-black text-black shadow-[2px_2px_0px_#000000] mb-4">
                1
              </div>
              <h4 className="text-xl font-black text-black">Rigorous Scrutiny & Safety</h4>
              <p className="text-sm font-medium text-slate-800 mt-2 leading-relaxed">
                Every machine undergoes electrical scrutiny (voltage limits, kill switches, weight classes) and scrap bay PPE checks before any competition run.
              </p>
            </div>

            <div className="p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
              <div className="w-10 h-10 bg-[#4CAF50] border-2 border-black flex items-center justify-center font-black text-black shadow-[2px_2px_0px_#000000] mb-4">
                2
              </div>
              <h4 className="text-xl font-black text-black">Transparent Weighted Scoring</h4>
              <p className="text-sm font-medium text-slate-800 mt-2 leading-relaxed">
                Official criteria weights are published in advance. Event Coordinators log rubric scores digitally with automatic tie-break algorithms and tamper-proof lockouts.
              </p>
            </div>

            <div className="p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
              <div className="w-10 h-10 bg-[#FF5252] border-2 border-black flex items-center justify-center font-black text-black shadow-[2px_2px_0px_#000000] mb-4">
                3
              </div>
              <h4 className="text-xl font-black text-black">Industry & College Mentors</h4>
              <p className="text-sm font-medium text-slate-800 mt-2 leading-relaxed">
                Jury panels consist of collegiate engineering faculty, robotics researchers, and creative fabrication experts who provide constructive feedback to participants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: FULL SCHEDULES (STARTS 5/11/2026 07:00 AM)                       */}
      {/* ========================================================================= */}
      <section id="schedule" className="px-4 sm:px-6 py-20 bg-[#FFFBEB] border-t-[3px] border-black">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FF5252] text-black px-3.5 py-1 font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000000] mb-3">
                <Clock className="w-3.5 h-3.5 text-black" />
                TIMELINE: 05 NOVEMBER 2026 • 07:00 AM ONWARD
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight leading-tight">
                Official Event Schedules
              </h2>
              <p className="text-slate-800 font-bold max-w-2xl mt-2 text-sm sm:text-base">
                Timed competition phases across campus arenas. Registration desk opens 05/11/2026 at 07:00 AM sharp; competitions run continuously until the 04:30 PM Grand Valedictory.
              </p>
            </div>

            <Link href="/schedule">
              <Button variant="yellow" size="md" className="text-xs uppercase font-black tracking-wider shadow-[4px_4px_0px_#000000]">
                <span>Full Screen Interactive View</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Interactive Track / Arena Filters */}
          <div className="flex flex-wrap items-center gap-2.5 p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000] mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-black mr-2 hidden sm:inline">
              Filter Itinerary:
            </span>
            <button
              onClick={() => setActiveScheduleFilter("all")}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                activeScheduleFilter === "all"
                  ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                  : "bg-white text-black hover:bg-[#FFFBEB]"
              }`}
            >
              All Events ({schedule.length})
            </button>
            <button
              onClick={() => setActiveScheduleFilter("ceremony")}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                activeScheduleFilter === "ceremony"
                  ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                  : "bg-white text-black hover:bg-[#FFFBEB]"
              }`}
            >
              Ceremonies & Food
            </button>
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setActiveScheduleFilter(track.id)}
                className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                  activeScheduleFilter === track.id
                    ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                    : "bg-white text-black hover:bg-[#FFFBEB]"
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="space-y-4">
            {filteredSchedule.length === 0 ? (
              <div className="p-8 sm:p-12 border-[3px] border-dashed border-black bg-white shadow-[6px_6px_0px_#000000] text-center space-y-3">
                <div className="w-12 h-12 bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-black text-black">Official Itinerary in Preparation</h3>
                <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-md mx-auto">
                  Event slots, arena heats, and safety scrutiny rounds starting 05 November 2026 at 07:00 AM are currently being configured by Event Coordinators in the Organizer Window.
                </p>
                <div className="pt-2">
                  <Link href="/register">
                    <Button variant="yellow" size="sm" className="text-xs uppercase font-black tracking-wider shadow-[3px_3px_0px_#000000]">
                      Register Visiting Delegation
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              filteredSchedule.map((item, index) => {
                const venue = (venues || []).find((v) => v.id === item.venue_id);
                const venueName = venue ? `${venue.name} (${venue.location})` : (item.venue_id || "Campus Venue");
                const startTime = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const endTime = new Date(item.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                let typeColor = "bg-[#4CAF50]";
                if (item.type === "competition") typeColor = "bg-[#FF5252]";
                if (item.type === "ceremony") typeColor = "bg-[#FFEB3B]";
                if (item.type === "judging") typeColor = "bg-[#2196F3]";

                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#000000] transition-all"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Time block */}
                      <div className="flex-shrink-0 text-center min-w-[110px]">
                        <div className="p-2 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000000]">
                          <span className="font-mono font-black text-sm text-black block leading-none">
                            {startTime}
                          </span>
                          <span className="text-[10px] font-black uppercase text-slate-600 block mt-1">
                            to {endTime}
                          </span>
                        </div>
                        <span className={`inline-block mt-2 px-2 py-0.5 border border-black text-[10px] font-black uppercase ${typeColor} text-black`}>
                          {item.type}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs text-black bg-[#FFEB3B] px-1.5 border border-black">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-black text-lg sm:text-xl text-black leading-tight">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-black">
                          <span className="flex items-center gap-1.5 bg-[#FFFBEB] border border-black px-2.5 py-1">
                            <MapPin className="w-3.5 h-3.5 text-black" />
                            {venueName}
                          </span>

                          {item.track_id && (
                            <span className="bg-[#2196F3] text-black border border-black px-2 py-1 font-black text-[11px] uppercase">
                              {tracks.find((t) => t.id === item.track_id)?.name || "Competition Track"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-end md:self-center">
                      <span className="px-3 py-1.5 border-2 border-black bg-[#FFFBEB] text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                        05 NOV 2026
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: COMPETITION ARENAS (TRACKS)                                      */}
      {/* ========================================================================= */}
      <section id="tracks" className="px-4 sm:px-6 py-20 max-w-7xl mx-auto w-full border-t-[3px] border-black bg-white">
        <div className="text-center mb-14">
          <div className="inline-block bg-black text-[#FFEB3B] px-3.5 py-1 font-black text-xs uppercase tracking-widest border-2 border-black mb-3">
            COMPETITION ARENAS
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tight">
            Three Distinct Tracks. Infinite Engineering.
          </h2>
          <p className="text-slate-900 font-bold max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Each visiting school fields one squad per track. Select your arena and build to dominate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track) => {
            const Icon = trackIcons[track.slug as keyof typeof trackIcons] || Bot;
            const cardBg = trackBgColors[track.slug] || "bg-white";

            return (
              <div
                key={track.id}
                className="p-6 sm:p-8 flex flex-col justify-between border-[3px] border-black bg-[#FFFBEB] shadow-[8px_8px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#000000] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3.5 border-[3px] border-black text-black shadow-[3px_3px_0px_#000000] ${cardBg}`}>
                      <Icon className="h-8 w-8 text-black" />
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
                    <p className="text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Official Track Rules
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
                      className="w-full text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000]"
                    >
                      <span>Explore Teams & Rubrics</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: LIVE STANDINGS & LEADERBOARDS                                    */}
      {/* ========================================================================= */}
      <section id="leaderboard" className="py-20 border-t-[3px] border-black bg-[#FFFBEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-block bg-[#FFEB3B] border-2 border-black px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] mb-2">
                OFFICIAL INSTITUTIONAL STANDINGS
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-black">Live Track Leaderboard</h2>
              <p className="text-slate-800 font-bold text-sm mt-1">
                Displaying institutional team standings. {resultsPublished ? "Official results published by Super Admin!" : "Live telemetry updates during rounds."}
              </p>
            </div>
            <Link href="/leaderboard">
              <Button size="sm" variant="yellow" className="gap-1.5 self-start font-black uppercase text-xs shadow-[3px_3px_0px_#000000]">
                <span>Full Leaderboard Standings</span>
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
                    {trackTeams.length === 0 ? (
                      <div className="p-4 border-2 border-dashed border-black bg-[#FFFBEB] text-center">
                        <p className="text-xs font-bold text-slate-700">Awaiting registrations & team check-ins</p>
                      </div>
                    ) : (
                      trackTeams.slice(0, 3).map((team, idx) => {
                      const school = schools.find((s) => s.id === team.school_id);
                      return (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-3 border-2 border-black bg-[#FFFBEB] shadow-[3px_3px_0px_#000000]"
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
                    }))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: HELPLINES & ON-CAMPUS SUPPORT                                    */}
      {/* ========================================================================= */}
      <section id="helpline" className="py-20 border-t-[3px] border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#FF5252] text-black border-2 border-black px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] mb-2">
              HELP DESK & CONTROL ROOM
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-black">Event Support & Helplines</h2>
            <p className="text-slate-800 font-bold text-sm sm:text-base mt-2">
              On-campus rapid assistance for visiting faculty leads, volunteers, and participants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 text-center border-[3px] border-black bg-[#FFFBEB] shadow-[6px_6px_0px_#000000]">
              <div className="w-12 h-12 border-2 border-black bg-[#2196F3] text-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-black text-black text-base">Registration Desk Hotline</h3>
              <p className="text-base text-black font-mono font-black mt-1">+91 98765 00001</p>
              <p className="text-xs text-slate-700 font-bold mt-2">Central Quadrangle Booth 1</p>
            </div>

            <div className="p-6 text-center border-[3px] border-black bg-[#FFFBEB] shadow-[6px_6px_0px_#000000]">
              <div className="w-12 h-12 border-2 border-black bg-[#FF5252] text-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-black text-base">Campus Medical Emergency</h3>
              <p className="text-base text-black font-mono font-black mt-1">+91 98765 00099</p>
              <p className="text-xs text-slate-700 font-bold mt-2">Health Center Ground Floor</p>
            </div>

            <div className="p-6 text-center border-[3px] border-black bg-[#FFFBEB] shadow-[6px_6px_0px_#000000]">
              <div className="w-12 h-12 border-2 border-black bg-[#4CAF50] text-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-black text-base">Faculty Hospitality Lounge</h3>
              <p className="text-base text-black font-mono font-black mt-1">+91 94471 23456</p>
              <p className="text-xs text-slate-700 font-bold mt-2">Academic Block Room 102</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-black py-12 bg-white text-xs text-slate-900 font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black">
              ⚡
            </div>
            <p>© 2026 SPARK Inter-School College Tech Fest. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-black uppercase">
            <a href="#about" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">About</a>
            <a href="#schedule" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Schedules</a>
            <Link href="/login" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Staff Login</Link>
            <Link href="/register" className="hover:bg-[#FFEB3B] px-2 py-1 border border-transparent hover:border-black transition-all">Faculty Registration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
