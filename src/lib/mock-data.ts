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
    description: "Transform discarded electronic components, mechanical gears, plumbing pipes, and scrap materials into a functional mechanical or electrical machine in 4 hours.",
    rules: "1. Minimum 70% of machine components must be sourced from the event scrap yard.\n2. Maximum 30% standard fasteners, glue, or microcontrollers permitted.\n3. Safety eyewear and cut-resistant gloves mandatory at all times.\n4. Machines are evaluated on scrap re-use, mechanical ingenuity, and reliability under load.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Useless Projects",
    slug: "useless-projects",
    color: "#991B1B", // Crimson
    description: "Over-engineer an astonishingly complex, fully functional machine that solves a problem nobody has or fails delightfully in dramatic, hilarious fashion.",
    rules: "1. Machine MUST actually work mechanically and electronically.\n2. Must achieve a completely useless, absurd, or delightfully counterproductive end goal.\n3. Points awarded for technical over-engineering, mechanism complexity, and deadpan serious pitch delivery.",
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

export const initialVenues: Venue[] = [
  { id: "e1111111-1111-1111-1111-111111111111", name: "Main Auditorium", location: "Second Floor, Central Hub", capacity: 600 },
  { id: "e2222222-2222-2222-2222-222222222222", name: "Robotics Arena Alpha", location: "Mechanical Workshop Ground Hall", capacity: 250 },
  { id: "e3333333-3333-3333-3333-333333333333", name: "Open Maker Quad", location: "Central Quadrangle Ground Floor", capacity: 400 },
  { id: "v-yard", name: "Scrap Fabrication Yard", location: "Industrial Bay 4 (Rear Compound)", capacity: 180 },
  { id: "v-tinker", name: "Innovation Tinkering Lab", location: "Room 304, Tech Complex", capacity: 150 },
];

// No hardcoded demo schools - populated dynamically from live Supabase registrations
export const initialSchools: School[] = [];

// No hardcoded demo tickets
export const initialSchoolTickets: SchoolTicket[] = [];

// No hardcoded demo teams
export const initialTeams: Team[] = [];

// No hardcoded demo students
export const initialStudents: Student[] = [];

