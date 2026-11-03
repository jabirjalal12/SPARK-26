-- ============================================================================
-- SPARK TECH FEST MANAGER - SEED DATA
-- 3 Tracks, Criteria, 5 Schools, Teams, 20 Students, Tickets, Venues, Schedule
-- ============================================================================

-- 1. TRACKS
INSERT INTO public.tracks (id, name, slug, color, description, rules) VALUES
('11111111-1111-1111-1111-111111111111', 'Robotics', 'robotics', '#1E40AF', 'Autonomous & line-follower rover engineering arena.', 'Standard chassis, battery <= 12V, no flame sources.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tracks (id, name, slug, color, description, rules) VALUES
('22222222-2222-2222-2222-222222222222', 'Build from Scrap', 'scrap', '#166534', 'Upcycled mechanical & functional prototypes made from junkyard materials.', '>=70% recycled materials required.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tracks (id, name, slug, color, description, rules) VALUES
('33333333-3333-3333-3333-333333333333', 'Useless Projects', 'useless', '#991B1B', 'Over-engineered solutions to non-existent problems.', 'Must physically function. Maximum humor, zero utility.')
ON CONFLICT (id) DO NOTHING;

-- 2. SCORING CRITERIA
-- Robotics
INSERT INTO public.scoring_criteria (track_id, name, weight, max_score) VALUES
('11111111-1111-1111-1111-111111111111', 'Autonomous Navigation', 0.40, 10.0),
('11111111-1111-1111-1111-111111111111', 'Hardware Robustness', 0.30, 10.0),
('11111111-1111-1111-1111-111111111111', 'Innovation & Code', 0.30, 10.0);

-- Build from Scrap
INSERT INTO public.scoring_criteria (track_id, name, weight, max_score) VALUES
('22222222-2222-2222-2222-222222222222', 'Creative Use of Scrap', 0.40, 10.0),
('22222222-2222-2222-2222-222222222222', 'Mechanism Functionality', 0.35, 10.0),
('22222222-2222-2222-2222-222222222222', 'Durability & Finish', 0.25, 10.0);

-- Useless Projects
INSERT INTO public.scoring_criteria (track_id, name, weight, max_score) VALUES
('33333333-3333-3333-3333-333333333333', 'Comedic Value & Irony', 0.45, 10.0),
('33333333-3333-3333-3333-333333333333', 'Absurd Over-Engineering', 0.35, 10.0),
('33333333-3333-3333-3333-333333333333', 'Working Execution', 0.20, 10.0);

-- 3. 5 VISITING SCHOOLS
INSERT INTO public.schools (id, name, code, city, address, contact_email, contact_phone, status, arrived) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Apex Institute of Technology', 'SCH-APX-812', 'Bengaluru', '42 Innovation Way', 'apex@edu.in', '+919845011001', 'approved', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'St. Joseph Senior Secondary', 'SCH-STJ-401', 'Mysuru', '15 Convent Road', 'stjoseph@edu.in', '+919845011002', 'approved', false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Green Valley Academy', 'SCH-GVA-932', 'Mangaluru', '88 Hill View', 'greenvalley@edu.in', '+919845011003', 'approved', false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Horizon Science College', 'SCH-HSC-154', 'Hubballi', '23 Vidya Nagar', 'horizon@edu.in', '+919845011004', 'approved', false),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Metro Public School', 'SCH-MPS-677', 'Belagavi', '10 Nehru Circle', 'metro@edu.in', '+919845011005', 'pending', false)
ON CONFLICT (id) DO NOTHING;

-- 4. TICKETS FOR APPROVED SCHOOLS (Single random token per school)
INSERT INTO public.school_tickets (school_id, token_hash) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TKT-APX-812-7f9a2b1c'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TKT-STJ-401-4c8d3e2f'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'TKT-GVA-932-9b1e5a7d'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'TKT-HSC-154-3f2a8c6e')
ON CONFLICT DO NOTHING;

-- 5. TEAMS
INSERT INTO public.teams (id, school_id, track_id, name, project_title, project_summary, table_number) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Apex Botsmiths', 'VortexCrawler X4', 'Quadruped pipeline inspection rover', 'T-01'),
('aaaa2222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Apex JunkForge', 'Pedal-Powered Air Purifier', 'Recycled cycle frame and vacuum filters', 'T-02'),
('bbbb1111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Josephite Circuit', 'Solar Pathfinder', 'Solar-tracked field exploration vehicle', 'T-03'),
('cccc3333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Valley Goofs', 'The Regret Alarm', 'Slaps you with rubber hand if snooze pressed', 'T-04')
ON CONFLICT (id) DO NOTHING;

