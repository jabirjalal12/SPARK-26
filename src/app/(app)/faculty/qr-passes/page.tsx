"use client";

import React from "react";
import { useFestStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { QRDisplay } from "@/components/qr/qr-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, ShieldCheck } from "lucide-react";

export default function FacultyQRPassesPage() {
  const { currentProfile, schools, students, tracks } = useFestStore();

  const facultySchool = schools.find((s) => s.id === currentProfile.school_id) || schools[0];
  const schoolStudents = facultySchool
    ? students.filter((s) => s.school_id === facultySchool.id)
    : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-3 border-black">
        <div>
          <Badge variant="outline" className="mb-1.5 bg-[#4CAF50] text-black border-2 border-black font-black">
            SECURITY & BADGING
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            Digital QR Passes — {facultySchool?.name}
          </h1>
          <p className="text-xs font-bold text-neutral-700 mt-1">
            Download individual passes for your student squad or print the entire delegation sheet.
          </p>
        </div>

        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-1.5" />
          <span>Print Pass Sheet</span>
        </Button>
      </div>

      {/* Master School Pass */}
      <GlassCard variant="yellow" className="p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_#000]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-white text-black border-2 border-black font-black">
                INSTITUTION MASTER PASS
              </Badge>
              <span className="font-mono text-xs font-black text-black bg-white px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                Code: {facultySchool?.code}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase">{facultySchool?.name}</h2>
            <p className="text-xs font-bold text-neutral-800 mt-2 max-w-md leading-relaxed">
              Volunteers can scan this single QR at campus gates to verify and check in your entire institution simultaneously in under 5 seconds.
            </p>

            <div className="mt-4 flex items-center gap-3 text-xs text-black font-black">
              <span className="flex items-center gap-1 bg-[#4CAF50] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                <ShieldCheck className="h-4 w-4" />
                Authorized Delegation
              </span>
              <span>• Total Registered: {schoolStudents.length} Students</span>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <QRDisplay
              value={facultySchool?.code || "SCH001"}
              title="Master School Pass"
              subtitle={facultySchool?.name}
              size={160}
            />
          </div>
        </div>
      </GlassCard>

      {/* Individual Student Passes */}
      <div>
        <h2 className="text-lg font-black text-black uppercase mb-4">
          Student Passes ({schoolStudents.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schoolStudents.map((stud) => {
            const tr = tracks.find((t) => t.id === stud.track_id);
            return (
              <GlassCard key={stud.id} variant="white" className="p-4 border-3 border-black shadow-[4px_4px_0px_#000]">
                <QRDisplay
                  value={stud.qr_token}
                  title={stud.full_name}
                  subtitle={`Track: ${tr?.name || "General"} | ${facultySchool?.name.split(" ")[0]}`}
                  size={140}
                />
              </GlassCard>
            );
          })}

          {schoolStudents.length === 0 && (
            <GlassCard variant="white" className="col-span-full p-8 text-center text-xs font-black uppercase text-black border-4 border-black shadow-[6px_6px_0px_#000]">
              No students enrolled yet. Add students in the Student Roster to generate badges.
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
