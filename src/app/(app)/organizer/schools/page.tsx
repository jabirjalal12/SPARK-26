"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  School,
  CheckCircle2,
  XCircle,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function OrganizerSchoolsPage() {
  const { schools, approveSchool, checkInSchool } = useFestStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filteredSchools = schools
    .filter((s) => {
      if (filter === "pending") return !s.approved;
      if (filter === "approved") return s.approved;
      return true;
    })
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        (s.city && s.city.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="warning" className="mb-1.5">ADMINISTRATION</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Institutional Registrations & Approvals
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Review visiting schools, approve faculty accounts, and unlock student squad passes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school name, code, or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === "all" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            All ({schools.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === "pending" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Pending ({schools.filter((s) => !s.approved).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === "approved" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Approved ({schools.filter((s) => s.approved).length})
          </button>
        </div>
      </GlassCard>

      {/* Schools List */}
      <div className="space-y-4">
        {filteredSchools.map((school) => (
          <GlassCard key={school.id} className="p-5 sm:p-6" glow="blue">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={school.approved ? "success" : "warning"}>
                  {school.approved ? "Approved" : "Awaiting Organizer Approval"}
                </Badge>
                <span className="font-mono text-xs font-bold text-indigo-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {school.code}
                </span>
                {school.checked_in && (
                  <Badge variant="info">Arrived on Campus</Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!school.approved ? (
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-xs"
                    onClick={() => approveSchool(school.id, true)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    <span>Approve School</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="danger"
                    className="text-xs"
                    onClick={() => approveSchool(school.id, false)}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    <span>Revoke Approval</span>
                  </Button>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">{school.name}</h3>
            <p className="text-xs text-slate-300 mt-0.5">{school.address}, {school.city}</p>

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                <span>{school.contact_email || "No email on record"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>{school.contact_phone || "No phone on record"}</span>
              </div>
            </div>
          </GlassCard>
        ))}

        {filteredSchools.length === 0 && (
          <GlassCard className="p-8 text-center text-xs text-slate-400">
            No schools found matching filter.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
