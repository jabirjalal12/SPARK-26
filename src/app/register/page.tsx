"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { schoolRegistrationSchema } from "@/lib/schemas";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchUserProfile } from "@/lib/supabase/db";
import {
  School,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  User,
  KeyRound,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function RegisterSchoolPage() {
  const router = useRouter();
  const { addSchool, switchRole, setCurrentProfile } = useFestStore();

  const [formData, setFormData] = useState({
    schoolName: "",
    city: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    facultyName: "",
    facultyEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registeredSchool, setRegisteredSchool] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schoolRegistrationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();

        // 1. Sign up Supabase Auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.facultyEmail,
          password: formData.password,
          options: {
            data: {
              full_name: formData.facultyName,
              role: "faculty",
            },
          },
        });

        if (authError) {
          setErrors({ form: authError.message });
          setIsSubmitting(false);
          return;
        }

        // 2. Generate unique school code & deterministic school UUID
        const code = `SCH-${formData.city.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const schoolId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" 
          ? crypto.randomUUID() 
          : "00000000-0000-0000-0000-" + Math.random().toString(16).substring(2, 14).padEnd(12, "0");

        // 3. Insert School into Supabase (without .select() to avoid RLS returning scan failure)
        const { error: schoolError } = await supabase
          .from("schools")
          .insert({
            id: schoolId,
            name: formData.schoolName,
            code,
            city: formData.city,
            address: formData.address,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            status: "pending",
            arrived: false,
          });

        if (schoolError) {
          setErrors({ form: schoolError.message });
          setIsSubmitting(false);
          return;
        }

        const schoolData = {
          id: schoolId,
          name: formData.schoolName,
          code,
          city: formData.city,
          address: formData.address,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          status: "pending",
          arrived: false,
        };

        // 4. Update Profile in Supabase
        if (authData.user) {
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            role: "faculty",
            full_name: formData.facultyName,
            email: formData.facultyEmail,
            phone: formData.contactPhone,
            school_id: schoolData.id,
          });
        }

        // 5. Generate School Ticket
        const tokenHash = `TKT-${code}-${Math.random().toString(36).substring(2, 10)}`;
        await supabase.from("school_tickets").insert({
          school_id: schoolData.id,
          token_hash: tokenHash,
        });

        // 6. Automatically log in the faculty so their session is established immediately
        let isAuthenticated = false;
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.facultyEmail,
            password: formData.password,
          });

          if (!signInError && signInData?.user) {
            const profile = await fetchUserProfile(signInData.user.id);
            if (profile) {
              setCurrentProfile(profile);
            }
            switchRole("faculty");
            isAuthenticated = true;
          }
        } catch (loginErr) {
          console.warn("Auto-login error after registration:", loginErr);
        }

        setRegisteredSchool({
          ...schoolData,
          ticket_token: tokenHash,
          facultyEmail: formData.facultyEmail,
          facultyPassword: formData.password,
          isAuthenticated,
        });
      } else {
        const school = addSchool({
          name: formData.schoolName,
          city: formData.city,
          address: formData.address,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
        });
        setRegisteredSchool(school);
      }
    } catch (err: any) {
      setErrors({ form: err?.message || "Registration could not be completed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-black flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FFEB3B] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fest Landing</span>
          </Link>
          <span className="text-xs font-black uppercase px-2.5 py-1 bg-[#4CAF50] text-black border-2 border-black shadow-[2px_2px_0px_#000000]">
            VISITING FACULTY REGISTRATION
          </span>
        </div>

        {registeredSchool ? (
          <div className="p-8 text-center border-[3px] border-black bg-white shadow-[8px_8px_0px_#000000]">
            <div className="h-16 w-16 border-[3px] border-black bg-[#4CAF50] text-black mx-auto flex items-center justify-center mb-4 shadow-[3px_3px_0px_#000000]">
              <CheckCircle2 className="h-10 w-10 text-black" />
            </div>

            <h1 className="text-3xl font-black text-black tracking-tight">Registration Submitted</h1>
            <p className="text-sm font-bold text-slate-800 max-w-md mx-auto mt-2 leading-relaxed">
              Your institution <strong className="text-black">{registeredSchool.name}</strong> has been enrolled for SPARK 2026.
            </p>

            <div className="my-6 p-5 border-2 border-black bg-[#FFFBEB] text-left shadow-[4px_4px_0px_#000000] space-y-3">
              <p className="text-xs font-black uppercase text-black bg-[#FFEB3B] px-2 py-0.5 border border-black inline-block">
                NEXT STEPS TO COMPLETE ENROLLMENT
              </p>
              <div className="space-y-2.5 text-xs font-bold text-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-black text-[#FFEB3B] flex items-center justify-center font-mono font-black text-xs flex-shrink-0">1</span>
                  <p>Proceed to your <strong>Faculty Delegation Portal</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-black text-[#FFEB3B] flex items-center justify-center font-mono font-black text-xs flex-shrink-0">2</span>
                  <p>Add your student participants (<strong>Full Name &amp; Class/Grade</strong>).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-black text-[#FFEB3B] flex items-center justify-center font-mono font-black text-xs flex-shrink-0">3</span>
                  <p>Open the <strong>Ticket</strong> window to generate your official Delegation Entry Ticket with QR Code.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-[#4CAF50] text-black flex items-center justify-center font-mono font-black text-xs flex-shrink-0">✓</span>
                  <p>This QR ticket will be scanned at the venue entrance by Registration Desk staff to verify and admit your student squad.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-black bg-[#FFFBEB] text-black text-xs text-left flex items-start gap-3 mb-6 shadow-[2px_2px_0px_#000000]">
              <Clock className="h-5 w-5 flex-shrink-0 mt-0.5 text-black" />
              <div>
                <p className="font-black text-black uppercase tracking-wide">Pending Registration Head Approval</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  The fest Registration Head reviews institutional submissions. In the meantime, you can log in, enter your student delegation roster, and prepare your track teams.
                </p>
              </div>
            </div>

            {registeredSchool.isAuthenticated && (
              <div className="mb-5 inline-flex items-center gap-2 bg-[#4CAF50] text-black border-2 border-black px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Active Session: Logged In as Faculty</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                variant="yellow"
                className="w-full text-base py-3 font-black"
                disabled={isLoggingIn}
                onClick={async () => {
                  setIsLoggingIn(true);
                  try {
                    if (isSupabaseConfigured()) {
                      const supabase = createClient();
                      const { data: sessionData } = await supabase.auth.getSession();
                      
                      if (!sessionData?.session?.user && registeredSchool?.facultyEmail && registeredSchool?.facultyPassword) {
                        const { data: sData, error: sErr } = await supabase.auth.signInWithPassword({
                          email: registeredSchool.facultyEmail,
                          password: registeredSchool.facultyPassword,
                        });
                        if (sErr) {
                          router.push(`/login?email=${encodeURIComponent(registeredSchool.facultyEmail)}&redirect=/faculty/students`);
                          return;
                        }
                        if (sData?.user) {
                          const prof = await fetchUserProfile(sData.user.id);
                          if (prof) setCurrentProfile(prof);
                        }
                      }
                    }
                    switchRole("faculty");
                    router.push("/faculty/students");
                  } catch (e) {
                    router.push(`/login?email=${encodeURIComponent(registeredSchool?.facultyEmail || "")}&redirect=/faculty/students`);
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
              >
                <span>{isLoggingIn ? "Authenticating Session..." : "Proceed to Faculty Delegation Manager"}</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>

              <Link
                href={`/login?email=${encodeURIComponent(registeredSchool?.facultyEmail || "")}&redirect=/faculty/students`}
                className="w-full"
              >
                <Button variant="secondary" className="w-full text-xs font-black uppercase">
                  <span>Open Faculty Portal via Login Screen</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 border-[3px] border-black bg-white shadow-[8px_8px_0px_#000000]">
            <div className="text-center mb-6">
              <div className="h-12 w-12 border-[3px] border-black bg-[#FFEB3B] flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_#000000]">
                <School className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-2xl font-black text-black tracking-tight">Register Your Institution</h1>
              <p className="text-xs font-bold text-slate-800 mt-1">
                Each visiting school sends ONE faculty coordinator who manages their student squad.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution Info */}
              <div className="space-y-3 pb-4 border-b-2 border-black">
                <p className="text-xs font-black uppercase tracking-wider text-black bg-[#FFEB3B] border border-black px-2 py-0.5 inline-block">
                  Institution Details
                </p>

                <div>
                  <label className="text-xs font-black text-black block mb-1">
                    School / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="e.g. Apex Institute of Technology"
                    className="w-full px-3.5 py-2.5 nb-input text-xs"
                  />
                  {errors.schoolName && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.schoolName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-black block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3.5 py-2.5 nb-input text-xs"
                    />
                    {errors.city && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-black text-black block mb-1">Campus Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street / Sector"
                      className="w-full px-3.5 py-2.5 nb-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-black block mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="fest@college.edu"
                      className="w-full px-3.5 py-2.5 nb-input text-xs"
                    />
                    {errors.contactEmail && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-black text-black block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+91 98450 11223"
                      className="w-full px-3.5 py-2.5 nb-input text-xs"
                    />
                    {errors.contactPhone && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Faculty Lead Info */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-black uppercase tracking-wider text-black bg-[#2196F3] border border-black px-2 py-0.5 inline-block">
                  Accompanying Faculty Lead
                </p>

                <div>
                  <label className="text-xs font-black text-black block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    placeholder="Dr. / Prof. Full Name"
                    className="w-full px-3.5 py-2.5 nb-input text-xs"
                  />
                  {errors.facultyName && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.facultyName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-black block mb-1">Faculty Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.facultyEmail}
                      onChange={(e) => setFormData({ ...formData, facultyEmail: e.target.value })}
                      placeholder="faculty.lead@college.edu"
                      className="w-full px-3.5 py-2.5 nb-input text-xs"
                    />
                    {errors.facultyEmail && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.facultyEmail}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-black text-black block mb-1">Portal Password *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 nb-input text-xs"
                    />
                    {errors.password && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.password}</p>}
                  </div>
                </div>
              </div>

              {errors.form && (
                <div className="p-3 border-2 border-black bg-[#FF5252] text-black text-xs font-bold shadow-[2px_2px_0px_#000]">
                  {errors.form}
                </div>
              )}

              <Button
                type="submit"
                variant="yellow"
                className="w-full mt-4"
                isLoading={isSubmitting}
              >
                <span>Submit Institutional Application</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}