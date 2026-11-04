"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useFestStore } from "@/lib/store";
import { UserRole } from "@/lib/types/database";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Key,
  UserPlus,
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Building,
  CheckCircle2,
} from "lucide-react";

export interface ManagedCredential {
  id: string;
  name: string;
  email: string;
  passwordText: string;
  role: UserRole;
  jurisdiction: string;
  phone?: string;
  createdAt: string;
  isSystem?: boolean;
}

const DEFAULT_SYSTEM_ACCOUNTS: ManagedCredential[] = [
  {
    id: "sys-01",
    name: "Fest Director (Super Administrator)",
    email: "admin@spark.in",
    passwordText: "123456",
    role: "super_admin",
    jurisdiction: "Full Campus Access • All Terminals & Arenas",
    phone: "+91 98765 43210",
    createdAt: "2026-11-01T09:00:00Z",
    isSystem: true,
  },
  {
    id: "sys-02",
    name: "Event Operations Coordinator",
    email: "coordinator@spark.in",
    passwordText: "123456",
    role: "event_coordinator",
    jurisdiction: "All Competition Tracks • Arena Schedules & Heats",
    phone: "+91 98765 43211",
    createdAt: "2026-11-01T09:00:00Z",
    isSystem: true,
  },
  {
    id: "sys-03",
    name: "Head of Registration Desk",
    email: "registration@spark.in",
    passwordText: "123456",
    role: "registration_head",
    jurisdiction: "Central Quadrangle Desk • Approvals & Undo",
    phone: "+91 98765 43212",
    createdAt: "2026-11-01T09:00:00Z",
    isSystem: true,
  },
  {
    id: "sys-04",
    name: "Registration Fast Scanner Volunteer",
    email: "volunteer@spark.in",
    passwordText: "123456",
    role: "volunteer",
    jurisdiction: "Registration Gate Booth 1 • QR Scanner",
    phone: "+91 98765 43213",
    createdAt: "2026-11-01T09:00:00Z",
    isSystem: true,
  },
  {
    id: "sys-05",
    name: "Dr. Evelyn Reed (Chief Jury)",
    email: "judge@spark.in",
    passwordText: "123456",
    role: "judge",
    jurisdiction: "Track 1: AI Hackathon Jury Arena",
    phone: "+91 98765 43214",
    createdAt: "2026-11-01T09:00:00Z",
    isSystem: true,
  },
  {
    id: "sys-06",
    name: "Visiting Faculty Coordinator",
    email: "faculty@spark.in",
    passwordText: "123456",
    role: "faculty",
    jurisdiction: "School Delegation Squads & Tickets",
    phone: "+91 98765 43215",
    createdAt: "2026-11-01T09:00:00Z",
    isSystem: true,
  },
  {
    id: "sys-07",
    name: "Venue TV Kiosk Screen",
    email: "tv@spark.in",
    passwordText: "123456",
    role: "tv_display",
    jurisdiction: "Auditorium Mainstage Display Feed",
    phone: "",
    createdAt: "2026-11-01T09:00:00Z",
    isSystem: true,
  },
];

