"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Bell,
  AlertTriangle,
  Plus,
  Trash2,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, tracks, currentProfile } =
    useFestStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    audience: "all" as "all" | "faculty" | "volunteers" | "track",
    trackId: "",
    urgent: false,
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.body) return;

    addAnnouncement({
      title: formData.title,
      body: formData.body,
      audience: formData.audience,
      track_id: formData.audience === "track" ? formData.trackId || tracks[0]?.id : null,
      urgent: formData.urgent,
    });

    setFormData({ title: "", body: "", audience: "all", trackId: "", urgent: false });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="warning" className="mb-1.5">REALTIME BULLETIN</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Official Notices & Broadcasts
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Urgent ground alerts, schedule amendments, and jury briefings sent across campus screens.
          </p>
        </div>

        {currentProfile.role === "organizer" && (
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Post New Announcement</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => {
          const track = tracks.find((t) => t.id === ann.track_id);
          return (
            <GlassCard
              key={ann.id}
              className="p-5 sm:p-6"
              glow={ann.urgent ? "red" : "purple"}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.urgent && (
                    <Badge variant="danger">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping mr-1" />
                      URGENT NOTICE
                    </Badge>
                  )}
                  <Badge variant="outline">Audience: {ann.audience.toUpperCase()}</Badge>
                  {track && (
                    <span
                      style={{ color: track.color, borderColor: `${track.color}40` }}
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-white/5"
                    >
                      {track.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(ann.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {currentProfile.role === "organizer" && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                {ann.body}
              </p>
            </GlassCard>
          );
        })}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Announcement"
        description="Target specific audience segments or push an urgent full-screen top banner."
      >
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Headline *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Round 2 Call for Robotics Arena Heats"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="all">All Attendees</option>
                <option value="faculty">Faculty Coordinators Only</option>
                <option value="volunteers">Volunteers Only</option>
                <option value="track">Specific Track Arena</option>
              </select>
            </div>

            {formData.audience === "track" && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Select Track</label>
                <select
                  value={formData.trackId}
                  onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Body *</label>
            <textarea
              required
              rows={3}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Provide exact instructions, venue details, or time deadlines..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.urgent}
              onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
              className="h-4 w-4 rounded accent-rose-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-rose-300">
              Mark as URGENT (displays in top floating red banner)
            </span>
          </label>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
