"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ScheduleItem } from "@/lib/types/database";
import * as XLSX from "xlsx";
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
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
  FileText,
  Check,
  Sparkles,
  Pencil,
} from "lucide-react";

interface ParsedEventRow {
  index: number;
  rawTitle: string;
  title: string;
  description: string;
  type: "ceremony" | "competition" | "break" | "judging" | "other";
  venueName: string;
  venueId: string | null;
  trackName: string;
  trackId: string | null;
  startsAt: string;
  endsAt: string;
  isValid: boolean;
  validationError?: string;
  willCreateVenue?: boolean;
}

export default function OrganizerSchedulePage() {
  const {
    schedule,
    venues,
    tracks,
    addScheduleItem,
    updateScheduleItem,
    importScheduleItems,
    deleteScheduleItem,
    addVenue,
    deleteVenue,
    isSuperAdmin,
    isEventCoordinator,
  } = useFestStore();

  const [activeTab, setActiveTab] = useState<"schedule" | "venues">("schedule");
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const canEdit = isSuperAdmin || isEventCoordinator;

  // Single add event form
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    trackId: "",
    venueId: "",
    startsAt: "2026-11-05T09:00",
    endsAt: "2026-11-05T09:30",
    type: "competition" as "ceremony" | "competition" | "break" | "judging" | "other",
  });

  // Edit / Modify event form
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    trackId: "",
    venueId: "",
    startsAt: "2026-11-05T09:00",
    endsAt: "2026-11-05T09:30",
    type: "competition" as "ceremony" | "competition" | "break" | "judging" | "other",
  });

  // Venue form
  const [venueForm, setVenueForm] = useState({
    name: "",
    location: "",
    capacity: 200,
  });

  // Excel / CSV Import State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedEventRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Helper to convert ISO string to YYYY-MM-DDTHH:mm for datetime-local
  const toDatetimeLocal = (isoString?: string | null): string => {
    if (!isoString) return "2026-11-05T09:00";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "2026-11-05T09:00";
      const pad = (n: number) => String(n).padStart(2, "0");
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "2026-11-05T09:00";
    }
  };

  // Helper to parse dates and times robustly
  const parseEventDateTime = (val: any, defaultTime: string, defaultDate = "2026-11-05"): string => {
    if (!val) {
      return new Date(`${defaultDate}T${defaultTime}:00`).toISOString();
    }

    if (val instanceof Date && !isNaN(val.getTime())) {
      return val.toISOString();
    }

    if (typeof val === "number") {
      if (val >= 0 && val < 1) {
        const totalMinutes = Math.round(val * 24 * 60);
        const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
        const mins = String(totalMinutes % 60).padStart(2, "0");
        return new Date(`${defaultDate}T${hours}:${mins}:00`).toISOString();
      }
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const parsed = new Date(excelEpoch.getTime() + val * 86400 * 1000);
      if (!isNaN(parsed.getTime())) return parsed.toISOString();
    }

    const str = String(val).trim();

    const direct = new Date(str);
    if (!isNaN(direct.getTime()) && str.includes("-") && str.length >= 10) {
      return direct.toISOString();
    }

    const slashMatch = str.match(/^(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i);
    if (slashMatch) {
      let [, p1, p2, year, hour = "9", min = "0", , ampm] = slashMatch;
      let h = parseInt(hour, 10);
      if (ampm) {
        if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
        if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
      }
      const d = parseInt(p1, 10);
      const m = parseInt(p2, 10);
      const day = d <= 31 && m <= 12 ? d : m;
      const month = d <= 31 && m <= 12 ? m : d;
      return new Date(Date.UTC(parseInt(year, 10), month - 1, day, h, parseInt(min, 10))).toISOString();
    }

    const timeMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (timeMatch) {
      let [, hour, min, , ampm] = timeMatch;
      let h = parseInt(hour, 10);
      if (ampm) {
        if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
        if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
      }
      const hStr = String(h).padStart(2, "0");
      return new Date(`${defaultDate}T${hStr}:${min}:00`).toISOString();
    }

    return new Date(`${defaultDate}T${defaultTime}:00`).toISOString();
  };

  // Helper to map event type strings
  const normalizeEventType = (val: string): "ceremony" | "competition" | "break" | "judging" | "other" => {
    const s = String(val || "").toLowerCase().trim();
    if (s.includes("break") || s.includes("lunch") || s.includes("tea") || s.includes("snack") || s.includes("refreshment")) {
      return "break";
    }
    if (s.includes("ceremony") || s.includes("inaugur") || s.includes("valedict") || s.includes("award") || s.includes("closing") || s.includes("opening")) {
      return "ceremony";
    }
    if (s.includes("judg") || s.includes("pitch") || s.includes("eval") || s.includes("defense") || s.includes("jury")) {
      return "judging";
    }
    if (s.includes("comp") || s.includes("heat") || s.includes("round") || s.includes("trial") || s.includes("match") || s.includes("arena")) {
      return "competition";
    }
    return "competition";
  };

  // Parse uploaded Excel or CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setIsProcessing(true);
    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        if (!buffer) throw new Error("Empty file content");

        const wb = XLSX.read(buffer, { type: "array", cellDates: true });
        const sheetName = wb.SheetNames[0];
        if (!sheetName) throw new Error("No sheet found in workbook");

        const ws = wb.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!rawJson || rawJson.length === 0) {
          throw new Error("Spreadsheet contains no data rows.");
        }

        const rows: ParsedEventRow[] = rawJson.map((row, idx) => {
          const keys = Object.keys(row);
          const findVal = (...terms: string[]) => {
            const foundKey = keys.find((k) =>
              terms.some((term) => k.toLowerCase().replace(/[^a-z0-9]/g, "").includes(term))
            );
            return foundKey ? row[foundKey] : "";
          };

          const rawTitle = String(findVal("title", "eventname", "name", "event") || "").trim();
          const description = String(findVal("desc", "detail", "info", "summary") || "").trim();
          const rawType = String(findVal("type", "category", "roundtype") || "competition");
          const venueVal = String(findVal("venue", "place", "location", "room", "hall", "arena") || "").trim();
          const trackVal = String(findVal("track", "stream", "competition") || "").trim();
          const startsVal = findVal("start", "from", "begin", "time");
          const endsVal = findVal("end", "to", "finish");

          // Match Venue
          let matchedVenue = venues.find(
            (v) =>
              v.name.toLowerCase() === venueVal.toLowerCase() ||
              v.location.toLowerCase().includes(venueVal.toLowerCase())
          );
          const willCreateVenue = !matchedVenue && venueVal.length > 0;

          // Match Track
          let matchedTrack = tracks.find(
            (t) =>
              t.name.toLowerCase() === trackVal.toLowerCase() ||
              t.slug.toLowerCase() === trackVal.toLowerCase() ||
              trackVal.toLowerCase().includes(t.name.toLowerCase())
          );

          // Parse times
          const startsAt = parseEventDateTime(startsVal, "09:30");
          const endsAt = parseEventDateTime(endsVal, "10:30");

          const isValid = rawTitle.length > 0;
          const validationError = !isValid ? "Event title is missing" : undefined;

          return {
            index: idx + 1,
            rawTitle,
            title: rawTitle,
            description,
            type: normalizeEventType(rawType),
            venueName: venueVal,
            venueId: matchedVenue ? matchedVenue.id : null,
            trackName: matchedTrack ? matchedTrack.name : trackVal,
            trackId: matchedTrack ? matchedTrack.id : null,
            startsAt,
            endsAt,
            isValid,
            validationError,
            willCreateVenue,
          };
        });

        setParsedRows(rows);
      } catch (err: any) {
        console.error("Excel parse error:", err);
        setImportError(err.message || "Failed to parse spreadsheet file.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setImportError("Error reading the selected file.");
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Download Sample Template (Excel .xlsx or CSV)
  const downloadSampleTemplate = (format: "xlsx" | "csv") => {
    const sampleRows = [
      {
        "Event Title": "Robotics Arena Trials - Heat 1",
        "Description": "Autonomous line follower scrutiny and obstacle trials",
        "Event Type": "competition",
        "Venue / Place": "College Dome",
        "Track": "Robotics",
        "Starts At": "2026-11-05 09:30",
        "Ends At": "2026-11-05 11:00",
      },
      {
        "Event Title": "Tech Quiz Prelims",
        "Description": "Elimination written quiz round for all schools",
        "Event Type": "competition",
        "Venue / Place": "College Auditorium",
        "Track": "Quiz",
        "Starts At": "2026-11-05 10:00",
        "Ends At": "2026-11-05 11:30",
      },
      {
        "Event Title": "Lunch & Maker Networking",
        "Description": "Complimentary lunch in dining area for student delegations",
        "Event Type": "break",
        "Venue / Place": "Near Reception",
        "Track": "",
        "Starts At": "2026-11-05 12:30",
        "Ends At": "2026-11-05 13:30",
      },
      {
        "Event Title": "Ideathon Stage Final Defense",
        "Description": "5-minute pitch before jury of industry evaluators",
        "Event Type": "judging",
        "Venue / Place": "Smart Classroom (2nd Floor)",
        "Track": "Ideathon",
        "Starts At": "2026-11-05 14:00",
        "Ends At": "2026-11-05 16:00",
      },
      {
        "Event Title": "Grand Valedictory & Award Ceremony",
        "Description": "Distribution of championship trophy, certificates and shields",
        "Event Type": "ceremony",
        "Venue / Place": "College Auditorium",
        "Track": "",
        "Starts At": "2026-11-05 16:30",
        "Ends At": "2026-11-05 18:00",
      },
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleRows);

    ws["!cols"] = [
      { wch: 32 },
      { wch: 45 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Fest_Schedule");

    if (format === "csv") {
      XLSX.writeFile(wb, "spark_event_schedule_template.csv", { bookType: "csv" });
    } else {
      XLSX.writeFile(wb, "spark_event_schedule_template.xlsx");
    }
  };

  // Commit the parsed events
  const handleConfirmImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) return;

    setIsImporting(true);
    setImportError(null);

    try {
      // 1. Auto-create any new venues
      const createdVenuesMap = new Map<string, string>();
      for (const row of validRows) {
        if (row.willCreateVenue && row.venueName && !createdVenuesMap.has(row.venueName.toLowerCase())) {
          const newVenue = await addVenue({
            name: row.venueName,
            location: "Main Campus Grounds",
            capacity: 200,
          });
          createdVenuesMap.set(row.venueName.toLowerCase(), newVenue.id);
        }
      }

      // 2. Prepare final schedule items
      const itemsToInsert = validRows.map((row) => {
        let venueId = row.venueId;
        if (!venueId && row.venueName) {
          venueId = createdVenuesMap.get(row.venueName.toLowerCase()) || null;
        }

        return {
          title: row.title,
          description: row.description || null,
          track_id: row.trackId || null,
          venue_id: venueId || null,
          starts_at: row.startsAt,
          ends_at: row.endsAt,
          type: row.type,
        };
      });

      const count = await importScheduleItems(itemsToInsert);

      setImportSuccess(`Successfully imported ${count} event ${count === 1 ? "slot" : "slots"} into the fest timeline!`);
      setTimeout(() => {
        setImportModalOpen(false);
        setParsedRows([]);
        setImportFile(null);
        setImportSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error("Import failed:", err);
      setImportError(err.message || "Failed to import schedule items.");
    } finally {
      setIsImporting(false);
    }
  };

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

  // Open Edit / Modify Modal
  const openEditModal = (item: ScheduleItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      description: item.description || "",
      trackId: item.track_id || "",
      venueId: item.venue_id || "",
      startsAt: toDatetimeLocal(item.starts_at),
      endsAt: toDatetimeLocal(item.ends_at),
      type: item.type,
    });
    setEditModalOpen(true);
  };

  // Submit Edit / Modify
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editForm.title) return;

    await updateScheduleItem(editingItem.id, {
      title: editForm.title,
      description: editForm.description || null,
      track_id: editForm.trackId || null,
      venue_id: editForm.venueId || null,
      starts_at: new Date(editForm.startsAt).toISOString(),
      ends_at: new Date(editForm.endsAt).toISOString(),
      type: editForm.type,
    });

    setEditModalOpen(false);
    setEditingItem(null);
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

  // Route Guard: Event Coordinator & Super Admin Only
  if (!canEdit) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] text-center">
        <div className="w-12 h-12 bg-[#FF5252] border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#000]">
          <Calendar className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-xl font-black text-black">Schedule Editor Clearance Required</h2>
        <p className="text-xs font-bold text-slate-700 mt-2">
          Only Event Coordinators and Super Administrators have clearance to edit timetables, stages, and venues.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span>View Public Schedule</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#FFEB3B] border-[3px] border-black shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
            ADMIN & COORDINATOR WORKSPACE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Schedule & Campus Places Manager
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
            Configure event rounds, arena heats, stage assignments, or import full schedules directly via Excel.
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
            {/* IMPORT EXCEL BUTTON */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="text-xs uppercase font-black bg-[#4CAF50] text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#81C784] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              <span>Import Excel</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setVenueModalOpen(true)}
              className="text-xs uppercase font-black bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#FFFBEB] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Add Place</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setEventModalOpen(true)}
              className="text-xs uppercase font-black bg-black text-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-slate-800 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
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
                Build your fest timeline starting 5/11/2026. Import your complete event timetable via Excel or add slots manually.
              </p>
              {canEdit && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    onClick={() => setImportModalOpen(true)}
                    className="text-xs uppercase font-black bg-[#4CAF50] text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#81C784]"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-1.5" />
                    Import from Excel
                  </Button>
                  <Button
                    onClick={() => setEventModalOpen(true)}
                    className="text-xs uppercase font-black bg-[#FFEB3B] text-black border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-black hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event Slot
                  </Button>
                </div>
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
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* MODIFY BUTTON */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1.5 border-2 border-black bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase"
                          title="Modify event details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Modify</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => deleteScheduleItem(item.id)}
                          className="p-1.5 border-2 border-black bg-[#FF5252] text-black shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                          title="Delete event slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* MODAL 1: IMPORT SCHEDULE VIA EXCEL / CSV */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => {
          if (!isImporting) {
            setImportModalOpen(false);
            setParsedRows([]);
            setImportFile(null);
            setImportError(null);
            setImportSuccess(null);
          }
        }}
        title="Import Schedule from Excel / CSV"
        description="Upload an Excel spreadsheet (.xlsx, .xls) or CSV file with your complete fest timeline events."
      >
        <div className="space-y-5 font-sans text-black">
          {/* Download Template Banner */}
          <div className="p-4 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-black flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#4CAF50]" />
                <span>Need a ready-made format?</span>
              </p>
              <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                Download our pre-formatted schedule template with sample rounds and timings.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                type="button"
                size="sm"
                onClick={() => downloadSampleTemplate("xlsx")}
                className="text-[11px] font-black bg-[#4CAF50] text-black border border-black shadow-[2px_2px_0px_#000000] hover:bg-[#81C784]"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Excel (.xlsx)</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => downloadSampleTemplate("csv")}
                className="text-[11px] font-black bg-white text-black border border-black shadow-[2px_2px_0px_#000000]"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>CSV</span>
              </Button>
            </div>
          </div>

          {/* Upload Zone */}
          <div>
            <label className="text-xs font-black text-black block mb-1">
              Select or Drop Spreadsheet File (.xlsx, .xls, .csv)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-[3px] border-dashed border-black bg-white hover:bg-[#FFFBEB] transition-colors cursor-pointer text-center group"
            >
              <Upload className="w-8 h-8 text-black mx-auto mb-2 group-hover:-translate-y-0.5 transition-transform" />
              <p className="text-xs font-black text-black">
                {importFile ? importFile.name : "Click to browse or drag file here"}
              </p>
              <p className="text-[10px] font-bold text-slate-600 mt-1">
                Supported formats: Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-3 bg-[#FFEB3B] border-2 border-black text-xs font-black flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin text-black" />
              <span>Analyzing spreadsheet headers and rows...</span>
            </div>
          )}

          {/* Error Message */}
          {importError && (
            <div className="p-3 bg-[#FF5252] text-black border-2 border-black text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-4 h-4 text-black flex-shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Success Message */}
          {importSuccess && (
            <div className="p-3 bg-[#4CAF50] text-black border-2 border-black text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b-2 border-black">
                <span className="text-xs font-black uppercase text-black">
                  Preview: {parsedRows.filter((r) => r.isValid).length} of {parsedRows.length} Events Valid
                </span>
                <span className="text-[11px] font-bold text-slate-700">
                  {parsedRows.filter((r) => r.willCreateVenue).length > 0 &&
                    `(${parsedRows.filter((r) => r.willCreateVenue).length} new campus venues will be auto-created)`}
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto border-2 border-black bg-white shadow-[2px_2px_0px_#000000]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black text-white font-black uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Event Title</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Venue / Place</th>
                      <th className="p-2">Track</th>
                      <th className="p-2">Starts</th>
                      <th className="p-2">Ends</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black font-bold">
                    {parsedRows.map((row) => (
                      <tr key={row.index} className={row.isValid ? "hover:bg-[#FFFBEB]" : "bg-[#FF5252]/20"}>
                        <td className="p-2 font-mono text-[10px]">{row.index}</td>
                        <td className="p-2 font-black text-black">
                          {row.title || <span className="text-[#D32F2F] italic">Missing Title</span>}
                          {row.description && <p className="text-[10px] font-normal text-slate-600 line-clamp-1">{row.description}</p>}
                        </td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.2 border border-black text-[9px] font-black uppercase ${getTypeBadge(row.type)}`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="p-2 text-[11px]">
                          {row.venueName ? (
                            <span className="flex items-center gap-1">
                              <span>{row.venueName}</span>
                              {row.willCreateVenue && (
                                <span className="text-[9px] bg-[#FFEB3B] text-black border border-black px-1 uppercase font-black">
                                  +New Place
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-normal">--</span>
                          )}
                        </td>
                        <td className="p-2 text-[11px]">
                          {row.trackName ? (
                            <span className="bg-[#2196F3] text-black border border-black px-1.5 py-0.2 font-black text-[9px] uppercase">
                              {row.trackName}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-normal">General</span>
                          )}
                        </td>
                        <td className="p-2 font-mono text-[10px]">
                          {new Date(row.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="p-2 font-mono text-[10px]">
                          {new Date(row.endsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isImporting}
              onClick={() => {
                setImportModalOpen(false);
                setParsedRows([]);
                setImportFile(null);
              }}
              className="border-2 border-black text-xs font-black"
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={parsedRows.filter((r) => r.isValid).length === 0 || isImporting}
              onClick={handleConfirmImport}
              className="bg-[#4CAF50] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase hover:bg-[#81C784]"
            >
              {isImporting ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing Events...</span>
                </span>
              ) : (
                <span>Confirm & Import ({parsedRows.filter((r) => r.isValid).length} Events)</span>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: ADD EVENT SLOT (SINGLE) */}
      <Modal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        title="Add Event Slot to Schedule"
        description="Insert a round, competition heat, pit scrutiny, or ceremony into the fest timeline."
      >
        <form onSubmit={handleAddEvent} className="space-y-4 font-sans text-black">
          {/* Quick link to import Excel */}
          <div className="p-2.5 bg-[#FFFBEB] border-2 border-black flex items-center justify-between text-xs font-bold shadow-[2px_2px_0px_#000]">
            <span>Have multiple rounds or timeline slots?</span>
            <button
              type="button"
              onClick={() => {
                setEventModalOpen(false);
                setImportModalOpen(true);
              }}
              className="underline font-black text-black flex items-center gap-1 hover:bg-[#FFEB3B] px-1.5 py-0.5 border border-black bg-white cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#4CAF50]" />
              <span>Import Excel</span>
            </button>
          </div>

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
              />
            </div>

            <div>
              <label className="text-xs font-black text-black block mb-1">Ends At *</label>
              <input
                type="datetime-local"
                required
                value={eventForm.endsAt}
                onChange={(e) => setEventForm({ ...eventForm, endsAt: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
              />
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

      {/* MODAL 3: MODIFY EVENT SLOT */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        title={`Modify Event Slot: ${editingItem?.title || ""}`}
        description="Update event schedule timings, assigned campus places, or track competitions."
      >
        <form onSubmit={handleUpdateEvent} className="space-y-4 font-sans text-black">
          <div>
            <label className="text-xs font-black text-black block mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="e.g. Robotics Round 1 Trials"
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-bold text-black"
            />
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Description</label>
            <textarea
              rows={2}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Details on what happens during this round..."
              className="w-full px-3 py-2 border-2 border-black bg-[#FFFBEB] text-xs font-medium text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-black block mb-1">Event Type</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
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
                value={editForm.venueId}
                onChange={(e) => setEditForm({ ...editForm, venueId: e.target.value })}
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
              value={editForm.trackId}
              onChange={(e) => setEditForm({ ...editForm, trackId: e.target.value })}
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
                value={editForm.startsAt}
                onChange={(e) => setEditForm({ ...editForm, startsAt: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
              />
            </div>

            <div>
              <label className="text-xs font-black text-black block mb-1">Ends At *</label>
              <input
                type="datetime-local"
                required
                value={editForm.endsAt}
                onChange={(e) => setEditForm({ ...editForm, endsAt: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditModalOpen(false);
                setEditingItem(null);
              }}
              className="border-2 border-black text-xs font-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#FFEB3B] text-black border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-black uppercase hover:bg-black hover:text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: ADD PLACE / VENUE */}
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
