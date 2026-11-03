"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import { Certificate } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Download, Award, ShieldCheck, Printer } from "lucide-react";
import { useFestStore } from "@/lib/store";

interface CertificateGeneratorProps {
  certificate: Certificate;
}

export function CertificateGenerator({ certificate }: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { schools } = useFestStore();
  const school = schools.find((s) => s.id === certificate.school_id);

  const studentName = certificate.student_name || "Participant";
  const schoolName = school?.name || "Visiting Institution";
  const trackName = certificate.track_name || "Technical Track";
  const certType =
    certificate.type === "winner"
      ? "CERTIFICATE OF EXCELLENCE • FIRST PLACE"
      : certificate.type === "runner_up"
      ? "CERTIFICATE OF MERIT • RUNNER-UP"
      : "CERTIFICATE OF ACTIVE PARTICIPATION";

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Outer background
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(0, 0, width, height, "F");

      // Deep blue decorative border
      doc.setDrawColor(30, 41, 59); // slate-800
      doc.setLineWidth(2);
      doc.rect(10, 10, width - 20, height - 20, "D");

      doc.setDrawColor(99, 102, 241); // indigo-500
      doc.setLineWidth(0.8);
      doc.rect(13, 13, width - 26, height - 26, "D");

      // Header branding
      doc.setTextColor(30, 27, 75); // indigo-950
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("MAKE//BREAK 2026", width / 2, 34, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("ANNUAL INTER-SCHOOL COLLEGE TECH FESTIVAL", width / 2, 42, { align: "center" });

      // Certificate Type Banner
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(certType, width / 2, 58, { align: "center" });

      // Body Text
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("This official credential is awarded with distinction to", width / 2, 75, { align: "center" });

      // Student Name
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text(studentName, width / 2, 92, { align: "center" });

      // School & Track Citation
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`representing ${schoolName}`, width / 2, 106, { align: "center" });
      doc.text(
        `for exceptional performance and technical ingenuity in the ${trackName} arena.`,
        width / 2,
        116,
        { align: "center" }
      );

      // Certificate Verification Code
      doc.setFillColor(241, 245, 249);
      doc.rect(width / 2 - 45, 132, 90, 10, "F");
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`ID: ${certificate.cert_code}`, width / 2, 138.5, { align: "center" });

      // Signatures
      const sigY = 165;

      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.line(35, sigY, 95, sigY);
      doc.line(width - 95, sigY, width - 35, sigY);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Prof. Vikram Malhotra", 65, sigY + 6, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("General Convenor & Super Admin", 65, sigY + 11, { align: "center" });

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Sarah Thomas", width - 65, sigY + 6, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Event Coordinator", width - 65, sigY + 11, { align: "center" });

      doc.save(`MAKEBREAK-Certificate-${certificate.cert_code}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <GlassCard className="p-5 border-white/15 bg-slate-900/70 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-[10px] text-indigo-300 bg-white/10 px-2 py-0.5 rounded border border-white/15">
            {certificate.cert_code}
          </span>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              certificate.type === "winner"
                ? "text-amber-400"
                : certificate.type === "runner_up"
                ? "text-slate-300"
                : "text-indigo-400"
            }`}
          >
            {certificate.type}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{studentName}</h3>
        <p className="text-xs text-slate-300 mb-1">{schoolName}</p>
        <p className="text-xs text-indigo-400 font-semibold mb-4">{trackName}</p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified
        </span>

        <Button
          size="sm"
          variant="gradient"
          onClick={handleDownloadPdf}
          isLoading={isGenerating}
          className="text-xs h-8"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          <span>Download PDF</span>
        </Button>
      </div>
    </GlassCard>
  );
}
