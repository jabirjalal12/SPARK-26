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
  Clock,
  Radio,
} from "lucide-react";

export default function AnnouncementsPage() {
  const {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    isSuperAdmin,
    isEventCoordinator,
    currentProfile,
  } = useFestStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [filterAudience, setFilterAudience] = useState<string>("all");
  const canBroadcast = isSuperAdmin || isEventCoordinator;

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    audience: "all" as "all" | "faculty" | "volunteers",
    urgent: false,
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.body) return;

    addAnnouncement({
      title: formData.title,
      body: formData.body,
      audience: formData.audience,
      urgent: formData.urgent,
    });

    setFormData({ title: "", body: "", audience: "all", urgent: false });
    setModalOpen(false);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (filterAudience === "all") return true;
    return a.audience === filterAudience || a.audience === "all";
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            CAMPUS BROADCASTS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Official Notices & Bulletins
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time emergency alerts, venue announcements, and faculty advisories.
          </p>
        </div>

        {canBroadcast && (
          <Button variant="gradient" size="sm" onClick={() => setModalOpen(true)} className="text-xs">
            <Radio className="h-4 w-4 mr-1.5" />
            <span>Post Broadcast</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 w-fit">
        {(["all", "faculty", "volunteers"] as const).map((aud) => (
          <button
            key={aud}
            onClick={() => setFilterAudience(aud)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              filterAudience === aud
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {aud === "all" ? "All Notices" : aud}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <GlassCard
            key={ann.id}
            className={`p-5 sm:p-6 border-white/15 ${
              ann.urgent
                ? "border-rose-500/40 bg-gradient-to-r from-rose-950/40 to-slate-900/80 shadow-lg shadow-rose-950/30"
                : "bg-slate-900/70"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {ann.urgent && (
                  <Badge variant="danger" className="animate-pulse">
                    URGENT ALERT
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize text-[10px]">
                  Audience: {ann.audience}
                </Badge>
              </div>

              <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {new Date(ann.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">{ann.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{ann.body}</p>

            {canBroadcast && (
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-950/60 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Delete notice"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Broadcast</span>
                </button>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Campus Notice"
        description="Broadcast an announcement to all campus screens and participant panels."
      >
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule Amendment for Robotics Trials"
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience</label>
            <select
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
              className="w-full px-3 py-2.5 glass-input text-xs bg-slate-900 text-white"
            >
              <option value="all">Everyone on Campus</option>
              <option value="faculty">Visiting Faculty Only</option>
              <option value="volunteers">Crew & Volunteers Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Message Content *</label>
            <textarea
              rows={4}
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Detailed announcement information..."
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
            <input
              type="checkbox"
              id="urgent"
              checked={formData.urgent}
              onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <label htmlFor="urgent" className="text-xs font-bold text-rose-300 cursor-pointer">
              Mark as URGENT (Displays top banner across all screens)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm">
              Publish Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
