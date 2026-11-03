-- ==============================================================================
-- MAKE//BREAK SEED DATA - 004_seed_data.sql
-- Pre-populates tracks, criteria, venues, settings, 5 schools, 20 students,
-- teams, schedule items, and announcements.
-- ==============================================================================

-- 1. SETTINGS
INSERT INTO public.settings (key, value, description) VALUES
('event_metadata', '{
    "name": "MAKE//BREAK 2026",
    "edition": "Annual Inter-School Tech Fest",
    "college": "St. Andrews College of Engineering & Technology",
    "tagline": "Build It. Break It. Re-engineer It.",
    "event_date": "2026-11-20",
    "location": "Main Campus, St. Andrews College, Tech Block",
    "contact_email": "hello@makebreak.tech",
    "contact_phone": "+91 98765 43210",
    "helpline_whatsapp": "+91 98765 43210"
}'::jsonb, 'Global event information and contact details'),
('registration_deadline', '"2026-11-18T23:59:59Z"'::jsonb, 'Deadline for faculty to edit students and teams'),
('results_published', 'false'::jsonb, 'Global toggle to publish final winners and scores'),
('live_stream_url', '"https://youtube.com/live/makebreak2026"'::jsonb, 'Official live stream link')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. TRACKS
INSERT INTO public.tracks (id, name, slug, color, accent_class, description, rules, icon) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Robotics',
    'robotics',
    '#2563EB',
    'from-blue-600 via-indigo-600 to-cyan-500',
    'Design, wire, and drive autonomous or RC robots to overcome obstacle mazes, push heavy payloads, and solve precision tasks against the clock.',
    '1. Maximum robot dimensions: 40cm x 40cm x 40cm.
2. Weight must not exceed 5.0 kg.
3. Max battery voltage allowed: 12V DC.
4. No hazardous chemical or open flame propulsion.
5. All teams get 2 competition runs; highest run score counts.',
    'Bot'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Build from Scrap',
    'build-from-scrap',
    '#15803D',
    'from-emerald-600 via-green-600 to-teal-500',
    'Transform discarded electronic components, cycle parts, pipes, and scrap metals into a functional, working mechanical or electrical apparatus in 4 hours.',
    '1. 70% of material used MUST be sourced from the organizer scrap yard.
2. 30% of fasteners and electronics (batteries, microcontrollers) may be brought in.
3. Safety goggles and gloves are mandatory inside the fabrication zone.
4. Judges score on structural durability, clever re-use, and practical function.',
    'Wrench'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Useless Projects',
    'useless-projects',
    '#DC2626',
    'from-rose-600 via-crimson-600 to-orange-500',
    'Over-engineer an astonishingly complex, fully functional contraption that solves a problem nobody has or fails delightfully in dramatic fashion.',
    '1. The machine MUST work mechanically or electronically as demonstrated.
2. It must achieve a thoroughly useless or comedic end goal.
3. Points are awarded for technical elegance applied to utter absurdity.
4. Pitch deck or demonstration must be delivered with a completely straight face.',
    'Sparkles'
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    color = EXCLUDED.color,
    description = EXCLUDED.description;

-- 3. SCORING CRITERIA
INSERT INTO public.scoring_criteria (id, track_id, name, description, weight, max_score) VALUES
-- Robotics
('aa111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Autonomous Execution & Control', 'Precision, latency, and sensor feedback', 0.40, 10),
('aa111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Mechanical Design & Build', 'Chassis durability, gear ratios, and cable management', 0.30, 10),
('aa111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Innovation & Obstacle Navigation', 'Novel solutions to course hurdles', 0.30, 10),

-- Build from Scrap
('bb222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Resourcefulness & Scrap Ratio', 'Clever usage of unrefined scrap pieces', 0.35, 10),
('bb222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Working Functionality', 'Does the assembled device deliver on its stated mechanical purpose?', 0.35, 10),
('bb222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Structural Integrity & Finish', 'Build stability under stress and aesthetic flair', 0.30, 10),

