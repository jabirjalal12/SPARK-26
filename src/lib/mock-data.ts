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

// 8 Official Competition Tracks for SPARK 2026
export const initialTracks: Track[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Robotics",
    slug: "robotics",
    color: "#1E40AF", // Deep Blue
    description: "Design, construct, and field autonomous or wired rovers to navigate brutal obstacle courses and speed circuits.",
    rules: "1. Robot chassis must fit within 300mm x 300mm x 300mm bounding box at scrutiny.\n2. Battery voltage capped at 12V DC nominal.\n3. Maximum 2 student operators per arena heat.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Quiz",
    slug: "quiz",
    color: "#7C3AED", // Purple
    description: "Multi-round inter-school technical quiz testing fundamentals of science, engineering, computing, and tech history.",
    rules: "1. Preliminary written elimination followed by live stage buzzer finals.\n2. Negative marks for wrong answers in buzzer round.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Ideathon",
    slug: "ideathon",
    color: "#059669", // Emerald Green
    description: "Pitch groundbreaking technological solutions and innovations solving critical real-world industry or social challenges.",
    rules: "1. 5-minute slide pitch followed by 3-minute jury Q&A.\n2. Evaluation based on novelty, technical feasibility, and societal impact.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Science Project Competition",
    slug: "science-project",
    color: "#0284C7", // Sky Blue
    description: "Exhibit functional working models, experimental setups, and applied scientific research projects.",
    rules: "1. Working model demonstration mandatory before jury.\n2. Chart display explaining hypothesis and experimental results.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Useless Project Competition",
    slug: "useless-projects",
    color: "#DC2626", // Red
    description: "Channel peak over-engineering absurdity to construct impeccably fabricated working machines that solve utterly trivial problems.",
    rules: "1. Machine must genuinely function and perform its stated useless task autonomously.\n2. Deadpan stage pitch required before judges.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    name: "Article Writing",
    slug: "article-writing",
    color: "#D97706", // Amber
    description: "Original on-the-spot technical essays and foresight articles addressing emerging frontiers in engineering and AI.",
    rules: "1. On-the-spot prompt revealed at 10:30 AM.\n2. Maximum 1500 words. Plagiarism disqualifies immediately.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    name: "Poster Presentation",
    slug: "poster-presentation",
    color: "#DB2777", // Pink
    description: "Visual infographics and technical poster exhibitions communicating engineering research and scientific principles.",
    rules: "1. Standard A1 poster format.\n2. Presenters must be stationed at their poster booth during judge inspection.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    name: "New Product Development from Scrap",
    slug: "build-from-scrap",
    color: "#166534", // Forest Green
    description: "Transform discarded industrial scrap, e-waste, and discarded mechanical hardware into working, functional machines.",
    rules: "1. Base scrap materials sourced from the allotment junkyard.\n2. Working prototype demonstration required during judging.",
    scores_locked: false,
    created_at: "2026-11-01T08:00:00Z",
  },
];

// Official Venues from SPARK 2026 Schedule
export const initialVenues: Venue[] = [
  { id: "ven-01", name: "Near Reception", location: "Main Administrative Building (Ground Floor)", capacity: 200 },
  { id: "ven-02", name: "College Auditorium", location: "Auditorium Complex", capacity: 800 },
  { id: "ven-03", name: "College Dome", location: "Central Campus Dome", capacity: 500 },
  { id: "ven-04", name: "Smart Classroom (2nd Floor)", location: "Academic Block - 2nd Floor", capacity: 80 },
  { id: "ven-05", name: "EG001 and EG002", location: "Engineering Block G - Ground Floor", capacity: 120 },
  { id: "ven-06", name: "Computer Lab 1", location: "IT Block - 1st Floor", capacity: 70 },
  { id: "ven-07", name: "ES001 and ES002", location: "Engineering Block S - Ground Floor", capacity: 120 },
  { id: "ven-08", name: "Computer Lab 3", location: "IT Block - 3rd Floor", capacity: 70 },
  { id: "ven-09", name: "Mechanical Workshop", location: "Mechanical Engineering Block", capacity: 150 },
];

