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
  const { schedule, tracks, isSuperAdmin, isEventCoordinator } = useFestStore();
  const [filterTrack, setFilterTrack] = useState<string>("all");
  const canEdit = isSuperAdmin || isEventCoordinator;

  const filteredSchedule = schedule.filter((item) => {
    if (filterTrack === "all") return true;
    if (filterTrack === "general") return item.track_id === null;
    return item.track_id === filterTrack;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            TIMELINE & VENUES
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Official Fest Schedule — Nov 20, 2026
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Opening ceremony, arena trials, scrap bay build hours, and valedictory gala.
          </p>
        </div>

        {canEdit && (
          <Link href="/organizer/schedule">
            <Button variant="gradient" size="sm" className="text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Edit / Add Slot</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/10 overflow-x-auto gap-2">
        <button
          onClick={() => setFilterTrack("all")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            filterTrack === "all"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          All Timeline Events
        </button>
        <button
          onClick={() => setFilterTrack("general")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            filterTrack === "general"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Ceremonies & Breaks
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTrack(t.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterTrack === t.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Timeline cards */}
      <div className="space-y-3">
        {filteredSchedule.map((item) => {
          const track = tracks.find((t) => t.id === item.track_id);
          const time = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <GlassCard key={item.id} className="p-4 sm:p-5 border-white/15 bg-slate-900/60">
              <div className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0">
                  <span className="font-mono font-bold text-sm text-indigo-300 block">{time}</span>
                  <Badge variant="outline" className="mt-1 text-[10px] px-2 py-0.5 capitalize">
                    {item.type}
                  </Badge>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {item.venue_id || "Central Quad"}
                    </span>
                    {track && <span className="text-indigo-400">• Track: {track.name}</span>}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
