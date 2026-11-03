import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { FestStoreProvider } from "@/lib/store";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MAKE//BREAK 2026 — Inter-School College Tech Fest",
  description:
    "Production-ready mobile-first manager for MAKE//BREAK inter-school college tech fest. Tracks: Robotics, Build from Scrap, Useless Projects.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MAKE//BREAK",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-sans min-h-full flex flex-col bg-[#030712] text-slate-100 selection:bg-indigo-500 selection:text-white`}
      >
        <FestStoreProvider>{children}</FestStoreProvider>
      </body>
    </html>
  );
}