// Official Schedule Items for 05/11/2026
export const initialSchedule: ScheduleItem[] = [
  {
    id: "sch-01",
    title: "Registration & Kit Distribution",
    description: "Visiting school faculty leads and student squads report for credential verification and badge pickup.",
    track_id: null,
    venue_id: "ven-01", // Near Reception
    starts_at: "2026-11-05T09:00:00Z",
    ends_at: "2026-11-05T09:30:00Z",
    type: "ceremony",
  },
  {
    id: "sch-02",
    title: "Inaugural Ceremony",
    description: "Welcome address, lamp lighting ceremony, and keynote address by Chief Guest.",
    track_id: null,
    venue_id: "ven-02", // College Auditorium
    starts_at: "2026-11-05T10:00:00Z",
    ends_at: "2026-11-05T10:30:00Z",
    type: "ceremony",
  },
  {
    id: "sch-03",
    title: "Robotics — Preliminary Rounds",
    description: "Autonomous & wired rover heats navigating obstacle courses and terrain challenges.",
    track_id: "11111111-1111-1111-1111-111111111111",
    venue_id: "ven-03", // College Dome
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T12:00:00Z",
    type: "competition",
  },
  {
    id: "sch-04",
    title: "Quiz — Preliminary Rounds",
    description: "Written elimination round covering science, engineering, and tech trivia.",
    track_id: "22222222-2222-2222-2222-222222222222",
    venue_id: "ven-02", // College Auditorium
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T11:30:00Z",
    type: "competition",
  },
  {
    id: "sch-05",
    title: "Ideathon",
    description: "Idea pitches on engineering solutions for pressing technological and societal challenges.",
    track_id: "33333333-3333-3333-3333-333333333333",
    venue_id: "ven-04", // Smart Classroom (2nd Floor)
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T13:00:00Z",
    type: "competition",
  },
  {
    id: "sch-06",
    title: "Science Project Competition",
    description: "Live exhibition and jury assessment of working scientific models and experiments.",
    track_id: "44444444-4444-4444-4444-444444444444",
    venue_id: "ven-05", // EG001 and EG002
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T13:00:00Z",
    type: "competition",
  },
  {
    id: "sch-07",
    title: "Useless Project Competition",
    description: "Over-engineered absurd machines solving hilarious, trivial problems autonomously.",
    track_id: "55555555-5555-5555-5555-555555555555",
    venue_id: "ven-06", // Computer Lab 1
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T13:00:00Z",
    type: "competition",
  },
  {
    id: "sch-08",
    title: "Article Writing",
    description: "On-the-spot technical essay writing on modern engineering frontiers.",
    track_id: "66666666-6666-6666-6666-666666666666",
    venue_id: "ven-07", // ES001 and ES002
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T13:00:00Z",
    type: "competition",
  },
  {
    id: "sch-09",
    title: "Poster Presentation",
    description: "Infographic exhibition and poster booth defense before visiting juries.",
    track_id: "77777777-7777-7777-7777-777777777777",
    venue_id: "ven-08", // Computer Lab 3
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T13:00:00Z",
    type: "competition",
  },
  {
    id: "sch-10",
    title: "New Product Development from Scrap",
    description: "Fabricating working electro-mechanical prototypes from junkyard materials.",
    track_id: "88888888-8888-8888-8888-888888888888",
    venue_id: "ven-09", // Mechanical Workshop
    starts_at: "2026-11-05T10:30:00Z",
    ends_at: "2026-11-05T13:00:00Z",
    type: "competition",
  },
  {
    id: "sch-11",
    title: "Quiz — Final Rounds",
    description: "Stage buzzer showdown featuring top qualifier school squads.",
    track_id: "22222222-2222-2222-2222-222222222222",
    venue_id: "ven-02", // College Auditorium
    starts_at: "2026-11-05T13:00:00Z",
    ends_at: "2026-11-05T14:00:00Z",
    type: "competition",
  },
  {
    id: "sch-12",
    title: "Robotics — Final Rounds",
    description: "Championship obstacle course faceoff between top preliminary rovers.",
    track_id: "11111111-1111-1111-1111-111111111111",
    venue_id: "ven-03", // College Dome
    starts_at: "2026-11-05T13:30:00Z",
    ends_at: "2026-11-05T14:00:00Z",
    type: "competition",
  },
  {
    id: "sch-13",
    title: "Valedictory Function and Prize Distribution",
    description: "Declaration of results, medal ceremony, and presentation of the SPARK Rolling Trophy.",
    track_id: null,
    venue_id: "ven-02", // College Auditorium
    starts_at: "2026-11-05T14:30:00Z",
    ends_at: "2026-11-05T15:30:00Z",
    type: "ceremony",
  },
];

