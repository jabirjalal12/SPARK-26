"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useFestStore } from "@/lib/store";
import { Camera, Search, CheckCircle2, AlertCircle, X } from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (data: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const { students, schools, checkInStudent, checkInSchool } = useFestStore();
  const [scannerActive, setScannerActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastScannedResult, setLastScannedResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = "qr-reader-viewport";

  const handleScanCode = useCallback((code: string) => {
    // Vibrate device if supported
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(100);
    }

    // Try checking in as student first
    const studentRes = checkInStudent(code);
    if (studentRes.success) {
      setLastScannedResult({
        success: true,
        message: "STUDENT VERIFIED",
        details: `${studentRes.student?.full_name} (${studentRes.student?.qr_token})`,
      });
      if (onScanSuccess) onScanSuccess(code);
      return;
    }

    // Try checking in as school code
    const school = schools.find(
      (s) => s.code.toUpperCase() === code.toUpperCase() || s.id === code
    );
    if (school) {
      const schoolRes = checkInSchool(school.id);
      setLastScannedResult({
        success: schoolRes.success,
        message: schoolRes.success ? "SCHOOL CHECKED IN" : "ALREADY CHECKED IN",
        details: `${school.name} (Code: ${school.code})`,
      });
      if (onScanSuccess) onScanSuccess(code);
      return;
    }

    // Unrecognized code
    setLastScannedResult({
      success: false,
      message: "UNRECOGNIZED PASS",
      details: `Code: ${code} - No matching registered record found.`,
    });
  }, [checkInStudent, checkInSchool, onScanSuccess, schools]);

  // Start QR scanner on open
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isOpen) {
      setLastScannedResult(null);
      const timer = setTimeout(() => {
        try {
          html5QrCode = new Html5Qrcode(readerElementId);
          scannerRef.current = html5QrCode;

          html5QrCode
            .start(
              { facingMode: "environment" },
              {
                fps: 15,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
              },
              (decodedText) => {
                handleScanCode(decodedText);
              },
              () => {
                // Ignore scanning noise
              }
            )
            .then(() => setScannerActive(true))
            .catch((err) => {
              console.warn("Camera start failed, falling back to manual search mode:", err);
              setScannerActive(false);
            });
        } catch (e) {
          console.warn("Scanner setup error:", e);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current
            .stop()
            .catch(() => {})
            .finally(() => {
              try {
                scannerRef.current?.clear();
              } catch {}
              scannerRef.current = null;
            });
        }
      };
    }
  }, [isOpen, handleScanCode]);

  // Filtered manual search results
  const filteredStudents = searchQuery.trim()
    ? students
        .filter(
          (s) =>
            s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.qr_token.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const filteredSchools = searchQuery.trim()
    ? schools
        .filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3)
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rapid QR Pass Scanner"
      description="Point camera at pass QR or search student name / code below."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Live Camera Viewport */}
        <div className="relative overflow-hidden rounded-2xl bg-black border border-white/20 aspect-square max-h-64 sm:max-h-72 w-full flex items-center justify-center">
          <div id={readerElementId} className="w-full h-full" />
          
          {/* Laser guide overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-indigo-400/80 rounded-2xl relative">
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {!scannerActive && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 text-center">
              <Camera className="h-10 w-10 text-indigo-400 mb-2 opacity-80" />
              <p className="text-sm font-semibold text-white">Camera active or initializing...</p>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">
                If permissions are blocked, use the lightning-fast manual search below.
              </p>
            </div>
          )}
        </div>

        {/* Scan Status Toast in Modal */}
        {lastScannedResult && (
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200 ${
              lastScannedResult.success
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                : "bg-rose-500/20 border-rose-500/40 text-rose-200"
            }`}
          >
            {lastScannedResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs uppercase tracking-wider">{lastScannedResult.message}</p>
              <p className="text-sm font-medium mt-0.5">{lastScannedResult.details}</p>
            </div>
            <button
              onClick={() => setLastScannedResult(null)}
              className="text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Manual Fast Search Fallback */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Fast Search Fallback (Under 3 seconds)</span>
            <span className="text-[10px] text-indigo-300">Type school name or student name</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. 'Aarav', 'St. Joseph', 'STJ771'..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Quick Matches dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
              {filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{school.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">Code: {school.code}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={school.checked_in ? "secondary" : "primary"}
                    disabled={school.checked_in}
                    onClick={() => handleScanCode(school.code)}
                  >
                    {school.checked_in ? "Arrived" : "Check In School"}
                  </Button>
                </div>
              ))}

              {filteredStudents.map((stud) => (
                <div
                  key={stud.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{stud.full_name}</p>
                    <p className="text-[11px] text-indigo-300 font-mono">{stud.qr_token}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={stud.checked_in ? "secondary" : "gradient"}
                    disabled={stud.checked_in}
                    onClick={() => handleScanCode(stud.qr_token)}
                  >
                    {stud.checked_in ? "Checked In" : "Check In"}
                  </Button>
                </div>
              ))}

              {filteredSchools.length === 0 && filteredStudents.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">No matching records found.</p>
              )}
            </div>
          )}
        </div>

        {/* Quick Demo Scan shortcuts for fast testing */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Demo Quick-Scan:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleScanCode("STJ771")}
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-indigo-300 font-mono text-[11px]"
            >
              School STJ771
            </button>
            <button
              onClick={() => handleScanCode("QR-APX-01")}
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-pink-300 font-mono text-[11px]"
            >
              Pass QR-APX-01
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}