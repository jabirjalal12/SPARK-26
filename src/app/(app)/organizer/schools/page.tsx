"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Search,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";

export default function OrganizerSchoolsPage() {
  const {
    schools,
    schoolTickets,
    students,
    approveSchool,
    reissueSchoolTicket,
    isSuperAdmin,
    isRegistrationHead,
  } = useFestStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const canEdit = isSuperAdmin || isRegistrationHead;

  const filteredSchools = schools
    .filter((s) => {
      if (filter === "pending") return s.status === "pending";
      if (filter === "approved") return s.status === "approved";
      return true;
    })
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        (s.city && s.city.toLowerCase().includes(search.toLowerCase()))
    );

  const handleReissue = (schoolId: string, schoolName: string) => {
    if (!canEdit) {
      alert("Permission denied. Only Super Admin and Registration Head can reissue tickets.");
      return;
    }
    if (confirm(`Revoke active QR pass and issue a new random token for ${schoolName}?`)) {
      const newTicket = reissueSchoolTicket(schoolId);
      alert(`Issued new ticket token: ${newTicket.token_hash}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            REGISTRATIONS & APPROVALS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Visiting Institutions & Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Approve institutional faculty applications and manage single QR ticket passes.
          </p>
        </div>

        {!canEdit && (
          <span className="text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
            Read-only mode (SA & RH can edit)
          </span>
        )}
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-white/15">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school name, code, city..."
            className="w-full pl-10 pr-4 py-2 glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 w-full sm:w-auto">
          {(["all", "pending", "approved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab} ({tab === "all" ? schools.length : schools.filter((s) => s.status === tab).length})
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Schools List */}
      <div className="space-y-4">
        {filteredSchools.map((school) => {
          const isApproved = school.status === "approved";
          const ticket = schoolTickets.find((t) => t.school_id === school.id && !t.revoked_at);
          const studentCount = students.filter((s) => s.school_id === school.id).length;

          return (
            <GlassCard key={school.id} className="p-5 border-white/15 bg-slate-900/70">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-300 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                      {school.code}
                    </span>
                    <Badge variant={isApproved ? "success" : "warning"}>
                      {school.status.toUpperCase()}
                    </Badge>
                    <span className={`text-xs font-semibold ${school.arrived ? "text-emerald-400" : "text-slate-400"}`}>
                      {school.arrived ? "• Checked In At Campus" : "• Awaiting Arrival"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">{school.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                    <span>{school.city} {school.address ? `(${school.address})` : ""}</span>
                    <span>• {school.contact_email}</span>
                    <span>• {school.contact_phone}</span>
                  </p>
                </div>

                {/* Approve/Reject Controls (SA & RH) */}
                {canEdit && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isApproved ? (
                      <Button
                        size="sm"
                        variant="green"
                        onClick={() => approveSchool(school.id, true)}
                        className="text-xs h-8"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        <span>Approve Application</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveSchool(school.id, false)}
                        className="text-xs h-8 text-rose-300 hover:text-white"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        <span>Revoke Approval</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Ticket & Roster Detail Row */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <span>Enrolled Delegation: <strong className="text-white">{studentCount} Students</strong></span>
                  {ticket ? (
                    <span className="font-mono text-[11px] text-indigo-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                      Token: {ticket.token_hash}
                    </span>
                  ) : (
                    <span className="text-amber-400 italic">No ticket issued (pending approval)</span>
                  )}
                </div>

                {canEdit && isApproved && ticket && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReissue(school.id, school.name)}
                    className="text-xs h-7 text-slate-400 hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Re-issue QR Pass</span>
                  </Button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