// Scoring Criteria for All 8 Official Competitions
export const initialCriteria: ScoringCriterion[] = [
  // Robotics
  { id: "c-rb-1", track_id: "11111111-1111-1111-1111-111111111111", name: "Autonomous Execution & Navigation", weight: 0.40, max_score: 10 },
  { id: "c-rb-2", track_id: "11111111-1111-1111-1111-111111111111", name: "Mechanical Chassis & Wiring", weight: 0.30, max_score: 10 },
  { id: "c-rb-3", track_id: "11111111-1111-1111-1111-111111111111", name: "Obstacle Course Speed", weight: 0.30, max_score: 10 },
  // Quiz
  { id: "c-qz-1", track_id: "22222222-2222-2222-2222-222222222222", name: "Preliminary Score", weight: 0.40, max_score: 10 },
  { id: "c-qz-2", track_id: "22222222-2222-2222-2222-222222222222", name: "Buzzer Stage Speed & Accuracy", weight: 0.60, max_score: 10 },
  // Ideathon
  { id: "c-id-1", track_id: "33333333-3333-3333-3333-333333333333", name: "Innovation & Problem Originality", weight: 0.40, max_score: 10 },
  { id: "c-id-2", track_id: "33333333-3333-3333-3333-333333333333", name: "Feasibility & Technical Roadmap", weight: 0.30, max_score: 10 },
  { id: "c-id-3", track_id: "33333333-3333-3333-3333-333333333333", name: "Stage Pitch & Defense", weight: 0.30, max_score: 10 },
  // Science Project
  { id: "c-sp-1", track_id: "44444444-4444-4444-4444-444444444444", name: "Scientific Depth & Hypothesis", weight: 0.35, max_score: 10 },
  { id: "c-sp-2", track_id: "44444444-4444-4444-4444-444444444444", name: "Working Demonstration", weight: 0.35, max_score: 10 },
  { id: "c-sp-3", track_id: "44444444-4444-4444-4444-444444444444", name: "Poster & Documentation", weight: 0.30, max_score: 10 },
  // Useless Project
  { id: "c-up-1", track_id: "55555555-5555-5555-5555-555555555555", name: "Concept Absurdity & Humor", weight: 0.40, max_score: 10 },
  { id: "c-up-2", track_id: "55555555-5555-5555-5555-555555555555", name: "Technical Over-engineering", weight: 0.40, max_score: 10 },
  { id: "c-up-3", track_id: "55555555-5555-5555-5555-555555555555", name: "Deadpan Stage Presentation", weight: 0.20, max_score: 10 },
  // Article Writing
  { id: "c-aw-1", track_id: "66666666-6666-6666-6666-666666666666", name: "Technical Depth & Content", weight: 0.40, max_score: 10 },
  { id: "c-aw-2", track_id: "66666666-6666-6666-6666-666666666666", name: "Structure & Clarity", weight: 0.30, max_score: 10 },
  { id: "c-aw-3", track_id: "66666666-6666-6666-6666-666666666666", name: "Originality of Perspective", weight: 0.30, max_score: 10 },
  // Poster Presentation
  { id: "c-pp-1", track_id: "77777777-7777-7777-7777-777777777777", name: "Visual Infographic Quality", weight: 0.40, max_score: 10 },
  { id: "c-pp-2", track_id: "77777777-7777-7777-7777-777777777777", name: "Technical Rigor", weight: 0.30, max_score: 10 },
  { id: "c-pp-3", track_id: "77777777-7777-7777-7777-777777777777", name: "Q&A Booth Defense", weight: 0.30, max_score: 10 },
  // Scrap Product
  { id: "c-sc-1", track_id: "88888888-8888-8888-8888-888888888888", name: "Scrap Resourcefulness & Re-use", weight: 0.35, max_score: 10 },
  { id: "c-sc-2", track_id: "88888888-8888-8888-8888-888888888888", name: "Functional Machine Output", weight: 0.35, max_score: 10 },
  { id: "c-sc-3", track_id: "88888888-8888-8888-8888-888888888888", name: "Structural Craft & Rigidity", weight: 0.30, max_score: 10 },
];

export const initialSchools: School[] = [];
export const initialSchoolTickets: SchoolTicket[] = [];
export const initialTeams: Team[] = [];
export const initialStudents: Student[] = [];

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-01",
    author_id: "organizer-default",
    title: "Official Schedule Released",
    body: "Registration commences at 9:00 AM Near Reception. Inaugural Ceremony at 10:00 AM in College Auditorium.",
    audience: "all",
    urgent: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "ann-02",
    author_id: "organizer-default",
    title: "Preliminary Rounds Begin at 10:30 AM",
    body: "Robotics at College Dome, Quiz at College Auditorium, Scrap at Mechanical Workshop, Useless Project at Computer Lab 1.",
    audience: "faculty",
    urgent: false,
    created_at: new Date().toISOString(),
  },
];

export const defaultProfile: Profile = {
  id: "organizer-default",
  role: "organizer",
  sub_roles: ["super_admin", "event_coordinator", "registration_head"],
  school_id: null,
  full_name: "Lead Organizer",
  email: "admin@spark.edu",
  phone: "+91 94471 23456",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
