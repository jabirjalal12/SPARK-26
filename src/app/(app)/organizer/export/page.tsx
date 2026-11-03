"use client";

import React, { useState } from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function OrganizerExportPage() {
  const {
    schools,
    students,
    teams,
    tracks,
    scores,
    auditLogs,
    isSuperAdmin,
    isEventCoordinator,
    isRegistrationHead,
  } = useFestStore();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const canExportAll = isSuperAdmin || isEventCoordinator;

  // Helper to trigger browser CSV download
  const triggerCsvDownload = (
    filename: string,
    headers: string[],
    rows: (string | number | boolean | null | undefined)[][]
  ) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) =>
          e.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Exported ${filename} successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const exportStudentsRoster = () => {
    const headers = [
      "Student ID",
      "Full Name",
      "Class/Grade",
      "School Name",
      "School Code",
      "Track",
      "Team ID",
      "Walk-in",
      "Checked In",
      "Checked In At",
    ];
    const rows = students.map((s) => {
      const sc = schools.find((sch) => sch.id === s.school_id);
      const tr = tracks.find((trk) => trk.id === s.track_id);
      return [
        s.id,
        s.name,
        s.class,
        sc?.name,
        sc?.code,
        tr?.name,
        s.team_id || "Individual",
        s.is_walkin ? "YES" : "NO",
        s.checked_in ? "YES" : "NO",
        s.checked_in_at || "",
      ];
    });
    triggerCsvDownload("makebreak_student_delegations.csv", headers, rows);
  };

  const exportSchoolsRegistry = () => {
    const headers = [
      "School ID",
      "School Name",
      "Code",
      "City",
      "Address",
      "Contact Email",
      "Contact Phone",
      "Approval Status",
      "Gate Arrival",
    ];
    const rows = schools.map((sc) => [
      sc.id,
      sc.name,
      sc.code,
      sc.city,
      sc.address || "",
      sc.contact_email,
      sc.contact_phone,
      sc.status.toUpperCase(),
      sc.arrived ? "ARRIVED" : "PENDING",
    ]);
    triggerCsvDownload("makebreak_schools_registry.csv", headers, rows);
  };

  const exportScoresAndResults = () => {
    if (!canExportAll) {
      alert("Permission denied. Registration Head is limited to registration data only.");
      return;
    }

    const headers = ["Team ID", "Team Name", "School", "Track", "Project Title", "Score Total"];
    const rows = teams.map((t) => {
      const sc = schools.find((s) => s.id === t.school_id);
      const tr = tracks.find((trk) => trk.id === t.track_id);
      return [t.id, t.name, sc?.name, tr?.name, t.project_title, t.score_total || 0];
    });
    triggerCsvDownload("makebreak_scores_results.csv", headers, rows);
  };

  const exportAuditLog = () => {
    if (!canExportAll) {
      alert("Permission denied. Registration Head is limited to registration data only.");
      return;
    }

    const headers = ["Log ID", "Actor ID", "Action", "Target Type", "Target ID", "Timestamp"];
    const rows = auditLogs.map((a) => [
      a.id,
      a.actor_id,
      a.action,
      a.target_type,
      a.target_id,
      a.created_at,
    ]);
    triggerCsvDownload("makebreak_audit_trail.csv", headers, rows);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <Badge variant="outline" className="mb-1.5">
          DATA MANAGEMENT & EXPORTS
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Export Event Data
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate tamper-evident CSV datasets. (Registration Head: Rosters only; SA & EC: All datasets)
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Student Delegation Roster */}
        <GlassCard className="p-5 border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Student Delegations Roster</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Export all registered student records with class, track assignments, and desk arrival timestamps.
            </p>
          </div>
          <Button size="sm" variant="gradient" onClick={exportStudentsRoster} className="text-xs">
            <Download className="w-4 h-4 mr-1.5" />
            <span>Download Students CSV</span>
          </Button>
        </GlassCard>

        {/* Schools Registry */}
        <GlassCard className="p-5 border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Visiting Schools Registry</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Complete institutional contact list, city, approval status, and check-in indicators.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={exportSchoolsRegistry} className="text-xs">
            <Download className="w-4 h-4 mr-1.5" />
            <span>Download Schools CSV</span>
          </Button>
        </GlassCard>

        {/* Scores & Standings */}
        <GlassCard className="p-5 border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">Scores & Results</h3>
              </div>
              {!canExportAll && <Lock className="w-4 h-4 text-slate-500" />}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Evaluations per track, weighted score computations, and project titles. (SA & EC only)
            </p>
          </div>
          <Button
            size="sm"
            variant={canExportAll ? "secondary" : "outline"}
            disabled={!canExportAll}
            onClick={exportScoresAndResults}
            className="text-xs disabled:opacity-40"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>{canExportAll ? "Download Scores CSV" : "Restricted to SA & EC"}</span>
          </Button>
        </GlassCard>

        {/* Audit Log Trail */}
        <GlassCard className="p-5 border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-base">Security Audit Trail</h3>
              </div>
              {!canExportAll && <Lock className="w-4 h-4 text-slate-500" />}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Immutable action log including school approvals, check-ins, score inputs, and timestamp records.
            </p>
          </div>
          <Button
            size="sm"
            variant={canExportAll ? "secondary" : "outline"}
            disabled={!canExportAll}
            onClick={exportAuditLog}
            className="text-xs disabled:opacity-40"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>{canExportAll ? "Download Audit Log CSV" : "Restricted to SA & EC"}</span>
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
