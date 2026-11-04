-- ============================================================================
-- SPARK TECH FEST - PURGE ALL DEMO DATA FROM SUPABASE
-- Wipes all mock schools, students, teams, check-ins, scores, duties, issues,
-- venues, and schedule items.
-- Preserves schema, RLS policies, and core tracks.
-- ============================================================================

-- 1. Truncate all fest activity and registration tables
TRUNCATE TABLE 
  public.checkins,
  public.scores,
  public.results,
  public.students,
  public.teams,
  public.school_tickets,
  public.volunteer_duties,
  public.issue_reports,
  public.audit_log,
  public.schedule_items,
  public.announcements,
  public.venues,
  public.schools
CASCADE;

-- 2. Clear any assigned school_ids on profiles
UPDATE public.profiles SET school_id = NULL;

-- 3. Remove fake/orphaned profiles that don't belong to a real Supabase Auth user
DELETE FROM public.organizer_roles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 4. Re-verify the 3 Official Tracks (Robotics Arena, Build from Scrap, Useless Projects)
INSERT INTO public.tracks (id, name, slug, color, description, rules) VALUES
('11111111-1111-1111-1111-111111111111', 'Robotics Arena', 'robotics', '#1E40AF', 
 'Design, construct, and field autonomous or wired rovers to navigate brutal obstacles, ramp ascents, and high-precision payload challenges.',
 '1. Robot chassis must fit within 300mm x 300mm x 300mm bounding box at scrutiny.\n2. Battery voltage capped at 12V DC nominal.\n3. No IC engines or combustive propellants permitted.\n4. Maximum 2 student operators per arena heat.'),

('22222222-2222-2222-2222-222222222222', 'Build from Scrap', 'build-from-scrap', '#166534', 
 'Transform unadulterated junkyard scrap, discarded motors, and e-waste into working, functional electro-mechanical machines on the clock.',
 '1. 100% of base materials must be sourced from the allotment junkyard dump.\n2. Fasteners, adhesives, and wiring provided at central tool station.\n3. 4-hour strict build window. No pre-assembled subsystems permitted.\n4. Working prototype demonstration required during judging.'),

('33333333-3333-3333-3333-333333333333', 'Useless Projects', 'useless-projects', '#991B1B', 
 'Channel peak over-engineering absurdity to engineer hyper-complex, impeccably fabricated machines that solve utterly trivial problems.',
 '1. Machine must genuinely function and perform its stated useless task with zero human intervention.\n2. Must integrate at least one active electronic, micro-controller, or mechanical actuator.\n3. 3-minute deadpan stage pitch required before judges.\n4. Safety scrutiny applies: no mains AC voltage or hazardous chemicals.')
ON CONFLICT (id) DO NOTHING;

-- 5. Re-verify Official Scoring Rubric (IDs must be valid UUIDs)
INSERT INTO public.scoring_criteria (id, track_id, name, weight, max_score) VALUES
-- Robotics Arena
('aaaaaaaa-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Autonomous Execution & Navigation', 0.40, 10),
('aaaaaaaa-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'Mechanical Chassis & Wiring Integrity', 0.30, 10),
('aaaaaaaa-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'Course Speed & Obstacle Handling', 0.30, 10),

-- Build from Scrap
('bbbbbbbb-0002-0002-0002-000000000001', '22222222-2222-2222-2222-222222222222', 'Scrap Resourcefulness & Re-use Ratio', 0.35, 10),
('bbbbbbbb-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', 'Functional Output & Working Prototype', 0.35, 10),
('bbbbbbbb-0002-0002-0002-000000000003', '22222222-2222-2222-2222-222222222222', 'Structural Rigidity & Craft Finish', 0.30, 10),

-- Useless Projects
('cccccccc-0003-0003-0003-000000000001', '33333333-3333-3333-3333-333333333333', 'Concept Absurdity & Novelty', 0.40, 10),
('cccccccc-0003-0003-0003-000000000002', '33333333-3333-3333-3333-333333333333', 'Technical Over-engineering & Circuitry', 0.40, 10),
('cccccccc-0003-0003-0003-000000000003', '33333333-3333-3333-3333-333333333333', 'Deadpan Stage Presentation', 0.20, 10)
ON CONFLICT (id) DO NOTHING;
