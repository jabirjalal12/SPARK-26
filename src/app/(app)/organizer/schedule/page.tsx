"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Building,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function OrganizerSchedulePage() {
  const {
    schedule,
    venues,
    tracks,
    addScheduleItem,
    deleteScheduleItem,
    addVenue,
    deleteVenue,
    isSuperAdmin,
    isEventCoordinator,
  } = useFestStore();

  const [activeTab, setActiveTab] = useState<"schedule" | "venues">("schedule");
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const canEdit = isSuperAdmin || isEventCoordinator;

  // Event form
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    trackId: "",
    venueId: "",
    startsAt: "2026-11-05T07:00",
    endsAt: "2026-11-05T08:00",
    type: "competition" as "ceremony" | "competition" | "break" | "judging" | "other",
  });

  // Venue form
  const [venueForm, setVenueForm] = useState({
    name: "",
    location: "",
    capacity: 200,
  });

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;

    await addScheduleItem({
      title: eventForm.title,
      description: eventForm.description,
      track_id: eventForm.trackId || null,
      venue_id: eventForm.venueId || null,
      starts_at: new Date(eventForm.startsAt).toISOString(),
      ends_at: new Date(eventForm.endsAt).toISOString(),
      type: eventForm.type,
    });

    setEventForm({
      title: "",
      description: "",
      trackId: "",
      venueId: "",
      startsAt: "2026-11-05T07:00",
      endsAt: "2026-11-05T08:00",
      type: "competition",
    });
    setEventModalOpen(false);
  };

  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueForm.name || !venueForm.location) return;

    await addVenue({
      name: venueForm.name,
      location: venueForm.location,
      capacity: Number(venueForm.capacity) || null,
    });

    setVenueForm({ name: "", location: "", capacity: 200 });
    setVenueModalOpen(false);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "competition":
        return "bg-[#FF5252] text-black";
      case "ceremony":
        return "bg-[#FFEB3B] text-black";
      case "judging":
        return "bg-[#2196F3] text-black";
      case "break":
      default:
        return "bg-[#4CAF50] text-black";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#FFEB3B] border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
            ADMIN WORKSPACE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Schedule & Campus Places Manager
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
            Super Admins & Event Coordinators: configure event phases, arena timings, and campus venue locations.
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setVenueModalOpen(true)}
              className="text-xs uppercase font-black bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#FFFBEB]"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Add Place</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEventModalOpen(true)}
              className="text-xs uppercase font-black bg-black text-white border-2 border-black shadow-[3px_3px_0px_#ffffff] hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Add Event Slot</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
            activeTab === "schedule"
              ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
              : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          📅 Timeline Events ({schedule.length})
        </button>
        <button
          onClick={() => setActiveTab("venues")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
            activeTab === "venues"
              ? "bg-[#FFEB3B] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
              : "bg-white text-black hover:bg-[#FFFBEB]"
          }`}
        >
          📍 Places & Venues ({venues.length})
        </button>
      </div>

      {/* TAB 1: SCHEDULE */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          {schedule.length === 0 ? (
            <div className="p-8 sm:p-12 border-[3px] border-dashed border-black bg-white shadow-[6px_6px_0px_#000000] text-center space-y-3">
              <div className="w-12 h-12 bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-black text-black">No Event Slots Configured Yet</h3>
              <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-md mx-auto">
                Build your fest timeline starting 5/11/2026. Click "Add Event Slot" to schedule competition heats, inaugural ceremonies, and meal breaks.
              </p>
              {canEdit && (
                <Button
                  onClick={() => setEventModalOpen(true)}
                  className="mt-3 text-xs uppercase font-black bg-[#2196F3] text-black border-2 border-black shadow-[3px_3px_0px_#000000]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Event Slot
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((item) => {
                const track = tracks.find((t) => t.id === item.track_id);
                const venue = venues.find((v) => v.id === item.venue_id);
                const startTime = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const endTime = new Date(item.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div
                    key={item.id}
                    className="p-5 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-24 flex-shrink-0 text-center">
                        <div className="p-1.5 bg-[#FFFBEB] border-2 border-black">
                          <span className="font-mono font-black text-xs text-black block">{startTime}</span>
                          <span className="text-[10px] font-bold text-slate-600 block">to {endTime}</span>
                        </div>
                        <span className={`inline-block mt-1 px-1.5 py-0.5 border border-black text-[9px] font-black uppercase ${getTypeBadge(item.type)}`}>
                          {item.type}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-black text-black text-base sm:text-lg">{item.title}</h3>
                        {item.description && <p className="text-xs font-medium text-slate-700">{item.description}</p>}
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-black pt-1">
                          <span className="flex items-center gap-1 bg-[#FFFBEB] border border-black px-2 py-0.5">
                            <MapPin className="w-3 h-3 text-black" />
                            {venue ? `${venue.name} (${venue.location})` : (item.venue_id || "Campus Venue")}
                          </span>
                          {track && (
                            <span className="bg-[#2196F3] text-black border border-black px-2 py-0.5 font-black text-[10px] uppercase">
                              Track: {track.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {canEdit && (
                      <button
                        onClick={() => deleteScheduleItem(item.id)}
                        className="self-end sm:self-center p-2 border-2 border-black bg-[#FF5252] text-black shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                        title="Delete event slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PLACES & VENUES */}
      {activeTab === "venues" && (
        <div className="space-y-4">
          {venues.length === 0 ? (
            <div className="p-8 sm:p-12 border-[3px] border-dashed border-black bg-white shadow-[6px_6px_0px_#000000] text-center space-y-3">
              <div className="w-12 h-12 bg-[#4CAF50] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-black text-black">No Campus Places Registered</h3>
              <p className="text-xs sm:text-sm font-bold text-slate-700 max-w-md mx-auto">
                Register campus venues, auditoriums, lab arenas, and maker courtyards. Once created, you can assign them directly to timeline events.
              </p>
              {canEdit && (
                <Button
                  onClick={() => setVenueModalOpen(true)}
                  className="mt-3 text-xs uppercase font-black bg-[#4CAF50] text-black border-2 border-black shadow-[3px_3px_0px_#000000]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Place
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="p-5 bg-white border-[3px] border-black shadow-[5px_5px_0px_#000000] flex items-start justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#4CAF50] border-2 border-black flex items-center justify-center">
                        <Building className="w-4 h-4 text-black" />
                      </div>
                      <h4 className="font-black text-base text-black">{venue.name}</h4>
                    </div>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-black" />
                      {venue.location}
                    </p>
                    {venue.capacity && (
                      <span className="inline-block px-2 py-0.5 bg-[#FFFBEB] border border-black text-[10px] font-black uppercase text-black">
                        Capacity: {venue.capacity} attendees
                      </span>
                    )}
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => deleteVenue(venue.id)}
                      className="p-2 border-2 border-black bg-[#FF5252] text-black shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                      title="Delete venue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD EVENT SLOT */}
      <Modal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        title="Add Event Slot to Schedule"
        description="Insert a round, competition heat, pit scrutiny, or ceremony into the fest timeline."
      >
        <form onSubmit={handleAddEvent} className="space-y-4 font-sans text-black">
          <div>
            <label className="text-xs font-black text-black block mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              placeholder="e.g. Robotics Round 1 Trials"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Description</label>
            <textarea
              rows={2}
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              placeholder="Details on what happens during this round..."
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-medium text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-black block mb-1">Event Type</label>
              <select
                value={eventForm.type}
                onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
              >
                <option value="competition">Competition</option>
                <option value="judging">Judging / Pitch</option>
                <option value="ceremony">Ceremony</option>
                <option value="break">Break / Meal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-black block mb-1">Assign Place / Venue</label>
              <select
                value={eventForm.venueId}
                onChange={(e) => setEventForm({ ...eventForm, venueId: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
              >
                <option value="">-- Select Campus Venue --</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Track / Arena (Optional)</label>
            <select
              value={eventForm.trackId}
              onChange={(e) => setEventForm({ ...eventForm, trackId: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
            >
              <option value="">General / All Tracks</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-black block mb-1">Starts At *</label>
              <input
                type="datetime-local"
                required
                value={eventForm.startsAt}
                onChange={(e) => setEventForm({ ...eventForm, startsAt: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
              >
              </input>
            </div>

            <div>
              <label className="text-xs font-black text-black block mb-1">Ends At *</label>
              <input
                type="datetime-local"
                required
                value={eventForm.endsAt}
                onChange={(e) => setEventForm({ ...eventForm, endsAt: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
              >
              </input>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEventModalOpen(false)}
              className="border-2 border-black text-xs font-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#FFEB3B] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase"
            >
              Publish to Timeline
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD PLACE / VENUE */}
      <Modal
        isOpen={venueModalOpen}
        onClose={() => setVenueModalOpen(false)}
        title="Add Campus Place / Venue"
        description="Register a new room, hall, courtyard, or arena location on campus."
      >
        <form onSubmit={handleAddVenue} className="space-y-4 font-sans text-black">
          <div>
            <label className="text-xs font-black text-black block mb-1">Venue Name *</label>
            <input
              type="text"
              required
              value={venueForm.name}
              onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
              placeholder="e.g. Main Auditorium, Robotics Arena Alpha"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Location / Building *</label>
            <input
              type="text"
              required
              value={venueForm.location}
              onChange={(e) => setVenueForm({ ...venueForm, location: e.target.value })}
              placeholder="e.g. Ground Floor, Tech Block"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Approximate Capacity</label>
            <input
              type="number"
              value={venueForm.capacity}
              onChange={(e) => setVenueForm({ ...venueForm, capacity: Number(e.target.value) })}
              placeholder="e.g. 350"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-bold text-black"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setVenueModalOpen(false)}
              className="border-2 border-black text-xs font-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#4CAF50] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase"
            >
              Save Campus Place
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
