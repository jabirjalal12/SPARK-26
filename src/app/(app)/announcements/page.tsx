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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#FF9800] text-black border-2 border-black font-black">
            REALTIME BULLETIN
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Official Notices & Broadcasts
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
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
              variant={ann.urgent ? "yellow" : "white"}
              className="p-5 sm:p-6 border-4 border-black shadow-[6px_6px_0px_#000]"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.urgent && (
                    <Badge variant="danger" className="border-2 border-black font-black">
                      <span className="h-2 w-2 rounded-full bg-white border border-black animate-ping mr-1" />
                      URGENT NOTICE
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-2 border-black bg-white text-black font-black">
                    AUDIENCE: {ann.audience.toUpperCase()}
                  </Badge>
                  {track && (
                    <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 border-2 border-black bg-[#2196F3] text-black">
                      {track.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-black font-mono font-bold bg-white px-2 py-0.5 border border-black">
                    {new Date(ann.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {currentProfile.role === "organizer" && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 text-black hover:bg-[#FF5252] border-2 border-black bg-white shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      title="Delete notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-black text-black uppercase tracking-tight">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-800 font-medium mt-2 leading-relaxed whitespace-pre-line">
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
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Headline *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Round 2 Call for Robotics Arena Heats"
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Target Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              >
                <option value="all">All Attendees</option>
                <option value="faculty">Faculty Coordinators Only</option>
                <option value="volunteers">Volunteers Only</option>
                <option value="track">Specific Track Arena</option>
              </select>
            </div>

            {formData.audience === "track" && (
              <div>
                <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Select Track</label>
                <select
                  value={formData.trackId}
                  onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
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
            <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Notice Body *</label>
            <textarea
              required
              rows={3}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Provide exact instructions, venue details, or time deadlines..."
              className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black text-xs font-medium placeholder-neutral-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1 bg-[#FF5252]/10 p-2 border-2 border-black">
            <input
              type="checkbox"
              checked={formData.urgent}
              onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
              className="h-4 w-4 accent-black cursor-pointer"
            />
            <span className="text-xs font-black uppercase text-black">
              Mark as URGENT (displays in top floating banner)
            </span>
          </label>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
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
