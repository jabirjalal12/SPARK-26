"use client";

import React from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  Calendar,
  MapPin,
  Phone,
  ShieldAlert,
  Clock,
  Building2,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";

export default function FacultyInfoSheetPage() {
  const { schedule, tracks } = useFestStore();

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Dark banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("MAKE//BREAK 2026 • VISITING FACULTY BRIEFING", 15, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("1-Page Official Orientation & Emergency Handbook", 15, 26);

    let y = 45;

    // Emergency Contacts Box
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 180, 24, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CAMPUS EMERGENCY & HELPLINES", 20, y + 7);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Registration Desk: +91 98765 00001 (Quad Booth 1)", 20, y + 14);
    doc.text("Campus Medical Center: +91 98765 00099 (Ground Fl)", 20, y + 20);
    doc.text("Faculty Hospitality: +91 94471 23456 (Room 102)", 110, y + 14);
    doc.text("Control Room / Chief Marshall: +91 98765 00002", 110, y + 20);

    y += 32;

    // Schedule Timeline
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL EVENT TIMELINE", 15, y);
    y += 5;
    doc.line(15, y, 195, y);
    y += 7;

    doc.setFontSize(9);
    schedule.slice(0, 8).forEach((item) => {
      const time = new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      doc.setFont("helvetica", "bold");
      doc.text(time, 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.title} (${item.venue_id || "Main Campus"})`, 35, y);
      y += 6;
    });

    y += 8;

    // Venue Directory
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CAMPUS VENUE DIRECTORY", 15, y);
    y += 5;
    doc.line(15, y, 195, y);
    y += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("• Central Quadrangle: Desk Check-in, Kit Collection & Dining", 15, y); y += 6;
    doc.text("• Main Auditorium (2nd Floor): Inauguration, Rules Keynote & Valedictory Gala", 15, y); y += 6;
    doc.text("• Robotics Arena Alpha (Mechanical Workshop): Timed Trials & Head-to-Head Finals", 15, y); y += 6;
    doc.text("• Scrap Fabrication Yard (Bay 4): Material Allotment & 4-Hour Rapid Prototyping", 15, y); y += 6;
    doc.text("• Tinkering Lab (Room 304): Useless Projects Pitch Arena", 15, y); y += 10;

    // Safety and Rules
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("MANDATORY SAFETY & CODE OF CONDUCT", 15, y);
    y += 5;
    doc.line(15, y, 195, y);
    y += 7;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text("1. Protective eyewear & gloves are strictly required inside Scrap Yard Bay 4 at all times.", 15, y); y += 5;
    doc.text("2. Max battery limit for Robotics arena is 12V DC. Pre-trial safety inspection is required.", 15, y); y += 5;
    doc.text("3. Minor Student Privacy: Students have no logins and cannot be photographed without badge consent.", 15, y); y += 5;
    doc.text("4. Visiting Faculty Honorarium & TA/DA reimbursement claims must be submitted by 03:30 PM.", 15, y);

    doc.save("MAKEBREAK-Faculty-Orientation-Sheet.pdf");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            ORIENTATION HANDBOOK
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            1-Page Printable Info Sheet
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete schedule, venue locations, track regulations, and emergency contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => window.print()} className="text-xs">
            <Printer className="h-4 w-4 mr-1.5" />
            <span>Print Sheet</span>
          </Button>
          <Button variant="gradient" size="sm" onClick={handleDownloadPDF} className="text-xs">
            <Download className="h-4 w-4 mr-1.5" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Emergency Hotline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <GlassCard className="p-4 border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Helpdesk Hotline</p>
            <p className="text-xs font-mono font-bold text-white truncate">+91 98765 00001</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Campus Medical</p>
            <p className="text-xs font-mono font-bold text-white truncate">+91 98765 00099</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Faculty Hospitality</p>
            <p className="text-xs font-mono font-bold text-white truncate">+91 94471 23456</p>
          </div>
        </GlassCard>
      </div>

      {/* Sheet Content Card */}
      <GlassCard className="p-6 sm:p-8 border-white/15 space-y-8 bg-slate-900/80 backdrop-blur-2xl">
        {/* Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Fest Day Timeline
            </h2>
          </div>

          <div className="space-y-3">
            {schedule.slice(0, 8).map((sc) => {
              const time = new Date(sc.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={sc.id} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <span className="font-mono font-bold text-indigo-300 w-18 flex-shrink-0">{time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{sc.title}</p>
                    <p className="text-slate-400 mt-0.5">{sc.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue Map Directory */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Campus Venue Locations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="font-bold text-white block">Central Quadrangle</span>
              <span className="text-slate-400 mt-1 block">Ground Floor, Academic Block A • Registration, Kits & Dining</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="font-bold text-white block">Main Auditorium</span>
              <span className="text-slate-400 mt-1 block">Second Floor, Central Hub • Inauguration & Valedictory Ceremony</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="font-bold text-white block">Robotics Arena Alpha</span>
              <span className="text-slate-400 mt-1 block">Mechanical Workshop Hall • Course speed runs & obstacle finals</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="font-bold text-white block">Scrap Fabrication Bay 4</span>
              <span className="text-slate-400 mt-1 block">Rear Industrial Yard • Scrap allotment & power tool bay</span>
            </div>
          </div>
        </div>

        {/* Safety & Honorarium Instructions */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Safety Regulations & Faculty Travel Desk
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 space-y-2">
            <p>• <strong>Eye Protection:</strong> Safety glasses and cut-resistant gloves are mandatory in Scrap Bay 4.</p>
            <p>• <strong>Battery Specs:</strong> Max voltage of 12V DC strictly enforced for all robots in Arena Alpha.</p>
            <p>• <strong>Travel Reimbursement:</strong> Visiting faculty coordinators may submit travel tickets and endorsement forms at Room 102 between 01:30 PM and 03:30 PM for honorarium processing.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
