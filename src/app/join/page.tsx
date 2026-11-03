"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Users } from "lucide-react";

export default function StudentJoinPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      <div className="w-full max-w-md">
        <GlassCard className="p-8 text-center border-white/20 bg-slate-900/90 backdrop-blur-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Student Notice</h1>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Students have <strong>no phone requirements and no individual accounts</strong> at MAKE//BREAK. All student credentials, verification passes, and track entries are managed directly by your visiting <strong>Faculty Coordinator</strong>.
          </p>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-left text-xs text-slate-300 mb-6">
            <p className="font-semibold text-white mb-1">How check-in works:</p>
            <p>1. Your school faculty lead holds the single official School QR Ticket.</p>
            <p className="mt-1">2. At the registration desk, the volunteer scans the pass and checks your name on the physical roster.</p>
          </div>

          <div className="flex flex-col gap-2">
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
        </GlassCard>
      </div>
    </div>
  );
}