// Official Fest Schedule (Starts 05/11/2026 at 07:00 AM)
export const initialSchedule: ScheduleItem[] = [
  {
    id: "sc-1",
    title: "Gates Open & Fast-Pass Registration Desk",
    description: "Visiting school delegations check in at Central Quad with their Master School Ticket QR pass. Credentials and badges issued.",
    track_id: null,
    venue_id: "e3333333-3333-3333-3333-333333333333",
    starts_at: "2026-11-05T07:00:00",
    ends_at: "2026-11-05T08:00:00",
    type: "break",
  },
  {
    id: "sc-2",
    title: "Visiting Faculty & Delegation Welcome Breakfast",
    description: "Complimentary hot breakfast buffet and networking lounge for visiting faculty coordinators and student participants.",
    track_id: null,
    venue_id: "e3333333-3333-3333-3333-333333333333",
    starts_at: "2026-11-05T07:45:00",
    ends_at: "2026-11-05T08:30:00",
    type: "break",
  },
  {
    id: "sc-3",
    title: "Grand Inaugural Ceremony & Rules Keynote",
    description: "Welcome address, unveiling of the SPARK 2026 Rolling Trophy, safety briefing, and introduction of jury panellists.",
    track_id: null,
    venue_id: "e1111111-1111-1111-1111-111111111111",
    starts_at: "2026-11-05T08:30:00",
    ends_at: "2026-11-05T09:30:00",
    type: "ceremony",
  },
  {
    id: "sc-4",
    title: "Arena Safety Pit Scrutiny & Tool Allotment",
    description: "Chassis weight and voltage inspection for Robotics; scrap yard safety gear and tool kit disbursement for builders.",
    track_id: null,
    venue_id: "e2222222-2222-2222-2222-222222222222",
    starts_at: "2026-11-05T09:30:00",
    ends_at: "2026-11-05T10:00:00",
    type: "competition",
  },
  {
    id: "sc-5",
    title: "Robotics: Obstacle Navigation Qualifiers (Round 1)",
    description: "Round 1 speed trials, obstacle course traversal, ramp climbs, and payload delivery in the main arena.",
    track_id: "11111111-1111-1111-1111-111111111111",
    venue_id: "e2222222-2222-2222-2222-222222222222",
    starts_at: "2026-11-05T10:00:00",
    ends_at: "2026-11-05T13:00:00",
    type: "competition",
  },
  {
    id: "sc-6",
    title: "Build from Scrap: 4-Hour Prototyping Scramble",
    description: "4-hour non-stop rapid fabrication from discarded motors, scrap pipes, sheet metal, and junk electronics in Industrial Bay 4.",
    track_id: "22222222-2222-2222-2222-222222222222",
    venue_id: "v-yard",
    starts_at: "2026-11-05T10:00:00",
    ends_at: "2026-11-05T14:00:00",
    type: "competition",
  },
  {
    id: "sc-7",
    title: "Useless Projects: Stage Pitch Session Round 1",
    description: "Absurdly over-engineered, functioning machines demonstrated live on stage with completely deadpan comedic delivery.",
    track_id: "33333333-3333-3333-3333-333333333333",
    venue_id: "v-tinker",
    starts_at: "2026-11-05T10:30:00",
    ends_at: "2026-11-05T12:30:00",
    type: "judging",
  },
  {
    id: "sc-8",
    title: "Delegation Lunch & Interactive Tech Showcase",
    description: "Hot catered lunch at Central Quadrangle. Interactive college robotics and AI project exhibits open for all visiting schools.",
    track_id: null,
    venue_id: "e3333333-3333-3333-3333-333333333333",
    starts_at: "2026-11-05T13:00:00",
    ends_at: "2026-11-05T14:00:00",
    type: "break",
  },
  {
    id: "sc-9",
    title: "Robotics: Grand Arena Championship Finals",
    description: "Top 4 qualifying robots go head-to-head on the multi-terrain arena with high-difficulty hazards and automated flag captures.",
    track_id: "11111111-1111-1111-1111-111111111111",
    venue_id: "e2222222-2222-2222-2222-222222222222",
    starts_at: "2026-11-05T14:00:00",
    ends_at: "2026-11-05T15:30:00",
    type: "competition",
  },
  {
    id: "sc-10",
    title: "Build from Scrap & Useless Projects Final Evaluation",
    description: "Jury walkthrough, mechanical stress-testing, endurance tests, deadpan question-and-answer, and final score calibration.",
    track_id: "22222222-2222-2222-2222-222222222222",
    venue_id: "v-yard",
    starts_at: "2026-11-05T14:30:00",
    ends_at: "2026-11-05T16:00:00",
    type: "judging",
  },
  {
    id: "sc-11",
    title: "Grand Valedictory & Awards Gala",
    description: "Official results announcement, distribution of ₹75,000+ cash prizes, rolling institution trophies, and participation certificates.",
    track_id: null,
    venue_id: "e1111111-1111-1111-1111-111111111111",
    starts_at: "2026-11-05T16:30:00",
    ends_at: "2026-11-05T18:00:00",
    type: "ceremony",
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome to SPARK 2026! ⚙️",
    body: "Helpdesks are active at Central Quad. Visiting faculty leads, please proceed to Booth 1 with your School Ticket QR code to check in your student delegations.",
    audience: "all",
    urgent: false,
    author_id: "organizer-super-admin",
    created_at: "2026-11-05T07:00:00Z",
  },
];

export const defaultProfile: Profile = {
  id: "organizer-default",
  role: "organizer",
  sub_roles: ["super_admin", "event_coordinator", "registration_head"],
  school_id: null,
  full_name: "Super Admin",
  email: "admin@spark.edu",
  phone: "+91 98765 00001",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
