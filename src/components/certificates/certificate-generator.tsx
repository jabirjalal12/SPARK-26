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
      doc.setFillColor(255, 251, 235); // #FFFBEB
      doc.rect(0, 0, width, height, "F");

      // Neubrutalist bold borders
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(2.5);
      doc.rect(10, 10, width - 20, height - 20, "D");

      doc.setLineWidth(1);
      doc.rect(13, 13, width - 26, height - 26, "D");

      // Header branding block
      doc.setFillColor(255, 235, 59); // #FFEB3B
      doc.rect(width / 2 - 45, 20, 90, 16, "FD");

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("SPARK 2026", width / 2, 31, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("ANNUAL INTER-SCHOOL COLLEGE TECH FESTIVAL", width / 2, 45, { align: "center" });

      // Certificate Type Banner
      doc.setFontSize(14);
      doc.text(certType, width / 2, 60, { align: "center" });

      // Body Text
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("This official credential is awarded with distinction to", width / 2, 77, { align: "center" });

      // Student Name
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text(studentName, width / 2, 95, { align: "center" });

      // School & Track Citation
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`representing ${schoolName}`, width / 2, 108, { align: "center" });
      doc.text(
        `for exceptional performance and technical ingenuity in the ${trackName} arena.`,
        width / 2,
        118,
        { align: "center" }
      );

      // Certificate Verification Code Box
      doc.setFillColor(255, 255, 255);
      doc.rect(width / 2 - 45, 134, 90, 10, "FD");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`ID: ${certificate.cert_code}`, width / 2, 140.5, { align: "center" });

      // Signatures
      const sigY = 168;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1);
      doc.line(35, sigY, 95, sigY);
      doc.line(width - 95, sigY, width - 35, sigY);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Prof. Vikram Malhotra", 65, sigY + 6, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("General Convenor & Super Admin", 65, sigY + 11, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Sarah Thomas", width - 65, sigY + 6, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Event Coordinator", width - 65, sigY + 11, { align: "center" });

      doc.save(`SPARK-Certificate-${certificate.cert_code}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-[10px] font-black text-black bg-[#FFEB3B] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            {certificate.cert_code}
          </span>
          <span
            className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 border border-black ${
              certificate.type === "winner"
                ? "bg-[#FFEB3B] text-black"
                : certificate.type === "runner_up"
                ? "bg-[#2196F3] text-black"
                : "bg-white text-black"
            }`}
          >
            {certificate.type}
          </span>
        </div>

        <h3 className="text-lg font-black text-black mb-1">{studentName}</h3>
        <p className="text-xs font-bold text-slate-800 mb-1">{schoolName}</p>
        <p className="text-xs font-black text-black mb-4 underline">{trackName}</p>
      </div>

      <div className="pt-3 border-t-2 border-black flex items-center justify-between">
        <span className="text-[11px] text-black font-black flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
          Verified
        </span>

        <Button
          size="sm"
          variant="yellow"
          onClick={handleDownloadPdf}
          isLoading={isGenerating}
          className="text-xs h-8"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          <span>Download PDF</span>
        </Button>
      </div>
    </div>
  );
}