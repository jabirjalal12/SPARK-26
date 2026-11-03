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
    <div className="flex flex-col items-center text-center p-3 text-slate-900">
      <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`QR pass for ${title}`}
            width={size}
            height={size}
            className="block rounded-lg"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-slate-100 rounded-lg text-slate-400"
          >
            <QrIcon className="h-10 w-10 animate-pulse text-slate-300" />
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <h4 className="font-bold text-xs text-slate-900 tracking-tight">{title}</h4>
        {subtitle && (
          <p className="text-[11px] font-medium text-slate-600 mt-0.5 max-w-[200px] truncate">
            {subtitle}
          </p>
        )}
      </div>

      {downloadable && dataUrl && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          className="mt-3 text-xs h-7 px-3 text-slate-800 border-slate-300 hover:bg-slate-100"
        >
          <Download className="h-3 w-3 mr-1" />
          <span>Save PNG</span>
        </Button>
      )}
    </div>
  );
}
