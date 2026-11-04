"use client";

import React, { useState } from "react";
import Link from "next/link";
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <Badge variant="default" className="mb-1.5">
            REGISTRATIONS & APPROVALS
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-black">
            Visiting Institutions & Tickets
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1">
            Approve institutional faculty applications and manage single QR ticket passes.
          </p>
        </div>

        {!canEdit && (
          <span className="text-xs text-black font-bold bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000] px-3 py-1">
            Read-only mode (SA & RH can edit)
          </span>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school name, code, city..."
            className="w-full pl-10 pr-4 py-2 nb-input text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#FFFBEB] border-2 border-black w-full sm:w-auto shadow-[2px_2px_0px_#000000]">
          {(["all", "pending", "approved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-black capitalize transition-all cursor-pointer border ${
                filter === tab
                  ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                  : "text-black border-transparent hover:bg-[#FFEB3B]"
              }`}
            >
              {tab} ({tab === "all" ? schools.length : schools.filter((s) => s.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Schools List */}
      <div className="space-y-4">
        {filteredSchools.map((school) => {
          const isApproved = school.status === "approved";
          const ticket = schoolTickets.find((t) => t.school_id === school.id && !t.revoked_at);
          const studentCount = students.filter((s) => s.school_id === school.id).length;

          return (
            <div key={school.id} className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-black">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-black text-black bg-[#FFEB3B] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                      {school.code}
                    </span>
                    <Badge variant={isApproved ? "success" : "warning"}>
                      {school.status.toUpperCase()}
                    </Badge>
                    <span className={`text-xs font-black ${school.arrived ? "text-[#4CAF50]" : "text-slate-700"}`}>
                      {school.arrived ? "• Checked In At Campus" : "• Awaiting Arrival"}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-black tracking-tight">{school.name}</h3>
                  <p className="text-xs font-bold text-slate-800 mt-1 flex flex-wrap items-center gap-3">
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
                        className="text-xs h-8"
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
                <div className="flex items-center gap-4 text-slate-800 font-bold">
                  <span>Enrolled Delegation: <strong className="text-black font-black">{studentCount} Students</strong></span>
                  {ticket ? (
                    <span className="font-mono text-[11px] font-black text-black bg-[#FFFBEB] px-2 py-0.5 border border-black">
                      Token: {ticket.token_hash}
                    </span>
                  ) : (
                    <span className="text-[#FF9800] font-black italic">No ticket issued (pending approval)</span>
                  )}
                </div>

                {canEdit && isApproved && ticket && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReissue(school.id, school.name)}
                    className="text-xs h-8"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Re-issue QR Pass</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}