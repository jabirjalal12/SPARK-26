-- ============================================================================
-- SPARK TECH FEST MANAGER - CORE CONFIGURATION & SEED DATA
-- Tracks, Criteria, Venues, Schedule (05/11/2026 07:00 AM)
-- NO DEMO SCHOOLS OR STUDENTS - Data populated via real registration
-- ============================================================================

-- 1. COMPETITION TRACKS
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
('11111111-1111-1111-1111-111111111111', 'Innovation & Code', 0.30, 10.0)
ON CONFLICT DO NOTHING;

-- Build from Scrap
INSERT INTO public.scoring_criteria (track_id, name, weight, max_score) VALUES
('22222222-2222-2222-2222-222222222222', 'Creative Use of Scrap', 0.40, 10.0),
('22222222-2222-2222-2222-222222222222', 'Mechanism Functionality', 0.35, 10.0),
('22222222-2222-2222-2222-222222222222', 'Durability & Finish', 0.25, 10.0)
ON CONFLICT DO NOTHING;

-- Useless Projects
INSERT INTO public.scoring_criteria (track_id, name, weight, max_score) VALUES
('33333333-3333-3333-3333-333333333333', 'Comedic Value & Irony', 0.45, 10.0),
('33333333-3333-3333-3333-333333333333', 'Absurd Over-Engineering', 0.35, 10.0),
('33333333-3333-3333-3333-333333333333', 'Working Execution', 0.20, 10.0)
ON CONFLICT DO NOTHING;

-- 3. OFFICIAL VENUES
INSERT INTO public.venues (id, name, location, capacity) VALUES
('e1111111-1111-1111-1111-111111111111', 'Main Auditorium', 'Ground Floor, Tech Block', 500),
('e2222222-2222-2222-2222-222222222222', 'Robotics Arena Alpha', 'Mechanical Labs 1st Floor', 150),
('e3333333-3333-3333-3333-333333333333', 'Open Maker Quad', 'Central Courtyard', 300)
ON CONFLICT (id) DO NOTHING;

-- 4. OFFICIAL EVENT SCHEDULE (Starts 05/11/2026 at 07:00 AM)
INSERT INTO public.schedule_items (title, description, venue_id, track_id, starts_at, ends_at, type) VALUES
('Gates Open & Fast-Pass Registration Desk', 'School delegations report at Central Quad with their master QR pass.', 'e1111111-1111-1111-1111-111111111111', NULL, '2026-11-05T07:00:00Z', '2026-11-05T08:00:00Z', 'break'),
('Visiting Faculty & Delegation Welcome Breakfast', 'Networking lounge and breakfast buffet.', 'e1111111-1111-1111-1111-111111111111', NULL, '2026-11-05T07:45:00Z', '2026-11-05T08:30:00Z', 'break'),
('Grand Inaugural Ceremony & Rules Keynote', 'Welcome keynote, rolling trophy unveiling, and safety briefing.', 'e1111111-1111-1111-1111-111111111111', NULL, '2026-11-05T08:30:00Z', '2026-11-05T09:30:00Z', 'ceremony'),
('Arena Safety Pit Scrutiny & Tool Allotment', 'Robotics voltage inspection and scrap tools allotment.', 'e2222222-2222-2222-2222-222222222222', NULL, '2026-11-05T09:30:00Z', '2026-11-05T10:00:00Z', 'competition'),
('Robotics Arena Trials (Heat 1)', 'Autonomous obstacle navigation qualifiers.', 'e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2026-11-05T10:00:00Z', '2026-11-05T13:00:00Z', 'competition'),
('Scrap Assembly & Build Sprint', '4-hour non-stop junkyard fabrication and prototype assembly.', 'e3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '2026-11-05T10:00:00Z', '2026-11-05T14:00:00Z', 'competition'),
('Useless Pitching & Stage Presentation', 'Live exhibition and deadpan stage demonstrations.', 'e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '2026-11-05T10:30:00Z', '2026-11-05T12:30:00Z', 'judging'),
('Delegation Lunch & Tech Showcase', 'Buffet lunch and open engineering exhibits at Central Quad.', 'e1111111-1111-1111-1111-111111111111', NULL, '2026-11-05T13:00:00Z', '2026-11-05T14:00:00Z', 'break'),
('Robotics Arena Championship Finals', 'Head-to-head top 4 bot championship trials.', 'e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2026-11-05T14:00:00Z', '2026-11-05T15:30:00Z', 'competition'),
('Valedictory & Grand Award Ceremony', 'Announcement of official winners, ₹75k+ cash, and certificates.', 'e1111111-1111-1111-1111-111111111111', NULL, '2026-11-05T16:30:00Z', '2026-11-05T18:00:00Z', 'ceremony')
ON CONFLICT DO NOTHING;

-- 5. INITIAL OFFICIAL ANNOUNCEMENTS
INSERT INTO public.announcements (title, body, audience, urgent) VALUES
('Welcome to SPARK 2026!', 'Campus gates are open. Faculty coordinators must present their single school QR ticket at Central Registration.', 'all', false),
('Power Strip Distribution at Maker Quad', 'Scrap track teams can collect 16A heavy-duty extension strips from Table 0.', 'all', false),
('Urgent: Robotics Heat 1 Pit Call', 'All line-following robots must report to inspection bay by 10:20 AM sharp.', 'all', true)
ON CONFLICT DO NOTHING;
