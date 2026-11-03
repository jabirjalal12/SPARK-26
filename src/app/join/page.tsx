"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Users } from "lucide-react";

export default function StudentJoinPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-black flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      <div className="w-full max-w-md">
        <div className="p-8 text-center border-[3px] border-black bg-white shadow-[8px_8px_0px_#000000]">
          <div className="w-14 h-14 border-[3px] border-black bg-[#FFEB3B] text-black flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#000000]">
            <Users className="w-7 h-7 text-black" />
          </div>

          <h1 className="text-2xl font-black text-black mb-2">Student Notice</h1>
          <p className="text-xs font-bold text-slate-800 leading-relaxed mb-6 bg-[#FFFBEB] border-2 border-black p-3 shadow-[2px_2px_0px_#000000]">
            Students have <strong>no phone requirements and no individual accounts</strong> at SPARK. All student credentials, verification passes, and track entries are managed directly by your visiting <strong>Faculty Coordinator</strong>.
          </p>

          <div className="p-4 border-2 border-black bg-white text-left text-xs font-bold text-black mb-6 shadow-[2px_2px_0px_#000000]">
            <p className="font-black text-black mb-1 underline">How check-in works:</p>
            <p>1. Your school faculty lead holds the single official School QR Ticket.</p>
            <p className="mt-1">2. At the registration desk, the volunteer scans the pass and checks your name on the digital roster.</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link href="/" className="w-full">
              <Button variant="secondary" className="w-full text-xs">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Return to Fest Landing</span>
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full text-xs">
                <span>Faculty & Staff Login</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}