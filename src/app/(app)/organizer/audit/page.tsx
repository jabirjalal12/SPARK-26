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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="outline" className="mb-1.5">
            COMPLIANCE & TRACEABILITY
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Security Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all school approvals, check-ins, score locks, and system changes.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or actor..."
            className="w-full pl-9 pr-3 py-2 glass-input text-xs"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <GlassCard className="p-5 border-white/15 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No audit logs found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-3">Timestamp</th>
                  <th className="pb-3 px-3">Action</th>
                  <th className="pb-3 px-3">Actor</th>
                  <th className="pb-3 px-3">Target</th>
                  <th className="pb-3 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredLogs.map((log) => {
                  let badgeVariant: "default" | "success" | "warning" | "danger" | "info" = "default";
                  if (log.action.includes("APPROVE")) badgeVariant = "success";
                  else if (log.action.includes("UNDO") || log.action.includes("DELETE") || log.action.includes("LOCK")) badgeVariant = "danger";
                  else if (log.action.includes("CHECKIN")) badgeVariant = "info";
                  else if (log.action.includes("SCORE")) badgeVariant = "warning";

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={badgeVariant} className="text-[10px] font-mono px-2 py-0.5">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-indigo-300">
                        {log.actor_id || "system"}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        <span className="font-semibold">{log.target_type}</span>
                        {log.target_id && (
                          <span className="text-[11px] font-mono text-slate-500 block">
                            {log.target_id.slice(0, 16)}...
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[11px] font-mono text-slate-400 max-w-xs truncate">
                        {log.new_data ? JSON.stringify(log.new_data) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
