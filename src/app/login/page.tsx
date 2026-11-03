"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { UserRole } from "@/lib/types/database";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Mail,
  ArrowRight,
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
    <div className="min-h-screen bg-[#FFFBEB] text-black flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFEB3B] px-2 py-1 border-2 border-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Landing</span>
          </Link>
          <span className="text-xs font-black bg-[#2196F3] text-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000000]">
            STAFF & JURY
          </span>
        </div>

        <GlassCard className="p-6 sm:p-8 bg-white border-[4px] border-black shadow-[8px_8px_0px_#000000]" color="white">
          <div className="text-center mb-6">
            <div className="h-14 w-14 bg-[#FFEB3B] border-[3px] border-black shadow-[4px_4px_0px_#000000] mx-auto flex items-center justify-center mb-3">
              <Lock className="h-7 w-7 text-black" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">Staff Portal Sign In</h1>
            <p className="text-xs font-medium text-slate-700 mt-1">
              For Organizers, Approved Faculty Coordinators, Volunteers, and Jury.
            </p>
          </div>

          {/* Toggle Password vs Magic Link */}
          <div className="flex border-[3px] border-black mb-5 bg-[#FFFBEB] p-1 shadow-[3px_3px_0px_#000000]">
            <button
              type="button"
              onClick={() => { setMode("password"); setMagicLinkSent(false); }}
              className={`flex-1 py-1.5 text-xs font-black transition-colors border-2 ${
                mode === "password"
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-transparent hover:bg-white"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setMode("magic-link")}
              className={`flex-1 py-1.5 text-xs font-black transition-colors border-2 ${
                mode === "magic-link"
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-transparent hover:bg-white"
              }`}
            >
              Magic Link Email
            </button>
          </div>

          {magicLinkSent ? (
            <div className="text-center py-6 space-y-3">
              <div className="h-12 w-12 bg-[#4CAF50] text-black border-[3px] border-black shadow-[3px_3px_0px_#000000] mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-black text-black">Magic Link Sent!</h3>
              <p className="text-xs font-medium text-slate-800 max-w-xs mx-auto">
                Check your inbox at <span className="font-bold underline">{email}</span>. Click the link to securely sign in.
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
                <label className="text-xs font-black uppercase tracking-wider text-black block mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="coordinator@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 border-[3px] border-black bg-white text-black font-semibold placeholder-slate-500 text-sm shadow-[3px_3px_0px_#000000] focus:outline-none focus:ring-4 focus:ring-black"
                  />
                </div>
              </div>

              {mode === "password" && (
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-black block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border-[3px] border-black bg-white text-black font-semibold placeholder-slate-500 text-sm shadow-[3px_3px_0px_#000000] focus:outline-none focus:ring-4 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <p className="text-xs text-black font-bold bg-[#FF5252] border-2 border-black p-2.5 shadow-[2px_2px_0px_#000000] text-center">
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
          <div className="mt-6 pt-5 border-t-2 border-black">
            <p className="text-[11px] uppercase font-black tracking-wider text-black text-center mb-2.5 bg-[#FFEB3B] py-1 border border-black shadow-[2px_2px_0px_#000000]">
              1-Click Instant Demo Login:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("organizer")}
                className="p-2 border-[2px] border-black bg-[#FFEB3B] text-black font-black text-center shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Organizer (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("faculty")}
                className="p-2 border-[2px] border-black bg-[#2196F3] text-black font-black text-center shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Faculty Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("volunteer")}
                className="p-2 border-[2px] border-black bg-[#4CAF50] text-black font-black text-center shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("judge")}
                className="p-2 border-[2px] border-black bg-[#FF9800] text-black font-black text-center shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Judge (Scoring)
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs font-bold text-black">
            New visiting school?{" "}
            <Link href="/register" className="underline font-black text-black hover:bg-[#FFEB3B]">
              Register Institution
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}