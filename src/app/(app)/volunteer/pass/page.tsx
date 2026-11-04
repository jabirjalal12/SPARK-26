"use client";

import React from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { IdPassCard } from "@/components/passes/id-pass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, ClipboardList } from "lucide-react";

export default function VolunteerPassPage() {
  const { currentProfile, volunteerDuties } = useFestStore();

  const volunteerName = currentProfile.full_name || "Campus Operations Volunteer";
  const badgeNumber = `VOL-${(currentProfile.id || "001").substring(0, 6).toUpperCase()}`;

  const assignedDuty = volunteerDuties.find((d) => d.volunteer_id === currentProfile.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/volunteer/duties"
          className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFEB3B] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Duty Roster</span>
        </Link>
        <span className="text-xs font-black uppercase px-2.5 py-1 bg-[#2196F3] text-black border-2 border-black shadow-[2px_2px_0px_#000000]">
          OPERATIONS VOLUNTEER BADGE
        </span>
      </div>

      {/* Intro info box */}
      <div className="p-4 border-[3px] border-black bg-[#FFFBEB] shadow-[4px_4px_0px_#000000] text-black">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-[#2196F3]" />
          <h1 className="text-base font-black uppercase tracking-tight">
            Official Volunteer Duty Credential
          </h1>
        </div>
        <p className="text-xs font-bold text-slate-700">
          This lanyard pass certifies your authorization on the SPARK 2026 operations floor. Wear this badge at your assigned desk or scanning checkpoint.
        </p>
      </div>

      {/* ID Pass Card Component */}
      <IdPassCard
        role="volunteer"
        name={volunteerName}
        badgeNumber={badgeNumber}
        title="Operations & Registration Volunteer"
        organization="SPARK 2026 Volunteer Taskforce"
        accessLevel="REGISTRATION DESK • ARENA FLOOR • OPS CREW"
        trackName={assignedDuty?.duty || "Campus Registration Desk"}
        tableNumber={assignedDuty?.description || "Desk Station A"}
        metadata={[
          { label: "DUTY", value: assignedDuty?.duty || "CHECK-IN OPERATIONS" },
          { label: "STATUS", value: (assignedDuty?.status || "ACTIVE").toUpperCase() },
        ]}
      />
    </div>
  );
}
