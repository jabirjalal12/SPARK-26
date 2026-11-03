"use client";

import React from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function VolunteerDutiesPage() {
  const { currentProfile, volunteerDuties } = useFestStore();

  const myDuties = volunteerDuties.filter((d) => d.volunteer_id === currentProfile.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-white/10">
        <Badge variant="info" className="mb-1.5">CREW ASSIGNMENTS</Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          My Duty Roster & Shifts
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Review your time slots, designated venue locations, and course duties for MAKE//BREAK 2026.
        </p>
      </div>

      <div className="space-y-4">
        {myDuties.map((duty) => (
          <GlassCard key={duty.id} className="p-5 sm:p-6" glow="blue">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={duty.status === "completed" ? "success" : "warning"}>
                  {duty.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  {duty.starts_at ? new Date(duty.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "08:00 AM"} – {duty.ends_at ? new Date(duty.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "12:00 PM"}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">{duty.duty}</h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">{duty.description}</p>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-pink-400" />
                Station: Central Quad & Arena Alpha
              </span>
              <span className="font-semibold text-emerald-400">Shift Confirmed</span>
            </div>
          </GlassCard>
        ))}

        {myDuties.length === 0 && (
          <GlassCard className="p-8 text-center text-slate-400 text-xs">
            No duties currently assigned to your account. Report to Chief Volunteer Lead at Room 104.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
