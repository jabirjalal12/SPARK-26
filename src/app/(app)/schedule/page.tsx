"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
} from "lucide-react";

export default function SchedulePage() {
  const { schedule, tracks, currentProfile } = useFestStore();
  const [filterTrack, setFilterTrack] = useState<string>("all");

  const filteredSchedule = schedule.filter((item) => {
    if (filterTrack === "all") return true;
    if (filterTrack === "general") return item.track_id === null;
    return item.track_id === filterTrack;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#FFEB3B] text-black border-2 border-black font-black">
            TIMELINE & VENUES
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Official Schedule — Nov 20, 2026
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Opening ceremony, arena heats, lunch timings, and the grand championship valedictory.
          </p>
        </div>

        {currentProfile.role === "organizer" && (
          <Link href="/organizer/schedule">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Edit / Add Time Slot</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex p-1.5 bg-white border-3 border-black shadow-[4px_4px_0px_#000] overflow-x-auto gap-2">
        <button
          onClick={() => setFilterTrack("all")}
          className={`px-3 py-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
            filterTrack === "all" ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000] -translate-x-0.5 -translate-y-0.5" : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilterTrack("general")}
          className={`px-3 py-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
            filterTrack === "general" ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000] -translate-x-0.5 -translate-y-0.5" : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          General & Ceremonies
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTrack(t.id)}
            className={`px-3 py-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
              filterTrack === t.id ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000] -translate-x-0.5 -translate-y-0.5" : "bg-white text-black hover:bg-[#FFFBEB]"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-7 before:w-1 before:bg-black">
        {filteredSchedule.map((item) => {
          const track = tracks.find((t) => t.id === item.track_id);
          const startTime = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const endTime = new Date(item.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div key={item.id} className="relative flex items-start gap-4 pl-3">
              {/* Timeline marker node */}
              <div className="h-9 w-9 bg-[#FFEB3B] border-3 border-black flex items-center justify-center flex-shrink-0 z-10 shadow-[3px_3px_0px_#000]">
                <Clock className="h-4 w-4 text-black" />
              </div>

              {/* Event card */}
              <GlassCard variant="white" className="flex-1 p-4 sm:p-5 border-3 border-black shadow-[5px_5px_0px_#000]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-[#2196F3] text-black border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
                      {startTime} – {endTime}
                    </span>
                    {track && (
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 border border-black bg-[#FFEB3B] text-black">
                        {track.name}
                      </span>
                    )}
                  </div>

                  <Badge
                    variant={
                      item.type === "competition"
                        ? "danger"
                        : item.type === "ceremony"
                        ? "warning"
                        : item.type === "break"
                        ? "success"
                        : "default"
                    }
                  >
                    {item.type.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-base font-black text-black uppercase tracking-tight">{item.title}</h3>
                {item.description && (
                  <p className="text-xs font-medium text-neutral-800 mt-1 leading-relaxed">{item.description}</p>
                )}

                <div className="mt-3 pt-2.5 border-t-2 border-black flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                  <MapPin className="h-3.5 w-3.5 text-black" />
                  <span>
                    Venue: {item.venue_id ? "Campus Arena & Tech Block" : "Sir CV Raman Auditorium"}
                  </span>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