-- Useless Projects
('cc333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Absurdity & Concept Novelty', 'How hilariously unnecessary or satirical is the invention?', 0.40, 10),
('cc333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Technical Over-engineering', 'Use of intricate hardware, microcontrollers, and precision for trivial ends', 0.40, 10),
('cc333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Deadpan Stage Presentation', 'Convincing mock-serious pitch delivery to judges', 0.20, 10)
ON CONFLICT (id) DO NOTHING;

-- 4. VENUES
INSERT INTO public.venues (id, name, location, capacity, notes) VALUES
('e1111111-1111-1111-1111-111111111111', 'Main Auditorium (Sir CV Raman Hall)', 'Admin Block - 1st Floor', 500, 'Audio/Video stage, Opening & Closing Ceremonies'),
('e2222222-2222-2222-2222-222222222222', 'Arena Alpha (Robotics Course)', 'Mechanical Workshop Ground Bay', 150, 'Rubberized track floor, high speed obstacle barrier, power drops'),
('e3333333-3333-3333-3333-333333333333', 'Fabrication Yard & Bay 4', 'Central Works Quadrangle', 120, 'Welding stalls, angle grinders, scrap sorting bins'),
('e4444444-4444-4444-4444-444444444444', 'Tinkering Den & Presentation Hall', 'Innovation Hub - Room 204', 100, 'Projectors, display tables, quiet acoustic environment'),
('e5555555-5555-5555-5555-555555555555', 'Central Quad & Food Court', 'Campus Ground Plaza', 800, 'Check-in reception desk, badges, dining and relaxation zone')
ON CONFLICT (id) DO NOTHING;

-- 5. SCHOOLS (5 Demo Schools)
INSERT INTO public.schools (id, name, code, address, city, contact_email, contact_phone, approved, checked_in) VALUES
(
    'a0000001-0000-0000-0000-000000000001',
    'St. Joseph''s Engineering Academy',
    'STJ771',
    '44 Cathedral Road, Civil Lines',
    'Kochi',
    'stjoseph.techfest@example.edu',
    '+91 94471 23456',
    true,
    true
),
(
    'a0000002-0000-0000-0000-000000000002',
    'Apex Institute of Technology',
    'APX882',
    '12 Electronic City Phase II',
    'Bengaluru',
    'apex.innovations@example.edu',
    '+91 98450 11223',
    true,
    true
),
(
    'a0000003-0000-0000-0000-000000000003',
    'National Institute of Design & Tech',
    'NID993',
    'Sector 19, Knowledge Park',
    'Pune',
    'nidt.faculty@example.edu',
    '+91 97654 33445',
    true,
    false
),
(
    'a0000004-0000-0000-0000-000000000004',
    'Metro Polytechnic College',
    'MTR554',
    '88 Industrial Corridor Bypass',
    'Chennai',
    'metro.poly@example.edu',
    '+91 94440 99887',
    true,
    false
),
(
    'a0000005-0000-0000-0000-000000000005',
    'Horizon Science & Tech Higher Sec',
    'HRZ335',
    '3 Ring Road Enclave',
    'Hyderabad',
    'horizon.stem@example.edu',
    '+91 99880 77665',
    true,
    false
)
ON CONFLICT (id) DO UPDATE SET 
    approved = EXCLUDED.approved,
    checked_in = EXCLUDED.checked_in;

