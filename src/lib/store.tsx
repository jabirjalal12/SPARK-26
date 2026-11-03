"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  UserRole,
  OrganizerSubRole,
  Profile,
  School,
  SchoolTicket,
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
  Checkin,
  Result,
} from "./types/database";
import {
  initialTracks,
  initialCriteria,
  initialSchools,
  initialSchoolTickets,
  initialTeams,
  initialStudents,
  initialSchedule,
  initialAnnouncements,
  demoProfiles,
} from "./mock-data";

interface FestStoreContextType {
  // Roles & Identity
  currentProfile: Profile;
  activeOrganizerSubRole: OrganizerSubRole;
  switchRole: (role: UserRole) => void;
  switchOrganizerSubRole: (subRole: OrganizerSubRole) => void;
  isSuperAdmin: boolean;
  isEventCoordinator: boolean;
  isRegistrationHead: boolean;
  isOrganizer: boolean;
  isFaculty: boolean;
  isVolunteer: boolean;

  // Data collections
  schools: School[];
  schoolTickets: SchoolTicket[];
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
  checkins: Checkin[];
  results: Result[];
  certificates: Certificate[];
  resultsPublished: boolean;

  // Actions
  checkInBatch: (schoolId: string, studentIds: string[]) => { success: boolean; message: string; count: number };
  undoCheckin: (studentId: string) => { success: boolean; message: string };
  addWalkinStudent: (data: { school_id: string; track_id: string; name: string; class: string }) => Student;
  approveSchool: (schoolId: string, approved: boolean) => void;
  reissueSchoolTicket: (schoolId: string) => SchoolTicket;
  addSchool: (school: Partial<School>) => School;
  updateSchool: (id: string, updates: Partial<School>) => void;
  addStudent: (student: { school_id: string; track_id: string; name: string; class: string; team_id?: string | null }) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeam: (team: { school_id: string; track_id: string; name: string; project_title: string; project_summary: string; table_number?: string }) => Team;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  saveScore: (scoreData: { team_id: string; criterion_id: string; value: number; feedback?: string }) => void;
  lockTrackScores: (trackId: string, locked: boolean) => void;
  togglePublishResults: () => void;
  addAnnouncement: (ann: { title: string; body: string; audience: "all" | "faculty" | "volunteers"; urgent: boolean }) => void;
  deleteAnnouncement: (id: string) => void;
  reportIssue: (issue: { title: string; description: string; severity: "low" | "medium" | "high" | "critical" }) => void;
  resolveIssue: (id: string, notes: string) => void;
  addScheduleItem: (item: Omit<ScheduleItem, "id">) => void;
  deleteScheduleItem: (id: string) => void;
  resetAllData: () => void;
}

const FestStoreContext = createContext<FestStoreContextType | null>(null);

const STORAGE_KEY = "spark_fest_state_v3";

