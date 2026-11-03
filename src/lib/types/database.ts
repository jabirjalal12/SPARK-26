export type UserRole = "organizer" | "faculty" | "volunteer" | "judge" | "participant";

export interface Profile {
  id: string;
  role: UserRole;
  school_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  approved: boolean;
  assigned_track_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  name: string;
  slug: string;
  color: string;
  accent_class: string;
  description: string | null;
  rules: string | null;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ScoringCriterion {
  id: string;
  track_id: string;
  name: string;
  description: string | null;
  weight: number;
  max_score: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number | null;
  map_url: string | null;
  notes: string | null;
}

export interface School {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  faculty_id: string | null;
  approved: boolean;
  checked_in: boolean;
  checked_in_at: string | null;
  checked_in_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  faculty?: Profile;
  students_count?: number;
  teams_count?: number;
}

export interface Team {
  id: string;
  name: string;
  school_id: string;
  track_id: string;
  project_title: string | null;
  project_summary: string | null;
  table_number: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  school?: School;
  track?: Track;
  students?: Student[];
  score_total?: number;
}

export interface Student {
  id: string;
  school_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  track_id: string | null;
  team_id: string | null;
  qr_token: string;
  checked_in: boolean;
  checked_in_at: string | null;
  checked_in_by: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  school?: School;
  track?: Track;
  team?: Team;
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
  // Joined relations
  track?: Track;
  venue?: Venue;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "all" | "faculty" | "volunteers" | "track";
  track_id: string | null;
  urgent: boolean;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  track?: Track;
  author?: Profile;
}

export interface Checkin {
  id: string;
  school_id: string;
  student_id: string | null;
  volunteer_id: string;
  type: "school" | "student";
  notes: string | null;
  created_at: string;
  volunteer?: Profile;
  school?: School;
  student?: Student;
}

export interface VolunteerDuty {
  id: string;
  volunteer_id: string;
  track_id: string | null;
  venue_id: string | null;
  duty: string;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: "assigned" | "completed" | "excused";
  track?: Track;
  venue?: Venue;
}

export interface Score {
  id: string;
  team_id: string;
  judge_id: string;
  criterion_id: string;
  value: number;
  feedback: string | null;
  locked: boolean;
  created_at: string;
  updated_at: string;
  criterion?: ScoringCriterion;
  judge?: Profile;
  team?: Team;
}

export interface Result {
  id: string;
  track_id: string;
  team_id: string;
  total_score: number;
  rank: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  team?: Team;
  track?: Track;
}

export interface IssueReport {
  id: string;
  reporter_id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved";
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  reporter?: Profile;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_data: any;
  new_data: any;
  ip_address: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  school_id: string;
  track_id: string | null;
  type: "participation" | "winner" | "runner_up" | "special_mention";
  cert_code: string;
  title: string;
  issued_at: string;
  metadata: Record<string, any>;
  student?: Student;
  school?: School;
  track?: Track;
}
