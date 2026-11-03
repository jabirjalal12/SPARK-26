"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { CertificateGenerator } from "@/components/certificates/certificate-generator";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function CertificatesPage() {
  const { certificates, currentProfile } = useFestStore();
  const [search, setSearch] = useState("");

  const role = currentProfile.role;

  // Filter certificates based on role
  const userCertificates = certificates.filter((cert) => {
    if (role === "participant") {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#FFEB3B] text-black border-2 border-black font-black">
            OFFICIAL CREDENTIALS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Verified Participation & Winner Certificates
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Tamper-proof digital credentials with unique authentication codes. Direct vector PDF download.
          </p>
        </div>
      </div>

      {role !== "participant" && (
        <GlassCard variant="white" className="p-4 border-3 border-black shadow-[4px_4px_0px_#000]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or certificate code (e.g. CERT-STJ-01-2026)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 font-mono text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
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
          <GlassCard variant="white" className="col-span-full p-8 text-center text-xs font-black uppercase text-black border-4 border-black shadow-[6px_6px_0px_#000]">
            No matching certificates found.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
