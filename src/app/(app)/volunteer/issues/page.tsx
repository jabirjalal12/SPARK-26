"use client";

import React, { useState, useMemo } from "react";
import { useFestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  MessageSquare,
  Search,
  Filter,
  Check,
  Send,
} from "lucide-react";

export default function VolunteerIssuesPage() {
  const { issueReports, reportIssue, resolveIssue, isEventCoordinator, isSuperAdmin, currentProfile } = useFestStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [filterType, setFilterType] = useState<"all" | "helpdesk" | "incidents" | "open" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    reportIssue({
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
    });

    setFormData({ title: "", description: "", severity: "medium" });
    setModalOpen(false);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !resolutionNotes.trim()) return;

    resolveIssue(selectedIssueId, resolutionNotes.trim());
    setSelectedIssueId(null);
    setResolutionNotes("");
    setResolveModalOpen(false);
  };

  const openResolveDialog = (issueId: string) => {
    setSelectedIssueId(issueId);
    setResolutionNotes("Addressed by Event Operations Coordinator. Ground situation normal.");
    setResolveModalOpen(true);
  };

  // Filter and search
  const filteredIssues = useMemo(() => {
    return issueReports.filter((issue) => {
      const isHelpDesk = issue.title.startsWith("[Help Desk]");
      const isResolved = issue.status === "resolved";

      if (filterType === "helpdesk" && !isHelpDesk) return false;
      if (filterType === "incidents" && isHelpDesk) return false;
      if (filterType === "open" && isResolved) return false;
      if (filterType === "resolved" && !isResolved) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          (issue.resolution_notes && issue.resolution_notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [issueReports, filterType, searchQuery]);

  const helpDeskCount = issueReports.filter((i) => i.title.startsWith("[Help Desk]")).length;
  const incidentCount = issueReports.length - helpDeskCount;
  const openCount = issueReports.filter((i) => i.status !== "resolved").length;
  const resolvedCount = issueReports.length - openCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans text-black">
      {/* Top Neubrutalist Banner */}
      <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#FF5252] text-black border border-black shadow-[2px_2px_0px_#000000]">
                EVENT OPERATIONS LOG
              </span>
              <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#FFEB3B] text-black border border-black">
                {openCount} Open Dispatches
              </span>
              <span className="text-xs font-bold text-slate-800">
                Ground Control &amp; Help Desk Center
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight flex items-center gap-2.5">
              <AlertTriangle className="w-8 h-8 text-[#FF5252]" />
              <span>Event Coordinator Dispatch &amp; Issues Desk</span>
            </h1>

            <p className="text-xs font-bold text-slate-800 mt-1 max-w-2xl">
              Monitored by the Event Operations Coordinator. Receives public inquiries from the landing page Help Desk and live incident logs from floor volunteers.
            </p>
          </div>

          <Button
            variant="yellow"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000000] flex-shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Log Ground Incident</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            filterType === "all"
              ? "bg-black text-white border-black shadow-[2px_2px_0px_#2196F3]"
              : "bg-white text-black border-transparent hover:bg-[#FFFBEB]"
          }`}
        >
          All Items ({issueReports.length})
        </button>

        <button
          onClick={() => setFilterType("helpdesk")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            filterType === "helpdesk"
              ? "bg-[#2196F3] text-black border-black shadow-[2px_2px_0px_#000000]"
              : "bg-white text-black border-transparent hover:bg-[#FFFBEB]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>📩 Help Desk Messages ({helpDeskCount})</span>
        </button>

        <button
          onClick={() => setFilterType("incidents")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            filterType === "incidents"
              ? "bg-[#FF5252] text-black border-black shadow-[2px_2px_0px_#000000]"
              : "bg-white text-black border-transparent hover:bg-[#FFFBEB]"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>⚠️ Field Incidents ({incidentCount})</span>
        </button>

        <button
          onClick={() => setFilterType("open")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            filterType === "open"
              ? "bg-[#FFEB3B] text-black border-black shadow-[2px_2px_0px_#000000]"
              : "bg-white text-black border-transparent hover:bg-[#FFFBEB]"
          }`}
        >
          Open ({openCount})
        </button>

        <button
          onClick={() => setFilterType("resolved")}
          className={`px-3 py-1.5 text-xs font-black border-2 transition-all cursor-pointer ${
            filterType === "resolved"
              ? "bg-[#4CAF50] text-black border-black shadow-[2px_2px_0px_#000000]"
              : "bg-white text-black border-transparent hover:bg-[#FFFBEB]"
          }`}
        >
          Resolved ({resolvedCount})
        </button>
      </div>

      {/* Search Input */}
      <div className="relative p-2 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
        <Search className="w-4 h-4 absolute left-4 top-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dispatches by sender name, subject, message details, or notes..."
          className="w-full pl-9 pr-3 py-2 text-xs font-bold border-2 border-black bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Issues & Messages List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center bg-white border-[3px] border-black shadow-[6px_6px_0px_#000000]">
            <CheckCircle2 className="w-12 h-12 text-[#4CAF50] mx-auto mb-3" />
            <h3 className="text-base font-black text-black">No matching dispatches found</h3>
            <p className="text-xs font-bold text-slate-600 mt-1">
              Public inquiries submitted on the landing page Help Desk or field incident logs will appear here.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isResolved = issue.status === "resolved";
            const isHelpDesk = issue.title.startsWith("[Help Desk]");

            return (
              <div
                key={issue.id}
                className={`p-5 border-[3px] border-black shadow-[5px_5px_0px_#000000] bg-white transition-all ${
                  isHelpDesk
                    ? "border-l-[10px] border-l-[#2196F3]"
                    : issue.severity === "critical"
                    ? "border-l-[10px] border-l-[#FF5252]"
                    : "border-l-[10px] border-l-[#FFEB3B]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b-2 border-black">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isHelpDesk ? (
                      <span className="px-2 py-0.5 bg-[#2196F3] text-black border border-black text-[10px] font-black uppercase shadow-[1px_1px_0px_#000000] flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>LANDING HELP DESK DISPATCH</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#FF5252] text-black border border-black text-[10px] font-black uppercase shadow-[1px_1px_0px_#000000] flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>FIELD OPERATIONAL INCIDENT</span>
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 border border-black text-[10px] font-black uppercase ${
                        issue.severity === "critical"
                          ? "bg-[#FF5252] text-black"
                          : issue.severity === "high"
                          ? "bg-[#FF9800] text-black"
                          : issue.severity === "medium"
                          ? "bg-[#FFEB3B] text-black"
                          : "bg-slate-200 text-black"
                      }`}
                    >
                      {issue.severity.toUpperCase()} PRIORITY
                    </span>

                    <span
                      className={`px-2 py-0.5 border border-black text-[10px] font-black uppercase ${
                        isResolved ? "bg-[#4CAF50] text-black" : "bg-[#FFF9C4] text-black animate-pulse"
                      }`}
                    >
                      {isResolved ? "✓ RESOLVED" : "● OPEN FOR COORDINATOR"}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-800 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>
                      {new Date(issue.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                </div>

                <h3 className="text-base font-black text-black mb-2">{issue.title}</h3>

                {/* Pre-formatted description box for easy readability of contact & message details */}
                <div className="p-3.5 bg-[#FFFBEB] border-2 border-black text-xs font-bold text-black whitespace-pre-wrap leading-relaxed shadow-[2px_2px_0px_#000000] mb-3">
                  {issue.description}
                </div>

                {issue.resolution_notes && (
                  <div className="p-3 bg-[#E8F5E9] border-2 border-black text-xs font-bold text-black mb-3 shadow-[2px_2px_0px_#000000]">
                    <span className="font-black text-[#2E7D32] block mb-1">✓ RESOLUTION LOGGED BY COORDINATOR:</span>
                    <p>{issue.resolution_notes}</p>
                  </div>
                )}

                {/* Resolution action button for Event Coordinator & Super Admin */}
                {!isResolved && (
                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="yellow"
                      onClick={() => openResolveDialog(issue.id)}
                      className="text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000000]"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span>Address &amp; Mark Resolved</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Log New Incident */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Ground Incident"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">Incident Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Scrap Yard breaker 4 tripped"
              className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">Severity Level</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="low">Low (Minor supply shortage)</option>
              <option value="medium">Medium (Requires attention)</option>
              <option value="high">High (Delaying competition)</option>
              <option value="critical">Critical (Safety / Medical concern)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Location, what happened, who is affected, and immediate action taken..."
              className="w-full p-3 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-black">
              Cancel
            </Button>
            <Button type="submit" variant="yellow" size="sm" className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
              Submit Incident Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Mark Resolved with Notes */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Dispatch / Incident"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4 text-black">
          <p className="text-xs font-bold text-slate-800">
            Log resolution notes explaining how this dispatch or issue was addressed by the Event Coordinator.
          </p>

          <div>
            <label className="text-xs font-black uppercase text-black block mb-1">Coordinator Resolution Notes *</label>
            <textarea
              rows={3}
              required
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Contacted delegation lead via mobile, provided 2 extra extension cords at Table 4."
              className="w-full p-3 border-2 border-black text-xs font-bold bg-[#FFFBEB] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
            <Button type="button" variant="secondary" size="sm" onClick={() => setResolveModalOpen(false)} className="text-xs font-black">
              Cancel
            </Button>
            <Button type="submit" variant="yellow" size="sm" className="text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000]">
              <Check className="w-4 h-4 mr-1.5" />
              <span>Confirm &amp; Close Issue</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
