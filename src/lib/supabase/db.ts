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
  Venue,
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
      venuesRes,
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
      supabase.from("venues").select("*").order("name"),
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
      venues: (venuesRes.data as Venue[]) || [],
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
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) return null;

    let subRoles: OrganizerSubRole[] = [];
    if (profile.role === "organizer") {
      const { data: roles } = await supabase
        .from("organizer_roles")
        .select("sub_role")
        .eq("user_id", userId);

      if (roles) {
        subRoles = roles.map((r: any) => r.sub_role as OrganizerSubRole);
      }
    }

    return {
      ...profile,
      sub_roles: subRoles,
    } as Profile;
  } catch (err) {
    console.warn("Error fetching user profile:", err);
    return null;
  }
}

export function subscribeToFestRealtime(callback: (payload: { table: string; event: string; record: any }) => void) {
  if (!isSupabaseConfigured()) return () => {};

  const supabase = createClient();

  const channel = supabase
    .channel(`fest-db-changes-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "venues" },
      (payload: any) => callback({ table: "venues", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "schedule_items" },
      (payload: any) => callback({ table: "schedule_items", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "announcements" },
      (payload: any) => callback({ table: "announcements", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "schools" },
      (payload: any) => callback({ table: "schools", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "checkins" },
      (payload: any) => callback({ table: "checkins", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "scores" },
      (payload: any) => callback({ table: "scores", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "students" },
      (payload: any) => callback({ table: "students", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "teams" },
      (payload: any) => callback({ table: "teams", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "school_tickets" },
      (payload: any) => callback({ table: "school_tickets", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "volunteer_duties" },
      (payload: any) => callback({ table: "volunteer_duties", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "issue_reports" },
      (payload: any) => callback({ table: "issue_reports", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "results" },
      (payload: any) => callback({ table: "results", event: payload.eventType, record: payload.new || payload.old })
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tracks" },
      (payload: any) => callback({ table: "tracks", event: payload.eventType, record: payload.new || payload.old })
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
