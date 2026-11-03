"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
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
  defaultProfile,
} from "./mock-data";
import { createClient, isSupabaseConfigured } from "./supabase/client";
import { fetchFestDataFromSupabase, fetchUserProfile, subscribeToFestRealtime } from "./supabase/db";

interface FestStoreContextType {
  // Roles & Identity
  currentProfile: Profile;
  activeOrganizerSubRole: OrganizerSubRole;
  switchRole: (role: UserRole) => void;
  switchOrganizerSubRole: (subRole: OrganizerSubRole) => void;
  setCurrentProfile: (profile: Profile) => void;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
  isEventCoordinator: boolean;
  isRegistrationHead: boolean;
  isOrganizer: boolean;
  isFaculty: boolean;
  isVolunteer: boolean;
  isSupabaseLive: boolean;

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

const STORAGE_KEY = "spark_live_v4";

export function FestStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("organizer");
  const [activeOrganizerSubRole, setActiveOrganizerSubRole] = useState<OrganizerSubRole>("super_admin");
  const [customProfile, setCustomProfile] = useState<Profile | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [schoolTickets, setSchoolTickets] = useState<SchoolTicket[]>(initialSchoolTickets);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [criteria] = useState<ScoringCriterion[]>(initialCriteria);
  const [scores, setScores] = useState<Score[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);
  const [volunteerDuties, setVolunteerDuties] = useState<VolunteerDuty[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [resultsPublished, setResultsPublished] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize Supabase Auth Session and Live Data
  useEffect(() => {
    let unsubscribeRealtime = () => {};

    const initSupabase = async () => {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();

          // 1. Check active user session
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session?.user) {
            const profile = await fetchUserProfile(sessionData.session.user.id);
            if (profile) {
              setCustomProfile(profile);
              setCurrentRole(profile.role);
              if (profile.sub_roles && profile.sub_roles.length > 0) {
                setActiveOrganizerSubRole(profile.sub_roles[0]);
              }
            }
          }

          // 2. Fetch live database tables
          const liveData = await fetchFestDataFromSupabase();
          if (liveData) {
            if (liveData.tracks.length > 0) setTracks(liveData.tracks);
            if (liveData.schools.length > 0) setSchools(liveData.schools);
            if (liveData.schoolTickets.length > 0) setSchoolTickets(liveData.schoolTickets);
            if (liveData.teams.length > 0) setTeams(liveData.teams);
            if (liveData.students.length > 0) setStudents(liveData.students);
            if (liveData.schedule.length > 0) setSchedule(liveData.schedule);
            if (liveData.announcements.length > 0) setAnnouncements(liveData.announcements);
            if (liveData.checkins.length > 0) setCheckins(liveData.checkins);
            if (liveData.volunteerDuties.length > 0) setVolunteerDuties(liveData.volunteerDuties);
            if (liveData.issueReports.length > 0) setIssueReports(liveData.issueReports);
            if (liveData.scores.length > 0) setScores(liveData.scores);
            if (liveData.auditLogs.length > 0) setAuditLogs(liveData.auditLogs);
            setIsSupabaseLive(true);
          }

          // 3. Listen to auth changes
          supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
            if (session?.user) {
              const p = await fetchUserProfile(session.user.id);
              if (p) {
                setCustomProfile(p);
                setCurrentRole(p.role);
                if (p.sub_roles && p.sub_roles.length > 0) {
                  setActiveOrganizerSubRole(p.sub_roles[0]);
                }
              }
            } else {
              setCustomProfile(null);
            }
          });

          // 4. Subscribe to Realtime Postgres Changes
          unsubscribeRealtime = subscribeToFestRealtime((payload) => {
            if (payload.table === "announcements") {
              if (payload.event === "INSERT") {
                setAnnouncements((prev) => [payload.record, ...prev.filter((a) => a.id !== payload.record.id)]);
              } else if (payload.event === "DELETE") {
                setAnnouncements((prev) => prev.filter((a) => a.id !== payload.record.id));
              }
            } else if (payload.table === "checkins") {
              if (payload.event === "INSERT") {
                setCheckins((prev) => [payload.record, ...prev.filter((c) => c.id !== payload.record.id)]);
              }
            } else if (payload.table === "scores") {
              if (payload.event === "INSERT" || payload.event === "UPDATE") {
                setScores((prev) => [payload.record, ...prev.filter((s) => s.id !== payload.record.id)]);
              }
            } else if (payload.table === "schools") {
              if (payload.event === "UPDATE") {
                setSchools((prev) => prev.map((s) => (s.id === payload.record.id ? { ...s, ...payload.record } : s)));
              }
            }
          });
        } catch (e) {
          console.warn("Supabase init error:", e);
        }
      }
      setIsLoaded(true);
    };

    initSupabase();

    return () => {
      unsubscribeRealtime();
    };
  }, []);

  // Determine current active profile (Authenticated via Supabase or fallback)
  const currentProfile: Profile = useMemo(() => {
    if (customProfile) return customProfile;
    return {
      ...defaultProfile,
      role: currentRole,
      sub_roles: currentRole === "organizer" ? [activeOrganizerSubRole] : undefined,
    };
  }, [customProfile, currentRole, activeOrganizerSubRole]);

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

  const signOut = async () => {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch {}
    setCustomProfile(null);
    setCurrentRole("organizer");
    setActiveOrganizerSubRole("super_admin");
  };

  const logAudit = useCallback((action: string, target_type: string, target_id: string | null, old_data: any, new_data: any) => {
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

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        supabase.from("audit_log").insert({
          actor_id: currentProfile.id,
          action,
          target_type,
          target_id,
          old_data,
          new_data,
          ip_address: "192.168.12.165",
        }).then();
      } catch {}
    }
  }, [currentProfile.id]);

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

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const recordsToInsert = studentIds.map((sid) => ({
          student_id: sid,
          school_id: schoolId,
          volunteer_id: volunteerId,
          timestamp: now,
        }));
        supabase.from("checkins").insert(recordsToInsert).then();
        supabase.from("schools").update({ arrived: true, updated_at: now }).eq("id", schoolId).then();
      } catch {}
    }

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

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, checked_in: false, checked_in_at: null, checked_in_by: null }
          : s
      )
    );

    setCheckins((prev) =>
      prev.map((c) =>
        c.student_id === studentId && !c.is_undone
          ? { ...c, is_undone: true, undone_by: currentProfile.id, undone_at: now }
          : c
      )
    );

    const otherStudents = students.filter((s) => s.school_id === student.school_id && s.id !== studentId && s.checked_in);
    if (otherStudents.length === 0) {
      setSchools((prev) =>
        prev.map((sc) => (sc.id === student.school_id ? { ...sc, arrived: false, updated_at: now } : sc))
      );
      if (isSupabaseConfigured()) {
        createClient().from("schools").update({ arrived: false, updated_at: now }).eq("id", student.school_id).then();
      }
    }

    if (isSupabaseConfigured()) {
      createClient().from("checkins").update({ is_undone: true, undone_by: currentProfile.id, undone_at: now }).eq("student_id", studentId).then();
    }

    logAudit("UNDO_CHECKIN", "students", studentId, { checked_in: true }, { checked_in: false });

    return { success: true, message: `Check-in reversed for ${student.name}.` };
  };

  // WALK-IN STUDENT
  const addWalkinStudent = (data: { school_id: string; track_id: string; name: string; class: string }) => {
    const newStudent: Student = {
      id: "s-walk-" + Date.now(),
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

    setCheckins((prev) => [
      {
        id: "chk-walk-" + Date.now(),
        student_id: newStudent.id,
        school_id: data.school_id,
        volunteer_id: currentProfile.id,
        timestamp: newStudent.checked_in_at!,
        is_undone: false,
        undone_by: null,
        undone_at: null,
      },
      ...prev,
    ]);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.from("students").insert({
        school_id: data.school_id,
        track_id: data.track_id,
        name: data.name,
        class: data.class,
        is_walkin: true,
      }).select().single().then((res: any) => {
        if (res.data) {
          supabase.from("checkins").insert({
            student_id: res.data.id,
            school_id: data.school_id,
            volunteer_id: currentProfile.id,
          }).then();
        }
      });
    }

    logAudit("ADD_WALKIN_STUDENT", "students", newStudent.id, null, newStudent);
    return newStudent;
  };

  // APPROVE SCHOOL
  const approveSchool = (schoolId: string, approved: boolean) => {
    const now = new Date().toISOString();
    const status = approved ? "approved" : "rejected";

    setSchools((prev) =>
      prev.map((s) =>
        s.id === schoolId
          ? {
              ...s,
              status,
              approved_by: currentProfile.id,
              approved_at: now,
              updated_at: now,
            }
          : s
      )
    );

    if (approved) {
      const existingTicket = schoolTickets.find((t) => t.school_id === schoolId && !t.revoked_at);
      if (!existingTicket) {
        const school = schools.find((s) => s.id === schoolId);
        const code = school ? school.code : "SCH";
        const newTicket: SchoolTicket = {
          id: "tkt-" + Date.now(),
          school_id: schoolId,
          token_hash: `TKT-${code}-${Math.random().toString(36).substring(2, 10)}`,
          revoked_at: null,
          created_at: now,
        };
        setSchoolTickets((prev) => [...prev, newTicket]);

        if (isSupabaseConfigured()) {
          createClient().from("school_tickets").insert({
            school_id: schoolId,
            token_hash: newTicket.token_hash,
          }).then();
        }
      }
    }

    if (isSupabaseConfigured()) {
      createClient().from("schools").update({
        status,
        approved_by: currentProfile.id,
        approved_at: now,
        updated_at: now,
      }).eq("id", schoolId).then();
    }

    logAudit("APPROVE_SCHOOL", "schools", schoolId, null, { status, approved_by: currentProfile.id });
  };

  // REISSUE SCHOOL TICKET
  const reissueSchoolTicket = (schoolId: string) => {
    const now = new Date().toISOString();
    const school = schools.find((s) => s.id === schoolId);
    const code = school ? school.code : "SCH";

    setSchoolTickets((prev) =>
      prev.map((t) => (t.school_id === schoolId && !t.revoked_at ? { ...t, revoked_at: now } : t))
    );

    const newTicket: SchoolTicket = {
      id: "tkt-" + Date.now(),
      school_id: schoolId,
      token_hash: `TKT-${code}-${Math.random().toString(36).substring(2, 10)}`,
      revoked_at: null,
      created_at: now,
    };

    setSchoolTickets((prev) => [...prev, newTicket]);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.from("school_tickets").update({ revoked_at: now }).eq("school_id", schoolId).then();
      supabase.from("school_tickets").insert({
        school_id: schoolId,
        token_hash: newTicket.token_hash,
      }).then();
    }

    logAudit("REISSUE_TICKET", "school_tickets", newTicket.id, null, { token_hash: newTicket.token_hash });
    return newTicket;
  };

  // ADD SCHOOL
  const addSchool = (schoolData: Partial<School>) => {
    const code = `SCH-${(schoolData.city || "GEN").substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newSchool: School = {
      id: "sch-" + Date.now(),
      name: schoolData.name || "New Visiting Institution",
      code,
      address: schoolData.address || "",
      city: schoolData.city || "Campus",
      contact_email: schoolData.contact_email || "",
      contact_phone: schoolData.contact_phone || "",
      status: "pending",
      approved_by: null,
      approved_at: null,
      arrived: false,
      created_at: now,
      updated_at: now,
    };

    setSchools((prev) => [...prev, newSchool]);
    logAudit("REGISTER_SCHOOL", "schools", newSchool.id, null, newSchool);

    if (isSupabaseConfigured()) {
      createClient().from("schools").insert(newSchool).then();
    }

    return newSchool;
  };

  const updateSchool = (id: string, updates: Partial<School>) => {
    const now = new Date().toISOString();
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updated_at: now } : s))
    );
    if (isSupabaseConfigured()) {
      createClient().from("schools").update({ ...updates, updated_at: now }).eq("id", id).then();
    }
  };

  // ADD STUDENT
  const addStudent = (studentData: { school_id: string; track_id: string; name: string; class: string; team_id?: string | null }) => {
    const newStudent: Student = {
      id: "stu-" + Date.now(),
      school_id: studentData.school_id,
      track_id: studentData.track_id,
      team_id: studentData.team_id || null,
      name: studentData.name,
      class: studentData.class,
      is_walkin: false,
      checked_in: false,
      created_at: new Date().toISOString(),
    };
    setStudents((prev) => [...prev, newStudent]);
    if (isSupabaseConfigured()) {
      createClient().from("students").insert(newStudent).then();
    }
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    if (isSupabaseConfigured()) {
      createClient().from("students").update(updates).eq("id", id).then();
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured()) {
      createClient().from("students").delete().eq("id", id).then();
    }
  };

  // ADD TEAM
  const addTeam = (teamData: { school_id: string; track_id: string; name: string; project_title: string; project_summary: string; table_number?: string }) => {
    const newTeam: Team = {
      id: "team-" + Date.now(),
      school_id: teamData.school_id,
      track_id: teamData.track_id,
      name: teamData.name,
      project_title: teamData.project_title,
      project_summary: teamData.project_summary,
      table_number: teamData.table_number || "T-00",
      score_total: 0,
      created_at: new Date().toISOString(),
    };
    setTeams((prev) => [...prev, newTeam]);
    if (isSupabaseConfigured()) {
      createClient().from("teams").insert(newTeam).then();
    }
    return newTeam;
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    if (isSupabaseConfigured()) {
      createClient().from("teams").update(updates).eq("id", id).then();
    }
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    if (isSupabaseConfigured()) {
      createClient().from("teams").delete().eq("id", id).then();
    }
  };

  // SAVE SCORE
  const saveScore = (scoreData: { team_id: string; criterion_id: string; value: number; feedback?: string }) => {
    const now = new Date().toISOString();
    const newScore: Score = {
      id: "sc-" + Date.now(),
      entered_by: currentProfile.id,
      team_id: scoreData.team_id,
      criterion_id: scoreData.criterion_id,
      value: scoreData.value,
      feedback: scoreData.feedback || "",
      created_at: now,
      updated_at: now,
    };

    setScores((prev) => {
      const filtered = prev.filter(
        (s) => !(s.team_id === scoreData.team_id && s.criterion_id === scoreData.criterion_id)
      );
      return [...filtered, newScore];
    });

    // Recalculate team total score
    setTimeout(() => {
      setTeams((prevTeams) => {
        return prevTeams.map((t) => {
          if (t.id === scoreData.team_id) {
            const teamScores = scores.filter((s) => s.team_id === t.id);
            const total = teamScores.reduce((acc, curr) => acc + curr.value, 0) + scoreData.value;
            const avg = teamScores.length > 0 ? total / (teamScores.length + 1) : scoreData.value;
            return { ...t, score_total: Number(avg.toFixed(2)) };
          }
          return t;
        });
      });
    }, 50);

    if (isSupabaseConfigured()) {
      createClient().from("scores").upsert({
        team_id: scoreData.team_id,
        criterion_id: scoreData.criterion_id,
        value: scoreData.value,
        feedback: scoreData.feedback,
        entered_by: currentProfile.id,
        updated_at: now,
      }).then();
    }

    logAudit("SAVE_SCORE", "scores", newScore.id, null, { team_id: scoreData.team_id, value: scoreData.value });
  };

  // LOCK TRACK SCORES
  const lockTrackScores = (trackId: string, locked: boolean) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, scores_locked: locked } : t))
    );
    if (isSupabaseConfigured()) {
      createClient().from("tracks").update({ scores_locked: locked }).eq("id", trackId).then();
    }
    logAudit("LOCK_SCORES", "tracks", trackId, null, { locked });
  };

  // TOGGLE PUBLISH RESULTS
  const togglePublishResults = () => {
    const newState = !resultsPublished;
    setResultsPublished(newState);

    if (newState && isSupabaseConfigured()) {
      const supabase = createClient();
      tracks.forEach((track) => {
        const trackTeams = teams
          .filter((t) => t.track_id === track.id)
          .sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

        trackTeams.forEach((team, idx) => {
          supabase.from("results").upsert({
            track_id: track.id,
            team_id: team.id,
            rank: idx + 1,
            weighted_score: team.score_total || 0,
            is_published: true,
            published_by: currentProfile.id,
            published_at: new Date().toISOString(),
          }).then();
        });
      });
    }

    logAudit("PUBLISH_RESULTS", "results", null, { published: resultsPublished }, { published: newState });
  };

  // ANNOUNCEMENTS
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

    if (isSupabaseConfigured()) {
      createClient().from("announcements").insert(newAnn).then();
    }

    logAudit("POST_ANNOUNCEMENT", "announcements", newAnn.id, null, newAnn);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    if (isSupabaseConfigured()) {
      createClient().from("announcements").delete().eq("id", id).then();
    }
  };

  // ISSUE REPORTS
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

    if (isSupabaseConfigured()) {
      createClient().from("issue_reports").insert(newIssue).then();
    }

    logAudit("REPORT_ISSUE", "issue_reports", newIssue.id, null, newIssue);
  };

  const resolveIssue = (id: string, notes: string) => {
    const now = new Date().toISOString();
    setIssueReports((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "resolved",
              resolution_notes: notes,
              resolved_by: currentProfile.id,
              updated_at: now,
            }
          : i
      )
    );

    if (isSupabaseConfigured()) {
      createClient().from("issue_reports").update({
        status: "resolved",
        resolution_notes: notes,
        resolved_by: currentProfile.id,
        updated_at: now,
      }).eq("id", id).then();
    }

    logAudit("RESOLVE_ISSUE", "issue_reports", id, null, { notes, resolved_by: currentProfile.id });
  };

  // SCHEDULE ITEMS
  const addScheduleItem = (item: Omit<ScheduleItem, "id">) => {
    const newItem: ScheduleItem = {
      ...item,
      id: "sc-" + Date.now(),
    };
    setSchedule((prev) => [...prev, newItem].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()));

    if (isSupabaseConfigured()) {
      createClient().from("schedule_items").insert(newItem).then();
    }

    logAudit("ADD_SCHEDULE_ITEM", "schedule_items", newItem.id, null, newItem);
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured()) {
      createClient().from("schedule_items").delete().eq("id", id).then();
    }
  };

  const resetAllData = () => {
    setSchools(initialSchools);
    setSchoolTickets(initialSchoolTickets);
    setStudents(initialStudents);
    setTeams(initialTeams);
    setTracks(initialTracks);
    setScores([]);
    setSchedule(initialSchedule);
    setAnnouncements(initialAnnouncements);
    setCheckins([]);
    setIssueReports([]);
    setResultsPublished(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    currentProfile,
    activeOrganizerSubRole,
    switchRole,
    switchOrganizerSubRole,
    setCurrentProfile: (p: Profile) => setCustomProfile(p),
    signOut,
    isSuperAdmin,
    isEventCoordinator,
    isRegistrationHead,
    isOrganizer,
    isFaculty,
    isVolunteer,
    isSupabaseLive,
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
    results: [],
    certificates: [],
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
  };

  return <FestStoreContext.Provider value={value}>{children}</FestStoreContext.Provider>;
}

export function useFestStore() {
  const context = useContext(FestStoreContext);
  if (!context) {
    throw new Error("useFestStore must be used within a FestStoreProvider");
  }
  return context;
}