-- 6. 20 STUDENTS (Stored with name and class ONLY; zero minor phone/email)
INSERT INTO public.students (school_id, track_id, team_id, name, class) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Aarav Nair', 'Grade 12-A'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Ananya Sharma', 'Grade 12-A'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'Rohan Verma', 'Grade 11-B'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 'Diya Patel', 'Grade 11-B'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'Kavya Menon', 'Grade 12-C'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 'Aditya Rao', 'Grade 12-C'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', NULL, 'Pooja Hegde', 'Grade 11-A'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', NULL, 'Siddharth Sen', 'Grade 11-A'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', 'Meera Iyer', 'Grade 12-B'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', 'Varun Joshi', 'Grade 12-B'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', NULL, 'Tara Deshmukh', 'Grade 11-C'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', NULL, 'Nikhil Kulkarni', 'Grade 11-C'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', NULL, 'Ishaan Gupta', 'Grade 12-A'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', NULL, 'Sneha Reddy', 'Grade 12-A'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', NULL, 'Gautam Nambiar', 'Grade 11-B'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', NULL, 'Anika Pillai', 'Grade 11-B'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', NULL, 'Kunal Bhat', 'Grade 10'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', NULL, 'Neha Koorse', 'Grade 10'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', NULL, 'Abhinav Patil', 'Grade 10'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', NULL, 'Tanvi Kamat', 'Grade 10');

-- 7. VENUES
INSERT INTO public.venues (id, name, location, capacity) VALUES
('v1111111-1111-1111-1111-111111111111', 'Main Auditorium', 'Ground Floor, Tech Block', 500),
('v2222222-2222-2222-2222-222222222222', 'Robotics Arena Alpha', 'Mechanical Labs 1st Floor', 150),
('v3333333-3333-3333-3333-333333333333', 'Open Maker Quad', 'Central Courtyard', 300)
ON CONFLICT (id) DO NOTHING;

-- 8. SCHEDULE ITEMS
INSERT INTO public.schedule_items (title, description, venue_id, track_id, starts_at, ends_at, type) VALUES
('Delegation Reporting & Fast-Checkin', 'School delegations report at Central Desk.', 'v1111111-1111-1111-1111-111111111111', NULL, '2026-11-20T08:30:00Z', '2026-11-20T09:30:00Z', 'ceremony'),
('Inaugural Ceremony & Track Briefing', 'Welcome keynote and technical safety briefing.', 'v1111111-1111-1111-1111-111111111111', NULL, '2026-11-20T09:30:00Z', '2026-11-20T10:15:00Z', 'ceremony'),
('Robotics Arena Trials (Heat 1)', 'Autonomous obstacle navigation round.', 'v2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2026-11-20T10:30:00Z', '2026-11-20T12:30:00Z', 'competition'),
('Scrap Assembly & Build Sprint', 'Junkyard selection and functional assembly.', 'v3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '2026-11-20T10:30:00Z', '2026-11-20T13:00:00Z', 'competition'),
('Useless Pitching & Demo Show', 'Live exhibition and comedy demonstrations.', 'v1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '2026-11-20T13:30:00Z', '2026-11-20T15:30:00Z', 'judging'),
('Valedictory & Grand Award Ceremony', 'Announcement of official winners and certificate issuance.', 'v1111111-1111-1111-1111-111111111111', NULL, '2026-11-20T16:00:00Z', '2026-11-20T17:00:00Z', 'ceremony');

-- 9. ANNOUNCEMENTS
INSERT INTO public.announcements (title, body, audience, urgent) VALUES
('Welcome to SPARK 2026!', 'Campus gates are open. Faculty coordinators must present their single school QR ticket at Central Registration.', 'all', false),
('Power Strip Distribution at Maker Quad', 'Scrap track teams can collect 16A heavy-duty extension strips from Table 0.', 'all', false),
('Urgent: Robotics Heat 1 Pit Call', 'All line-following robots must report to inspection bay by 10:20 AM sharp.', 'all', true);
