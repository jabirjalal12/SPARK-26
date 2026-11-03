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
} from "lucide-react";

export default function OrganizerSchoolsPage() {
  const { schools, approveSchool } = useFestStore();
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#FFEB3B] text-black border-2 border-black font-black">
            ADMINISTRATION
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Institutional Registrations & Approvals
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Review visiting schools, approve faculty accounts, and unlock student squad passes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard variant="white" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-3 border-black shadow-[4px_4px_0px_#000]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school name, code, or city..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 font-mono text-xs font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
          />
        </div>

        <div className="flex p-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000] w-full sm:w-auto gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-black uppercase border border-black transition-all ${
              filter === "all" ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000]" : "bg-white text-black hover:bg-[#FFFBEB]"
            }`}
          >
            All ({schools.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-black uppercase border border-black transition-all ${
              filter === "pending" ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000]" : "bg-white text-black hover:bg-[#FFFBEB]"
            }`}
          >
            Pending ({schools.filter((s) => !s.approved).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-black uppercase border border-black transition-all ${
              filter === "approved" ? "bg-[#FFEB3B] text-black shadow-[2px_2px_0px_#000]" : "bg-white text-black hover:bg-[#FFFBEB]"
            }`}
          >
            Approved ({schools.filter((s) => s.approved).length})
          </button>
        </div>
      </GlassCard>

      {/* Schools List */}
      <div className="space-y-4">
        {filteredSchools.map((school) => (
          <GlassCard key={school.id} variant="white" className="p-5 sm:p-6 border-4 border-black shadow-[6px_6px_0px_#000]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={school.approved ? "success" : "warning"}>
                  {school.approved ? "Approved" : "Awaiting Approval"}
                </Badge>
                <span className="font-mono text-xs font-black bg-[#FFEB3B] text-black px-2.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                  {school.code}
                </span>
                {school.checked_in && (
                  <Badge variant="outline" className="bg-[#4CAF50] text-black border-2 border-black font-black">
                    Arrived on Campus
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!school.approved ? (
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-xs font-black"
                    onClick={() => approveSchool(school.id, true)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    <span>Approve School</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="danger"
                    className="text-xs font-black"
                    onClick={() => approveSchool(school.id, false)}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    <span>Revoke Approval</span>
                  </Button>
                )}
              </div>
            </div>

            <h3 className="text-xl font-black text-black uppercase tracking-tight">{school.name}</h3>
            <p className="text-xs font-bold text-neutral-700 mt-0.5">{school.address}, {school.city}</p>

            <div className="mt-4 pt-3 border-t-2 border-black grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-neutral-800">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-black" />
                <span>{school.contact_email || "No email on record"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-black" />
                <span>{school.contact_phone || "No phone on record"}</span>
              </div>
            </div>
          </GlassCard>
        ))}

        {filteredSchools.length === 0 && (
          <GlassCard variant="white" className="p-8 text-center text-xs font-black uppercase text-black border-4 border-black shadow-[6px_6px_0px_#000]">
            No schools found matching filter.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
