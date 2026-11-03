"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline"
    | "track-blue"
    | "track-green"
    | "track-red";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-white/10 text-white border-white/20",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    info: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    outline: "bg-transparent text-slate-300 border-white/20",
    "track-blue": "bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-500/20",
    "track-green": "bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20",
    "track-red": "bg-rose-600/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border backdrop-blur-md",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
