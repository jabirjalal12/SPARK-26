"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "track-blue" | "track-green" | "track-red";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#FFEB3B] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    success: "bg-[#4CAF50] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    warning: "bg-[#FF9800] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    danger: "bg-[#FF5252] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    info: "bg-[#2196F3] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    outline: "bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    "track-blue": "bg-[#2196F3] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    "track-green": "bg-[#4CAF50] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
    "track-red": "bg-[#FF5252] text-black border-2 border-black shadow-[2px_2px_0px_#000000]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}