"use client";

import React from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { IdPassCard } from "@/components/passes/id-pass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export default function OrganizerPassPage() {
  const { currentProfile, activeOrganizerSubRole } = useFestStore();

  const organizerName = currentProfile.full_name || "Lead Fest Executive";
  const badgeNumber = `EXEC-${(currentProfile.id || "SA1").substring(0, 6).toUpperCase()}`;

  const subRoleTitle =
    activeOrganizerSubRole === "super_admin"
      ? "Super Administrator • Fest Director"
      : activeOrganizerSubRole === "event_coordinator"
      ? "Event Coordinator • Arena Operations"
      : "Head of Institutional Registration";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFEB3B] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Telemetry</span>
        </Link>
        <span className="text-xs font-black uppercase px-2.5 py-1 bg-black text-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000]">
          EXECUTIVE FEST ACCREDITATION
        </span>
      </div>

      {/* Intro info box */}
      <div className="p-4 border-[3px] border-black bg-[#FFFBEB] shadow-[4px_4px_0px_#000000] text-black">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-black" />
          <h1 className="text-base font-black uppercase tracking-tight">
            Official Executive Organizer Pass
          </h1>
        </div>
        <p className="text-xs font-bold text-slate-700">
          Highest clearance credential for SPARK 2026. Authorizes unhindered access across all campus zones, server terminals, jury rooms, and stage control areas.
        </p>
      </div>

      {/* ID Pass Card Component */}
      <IdPassCard
        role="organizer"
        name={organizerName}
        badgeNumber={badgeNumber}
        title={subRoleTitle}
        organization="SPARK 2026 Core Executive Council"
        accessLevel="FULL CAMPUS ACCESS • ALL AREAS • ADMIN HQ • STAGE"
        trackName="All Arenas & HQ"
        metadata={[
          { label: "CLEARANCE", value: "EXECUTIVE TIER-1" },
          { label: "JURISDICTION", value: "ALL CAMPUS" },
        ]}
      />
    </div>
  );
}
