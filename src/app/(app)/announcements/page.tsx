"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Bell,
  AlertTriangle,
  Plus,
  Trash2,
  Clock,
  Radio,
  Sparkles,
} from "lucide-react";

export default function AnnouncementsPage() {
  const {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    isSuperAdmin,
    isEventCoordinator,
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

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.body) return;

    await addAnnouncement({
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
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#FFEB3B] border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
            CAMPUS BROADCASTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Official Notices & Bulletins
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
            Real-time emergency alerts, arena pit calls, and visiting faculty advisories.
          </p>
        </div>

        {canBroadcast && (
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs uppercase font-black bg-black text-white border-2 border-black shadow-[3px_3px_0px_#ffffff] hover:bg-slate-800"
          >
            <Radio className="h-3.5 w-3.5 mr-1.5" />
            <span>Post Notice</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        {(["all", "faculty", "volunteers"] as const).map((aud) => (
          <button
            key={aud}
            onClick={() => setFilterAudience(aud)}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
              filterAudience === aud
                ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                : "bg-white text-black hover:bg-[#FFFBEB]"
            }`}
          >
            {aud === "all" ? "All Notices" : aud}
          </button>
        ))}
      </div>

      {/* Announcements List or Empty State */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-8 sm:p-12 border-[3px] border-dashed border-black bg-white shadow-[6px_6px_0px_#000000] text-center space-y-3">
            <div className="w-12 h-12 bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black text-black">No Campus Notices Published Yet</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-md mx-auto">
              Urgent bulletins, pit calls, and track schedule revisions will appear here in realtime once posted by Organizers.
            </p>
            {canBroadcast && (
              <Button
                onClick={() => setModalOpen(true)}
                className="mt-2 text-xs uppercase font-black bg-[#FFEB3B] text-black border-2 border-black shadow-[3px_3px_0px_#000000]"
              >
                <Plus className="h-4 w-4 mr-1" />
                Post First Notice
              </Button>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 sm:p-6 border-[3px] border-black shadow-[5px_5px_0px_#000000] ${
                ann.urgent ? "bg-[#FF5252]/10 border-[#FF5252]" : "bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {ann.urgent && (
                    <span className="px-2 py-0.5 bg-[#FF5252] text-black border-2 border-black font-black text-[10px] uppercase animate-pulse shadow-[2px_2px_0px_#000000]">
                      URGENT ALERT
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-[#FFFBEB] text-black border border-black font-black text-[10px] uppercase">
                    Audience: {ann.audience}
                  </span>
                </div>

                <span className="font-mono text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-black" />
                  {new Date(ann.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <h3 className="text-lg font-black text-black mb-1.5">{ann.title}</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">{ann.body}</p>

              {canBroadcast && (
                <div className="mt-4 pt-3 border-t-2 border-black flex justify-end">
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1.5 border border-black bg-[#FF5252] text-black font-black text-xs flex items-center gap-1 shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                    title="Delete notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Notice</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Campus Notice"
        description="Publish an official announcement to campus screens and participant portals."
      >
        <form onSubmit={handlePost} className="space-y-4 font-sans text-black">
          <div>
            <label className="text-xs font-black text-black block mb-1">Notice Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule Amendment for Robotics Trials"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Target Audience</label>
            <select
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
              className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
            >
              <option value="all">Public / All Attendees</option>
              <option value="faculty">Visiting Faculty Only</option>
              <option value="volunteers">Desk Volunteers Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Notice Content *</label>
            <textarea
              rows={4}
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Detailed instructions or alert text..."
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-medium text-black"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-[#FFFBEB] border-2 border-black">
            <input
              type="checkbox"
              id="urgent"
              checked={formData.urgent}
              onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
              className="h-4 w-4 border-2 border-black rounded-none cursor-pointer"
            />
            <label htmlFor="urgent" className="text-xs font-black text-black cursor-pointer flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF5252]" />
              <span>Mark as High-Priority Urgent Alert</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="border-2 border-black text-xs font-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#FFEB3B] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase"
            >
              Broadcast Now
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
