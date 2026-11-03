"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "gradient"
    | "blue"
    | "green"
    | "yellow"
    | "purple";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold tracking-tight rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base font-bold gap-2.5",
      icon: "h-10 w-10 p-0",
    }[size];

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/40 active:scale-[0.98]",
      secondary:
        "bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md active:scale-[0.98]",
      outline:
        "bg-transparent hover:bg-white/10 text-white border border-white/20 active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-white/10 text-slate-200 hover:text-white",
      danger:
        "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-rose-600 active:scale-[0.98]",
      gradient:
        "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:opacity-95 hover:shadow-indigo-500/50 active:scale-[0.98]",
      blue:
        "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-[0.98]",
      green:
        "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 active:scale-[0.98]",
      yellow:
        "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30 active:scale-[0.98]",
      purple:
        "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30 active:scale-[0.98]",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles, variantStyles, className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
