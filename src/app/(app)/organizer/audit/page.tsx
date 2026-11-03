"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Search,
  ShieldCheck,
  Clock,
  Terminal,
} from "lucide-react";

export default function OrganizerAuditPage() {
  const { auditLogs } = useFestStore();
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target_type.toLowerCase().includes(search.toLowerCase()) ||
      (log.actor_id && log.actor_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-[3px] border-black">
        <div>
          <Badge variant="default" className="mb-1.5">
            COMPLIANCE & TRACEABILITY
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-black">
            Security Audit Trail
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1">
            Immutable log of all school approvals, check-ins, score locks, and system changes.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-black" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or actor..."
            className="w-full pl-9 pr-3 py-2 nb-input text-xs"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-800 font-bold text-xs">
            No audit logs found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-black text-black font-black uppercase tracking-wider text-[11px] bg-[#FFEB3B]">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-sans">
                {filteredLogs.map((log) => {
                  let badgeVariant: "default" | "success" | "warning" | "danger" | "info" = "default";
                  if (log.action.includes("APPROVE")) badgeVariant = "success";
                  else if (log.action.includes("UNDO") || log.action.includes("DELETE") || log.action.includes("LOCK")) badgeVariant = "danger";
                  else if (log.action.includes("CHECKIN")) badgeVariant = "info";
                  else if (log.action.includes("SCORE")) badgeVariant = "warning";

                  return (
                    <tr key={log.id} className="hover:bg-[#FFFBEB] transition-colors">
                      <td className="p-3 font-mono text-[11px] font-bold text-black whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="p-3">
                        <Badge variant={badgeVariant} className="text-[10px] font-mono px-2 py-0.5">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono font-black text-[11px] text-black">
                        {log.actor_id || "system"}
                      </td>
                      <td className="p-3 text-slate-900 font-bold">
                        <span>{log.target_type}</span>
                        {log.target_id && (
                          <span className="text-[10px] font-mono text-slate-600 block">
                            {log.target_id.slice(0, 16)}...
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] font-mono font-bold text-slate-800 max-w-xs truncate">
                        {log.new_data ? JSON.stringify(log.new_data) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}