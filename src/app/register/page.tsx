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
    <div className="min-h-screen bg-[#FFFBEB] text-black flex flex-col justify-center items-center px-4 py-12 relative">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-black hover:bg-[#FFEB3B] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] bg-white transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Fest Landing</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider bg-[#FFEB3B] text-black px-2.5 py-1 border-2 border-black font-mono shadow-[2px_2px_0px_#000]">
            FACULTY REGISTRATION
          </span>
        </div>

        {registeredSchool ? (
          <GlassCard variant="yellow" className="p-8 text-center border-4 border-black shadow-[8px_8px_0px_#000]">
            <div className="h-16 w-16 bg-[#4CAF50] text-black border-4 border-black mx-auto flex items-center justify-center mb-4 shadow-[4px_4px_0px_#000]">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-3xl font-black text-black tracking-tight uppercase">Registration Submitted!</h1>
            <p className="text-sm font-medium text-black max-w-md mx-auto mt-2 leading-relaxed">
              Your institution <span className="font-black bg-white px-1.5 py-0.5 border border-black">{registeredSchool.name}</span> has been enrolled for SPARK 2026.
            </p>

            <div className="my-6 p-5 bg-white border-4 border-black shadow-[6px_6px_0px_#000] max-w-xs mx-auto">
              <p className="text-xs uppercase tracking-wider font-black text-black">
                Assigned School Code
              </p>
              <p className="text-4xl font-black text-black font-mono tracking-widest mt-1 bg-[#FFEB3B] py-1 border-2 border-black">
                {registeredSchool.code}
              </p>
              <p className="text-xs font-bold text-neutral-700 mt-2">
                Share this with your students so they can access their passes.
              </p>
            </div>

            <div className="p-4 bg-[#FF9800]/20 border-3 border-black text-black text-xs text-left flex items-start gap-3 mb-6 shadow-[3px_3px_0px_#000]">
              <Clock className="h-5 w-5 flex-shrink-0 mt-0.5 text-black" />
              <div>
                <p className="font-black uppercase tracking-wide">Pending Organizer Approval</p>
                <p className="text-xs font-medium text-black mt-0.5">
                  Organizers review institutional applications within 24 hours. You can already add students and configure teams.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                className="w-full text-base py-3"
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
          <GlassCard variant="white" className="p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_#000]">
            <div className="text-center mb-6">
              <div className="h-14 w-14 bg-[#2196F3] border-3 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000] mb-3">
                <School className="h-7 w-7 text-black" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">Register Your Institution</h1>
              <p className="text-xs font-semibold text-neutral-700 mt-1">
                Each visiting school sends ONE faculty coordinator and student squads.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution Info */}
              <div className="space-y-3 pb-4 border-b-3 border-black">
                <div className="inline-block bg-[#2196F3] text-black border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
                  Institution Details
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">
                    School / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="e.g. Apex Institute of Technology"
                    className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  />
                  {errors.schoolName && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.schoolName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    />
                    {errors.city && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Campus Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street / Sector"
                      className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="fest@college.edu"
                      className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    />
                    {errors.contactEmail && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="+91 98450 11223"
                      className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    />
                    {errors.contactPhone && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </div>

              {/* Faculty Coordinator Info */}
              <div className="space-y-3 pt-2">
                <div className="inline-block bg-[#FF5252] text-black border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
                  Accompanying Faculty Lead
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    placeholder="Dr. / Prof. Full Name"
                    className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#FF5252]"
                  />
                  {errors.facultyName && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.facultyName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Faculty Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.facultyEmail}
                      onChange={(e) => setFormData({ ...formData, facultyEmail: e.target.value })}
                      placeholder="faculty@college.edu"
                      className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#FF5252]"
                    />
                    {errors.facultyEmail && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.facultyEmail}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wide text-black block mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full px-3.5 py-2.5 bg-white border-3 border-black text-black placeholder-neutral-500 text-sm font-medium shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#FF5252]"
                    />
                    {errors.password && <p className="text-xs font-bold text-[#FF5252] mt-1">{errors.password}</p>}
                  </div>
                </div>
              </div>

              {errors.form && (
                <p className="text-xs font-bold text-white bg-[#FF5252] border-2 border-black p-2.5 text-center shadow-[3px_3px_0px_#000]">
                  {errors.form}
                </p>
              )}

              <Button type="submit" variant="primary" className="w-full mt-4 text-base py-3" isLoading={isSubmitting}>
                <span>Submit School Registration</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-5 text-center text-xs font-bold text-neutral-700">
              Already registered?{" "}
              <Link href="/login" className="text-black bg-[#FFEB3B] px-2 py-0.5 border border-black hover:shadow-[2px_2px_0px_#000] font-black underline">
                Sign In to Faculty Portal
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

