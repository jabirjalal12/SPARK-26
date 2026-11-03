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
      } else {
        switchRole("organizer");
      }

      router.push("/dashboard");
    } catch {
      setErrorMessage("Authentication failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole, subRole?: OrganizerSubRole) => {
    switchRole(role);
    if (subRole) {
      switchOrganizerSubRole(subRole);
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-black hover:bg-[#FFEB3B] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Public Landing</span>
          </Link>
        </div>

        <div className="p-6 sm:p-8 border-[3px] border-black bg-white shadow-[8px_8px_0px_#000000]">
          <div className="text-center mb-6">
            <div className="h-12 w-12 bg-[#FFEB3B] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center mx-auto mb-3">
              <Lock className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">Staff Portal Sign In</h1>
            <p className="text-xs font-bold text-slate-800 mt-1">
              Authorized access for Organizers, Visiting Faculty, and Desk Volunteers.
            </p>
          </div>

          {/* Quick 1-Click Evaluation Switcher */}
          <div className="mb-6 p-4 border-2 border-black bg-[#FFFBEB] shadow-[2px_2px_0px_#000000]">
            <p className="text-[11px] font-black uppercase tracking-wider text-black mb-2.5">
              ⚡ 1-Click Test Access (Instant Switch)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickDemoLogin("organizer", "super_admin")}
                className="justify-start text-xs font-black h-9"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Super Admin
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickDemoLogin("organizer", "event_coordinator")}
                className="justify-start text-xs font-black h-9"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Coordinator
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickDemoLogin("organizer", "registration_head")}
                className="justify-start text-xs font-black h-9"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Reg. Head
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickDemoLogin("faculty")}
                className="justify-start text-xs font-black h-9"
              >
                <Users className="w-3.5 h-3.5 mr-1" />
                Faculty Lead
              </Button>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleQuickDemoLogin("volunteer")}
              className="w-full mt-2 justify-start text-xs font-black h-9"
            >
              <Scan className="w-3.5 h-3.5 mr-1" />
              Registration Desk Volunteer
            </Button>
          </div>

          {/* Method tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#FFFBEB] border-2 border-black mb-5 shadow-[2px_2px_0px_#000000]">
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setMagicLinkSent(false);
              }}
              className={`py-2 text-xs font-black border transition-all cursor-pointer ${
                mode === "password"
                  ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                  : "text-black border-transparent hover:bg-[#FFEB3B]"
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
              className={`py-2 text-xs font-black border transition-all cursor-pointer ${
                mode === "magic-link"
                  ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
                  : "text-black border-transparent hover:bg-[#FFEB3B]"
              }`}
            >
              Magic Link
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 border-2 border-black bg-[#FF5252] text-black text-xs font-black shadow-[2px_2px_0px_#000000]">
              {errorMessage}
            </div>
          )}

          {magicLinkSent ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-[#4CAF50] mx-auto mb-3" />
              <h3 className="text-base font-black text-black">Check Your Inbox</h3>
              <p className="text-xs font-bold text-slate-800 mt-2">
                We sent a secure login link to <strong className="text-black">{email}</strong>.
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
                <label className="block text-xs font-black text-black mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-black" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.edu or staff@spark.edu"
                    className="w-full pl-9 pr-3 py-2.5 nb-input text-xs"
                  />
                </div>
              </div>

              {mode === "password" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black text-black">Password</label>
                    <span className="text-[11px] font-bold text-black hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-black" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 nb-input text-xs"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="yellow"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                <span>{mode === "magic-link" ? "Send Magic Login Link" : "Sign In to Portal"}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t-2 border-black text-center text-xs font-bold text-slate-800">
            <span>Visiting Faculty not yet registered? </span>
            <Link href="/register" className="font-black text-black underline hover:bg-[#FFEB3B] px-1">
              Register School
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}