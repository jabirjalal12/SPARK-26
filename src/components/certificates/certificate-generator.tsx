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
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Neubrutalism Paper background
      doc.setFillColor(255, 251, 235); // #FFFBEB
      doc.rect(0, 0, width, height, "F");

      // Thick bold black border (Neubrutalism trademark)
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(2.5);
      doc.rect(12, 12, width - 24, height - 24, "D");

      // Hard shadow box behind title
      doc.setFillColor(255, 235, 59); // #FFEB3B yellow
      doc.rect(width / 2 - 80, 22, 160, 22, "F");
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.2);
      doc.rect(width / 2 - 80, 22, 160, 22, "D");

      // Header branding
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("SPARK 2026", width / 2, 33, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("ANNUAL INTER-SCHOOL & COLLEGE TECH FESTIVAL", width / 2, 40, { align: "center" });

      // Certificate Type Banner
      doc.setFillColor(33, 150, 243); // #2196F3 blue
      doc.rect(width / 2 - 65, 54, 130, 10, "F");
      doc.rect(width / 2 - 65, 54, 130, 10, "D");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(certType, width / 2, 61, { align: "center" });

      // Body text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(30, 30, 30);
      doc.text("This is proudly presented to", width / 2, 78, { align: "center" });

      // Recipient Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      doc.setTextColor(0, 0, 0);
      doc.text(studentName, width / 2, 95, { align: "center" });

      // Thick divider line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.5);
      doc.line(width / 2 - 70, 102, width / 2 + 70, 102);

      // School & Track details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text(`representing ${schoolName}`, width / 2, 114, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(
        `for outstanding technical performance in the ${trackName} track during SPARK 2026.`,
        width / 2,
        124,
        { align: "center" }
      );

      // Signatures
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      doc.line(40, 160, 95, 160);
      doc.setFont("helvetica", "bold");
      doc.text("Dr. P. R. Radhakrishnan", 67.5, 166, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text("Chief Patron & Principal", 67.5, 171, { align: "center" });

      // Official Stamp Seal in center
      doc.setFillColor(255, 235, 59);
      doc.circle(width / 2, 155, 14, "FD");
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL SEAL", width / 2, 153, { align: "center" });
      doc.text("VERIFIED 2026", width / 2, 158, { align: "center" });

      doc.line(width - 95, 160, width - 40, 160);
      doc.text("Prof. Vikram Malhotra", width - 67.5, 166, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text("Convener, SPARK", width - 67.5, 171, { align: "center" });

      // Verification code footer
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`Certificate ID: ${certificate.cert_code}`, 20, height - 16);
      doc.text("Verify authenticity at: spark.tech/verify", width - 20, height - 16, { align: "right" });

      doc.save(`${studentName.toLowerCase().replace(/\s+/g, "_")}_certificate.pdf`);
    } catch (e) {
      console.error("Failed to generate PDF:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <GlassCard className="p-6 sm:p-8 relative bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
      {/* Visual Preview */}
      <div className="border-[3px] border-black p-6 bg-[#FFFBEB] text-center relative shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-black" />
            <span className="text-xs font-black uppercase tracking-wider bg-[#FFEB3B] text-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000]">
              VERIFIED CREDENTIAL
            </span>
          </div>
          <span className="font-mono text-xs font-black text-black bg-white px-2 py-0.5 border border-black">{certificate.cert_code}</span>
        </div>

        <h3 className="text-xl font-black tracking-tight text-black uppercase">SPARK 2026</h3>
        <p className="text-xs text-black font-black uppercase tracking-wider mt-1 bg-[#2196F3] inline-block px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
          {certType}
        </p>

        <div className="my-6">
          <p className="text-xs font-bold text-slate-700">Awarded to</p>
          <p className="text-2xl font-black text-black mt-1">
            {studentName}
          </p>
          <p className="text-xs font-bold text-black mt-1">{schoolName}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black text-xs text-black font-bold shadow-[2px_2px_0px_#000000]">
          <ShieldCheck className="h-4 w-4 text-[#4CAF50]" />
          <span>Track: {trackName}</span>
        </div>

        <div className="mt-6 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-bold text-slate-800">
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
          <Download className="h-4 w-4 mr-1.5" />
          <span>Download Official PDF</span>
        </Button>
        <Button
          onClick={() => window.print()}
          variant="secondary"
          className="px-4"
          title="Print Certificate"
          aria-label="Print Certificate"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  );
}