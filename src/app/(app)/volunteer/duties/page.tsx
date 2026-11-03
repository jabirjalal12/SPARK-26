"use client";

import React from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
} from "lucide-react";

export default function VolunteerDutiesPage() {
  const { currentProfile, volunteerDuties } = useFestStore();

  const myDuties = volunteerDuties.filter((d) => d.volunteer_id === currentProfile.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b-3 border-black">
        <Badge variant="outline" className="mb-1.5 bg-[#FFEB3B] text-black border-2 border-black font-black">
          CREW ASSIGNMENTS
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
          My Duty Roster & Shifts
        </h1>
        <p className="text-xs font-bold text-neutral-700 mt-1">
          Review your time slots, designated venue locations, and course duties for SPARK 2026.
        </p>
      </div>

      <div className="space-y-4">
        {myDuties.map((duty) => (
          <GlassCard key={duty.id} variant="white" className="p-5 sm:p-6 border-4 border-black shadow-[6px_6px_0px_#000]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={duty.status === "completed" ? "success" : "warning"}>
                  {duty.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono font-black text-black flex items-center gap-1 bg-[#FFEB3B] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                  <Clock className="h-3.5 w-3.5 text-black" />
                  {duty.starts_at ? new Date(duty.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "08:00 AM"} – {duty.ends_at ? new Date(duty.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "12:00 PM"}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-black text-black uppercase tracking-tight">{duty.duty}</h3>
            <p className="text-sm font-medium text-neutral-800 mt-1 leading-relaxed">{duty.description}</p>

            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-bold text-black">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-black" />
                Station: Central Quad & Arena Alpha
              </span>
              <span className="bg-[#4CAF50] px-2 py-0.5 border border-black text-black font-black">
                Shift Confirmed
              </span>
            </div>
          </GlassCard>
        ))}

        {myDuties.length === 0 && (
          <GlassCard variant="white" className="p-8 text-center text-black font-bold text-xs border-4 border-black shadow-[6px_6px_0px_#000]">
            No duties currently assigned to your account. Report to Chief Volunteer Lead at Room 104.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
