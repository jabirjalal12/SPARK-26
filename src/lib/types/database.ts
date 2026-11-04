export type UserRole = "organizer" | "faculty" | "volunteer" | "judge";
export type OrganizerSubRole = "super_admin" | "event_coordinator" | "registration_head";

export interface OrganizerRoleRecord {
  id: string;
  user_id: string;
  sub_role: OrganizerSubRole;
  created_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  sub_roles?: OrganizerSubRole[];
  school_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
  rules: string | null;
  scores_locked: boolean;
  created_at?: string;
}

export interface ScoringCriterion {
  id: string;
  track_id: string;
  name: string;
  weight: number;
  max_score: number;
  created_at?: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number | null;
  created_at?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string;
  contact_email: string;
  contact_phone: string;
  status: "pending" | "approved" | "rejected";
  approved_by: string | null;
  approved_at: string | null;
  arrived: boolean;
  ticket_token?: string;
  created_at: string;
  updated_at: string;
}

export interface SchoolTicket {
  id: string;
  school_id: string;
  token_hash: string;
  revoked_at: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  school_id: string;
  track_id: string;
  project_title: string;
  project_summary: string | null;
  table_number: string | null;
  score_total?: number;
  created_at: string;
}

export interface Student {
  id: string;
  school_id: string;
  track_id: string;
  team_id: string | null;
  name: string;
  class: string;
  is_walkin: boolean;
  checked_in?: boolean;
  checked_in_at?: string | null;
  checked_in_by?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description: string | null;
  track_id: string | null;
  venue_id: string | null;
  starts_at: string;
  ends_at: string;
  type: "ceremony" | "competition" | "break" | "judging" | "other";
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "all" | "faculty" | "volunteers";
  urgent: boolean;
  author_id: string | null;
  created_at: string;
}

export interface Checkin {
  id: string;
  student_id: string;
  school_id: string;
  volunteer_id: string;
  timestamp: string;
  is_undone: boolean;
  undone_by: string | null;
  undone_at: string | null;
}

export interface VolunteerDuty {
  id: string;
  volunteer_id: string;
  duty: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  status: "assigned" | "completed" | "missed";
  created_at?: string;
}

export interface Score {
  id: string;
  entered_by: string;
  team_id: string;
  criterion_id: string;
  value: number;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface Result {
  id: string;
  track_id: string;
  team_id: string;
  rank: number;
  weighted_score: number;
  is_published: boolean;
  published_by: string | null;
  published_at: string | null;
  created_at?: string;
}

export interface IssueReport {
  id: string;
  reported_by: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved";
  resolution_notes: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  caption: string | null;
  image_url: string;
  track_id: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor_id: string | null;
  target_type: string;
  target_id: string | null;
  old_data: any;
  new_data: any;
  ip_address: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  school_id: string;
  student_name: string;
  track_name: string;
  type: "participation" | "winner" | "runner_up";
  cert_code: string;
  created_at: string;
}