export default function PortalCredentialsCenter() {
  const { isSuperAdmin, tracks } = useFestStore();

  const [managedUsers, setManagedUsers] = useState<ManagedCredential[]>([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<ManagedCredential | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [successShareModal, setSuccessShareModal] = useState<ManagedCredential | null>(null);

  // Form state for creating user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "event_coordinator" as UserRole,
    jurisdiction: "",
    phone: "",
  });

  // Load custom credentials from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spark_managed_credentials");
      if (saved) {
        const parsed: ManagedCredential[] = JSON.parse(saved);
        setManagedUsers(parsed);
      }
    } catch (e) {
      console.warn("Failed to read credentials from storage", e);
    }
  }, []);

  // Check URL query parameters for ?create=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "true") {
        setCreateModalOpen(true);
      }
    }
  }, []);

  // Save custom credentials to localStorage
  const saveCustomCredentials = (list: ManagedCredential[]) => {
    setManagedUsers(list);
    try {
      localStorage.setItem("spark_managed_credentials", JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to persist credentials to storage", e);
    }
  };

  // Combine baseline system accounts with custom accounts
  const allAccounts = useMemo(() => {
    return [...DEFAULT_SYSTEM_ACCOUNTS, ...managedUsers];
  }, [managedUsers]);

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return allAccounts.filter((acc) => {
      if (selectedRoleFilter !== "all" && acc.role !== selectedRoleFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          acc.name.toLowerCase().includes(q) ||
          acc.email.toLowerCase().includes(q) ||
          acc.jurisdiction.toLowerCase().includes(q) ||
          acc.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allAccounts, selectedRoleFilter, searchQuery]);

  // Quick stats
  const totalCount = allAccounts.length;
  const coordCount = allAccounts.filter((a) => a.role === "event_coordinator").length;
  const regCount = allAccounts.filter((a) => a.role === "registration_head").length;
  const volCount = allAccounts.filter((a) => a.role === "volunteer").length;
  const judgeCount = allAccounts.filter((a) => a.role === "judge").length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let rand = "";
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SPARK@${rand}`;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert("Please enter Name, Login ID (Email), and Password.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const trimmedEmail = formData.email.trim().toLowerCase();

    // Check duplicate email
    if (allAccounts.some((a) => a.email.toLowerCase() === trimmedEmail)) {
      alert("An account with this Login ID / Email already exists.");
      return;
    }

    const newCred: ManagedCredential = {
      id: "usr-" + Date.now().toString(36),
      name: formData.name.trim(),
      email: trimmedEmail,
      passwordText: formData.password.trim(),
      role: formData.role,
      jurisdiction: formData.jurisdiction.trim() || getDefaultJurisdiction(formData.role),
      phone: formData.phone.trim() || undefined,
      createdAt: new Date().toISOString(),
      isSystem: false,
    };

    // If Supabase is live, provision auth account
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signUp({
          email: trimmedEmail,
          password: formData.password.trim(),
          options: {
            data: {
              full_name: formData.name.trim(),
              role: formData.role,
            },
          },
        });

        await supabase.from("profiles").upsert({
          id: newCred.id,
          email: trimmedEmail,
          full_name: formData.name.trim(),
          role: formData.role,
          phone: formData.phone.trim() || null,
        });
      } catch (err) {
        console.warn("Supabase provision attempt:", err);
      }
    }

    const updated = [newCred, ...managedUsers];
    saveCustomCredentials(updated);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "event_coordinator",
      jurisdiction: "",
      phone: "",
    });

    setCreateModalOpen(false);
    setSuccessShareModal(newCred);
    showToast(`Successfully created Login ID & Password for ${newCred.name}`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke and delete credentials for ${name}?`)) return;
    const updated = managedUsers.filter((u) => u.id !== id);
    saveCustomCredentials(updated);
    showToast(`Deleted credentials for ${name}`);
  };

  const handleOpenReset = (user: ManagedCredential) => {
    setSelectedUserForReset(user);
    setNewPasswordInput(generateRandomPassword());
    setResetModalOpen(true);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset || !newPasswordInput.trim()) return;

    if (newPasswordInput.trim().length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    const updatedUsers = managedUsers.map((u) => {
      if (u.id === selectedUserForReset.id) {
        return { ...u, passwordText: newPasswordInput.trim() };
      }
      return u;
    });

    saveCustomCredentials(updatedUsers);
    setResetModalOpen(false);
    showToast(`Password reset successfully for ${selectedUserForReset.name}`);
    setSelectedUserForReset(null);
  };

  const getDefaultJurisdiction = (r: UserRole) => {
    if (r === "event_coordinator") return "All Competition Tracks • Arena Schedules";
    if (r === "registration_head") return "Central Quadrangle Desk • Arrivals & Undo";
    if (r === "volunteer") return "Registration Desk Scanner • Duty Roster";
    if (r === "judge") return "Official Marks Evaluation Arena";
    if (r === "faculty") return "School Delegation Student Roster";
    return "Campus HQ Administration";
  };

  const getRoleBadgeStyle = (r: UserRole) => {
    if (r === "super_admin") return "bg-[#FFEB3B] text-black border-black";
    if (r === "event_coordinator") return "bg-[#FF5252] text-black border-black";
    if (r === "registration_head") return "bg-[#00BCD4] text-black border-black";
    if (r === "volunteer") return "bg-[#2196F3] text-white border-black";
    if (r === "judge") return "bg-[#9C27B0] text-white border-black";
    if (r === "faculty") return "bg-[#4CAF50] text-white border-black";
    return "bg-black text-white border-black";
  };

  const getRoleDisplayName = (r: UserRole) => {
    if (r === "super_admin") return "Super Administrator";
    if (r === "event_coordinator") return "Event Coordinator";
    if (r === "registration_head") return "Registration Head";
    if (r === "volunteer") return "Desk Volunteer";
    if (r === "judge") return "Fest Judge";
    if (r === "faculty") return "Visiting Faculty";
    if (r === "tv_display") return "TV Display Kiosk";
    return r;
  };

  // Route Guard: Super Admin Only
  if (!isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000] text-center">
        <div className="w-12 h-12 bg-[#FF5252] border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#000]">
          <ShieldAlert className="w-6 h-6 text-black" />
        </div>
        <h2 className="text-xl font-black text-black">Super Admin Clearance Required</h2>
        <p className="text-xs font-bold text-slate-700 mt-2">
          Provisioning portal Login IDs and Passwords for other roles is restricted exclusively to Super Administrators.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFEB3B] hover:bg-black hover:text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span>Return to Operations Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 p-3 bg-black text-[#FFEB3B] border-2 border-white shadow-[4px_4px_0px_#000000] flex items-center gap-2 text-xs font-black animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#FFEB3B] text-black border border-black shadow-[2px_2px_0px_#000]">
                SUPER ADMIN TERMINAL
              </span>
              <span className="text-xs font-bold text-slate-700">Role Credentials & Access Provisioning</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Portal Login ID & Password Manager
            </h1>
            <p className="text-xs font-bold text-slate-800 mt-1 max-w-2xl">
              Create and manage login accounts (ID & Password) for Event Coordinators, Registration Heads, Desk Volunteers, and Judges to log into the SPARK 2026 portal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCreateModalOpen(true)}
              variant="yellow"
              className="text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000000] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              <span>+ Create Role Login ID & Pass</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 border-2 border-black bg-white shadow-[3px_3px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-slate-600 block">Total User Accounts</span>
          <span className="text-2xl font-black text-black mt-1 block">{totalCount}</span>
        </div>
        <div className="p-3 border-2 border-black bg-[#FF5252]/20 shadow-[3px_3px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">Event Coordinators</span>
          <span className="text-2xl font-black text-black mt-1 block">{coordCount}</span>
        </div>
        <div className="p-3 border-2 border-black bg-[#00BCD4]/20 shadow-[3px_3px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">Registration Heads</span>
          <span className="text-2xl font-black text-black mt-1 block">{regCount}</span>
        </div>
        <div className="p-3 border-2 border-black bg-[#2196F3]/20 shadow-[3px_3px_0px_#000000]">
          <span className="text-[10px] font-black uppercase text-black block">Desk Volunteers</span>
          <span className="text-2xl font-black text-black mt-1 block">{volCount}</span>
        </div>
        <div className="p-3 border-2 border-black bg-[#9C27B0]/20 shadow-[3px_3px_0px_#000000] col-span-2 sm:col-span-1">
          <span className="text-[10px] font-black uppercase text-black block">Official Judges</span>
          <span className="text-2xl font-black text-black mt-1 block">{judgeCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedRoleFilter("all")}
            className={`px-2.5 py-1 text-xs font-black border-2 border-black transition-all cursor-pointer ${
              selectedRoleFilter === "all" ? "bg-black text-white shadow-[2px_2px_0px_#2196F3]" : "bg-white hover:bg-[#FFEB3B]"
            }`}
          >
            All Roles ({allAccounts.length})
          </button>
          <button
            onClick={() => setSelectedRoleFilter("event_coordinator")}
            className={`px-2.5 py-1 text-xs font-black border-2 border-black transition-all cursor-pointer ${
              selectedRoleFilter === "event_coordinator" ? "bg-[#FF5252] text-black shadow-[2px_2px_0px_#000]" : "bg-white hover:bg-[#FF5252]/20"
            }`}
          >
            Coordinators ({coordCount})
          </button>
          <button
            onClick={() => setSelectedRoleFilter("registration_head")}
            className={`px-2.5 py-1 text-xs font-black border-2 border-black transition-all cursor-pointer ${
              selectedRoleFilter === "registration_head" ? "bg-[#00BCD4] text-black shadow-[2px_2px_0px_#000]" : "bg-white hover:bg-[#00BCD4]/20"
            }`}
          >
            Reg Heads ({regCount})
          </button>
          <button
            onClick={() => setSelectedRoleFilter("volunteer")}
            className={`px-2.5 py-1 text-xs font-black border-2 border-black transition-all cursor-pointer ${
              selectedRoleFilter === "volunteer" ? "bg-[#2196F3] text-white shadow-[2px_2px_0px_#000]" : "bg-white hover:bg-[#2196F3]/20"
            }`}
          >
            Volunteers ({volCount})
          </button>
          <button
            onClick={() => setSelectedRoleFilter("judge")}
            className={`px-2.5 py-1 text-xs font-black border-2 border-black transition-all cursor-pointer ${
              selectedRoleFilter === "judge" ? "bg-[#9C27B0] text-white shadow-[2px_2px_0px_#000]" : "bg-white hover:bg-[#9C27B0]/20"
            }`}
          >
            Judges ({judgeCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, ID or role..."
            className="w-full pl-9 pr-3 py-1.5 nb-input text-xs"
          />
        </div>
      </div>

      {/* Credentials Table / Cards */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-black" />
            <h2 className="text-sm font-black uppercase tracking-tight text-black">
              Provisioned Portal User Accounts ({filteredAccounts.length})
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-600">
            Click 👁️ to reveal password • Copy to share with staff
          </span>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-black bg-[#FFFBEB] text-center">
            <p className="text-xs font-black text-black">No matching credentials found.</p>
            <p className="text-[11px] font-bold text-slate-600 mt-1">Try another search or role filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAccounts.map((acc) => {
              const isRevealed = revealedPasswords[acc.id] || false;
              const displayPass = isRevealed ? acc.passwordText : "••••••••";

              const fullCredentialsString = `Official: ${acc.name}\nRole: ${getRoleDisplayName(acc.role)}\nPortal Login URL: ${typeof window !== "undefined" ? window.location.origin : ""}/login\nLogin ID (Email): ${acc.email}\nPassword: ${acc.passwordText}`;

              return (
                <div
                  key={acc.id}
                  className="p-4 border-2 border-black bg-[#FFFBEB] shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Official Info */}
                    <div className="space-y-1 min-w-[240px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase border ${getRoleBadgeStyle(acc.role)}`}>
                          {getRoleDisplayName(acc.role)}
                        </span>
                        {acc.isSystem && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-black text-[#FFEB3B] border border-black">
                            SYSTEM
                          </span>
                        )}
                        <span className="font-black text-sm text-black">{acc.name}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700">
                        {acc.jurisdiction} {acc.phone && `• ${acc.phone}`}
                      </p>
                    </div>

                    {/* Login Credentials Box */}
                    <div className="flex flex-wrap items-center gap-2 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000000] w-full lg:w-auto">
                      {/* Login ID */}
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-black text-xs font-mono">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">ID:</span>
                        <strong className="text-black select-all">{acc.email}</strong>
                        <button
                          onClick={() => copyToClipboard(acc.email, `id-${acc.id}`, "Login ID")}
                          className="p-1 hover:bg-[#FFEB3B] border border-black ml-1 cursor-pointer"
                          title="Copy Login ID"
                        >
                          {copiedId === `id-${acc.id}` ? (
                            <Check className="w-3 h-3 text-[#4CAF50]" />
                          ) : (
                            <Copy className="w-3 h-3 text-black" />
                          )}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-black text-xs font-mono">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Pass:</span>
                        <strong className="text-black select-all">{displayPass}</strong>
                        <button
                          onClick={() => togglePasswordVisibility(acc.id)}
                          className="p-1 hover:bg-[#FFEB3B] border border-black ml-1 cursor-pointer"
                          title={isRevealed ? "Hide Password" : "Show Password"}
                        >
                          {isRevealed ? (
                            <EyeOff className="w-3 h-3 text-black" />
                          ) : (
                            <Eye className="w-3 h-3 text-black" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(acc.passwordText, `pw-${acc.id}`, "Password")}
                          className="p-1 hover:bg-[#FFEB3B] border border-black cursor-pointer"
                          title="Copy Password"
                        >
                          {copiedId === `pw-${acc.id}` ? (
                            <Check className="w-3 h-3 text-[#4CAF50]" />
                          ) : (
                            <Copy className="w-3 h-3 text-black" />
                          )}
                        </button>
                      </div>

                      {/* Copy Both */}
                      <button
                        onClick={() => copyToClipboard(fullCredentialsString, `both-${acc.id}`, "Full Credentials")}
                        className="px-2 py-1 bg-[#FFEB3B] hover:bg-black hover:text-white border border-black text-[11px] font-black uppercase shadow-[1px_1px_0px_#000] cursor-pointer flex items-center gap-1"
                        title="Copy full credentials package for WhatsApp / SMS"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Both</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {!acc.isSystem && (
                        <>
                          <button
                            onClick={() => handleOpenReset(acc)}
                            className="px-2 py-1 text-xs font-black bg-white hover:bg-[#FFEB3B] border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer"
                            title="Reset password"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleDeleteUser(acc.id, acc.name)}
                            className="p-1.5 text-xs font-black bg-white hover:bg-[#FF5252] border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer"
                            title="Revoke and delete account"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-black" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create New ID & Password */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Role Login ID & Password"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <p className="text-xs font-bold text-slate-700 bg-[#FFFBEB] p-2.5 border-2 border-black">
            Provision user login credentials for a specific fest official. They will use this exact Login ID (email) and Password on the portal login screen.
          </p>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Assign Role <span className="text-[#FF5252]">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => {
                const r = e.target.value as UserRole;
                setFormData((prev) => ({
                  ...prev,
                  role: r,
                  jurisdiction: prev.jurisdiction || getDefaultJurisdiction(r),
                }));
              }}
              className="w-full p-2 nb-input text-xs font-bold bg-white"
            >
              <option value="event_coordinator">Event Coordinator (Arena & Timelines)</option>
              <option value="registration_head">Registration Head (Desk Approvals & Arrivals)</option>
              <option value="volunteer">Desk Volunteer (Fast QR Scanner)</option>
              <option value="judge">Official Judge (Marks Evaluation)</option>
              <option value="faculty">Visiting School Faculty</option>
              <option value="super_admin">Super Administrator (Full Clearance)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Official Full Name <span className="text-[#FF5252]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const n = e.target.value;
                const slug = n.toLowerCase().replace(/[^a-z0-9]/g, ".");
                setFormData((prev) => ({
                  ...prev,
                  name: n,
                  email: prev.email || (slug ? `${slug}@spark.in` : ""),
                }));
              }}
              placeholder="e.g. Dr. Samantha Roy"
              className="w-full p-2 nb-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Login ID / Email <span className="text-[#FF5252]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. samantha.coord@spark.in"
              className="w-full p-2 nb-input text-xs font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black uppercase text-black">
                Password <span className="text-[#FF5252]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, password: generateRandomPassword() })}
                className="text-[11px] font-black text-black underline hover:bg-[#FFEB3B] px-1 cursor-pointer"
              >
                🎲 Auto-Generate Password
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter at least 6 characters (e.g. 123456 or SPARK@829)"
              className="w-full p-2 nb-input text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Assigned Area / Jurisdiction
            </label>
            <input
              type="text"
              value={formData.jurisdiction}
              onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              placeholder="e.g. Track 1: AI Hackathon / Desk Booth 2"
              className="w-full p-2 nb-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Contact Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 00000"
              className="w-full p-2 nb-input text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCreateModalOpen(false)}
              className="text-xs font-black"
            >
              Cancel
            </Button>
            <Button type="submit" variant="yellow" className="text-xs font-black shadow-[2px_2px_0px_#000]">
              Create User Credentials
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Reset Password */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <p className="text-xs font-bold text-slate-700">
            Set a new portal password for <strong>{selectedUserForReset?.name}</strong> ({selectedUserForReset?.email}).
          </p>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black uppercase text-black">
                New Password <span className="text-[#FF5252]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setNewPasswordInput(generateRandomPassword())}
                className="text-[11px] font-black text-black underline hover:bg-[#FFEB3B] px-1 cursor-pointer"
              >
                🎲 Auto-Generate
              </button>
            </div>
            <input
              type="text"
              required
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              className="w-full p-2 nb-input text-xs font-mono font-bold"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setResetModalOpen(false)}
              className="text-xs font-black"
            >
              Cancel
            </Button>
            <Button type="submit" variant="yellow" className="text-xs font-black shadow-[2px_2px_0px_#000]">
              Save New Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Success Share Summary */}
      <Modal
        isOpen={!!successShareModal}
        onClose={() => setSuccessShareModal(null)}
        title="Role Credentials Created Successfully!"
      >
        {successShareModal && (
          <div className="space-y-4">
            <div className="p-4 border-2 border-black bg-[#4CAF50]/15 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#4CAF50]" />
              <div>
                <p className="font-black text-sm text-black">User Account is Ready!</p>
                <p className="text-[11px] font-bold text-slate-700">
                  This user can now log into the portal immediately with their credentials.
                </p>
              </div>
            </div>

            <div className="p-3 border-2 border-black bg-[#FFFBEB] font-mono text-xs space-y-1.5 select-all">
              <p><strong>Official:</strong> {successShareModal.name}</p>
              <p><strong>Role:</strong> {getRoleDisplayName(successShareModal.role)}</p>
              <p><strong>Login URL:</strong> {typeof window !== "undefined" ? window.location.origin : ""}/login</p>
              <p><strong>Login ID:</strong> {successShareModal.email}</p>
              <p><strong>Password:</strong> {successShareModal.passwordText}</p>
              {successShareModal.jurisdiction && <p><strong>Area:</strong> {successShareModal.jurisdiction}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t-2 border-black">
              <Button
                variant="yellow"
                onClick={() => {
                  const str = `SPARK 2026 Portal Access Credentials:\nOfficial: ${successShareModal.name}\nRole: ${getRoleDisplayName(successShareModal.role)}\nLogin URL: ${window.location.origin}/login\nLogin ID: ${successShareModal.email}\nPassword: ${successShareModal.passwordText}`;
                  copyToClipboard(str, "share-modal", "Credentials");
                  setSuccessShareModal(null);
                }}
                className="text-xs font-black shadow-[2px_2px_0px_#000]"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                <span>Copy Credentials Message</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSuccessShareModal(null)}
                className="text-xs font-black"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
