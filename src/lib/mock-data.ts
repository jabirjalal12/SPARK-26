import {
  Track,
  ScoringCriterion,
  Venue,
  School,
  SchoolTicket,
  Team,
  Student,
  ScheduleItem,
  Announcement,
  Profile,
} from "./types/database";

// 3 Hardcore Arenas (Fixed tracks for SPARK Tech Fest)
export const initialTracks: Track[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Robotics Arena",
    slug: "robotics",
    color: "#1E40AF", // Deep Blue
    description: "Design, construct, and field autonomous or wired rovers to navigate brutal obstacles, ramp ascents, and high-precision payload challenges.",
    rules: "1. Robot chassis must fit within 300mm x 300mm x 300mm bounding box at scrutiny.\n2. Battery voltage capped at 12V DC nominal.\n3. No IC engines or combustive propellants permitted.\n4. Maximum 2 student operators per arena heat.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Build from Scrap",
    slug: "build-from-scrap",
    color: "#166534", // Deep Green
    description: "Transform unadulterated junkyard scrap, discarded motors, and e-waste into working, functional electro-mechanical machines on the clock.",
    rules: "1. 100% of base materials must be sourced from the allotment junkyard dump.\n2. Fasteners, adhesives, and wiring provided at central tool station.\n3. 4-hour strict build window. No pre-assembled subsystems permitted.\n4. Working prototype demonstration required during judging.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Useless Projects",
    slug: "useless-projects",
    color: "#991B1B", // Crimson
    description: "Channel peak over-engineering absurdity to engineer hyper-complex, impeccably fabricated machines that solve utterly trivial problems.",
    rules: "1. Machine must genuinely function and perform its stated useless task with zero human intervention.\n2. Must integrate at least one active electronic, micro-controller, or mechanical actuator.\n3. 3-minute deadpan stage pitch required before judges.\n4. Safety scrutiny applies: no mains AC voltage or hazardous chemicals.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
];

export const initialCriteria: ScoringCriterion[] = [
  // Robotics
  { id: "aa1", track_id: "11111111-1111-1111-1111-111111111111", name: "Autonomous Execution & Navigation", weight: 0.40, max_score: 10 },
  { id: "aa2", track_id: "11111111-1111-1111-1111-111111111111", name: "Mechanical Chassis & Wiring Integrity", weight: 0.30, max_score: 10 },
  { id: "aa3", track_id: "11111111-1111-1111-1111-111111111111", name: "Course Speed & Obstacle Handling", weight: 0.30, max_score: 10 },
  // Build from Scrap
  { id: "bb1", track_id: "22222222-2222-2222-2222-222222222222", name: "Scrap Resourcefulness & Re-use Ratio", weight: 0.35, max_score: 10 },
  { id: "bb2", track_id: "22222222-2222-2222-2222-222222222222", name: "Functional Output & Working Prototype", weight: 0.35, max_score: 10 },
  { id: "bb3", track_id: "22222222-2222-2222-2222-222222222222", name: "Structural Rigidity & Craft Finish", weight: 0.30, max_score: 10 },
  // Useless Projects
  { id: "cc1", track_id: "33333333-3333-3333-3333-333333333333", name: "Concept Absurdity & Novelty", weight: 0.40, max_score: 10 },
  { id: "cc2", track_id: "33333333-3333-3333-3333-333333333333", name: "Technical Over-engineering & Circuitry", weight: 0.40, max_score: 10 },
  { id: "cc3", track_id: "33333333-3333-3333-3333-333333333333", name: "Deadpan Stage Presentation", weight: 0.20, max_score: 10 },
];

// All places / venues are dynamically added and updated by Admin
export const initialVenues: Venue[] = [];

// All schools register dynamically or are added by admin
export const initialSchools: School[] = [];

// Tickets generated dynamically per registered school
export const initialSchoolTickets: SchoolTicket[] = [];

// Teams added by registered schools
export const initialTeams: Team[] = [];

// Students added by registered faculty or desk walk-in
export const initialStudents: Student[] = [];

// Event timeline slots are added and managed dynamically by Admin / Event Coordinators
export const initialSchedule: ScheduleItem[] = [];

// Notices are posted dynamically by Admin / Event Coordinators
export const initialAnnouncements: Announcement[] = [];

export const defaultProfile: Profile = {
  id: "organizer-default",
  role: "organizer",
  sub_roles: ["super_admin", "event_coordinator", "registration_head"],
  school_id: null,
  full_name: "Lead Organizer",
  email: "admin@spark.edu",
  phone: "+91 98765 00001",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
