"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
  glow?: "blue" | "green" | "red" | "purple" | "none";
  color?: "white" | "yellow" | "blue" | "green" | "red" | "paper";
  variant?: "white" | "yellow" | "blue" | "green" | "red" | "paper";
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  color,
  variant,
  interactive = false,
  ...props
}: GlassCardProps) {
  const chosenColor = variant || color;
  let bgClass = "bg-white text-black";

  if (chosenColor) {
    switch (chosenColor) {
      case "yellow":
        bgClass = "bg-[#FFEB3B] text-black";
        break;
      case "blue":
        bgClass = "bg-[#2196F3] text-black";
        break;
      case "green":
        bgClass = "bg-[#4CAF50] text-black";
        break;
      case "red":
        bgClass = "bg-[#FF5252] text-black";
        break;
      case "paper":
        bgClass = "bg-[#FFFBEB] text-black";
        break;
      case "white":
      default:
        bgClass = "bg-white text-black";
        break;
    }
  } else if (glow !== "none") {
    switch (glow) {
      case "blue":
        bgClass = "bg-white text-black shadow-[6px_6px_0px_#2196F3]";
        break;
      case "green":
        bgClass = "bg-white text-black shadow-[6px_6px_0px_#4CAF50]";
        break;
      case "red":
        bgClass = "bg-white text-black shadow-[6px_6px_0px_#FF5252]";
        break;
      case "purple":
        bgClass = "bg-white text-black shadow-[6px_6px_0px_#000000]";
        break;
    }
  }

  return (
    <div
      className={cn(
        "rounded-none border-[3px] border-black shadow-[6px_6px_0px_#000000] p-6",
        bgClass,
        interactive &&
          "transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000000] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}