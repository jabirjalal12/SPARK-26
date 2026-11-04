"use client";

import React from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { IdPassCard } from "@/components/passes/id-pass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Sparkles, ShieldCheck } from "lucide-react";

export default function JudgePassPage() {
  const { currentProfile, tracks } = useFestStore();

  const judgeName = currentProfile.full_name || "Dr. Evelyn Reed (Chief Jury)";
  const badgeNumber = `JDG-${(currentProfile.id || "001").substring(0, 6).toUpperCase()}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/judge"
          className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFEB3B] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Scoring Arena</span>
        </Link>
        <span className="text-xs font-black uppercase px-2.5 py-1 bg-[#9C27B0] text-white border-2 border-black shadow-[2px_2px_0px_#000000]">
          OFFICIAL JURY BADGE
        </span>
      </div>

      {/* Intro info box */}
      <div className="p-4 border-[3px] border-black bg-[#FFFBEB] shadow-[4px_4px_0px_#000000] text-black">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-5 h-5 text-[#9C27B0]" />
          <h1 className="text-base font-black uppercase tracking-tight">
            Official Competition Jury Credential
          </h1>
        </div>
        <p className="text-xs font-bold text-slate-700">
          This digital and printable badge accredits your judging authority across all SPARK 2026 competition tracks. Wear your badge or present this QR credential at the Arena Jury Entry.
        </p>
      </div>

      {/* ID Pass Card Component */}
      <IdPassCard
        role="judge"
        name={judgeName}
        badgeNumber={badgeNumber}
        title="Distinguished Evaluation Jury"
        organization="SPARK 2026 Academic Jury Committee"
        accessLevel="ALL-ACCESS • JURY ROOM • ARENA FLOOR • SCORING DESK"
        trackName="All Competition Tracks"
        metadata={[
          { label: "CLEARANCE", value: "LEVEL 3 JURY" },
          { label: "AUTHORITY", value: "FINAL SCORING" },
        ]}
      />
    </div>
  );
}
