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
      "inline-flex items-center justify-center font-black tracking-tight rounded-none border-[3px] border-black transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5 shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
      md: "h-11 px-5 text-sm gap-2 shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
      lg: "h-13 px-7 text-base font-black gap-2.5 shadow-[5px_5px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none",
      icon: "h-10 w-10 p-0 shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    }[size];

    const variantStyles = {
      primary:
        "bg-black text-white hover:bg-black shadow-[4px_4px_0px_#2196F3] hover:shadow-[6px_6px_0px_#2196F3] active:shadow-none",
      secondary:
        "bg-white text-black hover:bg-[#FFEB3B]",
      outline:
        "bg-[#FFFBEB] text-black hover:bg-white",
      ghost:
        "border-transparent shadow-none hover:bg-[#FFEB3B] hover:border-black hover:shadow-[3px_3px_0px_#000000]",
      danger:
        "bg-[#FF5252] text-black hover:brightness-105",
      gradient:
        "bg-[#FFEB3B] text-black hover:bg-[#FFEB3B] shadow-[4px_4px_0px_#000000]",
      yellow:
        "bg-[#FFEB3B] text-black hover:brightness-105",
      blue:
        "bg-[#2196F3] text-black hover:brightness-105",
      green:
        "bg-[#4CAF50] text-black hover:brightness-105",
      purple:
        "bg-[#FFEB3B] text-black hover:brightness-105",
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