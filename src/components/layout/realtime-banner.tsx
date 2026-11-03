"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { AlertCircle, X, ChevronRight } from "lucide-react";

export function RealtimeBanner() {
  const { announcements } = useFestStore();
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const urgentAnnouncement = announcements.find((a) => a.urgent && a.id !== dismissedId);

  if (!urgentAnnouncement) return null;

  return (
    <div
      role="alert"
      className="sticky top-0 z-30 w-full bg-rose-950/80 backdrop-blur-xl border-b border-rose-500/30 text-rose-100 px-4 py-2.5 transition-all shadow-lg shadow-rose-950/40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[11px] bg-rose-600 text-white rounded-full px-2.5 py-0.5 shadow-sm shadow-rose-500/40 flex-shrink-0 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            URGENT
          </span>
          <p className="font-medium truncate text-rose-200">
            <span className="font-bold text-white mr-1">{urgentAnnouncement.title}:</span>
            {urgentAnnouncement.body}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/announcements"
            className="flex items-center gap-1 font-semibold text-rose-200 hover:text-white bg-rose-900/50 hover:bg-rose-900/80 px-2.5 py-1 rounded-lg border border-rose-500/30 transition-colors"
          >
            <span>Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setDismissedId(urgentAnnouncement.id)}
            aria-label="Dismiss announcement banner"
            className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
