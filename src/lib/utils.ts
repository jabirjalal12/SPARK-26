import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getTrackBadgeClass(trackSlugOrName: string | null | undefined): string {
  const normalized = (trackSlugOrName || "").toLowerCase();
  if (normalized.includes("robot")) {
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  }
  if (normalized.includes("scrap")) {
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
  if (normalized.includes("useless")) {
    return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  }
  return "bg-purple-500/15 text-purple-400 border-purple-500/30";
}

export function getRoleBadgeClass(role: string): string {
  switch (role) {
    case "organizer":
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    case "faculty":
      return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    case "volunteer":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    case "judge":
      return "bg-purple-500/20 text-purple-300 border-purple-500/40";
    case "participant":
    default:
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  }
}
