"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { UserRole, OrganizerSubRole } from "@/lib/types/database";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Users,
  Scan,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, switchOrganizerSubRole } = useFestStore();

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
      } else if (email.includes("coord") || email.includes("event")) {
        switchOrganizerSubRole("event_coordinator");
      } else if (email.includes("reg") || email.includes("head")) {
        switchOrganizerSubRole("registration_head");
      } else {
        switchOrganizerSubRole("super_admin");
      }

      router.push("/dashboard");
    } catch {
      setErrorMessage("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole, subRole?: OrganizerSubRole) => {
    if (role === "organizer" && subRole) {
      switchOrganizerSubRole(subRole);
    } else {
      switchRole(role);
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Landing</span>
          </Link>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            STAFF & FACULTY ACCESS
          </span>
        </div>

        <GlassCard className="p-6 sm:p-8 border-white/15 bg-slate-900/80 backdrop-blur-2xl">
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Staff Portal Sign In</h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized access for Organizers, Visiting Faculty, and Desk Volunteers.
            </p>
          </div>

          {/* Quick 1-Click Evaluation Switcher */}
          <div className="mb-6 p-4 rounded-xl bg-white/[0.04] border border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2">
              ⚡ 1-Click Test Access (Instant Login)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => handleQuickDemoLogin("organizer", "super_admin")}
                className="justify-start text-xs font-medium h-9"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                Super Admin
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => handleQuickDemoLogin("organizer", "event_coordinator")}
                className="justify-start text-xs font-medium h-9"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
                Event Coordinator
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => handleQuickDemoLogin("organizer", "registration_head")}
                className="justify-start text-xs font-medium h-9"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Registration Head
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => handleQuickDemoLogin("faculty")}
                className="justify-start text-xs font-medium h-9"
              >
                <Users className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Visiting Faculty
              </Button>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => handleQuickDemoLogin("volunteer")}
              className="w-full mt-2 justify-start text-xs font-medium h-9"
            >
              <Scan className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              Registration Desk Volunteer
            </Button>
          </div>

          {/* Method tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 rounded-xl mb-5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setMagicLinkSent(false);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "password"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("magic-link");
                setMagicLinkSent(false);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "magic-link"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Magic Link
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}

          {magicLinkSent ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
              <h3 className="text-base font-bold text-white">Check Your Inbox</h3>
              <p className="text-xs text-slate-300 mt-2">
                We sent a secure login link to <strong className="text-white">{email}</strong>.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 text-xs"
                onClick={() => setMagicLinkSent(false)}
              >
                Use another method
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.edu or staff@makebreak.edu"
                    className="w-full pl-9 pr-3 py-2.5 glass-input text-xs"
                  />
                </div>
              </div>

              {mode === "password" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 glass-input text-xs"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                <span>{mode === "magic-link" ? "Send Magic Login Link" : "Sign In to Portal"}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
            <span>Visiting Faculty not yet registered? </span>
            <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
              Register School
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
