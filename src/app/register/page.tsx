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
  ShieldCheck,
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
      const cleanPrefix = formData.schoolName.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3) || "SCH";
      const randomNum = Math.floor(100 + Math.random() * 900);
      const generatedCode = `${cleanPrefix}-${randomNum}`;

      const created = addSchool({
        name: formData.schoolName,
        code: generatedCode,
        city: formData.city,
        address: formData.address,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        status: "pending",
      });

      setRegisteredSchool(created);
    } catch {
      setErrors({ form: "Registration could not be completed. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fest Landing</span>
          </Link>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            VISITING FACULTY REGISTRATION
          </span>
        </div>

        {registeredSchool ? (
          <GlassCard className="p-8 text-center border-white/20 bg-slate-900/90 backdrop-blur-2xl">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">Registration Submitted</h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
              Your institution <strong className="text-white">{registeredSchool.name}</strong> has been enrolled for MAKE//BREAK 2026.
            </p>

            <div className="my-6 p-5 rounded-xl bg-white/[0.04] border border-white/10 max-w-xs mx-auto">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Assigned School Code
              </p>
              <p className="text-3xl font-black text-indigo-300 font-mono tracking-widest mt-1">
                {registeredSchool.code}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Use this identifier to retrieve your delegation pass at the desk.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-left flex items-start gap-3 mb-6">
              <Clock className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-400" />
              <div>
                <p className="font-bold text-white uppercase tracking-wide">Pending Registration Head Approval</p>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  The fest Registration Head reviews institutional submissions. In the meantime, you can log in, enter your student delegation roster, and prepare your track teams.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="gradient"
                className="w-full text-base py-3"
                onClick={() => {
                  switchRole("faculty");
                  router.push("/faculty/students");
                }}
              >
                <span>Proceed to Faculty Delegation Manager</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-6 sm:p-8 border-white/15 bg-slate-900/80 backdrop-blur-2xl">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
                <School className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Register Your Institution</h1>
              <p className="text-xs text-slate-400 mt-1">
                Each visiting school sends ONE faculty coordinator who manages their student squad.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution Info */}
              <div className="space-y-3 pb-4 border-b border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
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
                    className="w-full px-3.5 py-2.5 glass-input text-xs"
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
                      className="w-full px-3.5 py-2.5 glass-input text-xs"
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
                      className="w-full px-3.5 py-2.5 glass-input text-xs"
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
                      className="w-full px-3.5 py-2.5 glass-input text-xs"
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
                      className="w-full px-3.5 py-2.5 glass-input text-xs"
                    />
                    {errors.contactPhone && <p className="text-xs text-rose-400 mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Faculty Lead Info */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-300">
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
                    className="w-full px-3.5 py-2.5 glass-input text-xs"
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
                      placeholder="faculty.lead@college.edu"
                      className="w-full px-3.5 py-2.5 glass-input text-xs"
                    />
                    {errors.facultyEmail && <p className="text-xs text-rose-400 mt-1">{errors.facultyEmail}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Portal Password *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 glass-input text-xs"
                    />
                    {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                  </div>
                </div>
              </div>

              {errors.form && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs">
                  {errors.form}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full mt-4"
                isLoading={isSubmitting}
              >
                <span>Submit Institutional Application</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
