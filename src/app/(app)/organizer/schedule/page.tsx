"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  MapPin,
} from "lucide-react";

export default function OrganizerSchedulePage() {
  const { schedule, tracks, addScheduleItem, deleteScheduleItem } = useFestStore();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trackId: "",
    venueId: "",
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="warning" className="mb-1.5">CONTROL TOWER</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Schedule & Time Slots Editor
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Add rounds, shift competition timings, and manage venue allocations.
          </p>
        </div>

        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add Time Slot</span>
        </Button>
      </div>

      <div className="space-y-3">
        {schedule.map((item) => (
          <GlassCard key={item.id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-indigo-400 bg-white/5 px-2 py-0.5 rounded">
                  {new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(item.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <Badge variant={item.type === "competition" ? "danger" : item.type === "ceremony" ? "warning" : "default"}>
                  {item.type}
                </Badge>
              </div>
              <h3 className="font-bold text-sm text-white">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>

            <button
              onClick={() => deleteScheduleItem(item.id)}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Delete time slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </GlassCard>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Schedule Item"
        description="Insert a scheduled session into the fest timeline."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Robotics Quarter-Final Trials"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="competition">Competition</option>
                <option value="ceremony">Ceremony</option>
                <option value="judging">Judging</option>
                <option value="break">Break / Meals</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Track</label>
              <select
                value={formData.trackId}
                onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">General (All Tracks)</option>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Details for participants and audience..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Insert into Timeline
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
