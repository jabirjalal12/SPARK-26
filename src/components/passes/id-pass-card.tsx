"use client";

import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import {
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building2,
  Calendar,
  User,
  QrCode,
  Award,
  Layers,
} from "lucide-react";

export type PassRole = "faculty" | "volunteer" | "judge" | "organizer" | "student" | "event_coordinator" | "registration_head";

export interface IdPassProps {
  role: PassRole;
  name: string;
  badgeNumber: string;
  title?: string;
  organization?: string;
  qrToken?: string;
  accessLevel?: string;
  trackName?: string;
  tableNumber?: string;
  issuedAt?: string;
  metadata?: { label: string; value: string }[];
}

export function IdPassCard({
  role,
  name,
  badgeNumber,
  title,
  organization = "ACE Engineering College",
  qrToken,
  accessLevel,
  trackName,
  tableNumber,
  issuedAt = "NOV 2026",
  metadata = [],
}: IdPassProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const badgeRef = useRef<HTMLDivElement>(null);

  const tokenValue = qrToken || `SPK26-${role.toUpperCase()}-${badgeNumber}`;

  useEffect(() => {
    QRCode.toDataURL(tokenValue, {
      width: 280,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Error:", err));
  }, [tokenValue]);

  // Role visual configuration
  const roleConfig: Record<
    PassRole,
    {
      bannerBg: string;
      bannerText: string;
      roleTitle: string;
      accessBadge: string;
      roleTagColor: string;
      themeBorder: string;
    }
  > = {
    faculty: {
      bannerBg: "bg-[#4CAF50]",
      bannerText: "text-black",
      roleTitle: "VISITING FACULTY LEAD",
      accessBadge: "DELEGATION ACCESS • VISITOR LOUNGE • CAMPUS ARENA",
      roleTagColor: "bg-[#FFEB3B]",
      themeBorder: "border-[#4CAF50]",
    },
    judge: {
      bannerBg: "bg-[#9C27B0]",
      bannerText: "text-white",
      roleTitle: "OFFICIAL FEST JUDGE",
      accessBadge: "ALL-ACCESS • JURY ROOM • EVALUATION DESK",
      roleTagColor: "bg-[#FFEB3B]",
      themeBorder: "border-[#9C27B0]",
    },
    volunteer: {
      bannerBg: "bg-[#2196F3]",
      bannerText: "text-black",
      roleTitle: "OPERATIONS VOLUNTEER",
      accessBadge: "REGISTRATION DESK • ARENA FLOOR • OPS CREW",
      roleTagColor: "bg-[#FFFBEB]",
      themeBorder: "border-[#2196F3]",
    },
    organizer: {
      bannerBg: "bg-black",
      bannerText: "text-[#FFEB3B]",
      roleTitle: "SUPER ADMINISTRATOR",
      accessBadge: "FULL CAMPUS ACCESS • ALL AREAS • ADMIN HQ",
      roleTagColor: "bg-[#FFEB3B]",
      themeBorder: "border-black",
    },
    event_coordinator: {
      bannerBg: "bg-[#FF5252]",
      bannerText: "text-black",
      roleTitle: "EVENT OPERATIONS COORDINATOR",
      accessBadge: "FULL CAMPUS ACCESS • ALL ARENAS • STAGE • HQ",
      roleTagColor: "bg-[#FFEB3B]",
      themeBorder: "border-[#FF5252]",
    },
    registration_head: {
      bannerBg: "bg-[#00BCD4]",
      bannerText: "text-black",
      roleTitle: "HEAD OF REGISTRATION",
      accessBadge: "REGISTRATION DESK • ALL ACCESS • ADMIN HQ",
      roleTagColor: "bg-[#FFEB3B]",
      themeBorder: "border-[#00BCD4]",
    },
    student: {
      bannerBg: "bg-[#FF9800]",
      bannerText: "text-black",
      roleTitle: "STUDENT COMPETITOR",
      accessBadge: "PARTICIPANT • ARENA FLOOR • COMPETITION STATIONS",
      roleTagColor: "bg-[#FFFBEB]",
      themeBorder: "border-[#FF9800]",
    },
  };

  const config = roleConfig[role] || roleConfig.organizer;
  const finalAccess = accessLevel || config.accessBadge;

  // PDF Badge Generation
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 160], // Standard Conference Badge size (100mm x 160mm)
    });

    // Outer Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.2);
    doc.rect(3, 3, 94, 154);

    // Lanyard punch hole representation
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(42, 6, 16, 3.5, 1.5, 1.5, "F");

    // Header Background
    if (role === "judge") doc.setFillColor(156, 39, 176); // Purple
    else if (role === "faculty") doc.setFillColor(76, 175, 80); // Green
    else if (role === "volunteer") doc.setFillColor(33, 150, 243); // Blue
    else if (role === "student") doc.setFillColor(255, 152, 0); // Orange
    else if (role === "event_coordinator") doc.setFillColor(255, 82, 82); // Red
    else if (role === "registration_head") doc.setFillColor(0, 188, 212); // Cyan
    else doc.setFillColor(0, 0, 0); // Black

    doc.rect(3, 14, 94, 28, "F");
    doc.line(3, 42, 97, 42);

    // Header Text
    doc.setTextColor(role === "judge" || role === "organizer" ? 255 : 0, role === "organizer" ? 235 : role === "judge" ? 255 : 0, role === "organizer" ? 59 : role === "judge" ? 255 : 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SPARK 2026", 50, 25, { align: "center" });

    doc.setFontSize(8.5);
    doc.text(config.roleTitle, 50, 33, { align: "center" });
    doc.setFontSize(6.5);
    doc.text("COLLEGE CAMPUS • OFFICIAL CREDENTIAL", 50, 39, { align: "center" });

    // Attendee Name
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(name, 50, 54, { align: "center" });

    // Affiliation / Title
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    if (title) doc.text(title, 50, 60, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(organization, 50, 66, { align: "center" });

    // Badge Serial & Track
    doc.setFillColor(255, 235, 59); // Yellow Box
    doc.rect(15, 71, 70, 7, "FD");
    doc.setFontSize(7.5);
    doc.text(`ID: ${badgeNumber}  |  ${trackName || issuedAt}`, 50, 75.8, { align: "center" });

    // QR Code Image
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, "PNG", 30, 83, 40, 40);
    }

    // Access Level Banner
    doc.setFillColor(240, 240, 240);
    doc.rect(8, 126, 84, 10, "F");
    doc.setDrawColor(0, 0, 0);
    doc.rect(8, 126, 84, 10);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("ACCESS LEVEL", 50, 130, { align: "center" });
    doc.setFontSize(5.5);
    doc.text(finalAccess, 50, 134, { align: "center" });

    // Footer Security Notice
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.text("Tamper-proof credential. Must be worn visibly on campus.", 50, 144, { align: "center" });
    doc.text(`Token: ${tokenValue.substring(0, 26)}`, 50, 149, { align: "center" });

    doc.save(`SPARK26-${role.toUpperCase()}-${name.replace(/\s+/g, "_")}-Badge.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `SPARK26-${role.toUpperCase()}-${badgeNumber}-QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Physical Neubrutalist Lanyard ID Badge */}
      <div
        ref={badgeRef}
        id="printable-id-badge"
        className="w-full max-w-sm bg-white border-[4px] border-black shadow-[8px_8px_0px_#000000] p-4 text-black relative select-none font-sans"
      >
        {/* Top Lanyard Clip Cutout Hole */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-3 bg-slate-900 border-2 border-black rounded-full shadow-inner flex items-center justify-center">
            <span className="w-8 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>

        {/* Header Block with Role Banner */}
        <div className={`${config.bannerBg} ${config.bannerText} border-[3px] border-black p-3 text-center shadow-[3px_3px_0px_#000000] relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 border border-black">
              SPARK 2026
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white text-black px-1.5 py-0.5 border border-black">
              COLLEGE CAMPUS
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight uppercase mt-1">
            {config.roleTitle}
          </h2>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-90">
            OFFICIAL ACCREDITATION PASS
          </p>
        </div>

        {/* Attendee Profile Section */}
        <div className="py-4 text-center border-b-2 border-dashed border-black">
          <div className="w-14 h-14 bg-[#FFEB3B] border-[3px] border-black rounded-none mx-auto mb-2 flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000000]">
            {role === "judge" ? (
              <Award className="w-7 h-7 text-black" />
            ) : role === "faculty" ? (
              <Building2 className="w-7 h-7 text-black" />
            ) : role === "volunteer" ? (
              <ShieldCheck className="w-7 h-7 text-black" />
            ) : role === "organizer" ? (
              <Sparkles className="w-7 h-7 text-black" />
            ) : (
              <User className="w-7 h-7 text-black" />
            )}
          </div>

          <h3 className="text-xl font-black text-black tracking-tight leading-tight">
            {name}
          </h3>
          {title && (
            <p className="text-xs font-bold text-slate-700 mt-0.5">
              {title}
            </p>
          )}
          <p className="text-xs font-black text-black mt-1 uppercase tracking-wide">
            {organization}
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 bg-[#FFFBEB] border-2 border-black px-2.5 py-1 text-xs font-mono font-black shadow-[2px_2px_0px_#000000]">
            <span>BADGE ID:</span>
            <span className="text-blue-800 font-extrabold">{badgeNumber}</span>
          </div>
        </div>

        {/* Additional Metadata Details (Track, Table, Team, etc.) */}
        {(trackName || tableNumber || metadata.length > 0) && (
          <div className="py-2.5 px-3 bg-[#FFFBEB] border-b-2 border-black grid grid-cols-2 gap-2 text-left text-[11px] font-bold">
            {trackName && (
              <div>
                <span className="text-[9px] uppercase font-black text-slate-600 block">ARENA / TRACK</span>
                <span className="text-black font-black">{trackName}</span>
              </div>
            )}
            {tableNumber && (
              <div>
                <span className="text-[9px] uppercase font-black text-slate-600 block">DESK / TABLE</span>
                <span className="text-black font-black">{tableNumber}</span>
              </div>
            )}
            {metadata.map((item, idx) => (
              <div key={idx}>
                <span className="text-[9px] uppercase font-black text-slate-600 block">{item.label}</span>
                <span className="text-black font-black">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Scannable Verification QR Code */}
        <div className="py-4 flex flex-col items-center justify-center bg-white">
          <div className="p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000]">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Verification QR Code"
                className="w-36 h-36 object-contain"
              />
            ) : (
              <div className="w-36 h-36 bg-slate-100 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-400 animate-spin" />
              </div>
            )}
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-600 mt-2 tracking-widest uppercase">
            SCAN TO VERIFY CREDENTIALS
          </span>
          <span className="text-[9px] font-mono font-bold text-black bg-[#FFEB3B] px-1 border border-black mt-0.5">
            {tokenValue.substring(0, 28)}
          </span>
        </div>

        {/* Access Rights Zone */}
        <div className="p-2.5 bg-black text-white border-2 border-black text-center mt-1">
          <p className="text-[9px] uppercase font-bold text-[#FFEB3B] tracking-wider">
            SECURITY CLEARANCE &amp; ACCESS LEVEL
          </p>
          <p className="text-[10px] font-black uppercase tracking-tight text-white mt-0.5">
            {finalAccess}
          </p>
        </div>

        {/* Hologram / Barcode Footer */}
        <div className="mt-3 pt-2 border-t-2 border-black flex items-center justify-between text-[9px] font-mono text-slate-700">
          <span className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#4CAF50]" />
            SECURE LANYARD PASS
          </span>
          <span className="font-black bg-slate-200 px-1 border border-black">
            VALID: NOV 2026
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5 w-full max-w-sm print:hidden">
        <Button
          variant="yellow"
          className="flex-1 font-black text-xs py-2.5"
          onClick={handleDownloadPDF}
        >
          <Download className="w-4 h-4 mr-1.5" />
          <span>Download Badge (PDF)</span>
        </Button>
        <Button
          variant="secondary"
          className="font-black text-xs py-2.5 px-3 bg-white"
          onClick={handlePrint}
        >
          <Printer className="w-4 h-4 mr-1.5" />
          <span>Print</span>
        </Button>
        <Button
          variant="secondary"
          className="font-black text-xs py-2.5 px-3 bg-white"
          onClick={handleDownloadPNG}
          title="Download Scannable QR Code PNG"
        >
          <QrCode className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
