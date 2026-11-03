"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { CertificateGenerator } from "@/components/certificates/certificate-generator";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Search, Award, ShieldCheck } from "lucide-react";

export default function CertificatesPage() {
  const { certificates, currentProfile } = useFestStore();
  const [search, setSearch] = useState("");

  const role = currentProfile.role;

  // Filter certificates based on role
  const userCertificates = certificates.filter((cert) => {
    if (role === "faculty") {
      return cert.school_id === currentProfile.school_id;
    }
    return true; // Organizers and volunteers see all
  });

  const filteredCerts = userCertificates.filter((c) =>
    (c.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
    c.cert_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            DIGITAL CREDENTIALS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Verified Certificates
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official participation & excellence certificates for attending student delegates.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or code (e.g. MB-STJ-)..."
            className="w-full pl-10 pr-4 py-2 glass-input text-xs"
          />
        </div>
      </div>

      {filteredCerts.length === 0 ? (
        <GlassCard className="p-12 text-center text-slate-400 text-xs border-white/15">
          <Award className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="font-bold text-white text-sm">No Certificates Issued Yet</p>
          <p className="mt-1">
            Certificates are automatically generated for students checked in at the registration desk.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCerts.map((cert) => (
            <CertificateGenerator key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}
