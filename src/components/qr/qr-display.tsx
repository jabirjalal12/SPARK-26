"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, QrCode as QrIcon } from "lucide-react";

interface QRDisplayProps {
  value: string;
  title: string;
  subtitle?: string;
  size?: number;
  downloadable?: boolean;
}

export function QRDisplay({
  value,
  title,
  subtitle,
  size = 200,
  downloadable = true,
}: QRDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error("Error generating QR:", err));
  }, [value, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-pass.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`QR pass for ${title}`}
            width={size}
            height={size}
            className="rounded-lg"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-slate-100 text-slate-400 rounded-lg animate-pulse"
          >
            <QrIcon className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-bold text-sm text-white">{title}</h4>
        {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
        <div className="mt-2 inline-block font-mono text-[11px] font-semibold bg-white/10 px-2 py-0.5 rounded text-indigo-300">
          {value}
        </div>
      </div>

      {downloadable && (
        <Button
          size="sm"
          variant="secondary"
          onClick={handleDownload}
          className="mt-3 text-xs w-full"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Save Pass</span>
        </Button>
      )}
    </div>
  );
}
