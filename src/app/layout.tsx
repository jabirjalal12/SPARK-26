import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { FestStoreProvider } from "@/lib/store";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SPARK 2026 — Inter-School College Tech Fest",
  description:
    "Production-ready mobile-first manager for SPARK inter-school college tech fest. Tracks: Robotics, Build from Scrap, Useless Projects.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SPARK",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFEB3B",
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
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-sans min-h-full flex flex-col bg-[#FFFBEB] text-black selection:bg-[#FFEB3B] selection:text-black`}
      >
        <FestStoreProvider>{children}</FestStoreProvider>
      </body>
    </html>
  );
}