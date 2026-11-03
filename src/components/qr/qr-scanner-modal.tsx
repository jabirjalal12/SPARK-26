"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useFestStore } from "@/lib/store";
import { Camera, Search, CheckCircle2, AlertCircle, X, School } from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (data: string) => void;
  onScan?: (data: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onScanSuccess, onScan }: QRScannerModalProps) {
  const { schools, students } = useFestStore();
  const [scannerActive, setScannerActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraError, setCameraError] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = "qr-reader-viewport";

  const handleTriggerSuccess = useCallback((code: string) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(100);
    }
    if (onScanSuccess) onScanSuccess(code);
    else if (onScan) onScan(code);
    onClose();
  }, [onScanSuccess, onScan, onClose]);

  // Start QR scanner on open
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isOpen) {
      setCameraError(false);
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
                handleTriggerSuccess(decodedText);
              },
              () => {
                // Ignore scanning noise
              }
            )
            .then(() => setScannerActive(true))
            .catch((err) => {
              console.warn("Camera start failed, falling back to manual search mode:", err);
              setScannerActive(false);
              setCameraError(true);
            });
        } catch (e) {
          console.warn("Scanner setup error:", e);
          setCameraError(true);
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
  }, [isOpen, handleTriggerSuccess]);

  const filteredSchools = searchQuery.trim()
    ? schools.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scan Delegation QR Pass"
      description="Point your device camera at the visiting school's QR ticket."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Scanner Viewport */}
        <div className="relative overflow-hidden rounded-2xl bg-black border border-white/20 aspect-square max-h-[300px] flex items-center justify-center">
          <div id={readerElementId} className="w-full h-full" />

          {(!scannerActive || cameraError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-white">
              <Camera className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
              <p className="text-xs font-semibold">Camera scanner initializing...</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                If camera permissions are blocked or unavailable on this device, select an institutional record below.
              </p>
            </div>
          )}
        </div>

        {/* Manual search fallback */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Manual Search Fallback
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school name or code (e.g. STJ-771)..."
              className="w-full pl-9 pr-3 py-2 glass-input text-xs"
            />
          </div>

          {filteredSchools.length > 0 && (
            <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
              {filteredSchools.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleTriggerSuccess(s.code)}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">Code: {s.code}</span>
                  </div>
                  <span className="text-indigo-400 font-semibold">Select →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