-- 6. TEAMS (1 team per school per track)
INSERT INTO public.teams (id, name, school_id, track_id, project_title, project_summary, table_number) VALUES
-- Robotics teams
('t1111111-0001-0000-0000-000000000001', 'Apex Botsmiths', 'a0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'VortexCrawler X4', '6-wheel rocker-bogie rover with ultrasonic lidar mapping', 'ROBO-01'),
('t1111111-0002-0000-0000-000000000002', 'Joseph MechStrikers', 'a0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'TitanClaw MK2', 'High-torque pneumatic gripper bot for payload transport', 'ROBO-02'),
('t1111111-0003-0000-0000-000000000003', 'Metro Speedsters', 'a0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'PulseRunner Zero', 'High-RPM differential drive maze runner with PID guidance', 'ROBO-03'),

-- Build from Scrap teams
('t2222222-0001-0000-0000-000000000001', 'Scrap Titans', 'a0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Hydraulic Cycle Press', 'Pedal-powered metal can compactor made from cycle gears and plumbing pipe', 'SCRAP-01'),
('t2222222-0002-0000-0000-000000000002', 'Junkyard Wizards', 'a0000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Washing Motor Lathe', 'Miniature wood lathe fashioned from discarded washing machine motor', 'SCRAP-02'),
('t2222222-0003-0000-0000-000000000003', 'Horizon Recyclers', 'a0000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'Solar Thermal Water Still', 'Emergency water purification rig made from cracked mirrors and cans', 'SCRAP-03'),

-- Useless Projects teams
('t3333333-0001-0000-0000-000000000001', 'The Absurdists', 'a0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'The Butter Disapprover', 'AI camera robot that gasps in utter disgust whenever you reach for butter', 'USELESS-01'),
('t3333333-0002-0000-0000-000000000002', 'Nonsense Labs', 'a0000002-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Self-Closing Browser Locker', 'Mechanical solenoid fingers that force alt+f4 if you type too loudly', 'USELESS-02'),
('t3333333-0003-0000-0000-000000000003', 'Horizon Paradox', 'a0000005-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'High-Tech Candle Snuffer', 'Raspberry Pi with 4 servos and thermal camera to blow out a birthday candle', 'USELESS-03')
ON CONFLICT (id) DO UPDATE SET 
    project_title = EXCLUDED.project_title,
    project_summary = EXCLUDED.project_summary;

-- 7. STUDENTS (20 Sample Students)
INSERT INTO public.students (id, school_id, full_name, email, phone, track_id, team_id, qr_token, checked_in) VALUES
-- School 1 (St. Joseph's) - 4 students
('s0000001-0001-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Aarav Nair', 'aarav.n@stjoseph.edu', '+91 98950 11001', '11111111-1111-1111-1111-111111111111', 't1111111-0002-0000-0000-000000000002', 'QR-STJ-01', true),
('s0000001-0002-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'Riya Thomas', 'riya.t@stjoseph.edu', '+91 98950 11002', '11111111-1111-1111-1111-111111111111', 't1111111-0002-0000-0000-000000000002', 'QR-STJ-02', true),
('s0000001-0003-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'Kavya Menon', 'kavya.m@stjoseph.edu', '+91 98950 11003', '22222222-2222-2222-2222-222222222222', 't2222222-0001-0000-0000-000000000001', 'QR-STJ-03', true),
('s0000001-0004-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'Joel Mathew', 'joel.m@stjoseph.edu', '+91 98950 11004', '22222222-2222-2222-2222-222222222222', 't2222222-0001-0000-0000-000000000001', 'QR-STJ-04', true),

-- School 2 (Apex) - 4 students
('s0000002-0001-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002', 'Dhruv Sharma', 'dhruv.s@apex.edu', '+91 98450 22001', '11111111-1111-1111-1111-111111111111', 't1111111-0001-0000-0000-000000000001', 'QR-APX-01', true),
('s0000002-0002-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', 'Ananya Hegde', 'ananya.h@apex.edu', '+91 98450 22002', '11111111-1111-1111-1111-111111111111', 't1111111-0001-0000-0000-000000000001', 'QR-APX-02', true),
('s0000002-0003-0000-0000-000000000003', 'a0000002-0000-0000-0000-000000000002', 'Karan Patel', 'karan.p@apex.edu', '+91 98450 22003', '33333333-3333-3333-3333-333333333333', 't3333333-0002-0000-0000-000000000002', 'QR-APX-03', true),
('s0000002-0004-0000-0000-000000000004', 'a0000002-0000-0000-0000-000000000002', 'Sneha Rao', 'sneha.r@apex.edu', '+91 98450 22004', '33333333-3333-3333-3333-333333333333', 't3333333-0002-0000-0000-000000000002', 'QR-APX-04', false),

-- School 3 (NIDT) - 4 students
('s0000003-0001-0000-0000-000000000001', 'a0000003-0000-0000-0000-000000000003', 'Rohan Kulkarni', 'rohan.k@nidt.edu', '+91 97654 44001', '22222222-2222-2222-2222-222222222222', 't2222222-0002-0000-0000-000000000002', 'QR-NID-01', false),
('s0000003-0002-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003', 'Pooja Deshmukh', 'pooja.d@nidt.edu', '+91 97654 44002', '22222222-2222-2222-2222-222222222222', 't2222222-0002-0000-0000-000000000002', 'QR-NID-02', false),
('s0000003-0003-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003', 'Dev Sen', 'dev.s@nidt.edu', '+91 97654 44003', '33333333-3333-3333-3333-333333333333', 't3333333-0001-0000-0000-000000000001', 'QR-NID-03', false),
('s0000003-0004-0000-0000-000000000004', 'a0000003-0000-0000-0000-000000000003', 'Tanvi Joshi', 'tanvi.j@nidt.edu', '+91 97654 44004', '33333333-3333-3333-3333-333333333333', 't3333333-0001-0000-0000-000000000001', 'QR-NID-04', false),

-- School 4 (Metro Poly) - 4 students
('s0000004-0001-0000-0000-000000000001', 'a0000004-0000-0000-0000-000000000004', 'Siddharth Balan', 'sid.b@metro.edu', '+91 94440 55001', '11111111-1111-1111-1111-111111111111', 't1111111-0003-0000-0000-000000000003', 'QR-MTR-01', false),
('s0000004-0002-0000-0000-000000000002', 'a0000004-0000-0000-0000-000000000004', 'Meera Sundaram', 'meera.s@metro.edu', '+91 94440 55002', '11111111-1111-1111-1111-111111111111', 't1111111-0003-0000-0000-000000000003', 'QR-MTR-02', false),
('s0000004-0003-0000-0000-000000000003', 'a0000004-0000-0000-0000-000000000004', 'Vignesh Kumar', 'vig.k@metro.edu', '+91 94440 55003', '11111111-1111-1111-1111-111111111111', 't1111111-0003-0000-0000-000000000003', 'QR-MTR-03', false),
('s0000004-0004-0000-0000-000000000004', 'a0000004-0000-0000-0000-000000000004', 'Karthik Raja', 'karthik.r@metro.edu', '+91 94440 55004', '11111111-1111-1111-1111-111111111111', 't1111111-0003-0000-0000-000000000003', 'QR-MTR-04', false),

-- School 5 (Horizon) - 4 students
('s0000005-0001-0000-0000-000000000001', 'a0000005-0000-0000-0000-000000000005', 'Varun Reddy', 'varun.r@horizon.edu', '+91 99880 66001', '22222222-2222-2222-2222-222222222222', 't2222222-0003-0000-0000-000000000003', 'QR-HRZ-01', false),
('s0000005-0002-0000-0000-000000000002', 'a0000005-0000-0000-0000-000000000005', 'Sahithi Priya', 'sahithi.p@horizon.edu', '+91 99880 66002', '22222222-2222-2222-2222-222222222222', 't2222222-0003-0000-0000-000000000003', 'QR-HRZ-02', false),
('s0000005-0003-0000-0000-000000000003', 'a0000005-0000-0000-0000-000000000005', 'Pranav Krishna', 'pranav.k@horizon.edu', '+91 99880 66003', '33333333-3333-3333-3333-333333333333', 't3333333-0003-0000-0000-000000000003', 'QR-HRZ-03', false),
('s0000005-0004-0000-0000-000000000004', 'a0000005-0000-0000-0000-000000000005', 'Divya Teja', 'divya.t@horizon.edu', '+91 99880 66004', '33333333-3333-3333-3333-333333333333', 't3333333-0003-0000-0000-000000000003', 'QR-HRZ-04', false)
ON CONFLICT (id) DO UPDATE SET 
    track_id = EXCLUDED.track_id,
    team_id = EXCLUDED.team_id;

-- 8. SCHEDULE ITEMS
INSERT INTO public.schedule_items (id, title, description, track_id, venue_id, starts_at, ends_at, type) VALUES
(
    'c1111111-0001-0000-0000-000000000001',
    'Registration, Kit Pickup & Breakfast',
    'Faculty and student verification at Helpdesk; grab your official lanyard, wristband, and breakfast box.',
    NULL,
    'e5555555-5555-5555-5555-555555555555',
    '2026-11-20T08:00:00Z',
    '2026-11-20T09:15:00Z',
    'break'
),
(
    'c1111111-0002-0000-0000-000000000002',
    'Grand Inauguration & Fest Briefing',
    'Welcome note by Principal, lighting of ceremonial torch, and track rules orientation by the Chief Jury.',
    NULL,
    'e1111111-1111-1111-1111-111111111111',
    '2026-11-20T09:30:00Z',
    '2026-11-20T10:30:00Z',
    'ceremony'
),
(
    'c1111111-0003-0000-0000-000000000003',
    'Robotics: Speed & Obstacle Qualifying',
    'Round 1 time trials. Bots navigate the dynamic terrain and payload pickup zone.',
    '11111111-1111-1111-1111-111111111111',
    'e2222222-2222-2222-2222-222222222222',
    '2026-11-20T10:45:00Z',
    '2026-11-20T13:00:00Z',
    'competition'
),
(
    'c1111111-0004-0000-0000-000000000004',
    'Build from Scrap: Material Haul & Fab',
    'Teams get 20 minutes to bid for scrap parts in Yard 4, followed by rapid cutting, welding, and assembly.',
    '22222222-2222-2222-2222-222222222222',
    'e3333333-3333-3333-3333-333333333333',
    '2026-11-20T10:45:00Z',
    '2026-11-20T14:30:00Z',
    'competition'
),
(
    'c1111111-0005-0000-0000-000000000005',
    'Useless Projects: Pitch & Demo Session A',
    'Teams showcase their wonderfully pointless inventions to judges and an amused live audience.',
    '33333333-3333-3333-3333-333333333333',
    'e4444444-4444-4444-4444-444444444444',
    '2026-11-20T11:00:00Z',
    '2026-11-20T13:00:00Z',
    'judging'
),
(
    'c1111111-0006-0000-0000-000000000006',
    'Lunch & Networking Hour',
    'Hot buffet served at Central Quad; campus maker showcase open for walkthroughs.',
    NULL,
    'e5555555-5555-5555-5555-555555555555',
    '2026-11-20T13:00:00Z',
    '2026-11-20T14:00:00Z',
    'break'
),
(
    'c1111111-0007-0000-0000-000000000007',
    'Robotics Championship Finals: The Arena Clash',
    'Head-to-head tactical obstacle runs for the top 4 qualifying robots.',
    '11111111-1111-1111-1111-111111111111',
    'e2222222-2222-2222-2222-222222222222',
    '2026-11-20T14:30:00Z',
    '2026-11-20T16:00:00Z',
    'competition'
),
(
    'c1111111-0008-0000-0000-000000000008',
    'Grand Valedictory & Trophy Presentation',
    'Declaration of winners, presentation of cash awards, and distribution of verified participation certificates.',
    NULL,
    'e1111111-1111-1111-1111-111111111111',
    '2026-11-20T16:30:00Z',
    '2026-11-20T18:00:00Z',
    'ceremony'
)
ON CONFLICT (id) DO NOTHING;

-- 9. ANNOUNCEMENTS
INSERT INTO public.announcements (id, title, body, audience, track_id, urgent, published) VALUES
(
    'd1111111-0001-0000-0000-000000000001',
    'Welcome to MAKE//BREAK 2026! 🚀',
    'Registration desks are now open at Central Quad. Faculty members, please collect your official welcome packets and verify student rosters.',
    'all',
    NULL,
    false,
    true
),
(
    'd1111111-0002-0000-0000-000000000002',
    '🚨 URGENT: Safety Eyewear in Scrap Fabrication Bay',
    'All participants entering Yard 4 must wear ANSI-rated protective eyewear. Non-compliance will pause team clock immediately.',
    'track',
    '22222222-2222-2222-2222-222222222222',
    true,
    true
),
(
    'd1111111-0003-0000-0000-000000000003',
    'Faculty Briefing at 09:00 AM',
    'All visiting school faculty leads are requested to assemble in Conference Room 102 for judging guidelines and travel reimbursement forms.',
    'faculty',
    NULL,
    false,
    true
),
(
    'd1111111-0004-0000-0000-000000000004',
    'Volunteer Shift Change - 01:00 PM',
    'Volunteers assigned to Arena Alpha and Tinkering Den, report to Volunteer Station B for lunch box distribution and afternoon handover.',
    'volunteers',
    NULL,
    false,
    true
)
ON CONFLICT (id) DO NOTHING;
