"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function SchedulePage() {
  const { schedule, venues, tracks, isSuperAdmin, isEventCoordinator } = useFestStore();
  const [filterTrack, setFilterTrack] = useState<string>("all");
  const canEdit = isSuperAdmin || isEventCoordinator;

  const filteredSchedule = schedule.filter((item) => {
    if (filterTrack === "all") return true;
    if (filterTrack === "general") return item.track_id === null;
    return item.track_id === filterTrack;
  });

  const getTrackBadge = (trackId: string | null) => {
    if (!trackId) return null;
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return null;

    let bg = "bg-[#2196F3]";
    if (track.slug === "build-from-scrap") bg = "bg-[#4CAF50]";
    if (track.slug === "useless-projects") bg = "bg-[#FF5252]";

    return (
      <span className={`inline-block ${bg} text-black border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]`}>
        Track: {track.name}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "competition":
        return "bg-[#FF5252] text-black";
      case "ceremony":
        return "bg-[#FFEB3B] text-black";
      case "judging":
        return "bg-[#2196F3] text-black";
      case "break":
      default:
        return "bg-[#4CAF50] text-black";
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#FFEB3B] border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#ffffff] mb-3">
            📅 OFFICIAL EVENT ITINERARY
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight">
            Fest Schedule: 05 November 2026
          </h1>
          <p className="text-sm sm:text-base font-bold text-black mt-2 max-w-2xl leading-relaxed">
            All events kick off at <span className="underline decoration-black decoration-2">07:00 AM sharp</span>. Visiting delegations must complete fast-pass QR check-in prior to competition heats.
          </p>
        </div>

        {canEdit && (
          <Link href="/organizer/schedule" className="flex-shrink-0">
            <Button variant="primary" size="md" className="text-xs uppercase font-black tracking-wider bg-black text-white border-2 border-black shadow-[4px_4px_0px_#ffffff] hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Manage Slots & Places</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <span className="text-xs font-black uppercase tracking-widest text-black mr-2 hidden sm:inline">
          Filter:
        </span>
        <button
          onClick={() => setFilterTrack("all")}
          className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
            filterTrack === "all"
              ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
              : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          All Timeline Events ({schedule.length})
        </button>
        <button
          onClick={() => setFilterTrack("general")}
          className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
            filterTrack === "general"
              ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
              : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          Ceremonies & Breaks
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTrack(t.id)}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
              filterTrack === t.id
                ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-[#FFFBEB]"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Timeline items or Empty State */}
      <div className="space-y-4">
        {filteredSchedule.length === 0 ? (
          <div className="p-8 sm:p-12 border-[3px] border-dashed border-black bg-white shadow-[6px_6px_0px_#000000] text-center space-y-3">
            <div className="w-12 h-12 bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black text-black">No Timeline Events Published Yet</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-md mx-auto">
              The official event itinerary for 05 November 2026 is currently being configured by Event Coordinators in the Organizer window.
            </p>
            {canEdit && (
              <Link href="/organizer/schedule" className="inline-block mt-2">
                <Button className="text-xs uppercase font-black bg-[#FFEB3B] text-black border-2 border-black shadow-[3px_3px_0px_#000000]">
                  <Plus className="h-4 w-4 mr-1" />
                  Configure Schedule Slots
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredSchedule.map((item) => {
            const venue = venues.find((v) => v.id === item.venue_id);
            const venueName = venue ? `${venue.name} (${venue.location})` : (item.venue_id || "Campus Venue");
            const startTime = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const endTime = new Date(item.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Time badge */}
                  <div className="flex-shrink-0 text-center min-w-[110px]">
                    <div className="p-2 bg-[#FFFBEB] border-2 border-black shadow-[3px_3px_0px_#000000]">
                      <span className="font-mono font-black text-sm text-black block leading-tight">
                        {startTime}
                      </span>
                      <span className="text-[10px] font-black uppercase text-slate-600 block mt-0.5">
                        to {endTime}
                      </span>
                    </div>
                    <span className={`inline-block mt-2 px-2 py-0.5 border border-black text-[10px] font-black uppercase ${getTypeBadge(item.type)}`}>
                      {item.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-lg sm:text-xl text-black leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-black">
                      <span className="flex items-center gap-1.5 bg-[#FFFBEB] border border-black px-2.5 py-1">
                        <MapPin className="w-3.5 h-3.5 text-black" />
                        {venueName}
                      </span>

                      {getTrackBadge(item.track_id)}
                    </div>
                  </div>
                </div>

                {/* Date Pill */}
                <div className="flex-shrink-0 self-end md:self-center">
                  <span className="px-3 py-1.5 border-2 border-black bg-[#FFFBEB] text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                    05 NOV 2026
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
