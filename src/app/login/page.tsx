"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchUserProfile } from "@/lib/supabase/db";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, switchOrganizerSubRole, setCurrentProfile } = useFestStore();

  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-fill email from query parameters if redirected from registration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const prefillEmail = params.get("email");
      if (prefillEmail) {
        setEmail(prefillEmail);
      }
    }
  }, []);

  const supabaseConfigured = isSupabaseConfigured();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!email || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      if (mode === "magic-link") {
        if (supabaseConfigured) {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });
          if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
          }
        }
        setMagicLinkSent(true);
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }

      let profile: any = null;

      if (supabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          profile = await fetchUserProfile(data.user.id);
          if (profile) {
            setCurrentProfile(profile);
            switchRole(profile.role);
            if (profile.sub_roles && profile.sub_roles.length > 0) {
              switchOrganizerSubRole(profile.sub_roles[0]);
            }
          }
        }
      } else {
        // Fallback when Supabase keys in .env.local are still placeholder
        if (email.toLowerCase().includes("fac")) {
          switchRole("faculty");
        } else if (email.toLowerCase().includes("vol")) {
          switchRole("volunteer");
        } else {
          switchRole("organizer");
          switchOrganizerSubRole("super_admin");
        }
      }

      let destination = "/dashboard";
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect");
        if (redirectParam && redirectParam.startsWith("/")) {
          destination = redirectParam;
        } else if (profile?.role === "faculty" || email.toLowerCase().includes("fac")) {
          destination = "/faculty/students";
        } else if (profile?.role === "volunteer" || email.toLowerCase().includes("vol")) {
          destination = "/volunteer/duties";
        }
      } else if (profile?.role === "faculty") {
        destination = "/faculty/students";
      }

      router.push(destination);
    } catch (err: any) {
      setErrorMessage(err?.message || "Authentication failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
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

          {/* Supabase Connection Status Tag */}
          <div className="mb-5 p-2.5 bg-[#FFFBEB] border-2 border-black flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-black" />
              <span>Backend: Supabase Auth & RLS</span>
            </span>
            <span className={`px-2 py-0.5 border border-black text-[10px] uppercase font-black ${supabaseConfigured ? 'bg-[#4CAF50] text-black' : 'bg-[#FFEB3B] text-black'}`}>
              {supabaseConfigured ? "Connected" : "Live Client"}
            </span>
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
            <div className="mb-4 p-3 border-2 border-black bg-[#FF5252] text-black text-xs font-black shadow-[2px_2px_0px_#000000] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {magicLinkSent ? (
            <div className="p-4 border-2 border-black bg-[#4CAF50] text-black text-center shadow-[3px_3px_0px_#000000]">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-black" />
              <h3 className="text-sm font-black uppercase">Magic Link Sent!</h3>
              <p className="text-xs font-bold mt-1 text-slate-900">
                Check <strong>{email}</strong> for your Supabase login link to enter the fest portal.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMagicLinkSent(false)}
                className="mt-3 text-xs bg-white text-black font-black"
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@spark.edu"
                    className="w-full pl-9 pr-3 py-2 border-2 border-black text-sm font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {mode === "password" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-black">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-600 font-bold">Min 6 characters</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 border-2 border-black text-sm font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                variant="yellow"
                className="w-full mt-4 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
              >
                {isLoading ? (
                  <span>Authenticating via Supabase...</span>
                ) : (
                  <>
                    <span>{mode === "password" ? "Sign In to Portal" : "Send Magic Link"}</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t-2 border-black text-center">
            <p className="text-xs font-bold text-slate-800">
              Visiting school faculty coordinator not yet registered?
            </p>
            <Link
              href="/register"
              className="inline-block mt-1 text-xs font-black text-black underline decoration-black hover:bg-[#FFEB3B] px-1"
            >
              Register School Delegation Here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
