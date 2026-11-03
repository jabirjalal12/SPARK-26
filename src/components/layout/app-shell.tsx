"use client";

import React from "react";
import { PillNav } from "@/components/ui/pill-nav";
import { RealtimeBanner } from "@/components/layout/realtime-banner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden flex flex-col">
      {/* Background soft ambient gradient mesh (purple-blue-pink) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <PillNav />

      {/* Urgent Announcements Banner */}
      <RealtimeBanner />

      {/* Main Content Area with padding for floating pill nav */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-28">
        {children}
      </main>
    </div>
  );
}
