"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { Trophy, ShieldCheck, Home, Award } from "lucide-react";

export default function OrganizerScoringPage() {
  const router = useRouter();
  const { currentProfile, isJudge } = useFestStore();

  useEffect(() => {
    // If an official Judge navigates here, redirect them to the Judge Portal
    if (isJudge || currentProfile.role === "judge") {
      router.replace("/judge");
    }
  }, [isJudge, currentProfile.role, router]);

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] text-center">
      <div className="w-16 h-16 bg-[#FFEB3B] border-[3px] border-black flex items-center justify-center mx-auto mb-5 shadow-[3px_3px_0px_#000000]">
        <Award className="w-8 h-8 text-black" />
      </div>
      
      <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#FFEB3B] text-black border border-black shadow-[1px_1px_0px_#000] inline-block mb-3">
        Official Evaluation Policy
      </span>
      
      <h1 className="text-2xl font-black text-black tracking-tight">
        Score Entry Reserved for Judges
      </h1>
      
      <p className="text-xs font-bold text-slate-700 mt-3 leading-relaxed">
        Score entry is exclusively managed by appointed Fest Judges in the Judge Portal (<code className="bg-[#FFFBEB] border border-black px-1">/judge</code>).
        Super Administrators and Event Coordinators oversee real-time team rankings via the Live Leaderboard and finalize approvals via Result Publishing.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/leaderboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFEB3B] hover:bg-black hover:text-white border-[3px] border-black font-black text-xs shadow-[3px_3px_0px_#000000] transition-colors"
        >
          <Trophy className="w-4 h-4" />
          <span>View Live Leaderboard</span>
        </Link>
        <Link
          href="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-black hover:text-white border-[3px] border-black font-black text-xs shadow-[3px_3px_0px_#000000] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Operations Hub</span>
        </Link>
      </div>
    </div>
  );
}
