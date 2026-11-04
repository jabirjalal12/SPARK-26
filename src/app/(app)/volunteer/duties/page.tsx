"use client";

import React from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  User,
} from "lucide-react";

export default function VolunteerDutiesPage() {
  const { currentProfile, volunteerDuties } = useFestStore();

  const myDuties = volunteerDuties.filter(
    (d) => d.volunteer_id === currentProfile.id || true
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-16">
      {/* Top Banner */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#2196F3] text-white border border-black shadow-[2px_2px_0px_#000]">
                OPERATIONS VOLUNTEER
              </span>
              <span className="text-xs font-bold text-slate-700">Station Marshaling & Ground Roster</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Duty Roster & Shifts
            </h1>
            <p className="text-xs font-bold text-slate-800 mt-1">
              Official shift assignments and marshaling checkpoints for SPARK 2026.
            </p>
          </div>

          <Link
            href="/volunteer/scan"
            className="px-3.5 py-2 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[3px_3px_0px_#000000] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open QR Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Duty Cards */}
      <div className="space-y-4">
        {myDuties.map((duty) => (
          <div
            key={duty.id}
            className="p-5 border-[3px] border-black bg-white shadow-[5px_5px_0px_#000000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 text-xs font-black uppercase border border-black ${
                    duty.status === "completed"
                      ? "bg-[#4CAF50] text-white"
                      : "bg-[#FFEB3B] text-black"
                  }`}
                >
                  {duty.status.toUpperCase()}
                </span>
                <span className="text-xs font-mono font-black text-black bg-[#FFFBEB] px-2.5 py-0.5 border border-black flex items-center gap-1.5 shadow-[1px_1px_0px_#000]">
                  <Clock className="h-3.5 w-3.5 text-black" />
                  {duty.starts_at
                    ? new Date(duty.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "08:00 AM"}{" "}
                  –{" "}
                  {duty.ends_at
                    ? new Date(duty.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "12:00 PM"}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-black text-black tracking-tight flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-black" />
              <span>{duty.duty}</span>
            </h3>
            <p className="text-xs font-bold text-slate-800 mt-2 leading-relaxed bg-[#FFFBEB] p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
              {duty.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
