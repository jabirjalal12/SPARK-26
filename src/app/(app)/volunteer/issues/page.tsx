"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame,
} from "lucide-react";

export default function VolunteerIssuesPage() {
  const { issueReports, reportIssue, resolveIssue, currentProfile } = useFestStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    reportIssue({
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
    });

    setFormData({ title: "", description: "", severity: "medium" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="danger" className="mb-1.5">GROUND INCIDENT LOG</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Report & Track Issues
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Log arena power outages, missing tools, medical assistance, or safety concerns immediately.
          </p>
        </div>

        <Button variant="danger" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Report New Incident</span>
        </Button>
      </div>

      <div className="space-y-3.5">
        {issueReports.map((issue) => {
          const isResolved = issue.status === "resolved";
          return (
            <GlassCard
              key={issue.id}
              className="p-5"
              glow={issue.severity === "critical" || issue.severity === "high" ? "red" : "none"}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      issue.severity === "critical"
                        ? "danger"
                        : issue.severity === "high"
                        ? "warning"
                        : "default"
                    }
                  >
                    {issue.severity.toUpperCase()} PRIORITY
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(issue.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <Badge variant={isResolved ? "success" : "warning"}>
                  {issue.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-white">{issue.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{issue.description}</p>

              {issue.resolution_notes && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <span className="font-bold">Resolution: </span>
                  {issue.resolution_notes}
                </div>
              )}

              {!isResolved && (
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs"
                    onClick={() => resolveIssue(issue.id, "Resolved on site by field responder.")}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                    <span>Mark Resolved</span>
                  </Button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Modal for reporting */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Report Field Incident"
        description="Notify the control room immediately of hazards, delays, or equipment failures."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Headline *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Broken soldering iron in Workshop 4"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Severity Level *</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              <option value="low">Low - Minor inconvenience</option>
              <option value="medium">Medium - Needs volunteer attention</option>
              <option value="high">High - Match/Round blocked</option>
              <option value="critical">Critical - Safety/Medical emergency</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description & Location *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Specify arena, stall number, and exact issue..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Broadcast Incident
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
