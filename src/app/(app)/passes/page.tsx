"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { IdPassCard, PassRole } from "@/components/passes/id-pass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Users,
  Search,
  Filter,
  Award,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Printer,
  Download,
} from "lucide-react";

export default function UniversalPassesCenter() {
  const {
    currentProfile,
    schools,
    students,
    tracks,
    volunteerDuties,
  } = useFestStore();

  const [selectedRole, setSelectedRole] = useState<PassRole | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample or active roster of people across all roles
  const judges = [
    {
      id: "jdg-01",
      role: "judge" as PassRole,
      name: "Dr. Evelyn Reed",
      badgeNumber: "JDG-EVR-01",
      title: "Chief Evaluation Jury • AI Track",
      organization: "Academic Advisory Board",
      accessLevel: "ALL-ACCESS • JURY ROOM • EVALUATION DESK",
      trackName: "Robotics & AI Arenas",
    },
    {
      id: "jdg-02",
      role: "judge" as PassRole,
      name: "Prof. Vikram Singhania",
      badgeNumber: "JDG-VKS-02",
      title: "Senior Jury Member • Hardware",
      organization: "Robotics Research Council",
      accessLevel: "ALL-ACCESS • JURY ROOM • SCORING ARENA",
      trackName: "Hardware & IoT",
    },
    {
      id: "jdg-03",
      role: "judge" as PassRole,
      name: "Dr. Ananya Roy",
      badgeNumber: "JDG-ANR-03",
      title: "Senior Jury Member • Software & Web",
      organization: "Tech Innovation Hub",
      accessLevel: "ALL-ACCESS • JURY ROOM • SCORING ARENA",
      trackName: "Web Craft & Coding",
    },
  ];

  const organizers = [
    {
      id: "org-01",
      role: "organizer" as PassRole,
      name: "Lead Fest Executive",
      badgeNumber: "EXEC-DIR-01",
      title: "Fest Director & Super Administrator",
      organization: "SPARK Core Executive Council",
      accessLevel: "FULL CAMPUS ACCESS • ALL AREAS • ADMIN HQ",
      trackName: "Campus Wide",
    },
    {
      id: "org-02",
      role: "organizer" as PassRole,
      name: "Prof. Sunita Menon",
      badgeNumber: "EXEC-REG-02",
      title: "Head of Institutional Registration",
      organization: "SPARK Core Executive Council",
      accessLevel: "ALL-ACCESS • REGISTRATION DESK • HQ",
      trackName: "Campus Wide",
    },
  ];

  const facultyMembers = schools.map((sch, i) => ({
    id: `fac-${sch.id}`,
    role: "faculty" as PassRole,
    name: sch.contact_email ? `Faculty Coordinator (${sch.city})` : "Visiting Faculty Lead",
    badgeNumber: `FAC-${sch.code}`,
    title: "Accompanying Visiting Faculty Lead",
    organization: sch.name,
    accessLevel: "DELEGATION ACCESS • VISITOR LOUNGE • CAMPUS ARENA",
    trackName: `Squad of ${students.filter((s) => s.school_id === sch.id).length} Students`,
  }));

  const volunteers = [
    {
      id: "vol-01",
      role: "volunteer" as PassRole,
      name: currentProfile.role === "volunteer" ? currentProfile.full_name : "Aryan Kulkarni",
      badgeNumber: "VOL-DK1-01",
      title: "Check-in Desk Crew & QR Marshall",
      organization: "SPARK Student Volunteer Taskforce",
      accessLevel: "REGISTRATION DESK • ARENA FLOOR • OPS CREW",
      trackName: "Main Entrance Desk",
    },
    {
      id: "vol-02",
      role: "volunteer" as PassRole,
      name: "Neha Joshi",
      badgeNumber: "VOL-TRK-02",
      title: "Track & Arena Marshall",
      organization: "SPARK Student Volunteer Taskforce",
      accessLevel: "ARENA FLOOR • OPS CREW • STAGE",
      trackName: "Robotics Arena Floor",
    },
  ];

  const studentBadges = students.slice(0, 15).map((stu) => {
    const sch = schools.find((s) => s.id === stu.school_id);
    const trk = tracks.find((t) => t.id === stu.track_id);
    return {
      id: `stu-${stu.id}`,
      role: "student" as PassRole,
      name: stu.name,
      badgeNumber: `STU-${(stu.id || "001").substring(0, 6).toUpperCase()}`,
      title: `Grade/Class: ${stu.class}`,
      organization: sch?.name || "Visiting Delegation",
      accessLevel: "PARTICIPANT • ARENA FLOOR • COMPETITION STATIONS",
      trackName: trk?.name || "Competition Track",
    };
  });

  // Combine all passes
  const allPasses = [
    ...organizers,
    ...judges,
    ...facultyMembers,
    ...volunteers,
    ...studentBadges,
  ];

  const [activePass, setActivePass] = useState(allPasses[0]);

  // Filter passes
  const filteredPasses = allPasses.filter((pass) => {
    const matchesRole = selectedRole === "all" || pass.role === selectedRole;
    const matchesSearch =
      pass.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFEB3B] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
              CENTRAL ACCREDITATION TERMINAL
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 border border-black">
              SPARK 2026
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black flex items-center gap-2.5">
            <QrCode className="w-8 h-8 text-black" />
            <span>Official Fest ID Pass &amp; Badge Terminal</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1 max-w-xl">
            Preview, generate, and print official tamper-proof accreditation badges for Visiting Faculty, Competition Judges, Operations Volunteers, Organizers, and Student Competitors.
          </p>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FFFBEB] border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <span className="text-xs font-black uppercase text-black mr-2">Filter Roles:</span>
        <button
          onClick={() => setSelectedRole("all")}
          className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
            selectedRole === "all" ? "bg-black text-white" : "bg-white hover:bg-slate-100"
          }`}
        >
          All Passes ({allPasses.length})
        </button>
        <button
          onClick={() => setSelectedRole("faculty")}
          className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
            selectedRole === "faculty" ? "bg-[#4CAF50] text-black" : "bg-white hover:bg-slate-100"
          }`}
        >
          Faculty Leads ({facultyMembers.length})
        </button>
        <button
          onClick={() => setSelectedRole("judge")}
          className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
            selectedRole === "judge" ? "bg-[#9C27B0] text-white" : "bg-white hover:bg-slate-100"
          }`}
        >
          Jury / Judges ({judges.length})
        </button>
        <button
          onClick={() => setSelectedRole("volunteer")}
          className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
            selectedRole === "volunteer" ? "bg-[#2196F3] text-black" : "bg-white hover:bg-slate-100"
          }`}
        >
          Volunteers ({volunteers.length})
        </button>
        <button
          onClick={() => setSelectedRole("organizer")}
          className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
            selectedRole === "organizer" ? "bg-black text-[#FFEB3B]" : "bg-white hover:bg-slate-100"
          }`}
        >
          Organizers ({organizers.length})
        </button>
        <button
          onClick={() => setSelectedRole("student")}
          className={`px-3 py-1 text-xs font-black border-2 border-black cursor-pointer ${
            selectedRole === "student" ? "bg-[#FF9800] text-black" : "bg-white hover:bg-slate-100"
          }`}
        >
          Students ({studentBadges.length})
        </button>
      </div>

      {/* Main Split Layout: Pass Directory + Live Badge Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pass Directory List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, institution, or badge ID..."
              className="w-full pl-9 pr-3 py-2 text-xs font-bold nb-input"
            />
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredPasses.length === 0 ? (
              <div className="p-8 text-center bg-white border-[3px] border-black">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-black text-black">No passes match your search.</p>
              </div>
            ) : (
              filteredPasses.map((p) => {
                const isSelected = activePass?.id === p.id;
                const roleBadgeColor =
                  p.role === "judge"
                    ? "bg-[#9C27B0] text-white"
                    : p.role === "faculty"
                    ? "bg-[#4CAF50] text-black"
                    : p.role === "volunteer"
                    ? "bg-[#2196F3] text-black"
                    : p.role === "student"
                    ? "bg-[#FF9800] text-black"
                    : "bg-black text-[#FFEB3B]";

                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePass(p)}
                    className={`w-full p-3.5 border-[3px] border-black text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000] -translate-x-0.5 -translate-y-0.5"
                        : "bg-white hover:bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 border border-black ${roleBadgeColor}`}>
                          {p.role}
                        </span>
                        <span className="font-mono text-xs font-black text-slate-800">{p.badgeNumber}</span>
                      </div>
                      <p className="font-black text-sm text-black">{p.name}</p>
                      <p className="text-[11px] font-bold text-slate-700 truncate max-w-sm">
                        {p.organization} • {p.trackName}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-black flex-shrink-0" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Live Badge Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-[#FFFBEB] border-[3px] border-black p-4 shadow-[6px_6px_0px_#000000] mb-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFEB3B] border border-black px-2 py-0.5 inline-block">
              LIVE ACCREDITATION PREVIEW
            </span>
            <p className="text-xs font-bold text-slate-700 mt-1">
              Showing official credential pass for <strong>{activePass.name}</strong>.
            </p>
          </div>

          {activePass && (
            <IdPassCard
              role={activePass.role}
              name={activePass.name}
              badgeNumber={activePass.badgeNumber}
              title={activePass.title}
              organization={activePass.organization}
              accessLevel={activePass.accessLevel}
              trackName={activePass.trackName}
            />
          )}
        </div>
      </div>
    </div>
  );
}
