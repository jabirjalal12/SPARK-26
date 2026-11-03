"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFestStore } from "@/lib/store";
import { schoolRegistrationSchema } from "@/lib/schemas";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export default function RegisterSchoolPage() {
  const router = useRouter();
  const { addSchool, switchRole } = useFestStore();

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

  const handleSubmit = (e: React.FormEvent) => {
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
      // Auto-generate 6-char code from name prefix + random digits
      const cleanPrefix = formData.schoolName.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3) || "SCH";
      const randomNum = Math.floor(100 + Math.random() * 900);
      const generatedCode = `${cleanPrefix}${randomNum}`;

      const created = addSchool({
        name: formData.schoolName,
        code: generatedCode,
        city: formData.city,
        address: formData.address,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        approved: false, // Organizers approve faculty accounts
      });

      setRegisteredSchool(created);
    } catch {
      setErrors({ form: "Registration could not be completed. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fest Landing</span>
          </Link>
          <span className="text-xs font-bold text-blue-400 font-mono">FACULTY REGISTRATION</span>
        </div>

        {registeredSchool ? (
          <GlassCard className="p-8 text-center" glow="green">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-black text-white">Registration Submitted!</h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
              Your institution <span className="font-bold text-white">{registeredSchool.name}</span> has been enrolled for MAKE//BREAK 2026.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-xs mx-auto">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Assigned School Code
              </p>
              <p className="text-3xl font-black text-indigo-400 font-mono tracking-widest mt-1">
                {registeredSchool.code}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Share this with your students so they can access their passes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs text-left flex items-start gap-3 mb-6">
              <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Pending Organizer Approval</p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Organizers review institutional applications within 24 hours. You can already add students and configure teams.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  switchRole("faculty");
                  router.push("/faculty/students");
                }}
              >
                <span>Proceed to Faculty Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-6 sm:p-8" glow="blue">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
                <School className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Register Your Institution</h1>
              <p className="text-xs text-slate-300 mt-1">
                Each visiting school sends ONE faculty coordinator and student squads.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution Info */}
              <div className="space-y-3 pb-3 border-b border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Institution Details
                </p>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    School / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="e.g. Apex Institute of Technology"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.schoolName && <p className="text-xs text-rose-400 mt-1">{errors.schoolName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.city && <p className="text-xs text-rose-400 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Campus Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street / Sector"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="fest@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.contactEmail && <p className="text-xs text-rose-400 mt-1">{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+91 98450 11223"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.contactPhone && <p className="text-xs text-rose-400 mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Faculty Coordinator Info */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  Accompanying Faculty Lead
                </p>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    placeholder="Dr. / Prof. Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  {errors.facultyName && <p className="text-xs text-rose-400 mt-1">{errors.facultyName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Faculty Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.facultyEmail}
                      onChange={(e) => setFormData({ ...formData, facultyEmail: e.target.value })}
                      placeholder="faculty@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    {errors.facultyEmail && <p className="text-xs text-rose-400 mt-1">{errors.facultyEmail}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                  </div>
                </div>
              </div>

              {errors.form && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-center font-medium">
                  {errors.form}
                </p>
              )}

              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isSubmitting}>
                <span>Submit School Registration</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-400">
              Already registered?{" "}
              <Link href="/login" className="text-indigo-400 hover:underline font-semibold">
                Sign In to Faculty Portal
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