export function FestStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("organizer");
  const [activeOrganizerSubRole, setActiveOrganizerSubRole] = useState<OrganizerSubRole>("super_admin");

  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [schoolTickets, setSchoolTickets] = useState<SchoolTicket[]>(initialSchoolTickets);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [criteria] = useState<ScoringCriterion[]>(initialCriteria);
  const [scores, setScores] = useState<Score[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [checkins, setCheckins] = useState<Checkin[]>([
    {
      id: "chk-1",
      student_id: "s1",
      school_id: "a0000001-0000-0000-0000-000000000001",
      volunteer_id: "p-vol-1",
      timestamp: "2026-11-20T08:35:00Z",
      is_undone: false,
      undone_by: null,
      undone_at: null,
    },
    {
      id: "chk-2",
      student_id: "s2",
      school_id: "a0000001-0000-0000-0000-000000000001",
      volunteer_id: "p-vol-1",
      timestamp: "2026-11-20T08:35:00Z",
      is_undone: false,
      undone_by: null,
      undone_at: null,
    },
    {
      id: "chk-3",
      student_id: "s5",
      school_id: "a0000002-0000-0000-0000-000000000002",
      volunteer_id: "p-vol-1",
      timestamp: "2026-11-20T08:42:00Z",
      is_undone: false,
      undone_by: null,
      undone_at: null,
    },
  ]);
  const [issueReports, setIssueReports] = useState<IssueReport[]>([
    {
      id: "iss-1",
      reported_by: "p-vol-1",
      title: "Scrap Bay extension cord overloaded breaker 4",
      description: "Circuit breaker 4 tripped twice in fabrication yard. Electrician dispatched.",
      severity: "high",
      status: "in_progress",
      resolved_by: null,
      resolution_notes: null,
      created_at: "2026-11-20T11:10:00Z",
      updated_at: "2026-11-20T11:10:00Z",
    },
  ]);
  const [volunteerDuties] = useState<VolunteerDuty[]>([
    {
      id: "vd-1",
      volunteer_id: "p-vol-1",
      duty: "Registration Fast-Pass Desk Marshal",
      description: "Scan incoming school QR passes, mark arriving students, and distribute badge kits.",
      starts_at: "2026-11-20T08:00:00Z",
      ends_at: "2026-11-20T10:15:00Z",
      status: "assigned",
    },
    {
      id: "vd-2",
      volunteer_id: "p-vol-1",
      duty: "Arena Alpha Course Marshall & Timer",
      description: "Measure obstacle clearance times and log disqualification boundary lines.",
      starts_at: "2026-11-20T10:30:00Z",
      ends_at: "2026-11-20T13:30:00Z",
      status: "assigned",
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "aud-1",
      actor_id: "p-admin-sa",
      action: "APPROVE_SCHOOL",
      target_type: "schools",
      target_id: "a0000001-0000-0000-0000-000000000001",
      old_data: { status: "pending" },
      new_data: { status: "approved", name: "St. Joseph's Engineering Academy" },
      ip_address: "192.168.12.165",
      created_at: "2026-11-01T10:00:00Z",
    },
    {
      id: "aud-2",
      actor_id: "p-admin-ec",
      action: "POST_ANNOUNCEMENT",
      target_type: "announcements",
      target_id: "ann-2",
      old_data: null,
      new_data: { title: "URGENT: Safety Eyewear Mandatory in Scrap Bay" },
      ip_address: "192.168.12.165",
      created_at: "2026-11-20T10:15:00Z",
    },
  ]);
  const [resultsPublished, setResultsPublished] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Restore state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.schools) setSchools(parsed.schools);
        if (parsed.schoolTickets) setSchoolTickets(parsed.schoolTickets);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.tracks) setTracks(parsed.tracks);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.schedule) setSchedule(parsed.schedule);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.checkins) setCheckins(parsed.checkins);
        if (parsed.issueReports) setIssueReports(parsed.issueReports);
        if (parsed.resultsPublished !== undefined) setResultsPublished(parsed.resultsPublished);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
        if (parsed.activeOrganizerSubRole) setActiveOrganizerSubRole(parsed.activeOrganizerSubRole);
      }
    } catch {
      // Ignore parse error
    }
    setIsLoaded(true);
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          schools,
          schoolTickets,
          students,
          teams,
          tracks,
          scores,
          schedule,
          announcements,
          checkins,
          issueReports,
          resultsPublished,
          currentRole,
          activeOrganizerSubRole,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [
    schools,
    schoolTickets,
    students,
    teams,
    tracks,
    scores,
    schedule,
    announcements,
    checkins,
    issueReports,
    resultsPublished,
    currentRole,
    activeOrganizerSubRole,
    isLoaded,
  ]);

  // Determine current active profile
  const currentProfile: Profile = useMemo(() => {
    if (currentRole === "organizer") {
      if (activeOrganizerSubRole === "event_coordinator") return demoProfiles.event_coordinator;
      if (activeOrganizerSubRole === "registration_head") return demoProfiles.registration_head;
      return demoProfiles.super_admin;
    }
    if (currentRole === "faculty") return demoProfiles.faculty;
    return demoProfiles.volunteer;
  }, [currentRole, activeOrganizerSubRole]);

  // Role permissions
  const isOrganizer = currentRole === "organizer";
  const isFaculty = currentRole === "faculty";
  const isVolunteer = currentRole === "volunteer";

  const isSuperAdmin = isOrganizer && (activeOrganizerSubRole === "super_admin" || currentProfile.sub_roles?.includes("super_admin") || false);
  const isEventCoordinator = isOrganizer && (activeOrganizerSubRole === "event_coordinator" || currentProfile.sub_roles?.includes("event_coordinator") || isSuperAdmin);
  const isRegistrationHead = isOrganizer && (activeOrganizerSubRole === "registration_head" || currentProfile.sub_roles?.includes("registration_head") || isSuperAdmin);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const switchOrganizerSubRole = (subRole: OrganizerSubRole) => {
    setActiveOrganizerSubRole(subRole);
    setCurrentRole("organizer");
  };

  const logAudit = (action: string, target_type: string, target_id: string | null, old_data: any, new_data: any) => {
    const newLog: AuditLog = {
      id: "aud-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      actor_id: currentProfile.id,
      action,
      target_type,
      target_id,
      old_data,
      new_data,
      ip_address: "192.168.12.165",
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // CHECK-IN BATCH: volunteer scans single school ticket QR -> selects present students -> marks arrival
  const checkInBatch = (schoolId: string, studentIds: string[]) => {
    const school = schools.find((s) => s.id === schoolId);
    if (!school) return { success: false, message: "School not found in registry.", count: 0 };

    const now = new Date().toISOString();
    const volunteerId = currentProfile.id;

    // Mark selected students as checked in
    const newlyCheckedStudentIds = new Set(studentIds);
    setStudents((prev) =>
      prev.map((stu) => {
        if (newlyCheckedStudentIds.has(stu.id)) {
          return {
            ...stu,
            checked_in: true,
            checked_in_at: now,
            checked_in_by: volunteerId,
          };
        }
        return stu;
      })
    );

    // Mark school as arrived
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, arrived: true, updated_at: now } : s))
    );

    // Create checkin log records
    const newCheckins: Checkin[] = studentIds.map((sid) => ({
      id: "chk-" + Date.now() + "-" + sid,
      student_id: sid,
      school_id: schoolId,
      volunteer_id: volunteerId,
      timestamp: now,
      is_undone: false,
      undone_by: null,
      undone_at: null,
    }));
    setCheckins((prev) => [...newCheckins, ...prev]);

    logAudit("CHECKIN_BATCH", "schools", schoolId, { arrived: school.arrived }, { arrived: true, checked_in_count: studentIds.length });
    return {
      success: true,
      message: `Successfully verified delegation for ${school.name} (${studentIds.length} students checked in).`,
      count: studentIds.length,
    };
  };

  // UNDO CHECKIN: Only Registration Head & Super Admin
  const undoCheckin = (studentId: string) => {
    if (!isRegistrationHead && !isSuperAdmin) {
      return { success: false, message: "Permission denied. Only Registration Head and Super Admin can undo check-ins." };
    }

    const student = students.find((s) => s.id === studentId);
    if (!student) return { success: false, message: "Student record not found." };
    if (!student.checked_in) return { success: false, message: "Student is not currently marked as checked in." };

    const now = new Date().toISOString();

    // Revert student state
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, checked_in: false, checked_in_at: null, checked_in_by: null }
          : s
      )
    );

    // Update checkin log record
    setCheckins((prev) =>
      prev.map((c) =>
        c.student_id === studentId && !c.is_undone
          ? { ...c, is_undone: true, undone_by: currentProfile.id, undone_at: now }
          : c
      )
    );

    // Check if any other student from same school is still checked in; if none, revert school.arrived
    const otherStudents = students.filter((s) => s.school_id === student.school_id && s.id !== studentId && s.checked_in);
    if (otherStudents.length === 0) {
      setSchools((prev) =>
        prev.map((sc) => (sc.id === student.school_id ? { ...sc, arrived: false, updated_at: now } : sc))
      );
    }

    logAudit("UNDO_CHECKIN", "students", studentId, { checked_in: true }, { checked_in: false });
    return { success: true, message: `Reverted check-in for ${student.name}.` };
  };

  // ADD WALK-IN STUDENT AT DESK
  const addWalkinStudent = (data: { school_id: string; track_id: string; name: string; class: string }) => {
    const newStudent: Student = {
      id: "walk-" + Date.now(),
      school_id: data.school_id,
      track_id: data.track_id,
      team_id: null,
      name: data.name,
      class: data.class,
      is_walkin: true,
      checked_in: true,
      checked_in_at: new Date().toISOString(),
      checked_in_by: currentProfile.id,
      created_at: new Date().toISOString(),
    };

    setStudents((prev) => [...prev, newStudent]);

    // Ensure school is marked arrived
    setSchools((prev) =>
      prev.map((s) => (s.id === data.school_id ? { ...s, arrived: true } : s))
    );

    logAudit("ADD_WALKIN_STUDENT", "students", newStudent.id, null, newStudent);
    return newStudent;
  };

  // APPROVE / REJECT SCHOOL: SA and RH
  const approveSchool = (schoolId: string, approved: boolean) => {
    const status = approved ? "approved" : "rejected";
    const now = new Date().toISOString();

    setSchools((prev) =>
      prev.map((s) =>
        s.id === schoolId
          ? {
              ...s,
              status,
              approved_by: approved ? currentProfile.id : null,
              approved_at: approved ? now : null,
              updated_at: now,
            }
          : s
      )
    );

    // Auto-generate ticket token if approving and none exists
    if (approved) {
      const existingTicket = schoolTickets.find((t) => t.school_id === schoolId && !t.revoked_at);
      if (!existingTicket) {
        const school = schools.find((s) => s.id === schoolId);
        const code = school ? school.code.replace(/[^A-Za-z0-9]/g, "") : "SCH";
        const newTicket: SchoolTicket = {
          id: "tkt-" + Date.now(),
          school_id: schoolId,
          token_hash: `TKT-${code}-${Math.random().toString(36).substring(2, 10)}`,
          revoked_at: null,
          created_at: now,
        };
        setSchoolTickets((prev) => [...prev, newTicket]);
      }
    }

    logAudit(approved ? "APPROVE_SCHOOL" : "REJECT_SCHOOL", "schools", schoolId, null, { status });
  };

  // REISSUE SCHOOL TICKET: Revokes old ticket, generates new token
  const reissueSchoolTicket = (schoolId: string) => {
    const now = new Date().toISOString();
    // Revoke old ticket
    setSchoolTickets((prev) =>
      prev.map((t) => (t.school_id === schoolId && !t.revoked_at ? { ...t, revoked_at: now } : t))
    );

    const school = schools.find((s) => s.id === schoolId);
    const code = school ? school.code.replace(/[^A-Za-z0-9]/g, "") : "SCH";
    const newTicket: SchoolTicket = {
      id: "tkt-" + Date.now(),
      school_id: schoolId,
      token_hash: `TKT-${code}-${Math.random().toString(36).substring(2, 10)}`,
      revoked_at: null,
      created_at: now,
    };

    setSchoolTickets((prev) => [...prev, newTicket]);
    logAudit("REISSUE_TICKET", "school_tickets", newTicket.id, null, newTicket);
    return newTicket;
  };

  const addSchool = (schoolData: Partial<School>) => {
    const code = schoolData.code || "SCH-" + Math.floor(100 + Math.random() * 900);
    const newSchool: School = {
      id: "sch-" + Date.now(),
      name: schoolData.name || "Visiting School",
      code,
      address: schoolData.address || null,
      city: schoolData.city || "Kerala",
      contact_email: schoolData.contact_email || "faculty@school.edu",
      contact_phone: schoolData.contact_phone || "+91 90000 00000",
      status: "pending",
      approved_by: null,
      approved_at: null,
      arrived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSchools((prev) => [newSchool, ...prev]);
    logAudit("REGISTER_SCHOOL", "schools", newSchool.id, null, newSchool);
    return newSchool;
  };

  const updateSchool = (id: string, updates: Partial<School>) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s))
    );
  };

  // Student delegation management (Minor privacy: name, class, track_id, team_id ONLY)
  const addStudent = (data: { school_id: string; track_id: string; name: string; class: string; team_id?: string | null }) => {
    const newStudent: Student = {
      id: "stu-" + Date.now(),
      school_id: data.school_id,
      track_id: data.track_id,
      team_id: data.team_id || null,
      name: data.name,
      class: data.class,
      is_walkin: false,
      checked_in: false,
      checked_in_at: null,
      checked_in_by: null,
      created_at: new Date().toISOString(),
    };
    setStudents((prev) => [...prev, newStudent]);
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

  // Team management
  const addTeam = (teamData: { school_id: string; track_id: string; name: string; project_title: string; project_summary: string; table_number?: string }) => {
    const newTeam: Team = {
      id: "team-" + Date.now(),
      school_id: teamData.school_id,
      track_id: teamData.track_id,
      name: teamData.name,
      project_title: teamData.project_title,
      project_summary: teamData.project_summary,
      table_number: teamData.table_number || "TBD",
      score_total: 0,
      created_at: new Date().toISOString(),
    };
    setTeams((prev) => [newTeam, ...prev]);
    logAudit("CREATE_TEAM", "teams", newTeam.id, null, newTeam);
    return newTeam;
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    logAudit("DELETE_TEAM", "teams", id, null, null);
  };

  // Score management: SA & EC only
  const saveScore = (scoreData: { team_id: string; criterion_id: string; value: number; feedback?: string }) => {
    const team = teams.find((t) => t.id === scoreData.team_id);
    const track = tracks.find((tr) => tr.id === team?.track_id);
    if (track?.scores_locked) {
      alert("Scores are locked for this track by Super Admin.");
      return;
    }

    const existingIndex = scores.findIndex(
      (s) => s.team_id === scoreData.team_id && s.criterion_id === scoreData.criterion_id
    );

    const now = new Date().toISOString();
    let updatedScores: Score[];

    if (existingIndex >= 0) {
      updatedScores = scores.map((s, idx) =>
        idx === existingIndex
          ? { ...s, value: scoreData.value, feedback: scoreData.feedback || s.feedback, updated_at: now, entered_by: currentProfile.id }
          : s
      );
    } else {
      const newScore: Score = {
        id: "scr-" + Date.now(),
        team_id: scoreData.team_id,
        entered_by: currentProfile.id,
        criterion_id: scoreData.criterion_id,
        value: scoreData.value,
        feedback: scoreData.feedback || null,
        created_at: now,
        updated_at: now,
      };
      updatedScores = [newScore, ...scores];
    }
    setScores(updatedScores);

    // Recompute weighted score for team
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

    logAudit("ENTER_SCORE", "scores", scoreData.team_id, null, { scoreData, finalScore });
  };

  // Lock Scores per track: Super Admin only
  const lockTrackScores = (trackId: string, locked: boolean) => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can lock or unlock scores.");
      return;
    }
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, scores_locked: locked } : t))
    );
    logAudit(locked ? "LOCK_SCORES" : "UNLOCK_SCORES", "tracks", trackId, null, { scores_locked: locked });
  };

  // Publish Results: Super Admin only
  const togglePublishResults = () => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can publish or unpublish official fest results.");
      return;
    }
    const nextState = !resultsPublished;
    setResultsPublished(nextState);
    logAudit(nextState ? "PUBLISH_RESULTS" : "UNPUBLISH_RESULTS", "results", null, { published: resultsPublished }, { published: nextState });
  };

  // Announcements: SA & EC
  const addAnnouncement = (ann: { title: string; body: string; audience: "all" | "faculty" | "volunteers"; urgent: boolean }) => {
    const newAnn: Announcement = {
      id: "ann-" + Date.now(),
      title: ann.title,
      body: ann.body,
      audience: ann.audience,
      urgent: ann.urgent,
      author_id: currentProfile.id,
      created_at: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAudit("POST_ANNOUNCEMENT", "announcements", newAnn.id, null, newAnn);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    logAudit("DELETE_ANNOUNCEMENT", "announcements", id, null, null);
  };

  // Issue Reporting
  const reportIssue = (issue: { title: string; description: string; severity: "low" | "medium" | "high" | "critical" }) => {
    const newIssue: IssueReport = {
      id: "iss-" + Date.now(),
      reported_by: currentProfile.id,
      title: issue.title,
      description: issue.description,
      severity: issue.severity,
      status: "open",
      resolved_by: null,
      resolution_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setIssueReports((prev) => [newIssue, ...prev]);
    logAudit("REPORT_ISSUE", "issue_reports", newIssue.id, null, newIssue);
  };

  const resolveIssue = (id: string, notes: string) => {
    setIssueReports((prev) =>
      prev.map((iss) =>
        iss.id === id
          ? {
              ...iss,
              status: "resolved",
              resolved_by: currentProfile.id,
              resolution_notes: notes,
              updated_at: new Date().toISOString(),
            }
          : iss
      )
    );
    logAudit("RESOLVE_ISSUE", "issue_reports", id, null, { resolution_notes: notes });
  };

  // Schedule Management
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
    setSchoolTickets(initialSchoolTickets);
    setStudents(initialStudents);
    setTeams(initialTeams);
    setTracks(initialTracks);
    setScores([]);
    setSchedule(initialSchedule);
    setAnnouncements(initialAnnouncements);
    setResultsPublished(false);
  };

  // Calculated track results
  const results: Result[] = useMemo(() => {
    const output: Result[] = [];
    tracks.forEach((track) => {
      const trackTeams = teams
        .filter((t) => t.track_id === track.id)
        .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

      trackTeams.forEach((t, idx) => {
        output.push({
          id: `res-${t.id}`,
          track_id: track.id,
          team_id: t.id,
          rank: idx + 1,
          weighted_score: t.score_total || 0,
          is_published: resultsPublished,
          published_by: resultsPublished ? "p-admin-sa" : null,
          published_at: resultsPublished ? "2026-11-20T17:00:00Z" : null,
        });
      });
    });
    return output;
  }, [tracks, teams, resultsPublished]);

  // Certificates for checked-in students
  const certificates: Certificate[] = useMemo(() => {
    return students
      .filter((s) => s.checked_in)
      .map((s) => {
        const school = schools.find((sc) => sc.id === s.school_id);
        const track = tracks.find((t) => t.id === s.track_id);
        const team = teams.find((tm) => tm.id === s.team_id);
        const rank = results.find((r) => r.team_id === team?.id)?.rank;

        let type: "participation" | "winner" | "runner_up" = "participation";
        if (rank === 1) type = "winner";
        else if (rank === 2) type = "runner_up";

        return {
          id: "cert-" + s.id,
          school_id: s.school_id,
          student_name: s.name,
          track_name: track?.name || "SPARK Tech Fest",
          type,
          cert_code: `MB-${(school?.code || "SCH").replace(/[^A-Za-z0-9]/g, "")}-${s.id.slice(-4).toUpperCase()}-2026`,
          created_at: "2026-11-20T17:00:00Z",
        };
      });
  }, [students, schools, tracks, teams, results]);

  return (
    <FestStoreContext.Provider
      value={{
        currentProfile,
        activeOrganizerSubRole,
        switchRole,
        switchOrganizerSubRole,
        isSuperAdmin,
        isEventCoordinator,
        isRegistrationHead,
        isOrganizer,
        isFaculty,
        isVolunteer,
        schools,
        schoolTickets,
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
        checkins,
        results,
        certificates,
        resultsPublished,
        checkInBatch,
        undoCheckin,
        addWalkinStudent,
        approveSchool,
        reissueSchoolTicket,
        addSchool,
        updateSchool,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeam,
        updateTeam,
        deleteTeam,
        saveScore,
        lockTrackScores,
        togglePublishResults,
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
