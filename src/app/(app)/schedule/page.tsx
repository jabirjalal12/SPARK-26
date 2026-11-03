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
  Bot,
  Wrench,
  Sparkles,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="info" className="mb-1.5">TIMELINE & VENUES</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Official Schedule — Nov 20, 2026
          </h1>
          <p className="text-xs text-slate-300 mt-1">
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
      <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
        <button
          onClick={() => setFilterTrack("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            filterTrack === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilterTrack("general")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            filterTrack === "general" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          General & Ceremonies
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTrack(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              filterTrack === t.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-white/10">
        {filteredSchedule.map((item) => {
          const track = tracks.find((t) => t.id === item.track_id);
          const startTime = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const endTime = new Date(item.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div key={item.id} className="relative flex items-start gap-4 pl-3">
              {/* Timeline marker node */}
              <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-indigo-500/20">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
              </div>

              {/* Event card */}
              <GlassCard className="flex-1 p-4 sm:p-5" glow="purple">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {startTime} – {endTime}
                    </span>
                    {track && (
                      <span
                        style={{ color: track.color, borderColor: `${track.color}40` }}
                        className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-white/5"
                      >
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

                <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                )}

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-pink-400" />
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
