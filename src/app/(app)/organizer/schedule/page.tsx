"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Plus,
  Trash2,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#FFEB3B] text-black border-2 border-black font-black">
            CONTROL TOWER
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Schedule & Time Slots Editor
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
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
          <GlassCard key={item.id} variant="white" className="p-4 flex items-center justify-between gap-4 border-3 border-black shadow-[4px_4px_0px_#000]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-black bg-[#2196F3] text-black border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
                  {new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(item.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <Badge variant={item.type === "competition" ? "danger" : item.type === "ceremony" ? "warning" : "default"}>
                  {item.type}
                </Badge>
              </div>
              <h3 className="font-black text-sm text-black uppercase">{item.title}</h3>
              <p className="text-xs font-medium text-neutral-700">{item.description}</p>
            </div>

            <button
              onClick={() => deleteScheduleItem(item.id)}
              className="p-1.5 text-black hover:bg-[#FF5252] border-2 border-black bg-white shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Robotics Quarter-Final Trials"
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              >
                <option value="competition">Competition</option>
                <option value="ceremony">Ceremony</option>
                <option value="judging">Judging</option>
                <option value="break">Break / Meals</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Track</label>
              <select
                value={formData.trackId}
                onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
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
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Details for participants and audience..."
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-xs font-medium placeholder-neutral-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
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
