"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { IdPassCard, PassRole } from "@/components/passes/id-pass-card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
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
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Bot,
  User,
  ExternalLink,
} from "lucide-react";

export interface IssuedPass {
  id: string;
  role: PassRole;
  name: string;
  badgeNumber: string;
  title: string;
  organization: string;
  accessLevel: string;
  trackName: string;
  tableNumber?: string;
  phone?: string;
  isCustom?: boolean;
  createdAt: string;
}

export default function UniversalPassesCenter() {
  const {
    currentProfile,
    schools,
    students,
    tracks,
    isSuperAdmin,
  } = useFestStore();

  const [selectedRole, setSelectedRole] = useState<PassRole | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [customPasses, setCustomPasses] = useState<IssuedPass[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load custom passes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spark_custom_issued_passes");
      if (saved) {
        setCustomPasses(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to read custom passes from storage", e);
    }
  }, []);

  // Check URL query parameters for ?create=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "true") {
        setCreateModalOpen(true);
      }
    }
  }, []);

  // Base roster of core staff and personnel
  const baseStaffPasses: IssuedPass[] = useMemo(() => [
    {
      id: "org-01",
      role: "organizer",
      name: "Super Administrator",
      badgeNumber: "EXEC-DIR-01",
      title: "Fest Director • Supreme Executive Council",
      organization: "SPARK Core Executive Council",
      accessLevel: "FULL CAMPUS ACCESS • ALL AREAS • ADMIN HQ",
      trackName: "Campus Wide HQ",
      createdAt: "2026-11-01T09:00:00Z",
    },
    {
      id: "coord-01",
      role: "event_coordinator",
      name: "Dr. Evelyn Reed (Chief Coordinator)",
      badgeNumber: "COORD-OPS-01",
      title: "Event Operations Coordinator",
      organization: "SPARK Core Executive Council",
      accessLevel: "FULL CAMPUS ACCESS • ALL ARENAS • STAGE • HQ",
      trackName: "All 8 Arena Tracks",
      createdAt: "2026-11-01T09:00:00Z",
    },
    {
      id: "reg-01",
      role: "registration_head",
      name: "Prof. Sunita Menon",
      badgeNumber: "REG-HEAD-01",
      title: "Head of Institutional Registration Desk",
      organization: "SPARK Core Executive Council",
      accessLevel: "REGISTRATION DESK • ALL ACCESS • ADMIN HQ",
      trackName: "Central Quadrangle Desk",
      createdAt: "2026-11-01T09:00:00Z",
    },
    {
      id: "jdg-01",
      role: "judge",
      name: "Prof. Vikram Singhania",
      badgeNumber: "JDG-VKS-01",
      title: "Chief Evaluation Jury • Robotics Track",
      organization: "National Robotics Council",
      accessLevel: "ALL-ACCESS • JURY ROOM • EVALUATION DESK",
      trackName: "Robotics Arena",
      createdAt: "2026-11-01T09:00:00Z",
    },
    {
      id: "jdg-02",
      role: "judge",
      name: "Dr. Ananya Roy",
      badgeNumber: "JDG-ANR-02",
      title: "Senior Jury Member • Ideathon",
      organization: "Technology Innovation Foundation",
      accessLevel: "ALL-ACCESS • JURY ROOM • SCORING ARENA",
      trackName: "Ideathon Hall",
      createdAt: "2026-11-01T09:00:00Z",
    },
    {
      id: "vol-01",
      role: "volunteer",
      name: "Aryan Kulkarni",
      badgeNumber: "VOL-DK1-01",
      title: "Fast Scanner Marshall",
      organization: "SPARK Student Volunteer Taskforce",
      accessLevel: "REGISTRATION DESK • ARENA FLOOR • OPS CREW",
      trackName: "Main Entrance Gate 1",
      createdAt: "2026-11-01T09:00:00Z",
    },
    {
      id: "vol-02",
      role: "volunteer",
      name: "Neha Joshi",
      badgeNumber: "VOL-TRK-02",
      title: "Arena Floor Marshall",
      organization: "SPARK Student Volunteer Taskforce",
      accessLevel: "ARENA FLOOR • OPS CREW • STAGE",
      trackName: "Robotics Arena Floor",
      createdAt: "2026-11-01T09:00:00Z",
    },
  ], []);

  // Dynamic faculty passes from approved schools
  const facultyPasses: IssuedPass[] = useMemo(() => {
    return schools.map((sch) => ({
      id: `fac-${sch.id}`,
      role: "faculty",
      name: sch.contact_email ? `Visiting Faculty (${sch.name})` : "Visiting Faculty Lead",
      badgeNumber: `FAC-${sch.code || "SCH"}`,
      title: "Accompanying Visiting Faculty Lead",
      organization: sch.name,
      accessLevel: "DELEGATION ACCESS • VISITOR LOUNGE • CAMPUS ARENA",
      trackName: `Squad of ${students.filter((s) => s.school_id === sch.id).length} Students`,
      createdAt: sch.created_at || "2026-11-01T09:00:00Z",
    }));
  }, [schools, students]);

  // Dynamic student passes
  const studentPasses: IssuedPass[] = useMemo(() => {
    return students.slice(0, 20).map((stu) => {
      const sch = schools.find((s) => s.id === stu.school_id);
      const trk = tracks.find((t) => t.id === stu.track_id);
      return {
        id: `stu-${stu.id}`,
        role: "student",
        name: stu.name,
        badgeNumber: `STU-${(stu.id || "001").substring(0, 6).toUpperCase()}`,
        title: `Grade/Class: ${stu.class || "11"}`,
        organization: sch?.name || "Visiting School",
        accessLevel: "PARTICIPANT • ARENA FLOOR • COMPETITION STATIONS",
        trackName: trk?.name || "Competition Arena",
        createdAt: "2026-11-01T09:00:00Z",
      };
    });
  }, [students, schools, tracks]);

  // Combine all passes
  const allPasses = useMemo(() => {
    return [
      ...customPasses,
      ...baseStaffPasses,
      ...facultyPasses,
      ...studentPasses,
    ];
  }, [customPasses, baseStaffPasses, facultyPasses, studentPasses]);

  const [activePass, setActivePass] = useState<IssuedPass>(allPasses[0] || baseStaffPasses[0]);

  // Keep active pass synchronized
  useEffect(() => {
    if (!activePass && allPasses.length > 0) {
      setActivePass(allPasses[0]);
    }
  }, [allPasses, activePass]);

  // Filter passes
  const filteredPasses = useMemo(() => {
    return allPasses.filter((pass) => {
      const matchesRole = selectedRole === "all" || pass.role === selectedRole;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        pass.name.toLowerCase().includes(q) ||
        pass.organization.toLowerCase().includes(q) ||
        pass.badgeNumber.toLowerCase().includes(q) ||
        pass.trackName.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [allPasses, selectedRole, searchQuery]);

  // --- NEW PASS CREATION FORM STATE ---
  const [formRole, setFormRole] = useState<PassRole>("event_coordinator");
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("Event Operations Coordinator");
  const [formOrg, setFormOrg] = useState("SPARK 2026 Core Executive Council");
  const [formTrack, setFormTrack] = useState("All Arenas & Stage HQ");
  const [formAccess, setFormAccess] = useState("FULL CAMPUS ACCESS • ALL ARENAS • STAGE • HQ");
  const [formBadgeNumber, setFormBadgeNumber] = useState(`COORD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [formTable, setFormTable] = useState("");
  const [formPhone, setFormPhone] = useState("");

  // Auto-update defaults when role changes in modal
  const handleRoleSelection = (role: PassRole) => {
    setFormRole(role);
    const rand = Math.floor(1000 + Math.random() * 9000);
    switch (role) {
      case "event_coordinator":
        setFormTitle("Event Operations Coordinator");
        setFormOrg("SPARK 2026 Core Executive Council");
        setFormTrack("All Arenas & Stage HQ");
        setFormAccess("FULL CAMPUS ACCESS • ALL ARENAS • STAGE • HQ");
        setFormBadgeNumber(`COORD-${rand}`);
        break;
      case "registration_head":
        setFormTitle("Head of Registration Desk");
        setFormOrg("SPARK 2026 Core Executive Council");
        setFormTrack("Central Quadrangle Entrance");
        setFormAccess("REGISTRATION DESK • ALL ACCESS • ADMIN HQ");
        setFormBadgeNumber(`REG-${rand}`);
        break;
      case "judge":
        setFormTitle("Distinguished Evaluation Jury");
        setFormOrg("SPARK Academic Jury Council");
        setFormTrack(tracks[0]?.name || "Robotics Arena");
        setFormAccess("ALL-ACCESS • JURY ROOM • EVALUATION DESK");
        setFormBadgeNumber(`JDG-${rand}`);
        break;
      case "volunteer":
        setFormTitle("Campus Operations Volunteer");
        setFormOrg("SPARK Student Taskforce");
        setFormTrack("Registration & Ground Logistics");
        setFormAccess("REGISTRATION DESK • ARENA FLOOR • OPS CREW");
        setFormBadgeNumber(`VOL-${rand}`);
        break;
      case "faculty":
        setFormTitle("Visiting School Faculty Lead");
        setFormOrg(schools[0]?.name || "Visiting Delegation");
        setFormTrack("All Arenas • Faculty Lounge");
        setFormAccess("DELEGATION ACCESS • VISITOR LOUNGE • CAMPUS ARENA");
        setFormBadgeNumber(`FAC-${rand}`);
        break;
      case "student":
        setFormTitle("Student Competitor Squad Member");
        setFormOrg(schools[0]?.name || "Visiting Delegation");
        setFormTrack(tracks[0]?.name || "Robotics Track");
        setFormAccess("PARTICIPANT • ARENA FLOOR • COMPETITION STATIONS");
        setFormBadgeNumber(`STU-${rand}`);
        break;
      case "organizer":
      default:
        setFormTitle("Super Administrator • Fest Director");
        setFormOrg("SPARK 2026 Core Executive Council");
        setFormTrack("Campus Wide HQ");
        setFormAccess("FULL CAMPUS ACCESS • ALL AREAS • ADMIN HQ");
        setFormBadgeNumber(`EXEC-${rand}`);
        break;
    }
  };

  // Submit and create ID pass
  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBadgeNumber.trim()) return;

    const newPass: IssuedPass = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: formRole,
      name: formName.trim(),
      badgeNumber: formBadgeNumber.trim().toUpperCase(),
      title: formTitle.trim(),
      organization: formOrg.trim(),
      accessLevel: formAccess.trim(),
      trackName: formTrack.trim(),
      tableNumber: formTable.trim() || undefined,
      phone: formPhone.trim() || undefined,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPass, ...customPasses];
    setCustomPasses(updated);
    try {
      localStorage.setItem("spark_custom_issued_passes", JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage write failed", err);
    }

    setActivePass(newPass);
    setCreateModalOpen(false);

    // Reset form for next use
    setFormName("");
    setFormTable("");
    setFormPhone("");
    handleRoleSelection("event_coordinator");

    setToastMessage(`✓ Official ID Pass successfully issued for ${newPass.name}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete / Revoke custom pass
  const handleDeletePass = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke and delete the official badge for "${name}"?`)) return;

    const updated = customPasses.filter((p) => p.id !== id);
    setCustomPasses(updated);
    try {
      localStorage.setItem("spark_custom_issued_passes", JSON.stringify(updated));
    } catch {}

    if (activePass?.id === id) {
      setActivePass(baseStaffPasses[0]);
    }

    setToastMessage(`Credential for "${name}" has been revoked.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Trigger batch print
  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-black">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#4CAF50] text-black border-[3px] border-black px-4 py-3 shadow-[6px_6px_0px_#000000] flex items-center gap-2 text-xs font-black uppercase animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFEB3B] text-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
                SUPER ADMIN ACCREDITATION HUB
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFEB3B] px-2 py-0.5 border border-black">
                {allPasses.length} Total Verified Credentials
              </span>
              <span className="text-xs font-bold text-slate-800">
                Official Tamper-Proof ID Pass Terminal
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight flex items-center gap-2.5">
              <QrCode className="w-8 h-8 text-black" />
              <span>Official Fest ID Pass &amp; Badge Terminal</span>
            </h1>

            <p className="text-xs font-bold text-slate-700 mt-1 max-w-2xl">
              Super Admin authority window to generate, customize, preview, and print official credentials for Event Coordinators, Registration Heads, Judges, Volunteers, Visiting Faculty, and Student Competitors.
            </p>
          </div>

          {/* Super Admin Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
            <Button
              variant="yellow"
              onClick={() => setCreateModalOpen(true)}
              className="text-xs font-black border-2 border-black shadow-[4px_4px_0px_#000000] flex items-center gap-2 px-4 py-2.5"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>+ Issue New ID Pass</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handlePrintAll}
              className="text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center gap-1.5"
              title="Print badge cards sheet"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>Print Sheet</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FFFBEB] border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <span className="text-xs font-black uppercase text-black mr-2">Filter Roles:</span>
        <button
          onClick={() => setSelectedRole("all")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "all" ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          All Passes ({allPasses.length})
        </button>

        <button
          onClick={() => setSelectedRole("event_coordinator")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "event_coordinator" ? "bg-[#FF5252] text-black border-black shadow-[2px_2px_0px_#000000]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          Event Coordinators ({allPasses.filter((p) => p.role === "event_coordinator").length})
        </button>

        <button
          onClick={() => setSelectedRole("registration_head")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "registration_head" ? "bg-[#00BCD4] text-black border-black shadow-[2px_2px_0px_#000000]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          Registration Heads ({allPasses.filter((p) => p.role === "registration_head").length})
        </button>

        <button
          onClick={() => setSelectedRole("judge")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "judge" ? "bg-[#9C27B0] text-white border-black shadow-[2px_2px_0px_#000000]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          Judges / Jury ({allPasses.filter((p) => p.role === "judge").length})
        </button>

        <button
          onClick={() => setSelectedRole("volunteer")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "volunteer" ? "bg-[#2196F3] text-black border-black shadow-[2px_2px_0px_#000000]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          Volunteers ({allPasses.filter((p) => p.role === "volunteer").length})
        </button>

        <button
          onClick={() => setSelectedRole("faculty")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "faculty" ? "bg-[#4CAF50] text-black border-black shadow-[2px_2px_0px_#000000]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          Faculty Leads ({allPasses.filter((p) => p.role === "faculty").length})
        </button>

        <button
          onClick={() => setSelectedRole("organizer")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "organizer" ? "bg-black text-[#FFEB3B] border-black shadow-[2px_2px_0px_#000000]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          Super Admin ({allPasses.filter((p) => p.role === "organizer").length})
        </button>

        <button
          onClick={() => setSelectedRole("student")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            selectedRole === "student" ? "bg-[#FF9800] text-black border-black shadow-[2px_2px_0px_#000000]" : "bg-white text-black border-black hover:bg-slate-100"
          }`}
        >
          Students ({allPasses.filter((p) => p.role === "student").length})
        </button>
      </div>

      {/* Main Split Layout: Directory List (7 Cols) + Live Badge Preview (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pass Directory List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, institution, track, or badge code..."
              className="w-full pl-9 pr-3 py-2 text-xs font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredPasses.length === 0 ? (
              <div className="p-12 text-center bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
                <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-black text-black">No passes match your filter criteria.</p>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Click <strong>+ Issue New ID Pass</strong> to create credentials for any personnel.
                </p>
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
                    : p.role === "event_coordinator"
                    ? "bg-[#FF5252] text-black"
                    : p.role === "registration_head"
                    ? "bg-[#00BCD4] text-black"
                    : "bg-black text-[#FFEB3B]";

                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePass(p)}
                    className={`w-full p-4 border-[3px] border-black text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FFEB3B] text-black shadow-[4px_4px_0px_#000000] -translate-x-0.5 -translate-y-0.5"
                        : "bg-white hover:bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000000] ${roleBadgeColor}`}>
                          {p.role.replace("_", " ")}
                        </span>
                        <span className="font-mono text-xs font-black text-slate-900 bg-white border border-black px-1.5 py-0.2">
                          {p.badgeNumber}
                        </span>
                        {p.isCustom && (
                          <span className="text-[9px] font-black uppercase bg-emerald-200 text-emerald-950 px-1.5 py-0.2 border border-emerald-900">
                            Custom Issued
                          </span>
                        )}
                      </div>
                      <p className="font-black text-base text-black truncate">{p.name}</p>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {p.title} • {p.organization}
                      </p>
                      <p className="text-[11px] font-bold text-slate-600 truncate">
                        Track: {p.trackName} {p.tableNumber ? `• Table ${p.tableNumber}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {p.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePass(p.id, p.name);
                          }}
                          className="p-1.5 bg-white hover:bg-[#FF5252] text-black border-2 border-black shadow-[1px_1px_0px_#000000] transition-colors"
                          title="Revoke / Delete Pass"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ArrowRight className="w-4 h-4 text-black" />
                    </div>
                  </div>
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
            <div className="w-full flex justify-center">
              <IdPassCard
                role={activePass.role}
                name={activePass.name}
                badgeNumber={activePass.badgeNumber}
                title={activePass.title}
                organization={activePass.organization}
                accessLevel={activePass.accessLevel}
                trackName={activePass.trackName}
                tableNumber={activePass.tableNumber}
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUPER ADMIN ID PASS ISSUANCE WINDOW (MODAL DIALOG)                        */}
      {/* ========================================================================= */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Super Admin Window: Issue New Official ID Pass"
      >
        <div className="text-black space-y-6">
          <p className="text-xs font-bold text-slate-800 -mt-2">
            Generate and verify an official tamper-proof lanyard badge for event coordinators, judges, registration staff, volunteers, faculty, or students.
          </p>

          <form onSubmit={handleCreatePass} className="space-y-4">
            {/* 1. Role Selection Grid */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                Select Official Credential Role *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: "event_coordinator" as PassRole, label: "Event Coordinator", color: "bg-[#FF5252]" },
                  { role: "registration_head" as PassRole, label: "Registration Head", color: "bg-[#00BCD4]" },
                  { role: "judge" as PassRole, label: "Official Judge", color: "bg-[#9C27B0] text-white" },
                  { role: "volunteer" as PassRole, label: "Volunteer Crew", color: "bg-[#2196F3]" },
                  { role: "faculty" as PassRole, label: "Faculty Lead", color: "bg-[#4CAF50]" },
                  { role: "student" as PassRole, label: "Student Participant", color: "bg-[#FF9800]" },
                  { role: "organizer" as PassRole, label: "Super Admin", color: "bg-black text-[#FFEB3B]" },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleRoleSelection(item.role)}
                    className={`p-2 border-2 border-black text-xs font-black text-left transition-all cursor-pointer ${
                      formRole === item.role
                        ? `${item.color} shadow-[3px_3px_0px_#000000] -translate-x-0.5 -translate-y-0.5`
                        : "bg-white text-black hover:bg-[#FFFBEB]"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Personal & Title Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Full Name / Honorific *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Official Title / Role Designation *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Senior Evaluation Jury • AI"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* 3. Organization & Track Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Institution / Delegation / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formOrg}
                  onChange={(e) => setFormOrg(e.target.value)}
                  placeholder="e.g. Model Higher Secondary / Core Council"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                />
                {schools.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) setFormOrg(e.target.value);
                    }}
                    className="w-full mt-1 px-2 py-1 border border-black text-[10px] font-bold bg-white"
                  >
                    <option value="">Quick pick from registered schools...</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Assigned Track / Venue Arena *
                </label>
                <input
                  type="text"
                  required
                  value={formTrack}
                  onChange={(e) => setFormTrack(e.target.value)}
                  placeholder="e.g. Robotics Arena Floor"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                />
                {tracks.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) setFormTrack(e.target.value);
                    }}
                    className="w-full mt-1 px-2 py-1 border border-black text-[10px] font-bold bg-white"
                  >
                    <option value="">Quick pick from competition tracks...</option>
                    <option value="All 8 Arena Tracks & HQ">All 8 Arena Tracks &amp; HQ</option>
                    <option value="Central Quadrangle Registration Desk">Central Quadrangle Registration Desk</option>
                    {tracks.map((t) => (
                      <option key={t.id} value={`${t.name} Arena`}>
                        {t.name} Arena
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* 4. Security Access Clearance & Badge Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Security Access Level *
                </label>
                <input
                  type="text"
                  required
                  value={formAccess}
                  onChange={(e) => setFormAccess(e.target.value)}
                  placeholder="e.g. ALL-ACCESS • JURY ROOM • EVALUATION DESK"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Badge Code ID *
                </label>
                <input
                  type="text"
                  required
                  value={formBadgeNumber}
                  onChange={(e) => setFormBadgeNumber(e.target.value)}
                  placeholder="e.g. COORD-5841"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-mono font-black bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black uppercase"
                />
              </div>
            </div>

            {/* 5. Table & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Assigned Station / Table Number (Optional)
                </label>
                <input
                  type="text"
                  value={formTable}
                  onChange={(e) => setFormTable(e.target.value)}
                  placeholder="e.g. T-04 or Booth 1"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Emergency Phone Contact (Optional)
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t-2 border-black">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
                className="text-xs font-black"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="yellow"
                size="sm"
                className="text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] px-6"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>Issue &amp; Save Official ID Pass</span>
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
