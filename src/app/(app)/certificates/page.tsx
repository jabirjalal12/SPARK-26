"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { CertificateGenerator } from "@/components/certificates/certificate-generator";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ShieldCheck, Download, Search } from "lucide-react";

export default function CertificatesPage() {
  const { certificates, currentProfile, schools } = useFestStore();
  const [search, setSearch] = useState("");

  const role = currentProfile.role;

  // Filter certificates based on role
  const userCertificates = certificates.filter((cert) => {
    if (role === "participant") {
      // Participant sees their own or first matching student
      return true;
    }
    if (role === "faculty") {
      return cert.school_id === currentProfile.school_id;
    }
    return true; // Organizer sees all
  });

  const filteredCerts = userCertificates.filter((c) =>
    (c.metadata?.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
    c.cert_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="warning" className="mb-1.5">OFFICIAL CREDENTIALS</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verified Participation & Winner Certificates
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Tamper-proof digital credentials with unique authentication codes. Direct vector PDF download.
          </p>
        </div>
      </div>

      {role !== "participant" && (
        <GlassCard className="p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or certificate code (e.g. CERT-STJ-01-2026)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </GlassCard>
      )}

      {/* Grid of Certificate Generators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCerts.slice(0, role === "participant" ? 1 : 6).map((cert) => (
          <CertificateGenerator key={cert.id} certificate={cert} />
        ))}

        {filteredCerts.length === 0 && (
          <GlassCard className="col-span-full p-8 text-center text-xs text-slate-400">
            No matching certificates found.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
