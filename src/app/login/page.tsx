"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { UserRole } from "@/lib/types/database";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useFestStore();

  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }

      if (mode === "magic-link") {
        setMagicLinkSent(true);
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }

      // Check role heuristics or fallback to organizer
      if (email.includes("fac")) {
        switchRole("faculty");
      } else if (email.includes("vol")) {
        switchRole("volunteer");
      } else if (email.includes("judge")) {
        switchRole("judge");
      } else {
        switchRole("organizer");
      }

      router.push("/dashboard");
    } catch {
      setErrorMessage("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Landing</span>
          </Link>
          <span className="text-xs font-bold text-indigo-400 font-mono">STAFF & JURY</span>
        </div>

        <GlassCard className="p-6 sm:p-8" glow="purple">
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 mx-auto flex items-center justify-center shadow-lg shadow-purple-600/30 mb-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Staff Portal Sign In</h1>
            <p className="text-xs text-slate-300 mt-1">
              For Organizers, Approved Faculty Coordinators, Volunteers, and Jury.
            </p>
          </div>

          {/* Toggle Password vs Magic Link */}
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => { setMode("password"); setMagicLinkSent(false); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === "password"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setMode("magic-link")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === "magic-link"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Magic Link Email
            </button>
          </div>

          {magicLinkSent ? (
            <div className="text-center py-6 space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Magic Link Sent!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Check your inbox at <span className="font-semibold text-white">{email}</span>. Click the link to securely sign in.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMagicLinkSent(false)}
                className="mt-2 text-xs"
              >
                Send Again / Change Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="coordinator@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {mode === "password" && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-center font-medium">
                  {errorMessage}
                </p>
              )}

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                <span>{mode === "password" ? "Sign In to Fest Portal" : "Send Magic Link"}</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>
          )}

          {/* Quick 1-click Demo Role Logins */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 text-center mb-2.5">
              1-Click Instant Demo Login:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("organizer")}
                className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 font-semibold text-center transition-colors"
              >
                Organizer (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("faculty")}
                className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 font-semibold text-center transition-colors"
              >
                Faculty Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("volunteer")}
                className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 font-semibold text-center transition-colors"
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("judge")}
                className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 font-semibold text-center transition-colors"
              >
                Judge (Scoring)
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            New visiting school?{" "}
            <Link href="/register" className="text-indigo-400 hover:underline font-semibold">
              Register Institution
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
