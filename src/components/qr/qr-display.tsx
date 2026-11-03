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
        dark: "#000000",
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
    <div className="flex flex-col items-center text-center p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000] text-black">
      <div className="p-2 bg-white border-[3px] border-black shadow-[3px_3px_0px_#000000]">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={`QR pass for ${title}`}
            width={size}
            height={size}
            className="block"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-slate-100 text-black border border-black"
          >
            <QrIcon className="h-10 w-10 text-black" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-black text-sm text-black">{title}</h4>
        {subtitle && <p className="text-xs font-medium text-slate-700 mt-0.5">{subtitle}</p>}
        <div className="mt-2 inline-block font-mono text-xs font-black bg-[#FFEB3B] text-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000]">
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
          <Download className="h-3.5 w-3.5 mr-1" />
          <span>Save Pass</span>
        </Button>
      )}
    </div>
  );
}