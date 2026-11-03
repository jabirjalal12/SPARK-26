"use client";

import React from "react";
import { PillNav } from "@/components/ui/pill-nav";
import { RealtimeBanner } from "@/components/layout/realtime-banner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-slate-100 relative flex flex-col font-sans">
      {/* Navigation */}
      <PillNav />

      {/* Urgent Announcements Banner */}
      <RealtimeBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-32">
        {children}
      </main>
    </div>
  );
}
