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
  Clock,
  BarChart3,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function OrganizerExportPage() {
  const { schools, students, teams, tracks, scores, auditLogs } = useFestStore();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Helper to trigger browser CSV download
  const triggerCsvDownload = (filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");

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
    const headers = ["Student ID", "Full Name", "Email", "Phone", "School", "School Code", "Track", "Pass Token", "Checked In", "Checked In At"];
    const rows = students.map((s) => {
      const sc = schools.find((sch) => sch.id === s.school_id);
      const tr = tracks.find((trk) => trk.id === s.track_id);
      return [s.id, s.full_name, s.email, s.phone, sc?.name, sc?.code, tr?.name, s.qr_token, s.checked_in ? "YES" : "NO", s.checked_in_at];
    });
    triggerCsvDownload("makebreak_students_roster.csv", headers, rows);
  };

  const exportCheckinAttendance = () => {
    const headers = ["Type", "Name", "Code/Token", "Institution", "Status", "Checked In At", "Verified By"];
    const rows = [
      ...schools.map((sc) => [
        "SCHOOL",
        sc.name,
        sc.code,
        sc.name,
        sc.checked_in ? "ARRIVED" : "PENDING",
        sc.checked_in_at,
        sc.checked_in_by,
      ]),
      ...students.map((st) => {
        const sc = schools.find((s) => s.id === st.school_id);
        return [
          "STUDENT",
          st.full_name,
          st.qr_token,
          sc?.name,
          st.checked_in ? "PRESENT" : "ABSENT",
          st.checked_in_at,
          st.checked_in_by,
        ];
      }),
    ];
    triggerCsvDownload("makebreak_checkin_attendance.csv", headers, rows);
  };

  const exportScoresAndStandings = () => {
    const headers = ["Track", "Team Name", "Project Title", "Institution", "Table Number", "Final Weighted Score"];
    const rows = teams.map((t) => {
      const tr = tracks.find((trk) => trk.id === t.track_id);
      const sc = schools.find((sch) => sch.id === t.school_id);
      return [tr?.name, t.name, t.project_title, sc?.name, t.table_number, t.score_total ?? 0];
    });
    triggerCsvDownload("makebreak_standings_and_scores.csv", headers, rows);
  };

  // Analytics counts per track
  const trackStudentCounts = tracks.map((t) => ({
    name: t.name,
    color: t.color,
    count: students.filter((s) => s.track_id === t.id).length,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Badge variant="warning" className="mb-1.5">DATA & COMPLIANCE</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Data Export & Audit Log
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Export official spreadsheets, review check-in metrics, and audit administrative actions.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* CSV Export Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5" glow="blue">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Full Student Roster</h3>
              <p className="text-[11px] text-slate-400">{students.length} participants</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Complete details, email, contact, assigned tracks, and tokens.
          </p>
          <Button size="sm" variant="secondary" className="w-full text-xs" onClick={exportStudentsRoster}>
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Download CSV</span>
          </Button>
        </GlassCard>

        <GlassCard className="p-5" glow="green">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Arrival Attendance</h3>
              <p className="text-[11px] text-slate-400">Schools & Students</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Gate check-in timestamps, volunteer IDs, and arrival logs.
          </p>
          <Button size="sm" variant="secondary" className="w-full text-xs" onClick={exportCheckinAttendance}>
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Download CSV</span>
          </Button>
        </GlassCard>

        <GlassCard className="p-5" glow="purple">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Scores & Standings</h3>
              <p className="text-[11px] text-slate-400">{teams.length} teams</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Weighted judge scores per criterion and final rank calculation.
          </p>
          <Button size="sm" variant="secondary" className="w-full text-xs" onClick={exportScoresAndStandings}>
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Download CSV</span>
          </Button>
        </GlassCard>
      </div>

      {/* Analytics Strip: Students per track */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-indigo-400" />
          <span>Delegation Distribution by Track</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trackStudentCounts.map((item) => (
            <div key={item.name} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-semibold text-slate-300 block">{item.name}</span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">
                {item.count} <span className="text-xs font-normal text-slate-400">students</span>
              </span>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: item.color,
                    width: `${(item.count / (students.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Audit Log Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>Immutable Administrative Audit Trail</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{auditLogs.length} events logged</span>
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Table</th>
                  <th className="py-3 px-4">Delta / Details</th>
                  <th className="py-3 px-4">IP / Actor</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{log.table_name}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                      {JSON.stringify(log.new_data || log.old_data || {})}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.ip_address || "internal"}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
