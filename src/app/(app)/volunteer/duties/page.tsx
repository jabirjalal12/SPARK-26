"use client";

import React from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

export default function VolunteerDutiesPage() {
  const { currentProfile, volunteerDuties } = useFestStore();

  const myDuties = volunteerDuties.filter((d) => d.volunteer_id === currentProfile.id || true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-white/10">
        <Badge variant="outline" className="mb-1.5">
          CREW ASSIGNMENTS
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          My Duty Roster & Shifts
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Assigned shifts and marshaling stations for MAKE//BREAK 2026.
        </p>
      </div>

      <div className="space-y-4">
        {myDuties.map((duty) => (
          <GlassCard key={duty.id} className="p-5 sm:p-6 border-white/15 bg-slate-900/70">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={duty.status === "completed" ? "success" : "info"}>
                  {duty.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  {duty.starts_at ? new Date(duty.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "08:00 AM"} – {duty.ends_at ? new Date(duty.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "12:00 PM"}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">{duty.duty}</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{duty.description}</p>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Station: Central Quadrangle & Arena Alpha
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Shift Confirmed
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
