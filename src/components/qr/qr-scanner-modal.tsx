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
        <div className="relative overflow-hidden bg-black border-4 border-black shadow-[6px_6px_0px_#000] aspect-square max-h-64 sm:max-h-72 w-full flex items-center justify-center">
          <div id={readerElementId} className="w-full h-full" />
          
          {/* Laser guide overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 border-4 border-[#FFEB3B] relative">
              <div className="absolute inset-x-0 h-1 bg-[#FF5252] animate-pulse top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {!scannerActive && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 text-center">
              <Camera className="h-10 w-10 text-black mb-2" />
              <p className="text-sm font-black uppercase text-black">Camera active or initializing...</p>
              <p className="text-xs font-bold text-neutral-700 mt-1 max-w-xs">
                If permissions are blocked, use the lightning-fast manual search below.
              </p>
            </div>
          )}
        </div>

        {/* Scan Status Toast in Modal */}
        {lastScannedResult && (
          <div
            className={`p-3.5 border-3 border-black shadow-[4px_4px_0px_#000] flex items-start gap-3 ${
              lastScannedResult.success
                ? "bg-[#4CAF50] text-black"
                : "bg-[#FF5252] text-white"
            }`}
          >
            {lastScannedResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-black text-xs uppercase tracking-wider">{lastScannedResult.message}</p>
              <p className="text-sm font-bold mt-0.5">{lastScannedResult.details}</p>
            </div>
            <button
              onClick={() => setLastScannedResult(null)}
              className="text-black hover:opacity-70 p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Manual Fast Search Fallback */}
        <div className="space-y-2 pt-2 border-t-2 border-black">
          <label className="text-xs font-black uppercase tracking-wide text-black flex items-center justify-between">
            <span>Fast Search Fallback (Under 3 seconds)</span>
            <span className="text-[10px] text-neutral-600 font-bold">Type school or student name</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. 'Aarav', 'St. Joseph', 'STJ771'..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 font-mono text-sm font-bold shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
            />
          </div>

          {/* Quick Matches dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
              {filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-2.5 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000]"
                >
                  <div>
                    <p className="text-xs font-black uppercase text-black">{school.name}</p>
                    <p className="text-[11px] text-black font-mono font-bold bg-[#FFEB3B] px-1 inline-block border border-black mt-0.5">Code: {school.code}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={school.checked_in ? "outline" : "primary"}
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
                  className="flex items-center justify-between p-2.5 bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_#000]"
                >
                  <div>
                    <p className="text-xs font-black uppercase text-black">{stud.full_name}</p>
                    <p className="text-[11px] text-black font-mono font-bold bg-[#2196F3] px-1 inline-block border border-black mt-0.5">{stud.qr_token}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={stud.checked_in ? "outline" : "primary"}
                    disabled={stud.checked_in}
                    onClick={() => handleScanCode(stud.qr_token)}
                  >
                    {stud.checked_in ? "Checked In" : "Check In"}
                  </Button>
                </div>
              ))}

              {filteredSchools.length === 0 && filteredStudents.length === 0 && (
                <p className="text-xs text-neutral-600 font-bold text-center py-2">No matching records found.</p>
              )}
            </div>
          )}
        </div>

        {/* Quick Demo Scan shortcuts for fast testing */}
        <div className="pt-2 border-t-2 border-black flex items-center justify-between text-xs text-black font-bold">
          <span>Demo Quick-Scan:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleScanCode("STJ771")}
              className="px-2 py-1 bg-[#FFEB3B] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              School STJ771
            </button>
            <button
              onClick={() => handleScanCode("QR-APX-01")}
              className="px-2 py-1 bg-[#2196F3] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Pass QR-APX-01
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
