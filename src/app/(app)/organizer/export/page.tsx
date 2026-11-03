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
    triggerCsvDownload("spark_students_roster.csv", headers, rows);
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
    triggerCsvDownload("spark_checkin_attendance.csv", headers, rows);
  };

  const exportScoresAndStandings = () => {
    const headers = ["Track", "Team Name", "Project Title", "Institution", "Table Number", "Final Weighted Score"];
    const rows = teams.map((t) => {
      const tr = tracks.find((trk) => trk.id === t.track_id);
      const sc = schools.find((sch) => sch.id === t.school_id);
      return [tr?.name, t.name, t.project_title, sc?.name, t.table_number, t.score_total ?? 0];
    });
    triggerCsvDownload("spark_standings_and_scores.csv", headers, rows);
  };

  // Analytics counts per track
  const trackStudentCounts = tracks.map((t) => ({
    name: t.name,
    color: t.color,
    count: students.filter((s) => s.track_id === t.id).length,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#FFEB3B] text-black border-2 border-black font-black">
            DATA & COMPLIANCE
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Data Export & Audit Log
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Export official spreadsheets, review check-in metrics, and audit administrative actions.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-[#4CAF50] text-black border-3 border-black shadow-[4px_4px_0px_#000] text-xs font-black uppercase flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-black" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* CSV Export Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard variant="white" className="p-5 border-4 border-black shadow-[6px_6px_0px_#000]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#2196F3] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-black uppercase">Full Student Roster</h3>
              <p className="text-xs font-bold text-neutral-600">{students.length} participants</p>
            </div>
          </div>
          <p className="text-xs text-neutral-800 font-medium mb-4">
            Complete details, email, contact, assigned tracks, and tokens.
          </p>
          <Button size="sm" variant="secondary" className="w-full text-xs font-black" onClick={exportStudentsRoster}>
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Download CSV</span>
          </Button>
        </GlassCard>

        <GlassCard variant="white" className="p-5 border-4 border-black shadow-[6px_6px_0px_#000]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4CAF50] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-black uppercase">Arrival Attendance</h3>
              <p className="text-xs font-bold text-neutral-600">Schools & Students</p>
            </div>
          </div>
          <p className="text-xs text-neutral-800 font-medium mb-4">
            Gate check-in timestamps, volunteer IDs, and arrival logs.
          </p>
          <Button size="sm" variant="secondary" className="w-full text-xs font-black" onClick={exportCheckinAttendance}>
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Download CSV</span>
          </Button>
        </GlassCard>

        <GlassCard variant="white" className="p-5 border-4 border-black shadow-[6px_6px_0px_#000]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#FFEB3B] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-black uppercase">Scores & Standings</h3>
              <p className="text-xs font-bold text-neutral-600">{teams.length} teams</p>
            </div>
          </div>
          <p className="text-xs text-neutral-800 font-medium mb-4">
            Weighted judge scores per criterion and final rank calculation.
          </p>
          <Button size="sm" variant="secondary" className="w-full text-xs font-black" onClick={exportScoresAndStandings}>
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Download CSV</span>
          </Button>
        </GlassCard>
      </div>

      {/* Analytics Strip: Students per track */}
      <GlassCard variant="white" className="p-5 border-4 border-black shadow-[6px_6px_0px_#000]">
        <h3 className="text-sm font-black text-black uppercase mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-black" />
          <span>Delegation Distribution by Track</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trackStudentCounts.map((item) => (
            <div key={item.name} className="p-3 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-black uppercase text-black block">{item.name}</span>
              <span className="text-2xl font-black text-black font-mono mt-1 block">
                {item.count} <span className="text-xs font-bold text-neutral-700">students</span>
              </span>
              <div className="w-full bg-white border-2 border-black h-3 mt-2 overflow-hidden shadow-[1px_1px_0px_#000]">
                <div
                  className="h-full bg-black"
                  style={{
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
          <h3 className="font-black text-base text-black uppercase flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-black" />
            <span>Immutable Administrative Audit Trail</span>
          </h3>
          <span className="text-xs text-black font-mono font-bold bg-[#FFEB3B] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            {auditLogs.length} events logged
          </span>
        </div>

        <GlassCard variant="white" className="overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFEB3B] uppercase tracking-wider text-black font-black border-b-3 border-black">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Table</th>
                  <th className="py-3 px-4">Delta / Details</th>
                  <th className="py-3 px-4">IP / Actor</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FFFBEB] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-black bg-[#FFEB3B] border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000] text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-black">{log.table_name}</td>
                    <td className="py-3 px-4 text-neutral-800 font-mono text-[11px] max-w-xs truncate">
                      {JSON.stringify(log.new_data || log.old_data || {})}
                    </td>
                    <td className="py-3 px-4 text-neutral-700 font-bold">{log.ip_address || "internal"}</td>
                    <td className="py-3 px-4 text-right font-mono text-neutral-700 font-bold text-[11px]">
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
