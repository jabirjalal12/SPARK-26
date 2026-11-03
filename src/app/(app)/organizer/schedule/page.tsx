"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  ShieldCheck,
} from "lucide-react";

export default function OrganizerSchedulePage() {
  const {
    schedule,
    tracks,
    addScheduleItem,
    deleteScheduleItem,
    isSuperAdmin,
    isEventCoordinator,
  } = useFestStore();

  const [modalOpen, setModalOpen] = useState(false);
  const canEdit = isSuperAdmin || isEventCoordinator;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trackId: "",
    venueId: "Central Quadrangle",
    startsAt: "2026-11-20T11:00:00Z",
    endsAt: "2026-11-20T12:00:00Z",
    type: "competition" as "ceremony" | "competition" | "break" | "judging" | "other",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    addScheduleItem({
      title: formData.title,
      description: formData.description,
      track_id: formData.trackId || null,
      venue_id: formData.venueId || null,
      starts_at: formData.startsAt,
      ends_at: formData.endsAt,
      type: formData.type,
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            SCHEDULE & VENUES
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Schedule & Time Slots Editor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin & Event Coordinators add rounds, manage timings, and assign venues.
          </p>
        </div>

        {canEdit && (
          <Button variant="gradient" size="sm" onClick={() => setModalOpen(true)} className="text-xs">
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Event Slot</span>
          </Button>
        )}
      </div>

      {/* Schedule Item List */}
      <div className="space-y-3">
        {schedule.map((item) => {
          const track = tracks.find((t) => t.id === item.track_id);
          const time = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <GlassCard key={item.id} className="p-4 sm:p-5 border-white/15 bg-slate-900/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-mono font-bold text-sm text-indigo-300 block">{time}</span>
                    <Badge variant="outline" className="mt-1 text-[10px] px-2 py-0.5">
                      {item.type}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {item.venue_id || "Central Quad"}
                      </span>
                      {track && <span className="text-indigo-400">• Track: {track.name}</span>}
                    </div>
                  </div>
                </div>

                {canEdit && (
                  <button
                    onClick={() => deleteScheduleItem(item.id)}
                    className="self-end sm:self-center p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-950/60 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Event to Schedule"
        description="Insert an event round or ceremony slot into the fest timeline."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Robotics Round 2 Finals"
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief details about what occurs during this slot..."
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Event Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2.5 glass-input text-xs bg-slate-900 text-white"
              >
                <option value="competition">Competition</option>
                <option value="judging">Judging / Pitch</option>
                <option value="ceremony">Ceremony</option>
                <option value="break">Break / Meal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Venue Location</label>
              <input
                type="text"
                value={formData.venueId}
                onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                placeholder="e.g. Arena Alpha"
                className="w-full px-3 py-2.5 glass-input text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Save to Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
