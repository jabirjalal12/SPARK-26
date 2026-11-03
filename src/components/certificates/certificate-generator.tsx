"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import { Certificate } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Download, Award, ShieldCheck, Printer } from "lucide-react";

interface CertificateGeneratorProps {
  certificate: Certificate;
}

export function CertificateGenerator({ certificate }: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const studentName = certificate.metadata?.student_name || certificate.student?.full_name || "Participant";
  const schoolName = certificate.metadata?.school_name || certificate.school?.name || "Institution";
  const trackName = certificate.metadata?.track_name || certificate.track?.name || "Open Technical Track";
  const certType = certificate.type === "winner" ? "WINNER OF EXCELLENCE" : "CERTIFICATE OF MERIT & PARTICIPATION";

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      // Landscape A4 certificate (297mm x 210mm)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Background subtle gradient / dark navy aesthetic
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, width, height, "F");

      // Double golden / purple ornate border
      doc.setDrawColor(168, 85, 247); // purple-500
      doc.setLineWidth(1.5);
      doc.roundedRect(10, 10, width - 20, height - 20, 5, 5, "D");

      doc.setDrawColor(236, 72, 153); // pink-500
      doc.setLineWidth(0.6);
      doc.roundedRect(13, 13, width - 26, height - 26, 4, 4, "D");

      // Header branding
      doc.setTextColor(244, 244, 245);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("SPARK 2026", width / 2, 35, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(192, 132, 252);
      doc.text("ANNUAL INTER-SCHOOL & COLLEGE TECH FESTIVAL", width / 2, 42, { align: "center" });

      // Certificate Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(251, 191, 36); // amber-400
      doc.text(certType, width / 2, 60, { align: "center" });

      // Sub-text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(226, 232, 240);
      doc.text("This is proudly presented to", width / 2, 75, { align: "center" });

      // Recipient Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text(studentName, width / 2, 92, { align: "center" });

      // Divider line
      doc.setDrawColor(168, 85, 247);
      doc.setLineWidth(0.8);
      doc.line(width / 2 - 60, 98, width / 2 + 60, 98);

      // School & Track details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(203, 213, 225);
      doc.text(`representing ${schoolName}`, width / 2, 108, { align: "center" });

      doc.text(
        `for outstanding technical performance in the ${trackName} track during SPARK 2026.`,
        width / 2,
        118,
        { align: "center" }
      );

      // Signatures
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);

      // Sign 1
      doc.line(40, 160, 95, 160);
      doc.text("Dr. P. R. Radhakrishnan", 67.5, 166, { align: "center" });
      doc.text("Chief Patron & Principal", 67.5, 171, { align: "center" });

      // Official Stamp Seal in center
      doc.setDrawColor(251, 191, 36);
      doc.circle(width / 2, 155, 12, "D");
      doc.setFontSize(7);
      doc.setTextColor(251, 191, 36);
      doc.text("OFFICIAL SEAL", width / 2, 154, { align: "center" });
      doc.text("VERIFIED 2026", width / 2, 158, { align: "center" });

      // Sign 2
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(10);
      doc.line(width - 95, 160, width - 40, 160);
      doc.text("Prof. Vikram Malhotra", width - 67.5, 166, { align: "center" });
      doc.text("Convener, SPARK", width - 67.5, 171, { align: "center" });

      // Verification code & date footer
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(`Certificate ID: ${certificate.cert_code}`, 20, height - 16);
      doc.text("Verify authentic at: spark.tech/verify", width - 20, height - 16, { align: "right" });

      // Save PDF
      doc.save(`${studentName.toLowerCase().replace(/\s+/g, "_")}_certificate.pdf`);
    } catch (e) {
      console.error("Failed to generate PDF:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <GlassCard className="p-6 sm:p-8 overflow-hidden relative" glow="purple">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Visual Preview */}
      <div className="border border-white/20 rounded-2xl p-6 bg-slate-950/80 backdrop-blur-md text-center relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Verified Credential
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">{certificate.cert_code}</span>
        </div>

        <h3 className="text-lg font-black tracking-tight text-white uppercase">SPARK 2026</h3>
        <p className="text-xs text-indigo-300 font-semibold tracking-wide uppercase mt-0.5">
          {certType}
        </p>

        <div className="my-6">
          <p className="text-xs text-slate-400">Awarded to</p>
          <p className="text-2xl font-black text-white mt-1 bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
            {studentName}
          </p>
          <p className="text-xs text-slate-300 mt-1">{schoolName}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Track: {trackName}</span>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>St. Andrews College of Engineering</span>
          <span>Issued: Nov 20, 2026</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          onClick={handleDownloadPdf}
          isLoading={isGenerating}
          variant="primary"
          className="flex-1"
        >
          <Download className="h-4 w-4" />
          <span>Download Official PDF</span>
        </Button>
        <Button
          onClick={() => window.print()}
          variant="secondary"
          className="px-4"
          title="Print Certificate"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  );
}
