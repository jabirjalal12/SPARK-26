"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
  glow?: "blue" | "green" | "red" | "purple" | "none";
  color?: "white" | "yellow" | "blue" | "green" | "red" | "paper" | "purple";
  variant?: "white" | "yellow" | "blue" | "green" | "red" | "paper" | "purple";
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  color,
  variant,
  gradient = false,
  interactive = false,
  ...props
}: GlassCardProps) {
  const chosenColor = variant || color;

  const glowStyles = {
    none: "",
    blue: "glow-blue border-blue-500/30",
    green: "glow-green border-emerald-500/30",
    red: "glow-red border-rose-500/30",
    purple: "glow-purple border-purple-500/30",
  }[glow];

  let variantStyle = "bg-white/[0.06] border-white/15 text-white";

  if (chosenColor === "blue") {
    variantStyle = "bg-blue-950/30 border-blue-500/25 text-blue-50";
  } else if (chosenColor === "green") {
    variantStyle = "bg-emerald-950/30 border-emerald-500/25 text-emerald-50";
  } else if (chosenColor === "red") {
    variantStyle = "bg-rose-950/30 border-rose-500/25 text-rose-50";
  } else if (chosenColor === "yellow") {
    variantStyle = "bg-amber-950/30 border-amber-500/25 text-amber-50";
  } else if (chosenColor === "purple") {
    variantStyle = "bg-purple-950/30 border-purple-500/25 text-purple-50";
  }

  const gradientStyle = gradient
    ? "bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent"
    : "";

  return (
    <div
      className={cn(
        "relative rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-200",
        variantStyle,
        gradientStyle,
        glowStyles,
        interactive &&
          "cursor-pointer hover:border-white/30 hover:bg-white/[0.09] hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
