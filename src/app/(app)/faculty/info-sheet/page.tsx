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

    // Neubrutalist Header Block
    doc.setFillColor(255, 235, 59); // #FFEB3B
    doc.rect(0, 0, 210, 35, "F");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.5);
    doc.line(0, 35, 210, 35);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SPARK 2026 • VISITING FACULTY BRIEFING", 15, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("1-Page Official Orientation & Emergency Handbook", 15, 26);

    let y = 45;

    // Emergency Contacts Box
    doc.setFillColor(255, 251, 235); // #FFFBEB
    doc.rect(15, y, 180, 24, "FD");
    doc.setTextColor(0, 0, 0);
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

    doc.save("SPARK-Faculty-Orientation-Sheet.pdf");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <Badge variant="default" className="mb-1.5">
            ORIENTATION HANDBOOK
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-black">
            1-Page Printable Info Sheet
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1">
            Complete schedule, venue locations, track regulations, and emergency contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => window.print()} className="text-xs">
            <Printer className="h-4 w-4 mr-1.5" />
            <span>Print Sheet</span>
          </Button>
          <Button variant="yellow" size="sm" onClick={handleDownloadPDF} className="text-xs">
            <Download className="h-4 w-4 mr-1.5" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Emergency Hotline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 border-[3px] border-black bg-white shadow-[3px_3px_0px_#000000] flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-[#2196F3] text-black shadow-[2px_2px_0px_#000000] flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-700 uppercase font-black">Helpdesk Hotline</p>
            <p className="text-xs font-mono font-black text-black truncate">+91 98765 00001</p>
          </div>
        </div>

        <div className="p-4 border-[3px] border-black bg-white shadow-[3px_3px_0px_#000000] flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-[#FF5252] text-black shadow-[2px_2px_0px_#000000] flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-700 uppercase font-black">Campus Medical</p>
            <p className="text-xs font-mono font-black text-black truncate">+91 98765 00099</p>
          </div>
        </div>

        <div className="p-4 border-[3px] border-black bg-white shadow-[3px_3px_0px_#000000] flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-[#4CAF50] text-black shadow-[2px_2px_0px_#000000] flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-700 uppercase font-black">Faculty Hospitality</p>
            <p className="text-xs font-mono font-black text-black truncate">+91 94471 23456</p>
          </div>
        </div>
      </div>

      {/* Sheet Content Card */}
      <div className="p-6 sm:p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] space-y-8">
        {/* Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black">
            <Calendar className="w-5 h-5 text-black" />
            <h2 className="text-base font-black text-black uppercase tracking-wider">
              Fest Day Timeline
            </h2>
          </div>

          <div className="space-y-3">
            {schedule.slice(0, 8).map((sc) => {
              const time = new Date(sc.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={sc.id} className="flex items-start gap-4 p-3 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000] text-xs">
                  <span className="font-mono font-black text-black bg-[#FFEB3B] border border-black px-2 py-0.5 flex-shrink-0">{time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-black">{sc.title}</p>
                    <p className="text-slate-800 font-medium mt-0.5">{sc.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue Map Directory */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black">
            <MapPin className="w-5 h-5 text-black" />
            <h2 className="text-base font-black text-black uppercase tracking-wider">
              Campus Venue Locations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
              <span className="font-black text-black block">Central Quadrangle</span>
              <span className="text-slate-800 font-medium mt-1 block">Ground Floor, Academic Block A • Registration, Kits & Dining</span>
            </div>
            <div className="p-3.5 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
              <span className="font-black text-black block">Main Auditorium</span>
              <span className="text-slate-800 font-medium mt-1 block">Second Floor, Central Hub • Inauguration & Valedictory Ceremony</span>
            </div>
            <div className="p-3.5 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
              <span className="font-black text-black block">Robotics Arena Alpha</span>
              <span className="text-slate-800 font-medium mt-1 block">Mechanical Workshop Hall • Course speed runs & obstacle finals</span>
            </div>
            <div className="p-3.5 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
              <span className="font-black text-black block">Scrap Fabrication Bay 4</span>
              <span className="text-slate-800 font-medium mt-1 block">Rear Industrial Yard • Scrap allotment & power tool bay</span>
            </div>
          </div>
        </div>

        {/* Safety & Honorarium Instructions */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black">
            <ShieldAlert className="w-5 h-5 text-black" />
            <h2 className="text-base font-black text-black uppercase tracking-wider">
              Safety Regulations & Faculty Travel Desk
            </h2>
          </div>

          <div className="p-4 border-2 border-black bg-[#FFEB3B] text-black text-xs font-bold shadow-[3px_3px_0px_#000000] space-y-2">
            <p>• <strong>Eye Protection:</strong> Safety glasses and cut-resistant gloves are mandatory in Scrap Bay 4.</p>
            <p>• <strong>Battery Specs:</strong> Max voltage of 12V DC strictly enforced for all robots in Arena Alpha.</p>
            <p>• <strong>Travel Reimbursement:</strong> Visiting faculty coordinators may submit travel tickets and endorsement forms at Room 102 between 01:30 PM and 03:30 PM for honorarium processing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}