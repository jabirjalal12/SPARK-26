"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
  glow?: "blue" | "green" | "red" | "purple" | "none";
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  gradient = false,
  glow = "none",
  interactive = false,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    none: "",
    blue: "hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)] hover:border-blue-500/40",
    green: "hover:shadow-[0_0_30px_-5px_rgba(21,128,61,0.3)] hover:border-emerald-500/40",
    red: "hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.3)] hover:border-rose-500/40",
    purple: "hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] hover:border-purple-500/40",
  }[glow];

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl transition-all duration-300",
        gradient && "bg-gradient-to-br from-white/80 via-white/40 to-white/20 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950/40",
        interactive && "cursor-pointer hover:-translate-y-1 hover:border-white/25",
        glowClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
