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
} from "lucide-react";

export default function VolunteerIssuesPage() {
  const { issueReports, reportIssue, resolveIssue, isEventCoordinator, isSuperAdmin } = useFestStore();
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
          <Badge variant="outline" className="mb-1.5">
            GROUND INCIDENT LOG
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Report & Track Issues
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log equipment faults, power trips, medical assistance, or safety concerns.
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={() => setModalOpen(true)} className="text-xs">
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
              className={`p-5 border-white/15 ${
                issue.severity === "critical" || issue.severity === "high"
                  ? "border-rose-500/30 bg-rose-950/20"
                  : "bg-slate-900/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      issue.severity === "critical" || issue.severity === "high"
                        ? "danger"
                        : issue.severity === "medium"
                        ? "warning"
                        : "default"
                    }
                  >
                    {issue.severity.toUpperCase()} PRIORITY
                  </Badge>
                  <span className={`text-xs font-semibold ${isResolved ? "text-emerald-400" : "text-amber-400"}`}>
                    {isResolved ? "Resolved" : "Open / In Progress"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(issue.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{issue.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{issue.description}</p>

              {issue.resolution_notes && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs mb-3">
                  <strong>Resolution:</strong> {issue.resolution_notes}
                </div>
              )}

              {!isResolved && (isEventCoordinator || isSuperAdmin) && (
                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <Button
                    size="sm"
                    variant="green"
                    onClick={() => {
                      const notes = prompt("Enter resolution notes:");
                      if (notes) resolveIssue(issue.id, notes);
                    }}
                    className="text-xs h-8"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Mark Resolved</span>
                  </Button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Report Field Incident"
        description="Notify the control room and coordinators of any campus issue."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Scrap Yard breaker 4 tripped"
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Severity Level</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
              className="w-full px-3 py-2.5 glass-input text-xs bg-slate-900 text-white"
            >
              <option value="low">Low (Minor supply shortage)</option>
              <option value="medium">Medium (Requires attention)</option>
              <option value="high">High (Delaying competition)</option>
              <option value="critical">Critical (Safety / Medical concern)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Location, what happened, who is affected..."
              className="w-full px-3 py-2.5 glass-input text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Submit Incident Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
