"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Settings,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Database,
  Building,
  Users,
  Calendar,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function OrganizerSettingsPage() {
  const router = useRouter();
  const {
    isSuperAdmin,
    isSupabaseLive,
    schools,
    students,
    teams,
    checkins,
    schedule,
    venues,
    announcements,
    auditLogs,
    factoryResetAll,
  } = useFestStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const CONFIRM_KEYWORD = "RESET SPARK";

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput.trim().toUpperCase() !== CONFIRM_KEYWORD) return;

    setIsResetting(true);
    setStatusMessage(null);

    const result = await factoryResetAll();
    setIsResetting(false);
    setModalOpen(false);
    setConfirmInput("");

    if (result.success) {
      setStatusMessage({
        type: "success",
        text: "Factory Reset Complete: All created schools, rosters, schedule slots, venues, and activity records have been purged.",
      });
    } else {
      setStatusMessage({
        type: "error",
        text: result.message || "Failed to complete factory reset.",
      });
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 font-sans text-center">
        <div className="p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] space-y-4">
          <div className="w-12 h-12 bg-[#FF5252] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-black text-black">Super Admin Access Required</h2>
          <p className="text-xs sm:text-sm font-bold text-slate-700">
            System settings and database factory reset controls are strictly restricted to Super Admin accounts.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button className="text-xs font-black uppercase bg-[#FFEB3B] text-black border-2 border-black shadow-[3px_3px_0px_#000000]">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#FFEB3B] border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
            SUPER ADMIN CONTROLS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            System Settings & Factory Reset
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
            Global fest configuration, live database inventory, and full system reset.
          </p>
        </div>

        <Link href="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="text-xs uppercase font-black bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#FFFBEB]"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Dashboard</span>
          </Button>
        </Link>
      </div>

      {/* Status notification */}
      {statusMessage && (
        <div
          className={`p-4 border-[3px] border-black shadow-[4px_4px_0px_#000000] flex items-center gap-3 ${
            statusMessage.type === "success" ? "bg-[#4CAF50] text-black" : "bg-[#FF5252] text-black"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-black">{statusMessage.text}</p>
        </div>
      )}

      {/* Database Inventory Cards */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black">
          <h2 className="text-lg font-black text-black flex items-center gap-2">
            <Database className="w-5 h-5 text-black" />
            <span>Live Database Records Overview</span>
          </h2>
          <span className="px-2.5 py-0.5 bg-[#4CAF50] text-black border border-black font-black text-[10px] uppercase">
            {isSupabaseLive ? "Supabase Live" : "Active State"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{schools.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Schools</span>
          </div>

          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{students.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Students</span>
          </div>

          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{teams.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Teams</span>
          </div>

          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{checkins.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Check-ins</span>
          </div>

          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{schedule.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Schedule Slots</span>
          </div>

          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{venues.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Places / Venues</span>
          </div>

          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{announcements.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Announcements</span>
          </div>

          <div className="p-3 border-2 border-black bg-[#FFFBEB] text-center">
            <span className="font-mono text-2xl font-black text-black block">{auditLogs.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700">Audit Logs</span>
          </div>
        </div>
      </div>

      {/* System Settings & Fest Meta */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] space-y-4">
        <h2 className="text-lg font-black text-black flex items-center gap-2 pb-3 border-b-2 border-black">
          <Settings className="w-5 h-5 text-black" />
          <span>Fest Parameters & Meta</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-black">
          <div className="p-3 bg-[#FFFBEB] border-2 border-black space-y-1">
            <span className="text-[10px] uppercase text-slate-600 block">Event Title</span>
            <span className="font-black text-base text-black block">SPARK Tech Fest 2026</span>
          </div>

          <div className="p-3 bg-[#FFFBEB] border-2 border-black space-y-1">
            <span className="text-[10px] uppercase text-slate-600 block">Event Kickoff</span>
            <span className="font-black text-base text-black block">05 November 2026 • 07:00 AM</span>
          </div>

          <div className="p-3 bg-[#FFFBEB] border-2 border-black space-y-1">
            <span className="text-[10px] uppercase text-slate-600 block">Competition Arenas</span>
            <span className="font-black text-sm text-black block">Robotics, Build from Scrap, Useless Projects</span>
          </div>

          <div className="p-3 bg-[#FFFBEB] border-2 border-black space-y-1">
            <span className="text-[10px] uppercase text-slate-600 block">Security & Access Model</span>
            <span className="font-black text-sm text-black block">Postgres RLS + Tokenized School QR Tickets</span>
          </div>
        </div>
      </div>

      {/* DANGER ZONE: FACTORY RESET */}
      <div className="p-6 sm:p-8 border-[3px] border-[#FF5252] bg-[#FF5252]/10 shadow-[6px_6px_0px_#000000] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF5252] border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000000]">
            <ShieldAlert className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 bg-[#FF5252] text-black font-black text-[10px] uppercase border border-black mb-1">
              DANGER ZONE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-black">
              Factory Reset: Purge Everything Created
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed max-w-3xl">
          Factory Reset completely purges all created schools, student rosters, team submissions, master QR passes, check-in records, scoring rubrics, scheduled event slots, campus venue locations, and announcements.
        </p>

        <div className="p-3 bg-white border-2 border-black text-xs font-bold text-black space-y-1">
          <p className="font-black text-[#FF5252] uppercase">What will be permanently erased:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-800">
            <li>All visiting school delegations and faculty accounts</li>
            <li>All enrolled students and team assignments</li>
            <li>All single-token QR tickets & check-in arrival stamps</li>
            <li>All scored rubric rows and published results</li>
            <li>All timeline event slots and campus venues created by admin</li>
            <li>All campus notices and broadcast alerts</li>
          </ul>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => setModalOpen(true)}
            className="text-xs uppercase font-black bg-[#FF5252] text-black border-2 border-black shadow-[4px_4px_0px_#000000] hover:bg-rose-600"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span>Initiate Factory Reset</span>
          </Button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          if (!isResetting) {
            setModalOpen(false);
            setConfirmInput("");
          }
        }}
        title="Confirm Factory Reset"
        description="This action is immediate and completely irreversible."
      >
        <form onSubmit={handleExecuteReset} className="space-y-4 font-sans text-black">
          <div className="p-3 bg-[#FF5252]/20 border-2 border-[#FF5252] text-xs font-bold text-black flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF5252] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-black">Final Confirmation Required</p>
              <p className="text-slate-900 mt-0.5">
                All created records will be wiped from Supabase. The system will revert to zero schools, zero places, and zero schedule events.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">
              Type <span className="bg-[#FFEB3B] px-1 border border-black">{CONFIRM_KEYWORD}</span> to confirm:
            </label>
            <input
              type="text"
              required
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={CONFIRM_KEYWORD}
              disabled={isResetting}
              className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-black text-black uppercase"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isResetting}
              onClick={() => {
                setModalOpen(false);
                setConfirmInput("");
              }}
              className="border-2 border-black text-xs font-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={confirmInput.trim().toUpperCase() !== CONFIRM_KEYWORD || isResetting}
              className="bg-[#FF5252] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? "Purging System..." : "Confirm & Wipe Everything"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
