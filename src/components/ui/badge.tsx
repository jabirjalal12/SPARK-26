"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "track-blue" | "track-green" | "track-red";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/25",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/25",
    danger: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/25",
    info: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/25",
    outline: "bg-transparent text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-white/20",
    "track-blue": "bg-blue-600/20 text-blue-600 dark:text-blue-300 border-blue-500/40",
    "track-green": "bg-emerald-600/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40",
    "track-red": "bg-rose-600/20 text-rose-600 dark:text-rose-300 border-rose-500/40",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-colors",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
