"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  Profile,
  School,
  Student,
  Team,
  Track,
  ScoringCriterion,
  Score,
  ScheduleItem,
  Announcement,
  VolunteerDuty,
  IssueReport,
  AuditLog,
  Certificate,
} from "./types/database";
import {
  initialTracks,
  initialCriteria,
  initialSchools,
  initialTeams,
  initialStudents,
  initialSchedule,
  initialAnnouncements,
  demoProfiles,
} from "./mock-data";

interface FestStoreContextType {
  currentProfile: Profile;
  switchRole: (role: UserRole) => void;
  schools: School[];
  students: Student[];
  teams: Team[];
  tracks: Track[];
  criteria: ScoringCriterion[];
  scores: Score[];
  schedule: ScheduleItem[];
  announcements: Announcement[];
  volunteerDuties: VolunteerDuty[];
  issueReports: IssueReport[];
  auditLogs: AuditLog[];
  certificates: Certificate[];
  resultsPublished: boolean;
  togglePublishResults: () => void;
  checkInSchool: (schoolId: string, notes?: string) => { success: boolean; message: string };
  checkInStudent: (tokenOrId: string) => { success: boolean; student?: Student; message: string };
  approveSchool: (schoolId: string, approved: boolean) => void;
  addSchool: (school: Partial<School>) => School;
  addStudent: (student: { school_id: string; full_name: string; email?: string; phone?: string; track_id?: string; team_id?: string }) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeam: (team: { school_id: string; track_id: string; name: string; project_title: string; project_summary: string; table_number?: string }) => Team;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  saveScore: (scoreData: { team_id: string; criterion_id: string; value: number; feedback?: string }) => void;
  addAnnouncement: (ann: { title: string; body: string; audience: "all" | "faculty" | "volunteers" | "track"; track_id?: string | null; urgent: boolean }) => void;
  deleteAnnouncement: (id: string) => void;
  reportIssue: (issue: { title: string; description: string; severity: "low" | "medium" | "high" | "critical" }) => void;
  resolveIssue: (id: string, notes: string) => void;
  addScheduleItem: (item: Omit<ScheduleItem, "id">) => void;
  deleteScheduleItem: (id: string) => void;
  resetAllData: () => void;
}

const FestStoreContext = createContext<FestStoreContextType | null>(null);

const STORAGE_KEY = "spark_fest_state_v1";

