"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { AlertCircle, Bell, X, ChevronRight } from "lucide-react";

export function RealtimeBanner() {
  const { announcements } = useFestStore();
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  // Find the top urgent announcement that hasn't been dismissed
  const urgentAnnouncement = announcements.find((a) => a.urgent && a.id !== dismissedId);

  if (!urgentAnnouncement) return null;

  return (
    <div
      role="alert"
      className="sticky top-16 z-30 w-full bg-gradient-to-r from-rose-950/90 via-red-900/90 to-rose-950/90 border-b border-rose-500/30 text-rose-100 backdrop-blur-xl px-4 py-2.5 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-bold uppercase tracking-wider text-[11px] bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full flex-shrink-0">
            URGENT
          </span>
          <p className="font-medium truncate text-white">
            <span className="font-bold mr-1">{urgentAnnouncement.title}:</span>
            {urgentAnnouncement.body}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/announcements"
            className="flex items-center gap-1 font-semibold text-rose-300 hover:text-white underline underline-offset-2 transition-colors"
          >
            <span>View feed</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setDismissedId(urgentAnnouncement.id)}
            aria-label="Dismiss announcement banner"
            className="p-1 rounded-md text-rose-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
