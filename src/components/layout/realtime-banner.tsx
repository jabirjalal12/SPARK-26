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
      className="sticky top-0 z-30 w-full bg-[#FF5252] border-b-[3px] border-black text-black px-4 py-2.5 shadow-[0_4px_0px_#000000]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex items-center gap-1 font-black uppercase tracking-wider text-[11px] bg-black text-white px-2.5 py-0.5 border border-black flex-shrink-0 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-[#FFEB3B]" />
            URGENT
          </span>
          <p className="font-bold truncate text-black">
            <span className="font-black text-black mr-1 underline">{urgentAnnouncement.title}:</span>
            {urgentAnnouncement.body}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/announcements"
            className="flex items-center gap-1 font-black text-black bg-white hover:bg-[#FFEB3B] px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span>Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setDismissedId(urgentAnnouncement.id)}
            aria-label="Dismiss announcement banner"
            className="p-1 border-2 border-black bg-white text-black hover:bg-[#FFEB3B] shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}