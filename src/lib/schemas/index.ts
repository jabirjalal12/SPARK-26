import { z } from "zod";

export const schoolRegistrationSchema = z.object({
  schoolName: z.string().min(3, "School/College name must be at least 3 characters").max(120),
  city: z.string().min(2, "City is required").max(60),
  address: z.string().optional(),
  contactEmail: z.string().email("Enter a valid institutional email"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  facultyName: z.string().min(3, "Faculty coordinator name is required"),
  facultyEmail: z.string().email("Faculty email must be valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SchoolRegistrationInput = z.infer<typeof schoolRegistrationSchema>;

// Strict Minor Privacy: name & class ONLY; zero student phone/email
export const studentSchema = z.object({
  name: z.string().min(2, "Student name is required").max(80),
  class: z.string().min(1, "Class/Grade is required").max(30),
  trackId: z.string().min(1, "Please select a track"),
  teamId: z.string().optional().or(z.literal("")),
});

export type StudentInput = z.infer<typeof studentSchema>;

export const teamSchema = z.object({
  name: z.string().min(2, "Team name is required").max(60),
  trackId: z.string().min(1, "Please select a track"),
  projectTitle: z.string().min(3, "Project title is required").max(100),
  projectSummary: z.string().min(10, "Provide a brief description of the project").max(500),
  tableNumber: z.string().optional(),
});

export type TeamInput = z.infer<typeof teamSchema>;

export const scoreSchema = z.object({
  teamId: z.string().min(1, "Invalid team"),
  criterionId: z.string().min(1, "Invalid criterion"),
  value: z.number().min(0, "Score cannot be negative").max(10, "Score max is 10"),
  feedback: z.string().max(400).optional(),
});

export type ScoreInput = z.infer<typeof scoreSchema>;

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  body: z.string().min(5, "Announcement body is required").max(1000),
  audience: z.enum(["all", "faculty", "volunteers"]),
  urgent: z.boolean().default(false),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

export const issueReportSchema = z.object({
  title: z.string().min(3, "Issue summary is required").max(100),
  description: z.string().min(10, "Please describe the problem clearly").max(800),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

export type IssueReportInput = z.infer<typeof issueReportSchema>;

export const scheduleItemSchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  description: z.string().max(500).optional(),
  trackId: z.string().optional().nullable(),
  venueId: z.string().optional().nullable(),
  startsAt: z.string().min(1, "Start time is required"),
  endsAt: z.string().min(1, "End time is required"),
  type: z.enum(["ceremony", "competition", "break", "judging", "other"]),
});

export type ScheduleItemInput = z.infer<typeof scheduleItemSchema>;

export const checkinBatchSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  studentIds: z.array(z.string()).min(1, "Select at least one present student to check in"),
});

export type CheckinBatchInput = z.infer<typeof checkinBatchSchema>;
