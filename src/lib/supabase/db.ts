import { createClient, isSupabaseConfigured } from "./client";
import {
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
  Checkin,
  Result,
  Profile,
  OrganizerSubRole,
} from "../types/database";

export async function fetchFestDataFromSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createClient();

  try {
    const [
      tracksRes,
      criteriaRes,
      schoolsRes,
      ticketsRes,
      teamsRes,
      studentsRes,
      scheduleRes,
      announcementsRes,
      checkinsRes,
      dutiesRes,
      issuesRes,
      scoresRes,
      resultsRes,
      auditRes,
    ] = await Promise.all([
      supabase.from("tracks").select("*").order("name"),
      supabase.from("scoring_criteria").select("*"),
      supabase.from("schools").select("*").order("name"),
      supabase.from("school_tickets").select("*"),
      supabase.from("teams").select("*"),
      supabase.from("students").select("*"),
      supabase.from("schedule_items").select("*").order("starts_at"),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("checkins").select("*"),
      supabase.from("volunteer_duties").select("*"),
      supabase.from("issue_reports").select("*").order("created_at", { ascending: false }),
      supabase.from("scores").select("*"),
      supabase.from("results").select("*"),
      supabase.from("audit_log").select("*").order("created_at", { ascending: false }),
    ]);

    // Check for errors or empty responses
    if (tracksRes.error || schoolsRes.error) {
      console.warn("Supabase query error:", tracksRes.error || schoolsRes.error);
      return null;
    }

    return {
      tracks: (tracksRes.data as Track[]) || [],
      criteria: (criteriaRes.data as ScoringCriterion[]) || [],
      schools: (schoolsRes.data as School[]) || [],
      schoolTickets: (ticketsRes.data as SchoolTicket[]) || [],
      teams: (teamsRes.data as Team[]) || [],
      students: (studentsRes.data as Student[]) || [],
      schedule: (scheduleRes.data as ScheduleItem[]) || [],
      announcements: (announcementsRes.data as Announcement[]) || [],
      checkins: (checkinsRes.data as Checkin[]) || [],
      volunteerDuties: (dutiesRes.data as VolunteerDuty[]) || [],
      issueReports: (issuesRes.data as IssueReport[]) || [],
      scores: (scoresRes.data as Score[]) || [],
      results: (resultsRes.data as Result[]) || [],
      auditLogs: (auditRes.data as AuditLog[]) || [],
    };
  } catch (err) {
    console.warn("Failed fetching from Supabase:", err);
    return null;
  }
}

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, organizer_roles(sub_role)")
      .eq("id", userId)
      .single();

    if (error || !profile) return null;

    const sub_roles: OrganizerSubRole[] = (profile.organizer_roles || []).map(
      (r: { sub_role: OrganizerSubRole }) => r.sub_role
    );

    return {
      id: profile.id,
      role: profile.role,
      sub_roles,
      school_id: profile.school_id,
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  } catch {
    return null;
  }
}

export function subscribeToFestRealtime(onUpdate: (payload: { table: string; event: string; record: any }) => void) {
  if (!isSupabaseConfigured()) return () => {};

  const supabase = createClient();
  const channel = supabase
    .channel("fest-realtime-feed")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "announcements" },
      (payload: any) => onUpdate({ table: "announcements", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "checkins" },
      (payload: any) => onUpdate({ table: "checkins", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "scores" },
      (payload: any) => onUpdate({ table: "scores", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "schedule_items" },
      (payload: any) => onUpdate({ table: "schedule_items", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "schools" },
      (payload: any) => onUpdate({ table: "schools", event: payload.eventType, record: payload.new || payload.old })
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