export function FestStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("organizer");
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [tracks] = useState<Track[]>(initialTracks);
  const [criteria] = useState<ScoringCriterion[]>(initialCriteria);
  const [scores, setScores] = useState<Score[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [issueReports, setIssueReports] = useState<IssueReport[]>([
    {
      id: "iss-1",
      reporter_id: "p-vol-1",
      title: "Scrap Bay extension cord overload tripped breaker",
      description: "Circuit breaker 4 tripped twice in fabrication yard. Electrician dispatched.",
      severity: "high",
      status: "in_progress",
      resolved_by: null,
      resolved_at: null,
      resolution_notes: null,
      created_at: "2026-11-20T11:10:00Z",
    },
  ]);
  const [volunteerDuties, setVolunteerDuties] = useState<VolunteerDuty[]>([
    {
      id: "vd-1",
      volunteer_id: "p-vol-1",
      track_id: "11111111-1111-1111-1111-111111111111",
      venue_id: "v-arena",
      duty: "Arena Alpha Course Marshall & Timer",
      description: "Measure obstacle clearance times and log disqualification lines.",
      starts_at: "2026-11-20T10:30:00Z",
      ends_at: "2026-11-20T13:30:00Z",
      status: "assigned",
    },
    {
      id: "vd-2",
      volunteer_id: "p-vol-1",
      track_id: null,
      venue_id: "v-quad",
      duty: "Helpdesk & QR Fast Check-in",
      description: "Scan incoming student passes and assist visiting faculty.",
      starts_at: "2026-11-20T08:00:00Z",
      ends_at: "2026-11-20T10:15:00Z",
      status: "completed",
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "aud-1",
      actor_id: "p-admin",
      action: "APPROVE_SCHOOL",
      table_name: "schools",
      record_id: "a0000001-0000-0000-0000-000000000001",
      old_data: { approved: false },
      new_data: { approved: true, name: "St. Joseph's Engineering Academy" },
      ip_address: "192.168.1.10",
      created_at: "2026-11-01T10:15:00Z",
    },
    {
      id: "aud-2",
      actor_id: "p-admin",
      action: "INSERT_ANNOUNCEMENT",
      table_name: "announcements",
      record_id: "ann-2",
      old_data: null,
      new_data: { title: "URGENT: Safety Eyewear in Scrap Fabrication Bay" },
      ip_address: "192.168.1.10",
      created_at: "2026-11-20T10:15:00Z",
    },
  ]);
  const [resultsPublished, setResultsPublished] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.schools) setSchools(parsed.schools);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.schedule) setSchedule(parsed.schedule);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.issueReports) setIssueReports(parsed.issueReports);
        if (parsed.resultsPublished !== undefined) setResultsPublished(parsed.resultsPublished);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when updated
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          schools,
          students,
          teams,
          scores,
          schedule,
          announcements,
          issueReports,
          resultsPublished,
          currentRole,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [schools, students, teams, scores, schedule, announcements, issueReports, resultsPublished, currentRole, isLoaded]);

  const currentProfile = demoProfiles[currentRole] || demoProfiles.organizer;

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const logAudit = (action: string, table_name: string, record_id: string | null, old_data: any, new_data: any) => {
    const newLog: AuditLog = {
      id: "aud-" + Date.now(),
      actor_id: currentProfile.id,
      action,
      table_name,
      record_id,
      old_data,
      new_data,
      ip_address: "client-action",
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const checkInSchool = (schoolId: string, notes?: string) => {
    const school = schools.find((s) => s.id === schoolId);
    if (!school) return { success: false, message: "School not found" };
    if (school.checked_in) return { success: false, message: "School is already checked in" };

    const now = new Date().toISOString();
    setSchools((prev) =>
      prev.map((s) =>
        s.id === schoolId
          ? { ...s, checked_in: true, checked_in_at: now, checked_in_by: currentProfile.id, notes: notes || s.notes }
          : s
      )
    );
    logAudit("CHECKIN_SCHOOL", "schools", schoolId, { checked_in: false }, { checked_in: true, checked_in_at: now });
    return { success: true, message: `Checked in ${school.name} successfully!` };
  };

  const checkInStudent = (tokenOrId: string) => {
    const normalized = tokenOrId.trim().toUpperCase();
    const student = students.find(
      (s) => s.id === tokenOrId || s.qr_token.toUpperCase() === normalized || s.full_name.toUpperCase().includes(normalized)
    );

    if (!student) return { success: false, message: "No student pass matched the scanned code." };
    if (student.checked_in) return { success: false, student, message: `${student.full_name} is already checked in.` };

    const now = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, checked_in: true, checked_in_at: now, checked_in_by: currentProfile.id }
          : s
      )
    );

    // Also auto-mark school as checked in if first student
    setSchools((prev) =>
      prev.map((sc) =>
        sc.id === student.school_id && !sc.checked_in
          ? { ...sc, checked_in: true, checked_in_at: now, checked_in_by: currentProfile.id }
          : sc
      )
    );

    logAudit("CHECKIN_STUDENT", "students", student.id, { checked_in: false }, { checked_in: true, checked_in_at: now });
    return { success: true, student, message: `Verified & checked in ${student.full_name}!` };
  };

  const approveSchool = (schoolId: string, approved: boolean) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, approved } : s))
    );
    logAudit(approved ? "APPROVE_SCHOOL" : "REJECT_SCHOOL", "schools", schoolId, null, { approved });
  };

  const addSchool = (schoolData: Partial<School>) => {
    const newSchool: School = {
      id: "sch-" + Date.now(),
      name: schoolData.name || "New School",
      code: schoolData.code || "SCH" + Math.floor(100 + Math.random() * 900),
      address: schoolData.address || null,
      city: schoolData.city || null,
      contact_email: schoolData.contact_email || null,
      contact_phone: schoolData.contact_phone || null,
      faculty_id: schoolData.faculty_id || null,
      approved: schoolData.approved ?? false,
      checked_in: false,
      checked_in_at: null,
      checked_in_by: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      students_count: 0,
      teams_count: 0,
    };
    setSchools((prev) => [newSchool, ...prev]);
    logAudit("REGISTER_SCHOOL", "schools", newSchool.id, null, newSchool);
    return newSchool;
  };

  const addStudent = (data: { school_id: string; full_name: string; email?: string; phone?: string; track_id?: string; team_id?: string }) => {
    const school = schools.find((s) => s.id === data.school_id);
    const codePrefix = school ? school.code.substring(0, 3) : "STU";
    const newStudent: Student = {
      id: "stud-" + Date.now(),
      school_id: data.school_id,
      full_name: data.full_name,
      email: data.email || null,
      phone: data.phone || null,
      track_id: data.track_id || null,
      team_id: data.team_id || null,
      qr_token: `QR-${codePrefix}-${Math.floor(10 + Math.random() * 90)}`,
      checked_in: false,
      checked_in_at: null,
      checked_in_by: null,
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStudents((prev) => [newStudent, ...prev]);
    logAudit("ADD_STUDENT", "students", newStudent.id, null, newStudent);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    logAudit("DELETE_STUDENT", "students", id, null, null);
  };

  const addTeam = (teamData: { school_id: string; track_id: string; name: string; project_title: string; project_summary: string; table_number?: string }) => {
    const newTeam: Team = {
      id: "team-" + Date.now(),
      school_id: teamData.school_id,
      track_id: teamData.track_id,
      name: teamData.name,
      project_title: teamData.project_title,
      project_summary: teamData.project_summary,
      table_number: teamData.table_number || "TBD",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      score_total: 0,
    };
    setTeams((prev) => [newTeam, ...prev]);
    logAudit("CREATE_TEAM", "teams", newTeam.id, null, newTeam);
    return newTeam;
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  };

  const saveScore = (scoreData: { team_id: string; criterion_id: string; value: number; feedback?: string }) => {
    const existingIndex = scores.findIndex(
      (s) => s.team_id === scoreData.team_id && s.judge_id === currentProfile.id && s.criterion_id === scoreData.criterion_id
    );

    const now = new Date().toISOString();
    let updatedScores: Score[];

    if (existingIndex >= 0) {
      updatedScores = scores.map((s, idx) =>
        idx === existingIndex
          ? { ...s, value: scoreData.value, feedback: scoreData.feedback || s.feedback, updated_at: now }
          : s
      );
    } else {
      const newScore: Score = {
        id: "scr-" + Date.now(),
        team_id: scoreData.team_id,
        judge_id: currentProfile.id,
        criterion_id: scoreData.criterion_id,
        value: scoreData.value,
        feedback: scoreData.feedback || null,
        locked: false,
        created_at: now,
        updated_at: now,
      };
      updatedScores = [newScore, ...scores];
    }
    setScores(updatedScores);

    // Recompute total score for team
    const teamScores = updatedScores.filter((s) => s.team_id === scoreData.team_id);
    let totalWeighted = 0;
    let totalWeight = 0;
    teamScores.forEach((sc) => {
      const crit = criteria.find((c) => c.id === sc.criterion_id);
      if (crit) {
        totalWeighted += sc.value * crit.weight;
        totalWeight += crit.weight;
      }
    });
    const finalScore = totalWeight > 0 ? Number((totalWeighted / totalWeight).toFixed(2)) : 0;

    setTeams((prev) =>
      prev.map((t) => (t.id === scoreData.team_id ? { ...t, score_total: finalScore } : t))
    );

    logAudit("SUBMIT_SCORE", "scores", scoreData.team_id, null, { scoreData, finalScore });
  };

  const togglePublishResults = () => {
    const nextState = !resultsPublished;
    setResultsPublished(nextState);
    logAudit(nextState ? "PUBLISH_RESULTS" : "UNPUBLISH_RESULTS", "results", null, { published: resultsPublished }, { published: nextState });
  };

  const addAnnouncement = (ann: { title: string; body: string; audience: "all" | "faculty" | "volunteers" | "track"; track_id?: string | null; urgent: boolean }) => {
    const newAnn: Announcement = {
      id: "ann-" + Date.now(),
      title: ann.title,
      body: ann.body,
      audience: ann.audience,
      track_id: ann.track_id || null,
      urgent: ann.urgent,
      published: true,
      author_id: currentProfile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAudit("POST_ANNOUNCEMENT", "announcements", newAnn.id, null, newAnn);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    logAudit("DELETE_ANNOUNCEMENT", "announcements", id, null, null);
  };

  const reportIssue = (issue: { title: string; description: string; severity: "low" | "medium" | "high" | "critical" }) => {
    const newIssue: IssueReport = {
      id: "iss-" + Date.now(),
      reporter_id: currentProfile.id,
      title: issue.title,
      description: issue.description,
      severity: issue.severity,
      status: "open",
      resolved_by: null,
      resolved_at: null,
      resolution_notes: null,
      created_at: new Date().toISOString(),
    };
    setIssueReports((prev) => [newIssue, ...prev]);
    logAudit("REPORT_ISSUE", "issue_reports", newIssue.id, null, newIssue);
  };

  const resolveIssue = (id: string, notes: string) => {
    setIssueReports((prev) =>
      prev.map((iss) =>
        iss.id === id
          ? { ...iss, status: "resolved", resolved_by: currentProfile.id, resolved_at: new Date().toISOString(), resolution_notes: notes }
          : iss
      )
    );
  };

  const addScheduleItem = (item: Omit<ScheduleItem, "id">) => {
    const newItem: ScheduleItem = {
      ...item,
      id: "sc-" + Date.now(),
    };
    setSchedule((prev) => [...prev, newItem].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()));
    logAudit("ADD_SCHEDULE_ITEM", "schedule_items", newItem.id, null, newItem);
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
    logAudit("DELETE_SCHEDULE_ITEM", "schedule_items", id, null, null);
  };

  const resetAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSchools(initialSchools);
    setStudents(initialStudents);
    setTeams(initialTeams);
    setScores([]);
    setSchedule(initialSchedule);
    setAnnouncements(initialAnnouncements);
    setResultsPublished(false);
  };

  const certificates: Certificate[] = students.map((s) => {
    const school = schools.find((sc) => sc.id === s.school_id);
    const track = tracks.find((t) => t.id === s.track_id);
    return {
      id: "cert-" + s.id,
      student_id: s.id,
      school_id: s.school_id,
      track_id: s.track_id,
      type: "participation",
      cert_code: "CERT-" + s.qr_token.replace("QR-", "") + "-2026",
      title: "Certificate of Active Technical Participation",
      issued_at: "2026-11-20T17:00:00Z",
      metadata: {
        student_name: s.full_name,
        school_name: school?.name || "Visiting Institution",
        track_name: track?.name || "General Tech Fest Track",
      },
      student: s,
      school,
      track,
    };
  });

  return (
    <FestStoreContext.Provider
      value={{
        currentProfile,
        switchRole,
        schools,
        students,
        teams,
        tracks,
        criteria,
        scores,
        schedule,
        announcements,
        volunteerDuties,
        issueReports,
        auditLogs,
        certificates,
        resultsPublished,
        togglePublishResults,
        checkInSchool,
        checkInStudent,
        approveSchool,
        addSchool,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeam,
        updateTeam,
        saveScore,
        addAnnouncement,
        deleteAnnouncement,
        reportIssue,
        resolveIssue,
        addScheduleItem,
        deleteScheduleItem,
        resetAllData,
      }}
    >
      {children}
    </FestStoreContext.Provider>
  );
}

export function useFestStore() {
  const context = useContext(FestStoreContext);
  if (!context) {
    throw new Error("useFestStore must be used within a FestStoreProvider");
  }
  return context;
}
