-- ============================================================================
-- SPARK TECH FEST - COMPLETE SUPABASE UPDATE & CONFIGURATION
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aestqtbstvyhcpwkkyut/sql/new
-- ============================================================================

-- 1. FIX PROFILES ROLE CHECK CONSTRAINT
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN (
    'super_admin',
    'admin',
    'event_coordinator',
    'registration_head',
    'organizer',
    'faculty',
    'volunteer',
    'judge',
    'tv_display'
  ));

-- 2. ENABLE ROW LEVEL SECURITY & ADD PERMISSIVE POLICIES FOR OPERATIONAL TABLES

-- TRACKS
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tracks_select_all" ON public.tracks;
CREATE POLICY "tracks_select_all" ON public.tracks FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "tracks_manage_all" ON public.tracks;
CREATE POLICY "tracks_manage_all" ON public.tracks FOR ALL TO public USING (true);

-- SCORING CRITERIA
ALTER TABLE public.scoring_criteria ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "criteria_select_all" ON public.scoring_criteria;
CREATE POLICY "criteria_select_all" ON public.scoring_criteria FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "criteria_manage_all" ON public.scoring_criteria;
CREATE POLICY "criteria_manage_all" ON public.scoring_criteria FOR ALL TO public USING (true);

-- VENUES
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "venues_select_all" ON public.venues;
CREATE POLICY "venues_select_all" ON public.venues FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "venues_manage_all" ON public.venues;
CREATE POLICY "venues_manage_all" ON public.venues FOR ALL TO public USING (true);

-- SCHEDULE ITEMS
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "schedule_select_all" ON public.schedule_items;
CREATE POLICY "schedule_select_all" ON public.schedule_items FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "schedule_manage_all" ON public.schedule_items;
CREATE POLICY "schedule_manage_all" ON public.schedule_items FOR ALL TO public USING (true);

-- ANNOUNCEMENTS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "announcements_select_all" ON public.announcements;
CREATE POLICY "announcements_select_all" ON public.announcements FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "announcements_manage_all" ON public.announcements;
CREATE POLICY "announcements_manage_all" ON public.announcements FOR ALL TO public USING (true);

-- SCHOOLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "schools_select_all" ON public.schools;
CREATE POLICY "schools_select_all" ON public.schools FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "schools_insert_all" ON public.schools;
CREATE POLICY "schools_insert_all" ON public.schools FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "schools_update_all" ON public.schools;
CREATE POLICY "schools_update_all" ON public.schools FOR UPDATE TO public USING (true);
DROP POLICY IF EXISTS "schools_delete_all" ON public.schools;
CREATE POLICY "schools_delete_all" ON public.schools FOR DELETE TO public USING (true);

-- SCHOOL TICKETS
ALTER TABLE public.school_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tickets_select_all" ON public.school_tickets;
CREATE POLICY "tickets_select_all" ON public.school_tickets FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "tickets_manage_all" ON public.school_tickets;
CREATE POLICY "tickets_manage_all" ON public.school_tickets FOR ALL TO public USING (true);

-- STUDENTS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "students_select_all" ON public.students;
CREATE POLICY "students_select_all" ON public.students FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "students_manage_all" ON public.students;
CREATE POLICY "students_manage_all" ON public.students FOR ALL TO public USING (true);

-- TEAMS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "teams_select_all" ON public.teams;
CREATE POLICY "teams_select_all" ON public.teams FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "teams_manage_all" ON public.teams;
CREATE POLICY "teams_manage_all" ON public.teams FOR ALL TO public USING (true);

-- SCORES
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "scores_select_all" ON public.scores;
CREATE POLICY "scores_select_all" ON public.scores FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "scores_manage_all" ON public.scores;
CREATE POLICY "scores_manage_all" ON public.scores FOR ALL TO public USING (true);

-- CHECKINS
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "checkins_select_all" ON public.checkins;
CREATE POLICY "checkins_select_all" ON public.checkins FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "checkins_manage_all" ON public.checkins;
CREATE POLICY "checkins_manage_all" ON public.checkins FOR ALL TO public USING (true);

-- VOLUNTEER DUTIES
ALTER TABLE public.volunteer_duties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "duties_select_all" ON public.volunteer_duties;
CREATE POLICY "duties_select_all" ON public.volunteer_duties FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "duties_manage_all" ON public.volunteer_duties;
CREATE POLICY "duties_manage_all" ON public.volunteer_duties FOR ALL TO public USING (true);

-- ISSUE REPORTS
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "issues_select_all" ON public.issue_reports;
CREATE POLICY "issues_select_all" ON public.issue_reports FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "issues_manage_all" ON public.issue_reports;
CREATE POLICY "issues_manage_all" ON public.issue_reports FOR ALL TO public USING (true);

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "profiles_insert_all" ON public.profiles;
CREATE POLICY "profiles_insert_all" ON public.profiles FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "profiles_update_all" ON public.profiles;
CREATE POLICY "profiles_update_all" ON public.profiles FOR UPDATE TO public USING (true);

-- AUDIT LOG
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_select_all" ON public.audit_log;
CREATE POLICY "audit_select_all" ON public.audit_log FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "audit_insert_all" ON public.audit_log;
CREATE POLICY "audit_insert_all" ON public.audit_log FOR INSERT TO public WITH CHECK (true);

-- 3. INSERT / UPSERT THE 8 OFFICIAL COMPETITION TRACKS
INSERT INTO public.tracks (id, name, slug, color, description, rules) VALUES
('11111111-1111-1111-1111-111111111111', 
 'Robotics', 
 'robotics', 
 '#1E40AF', 
 'Design, construct, and field autonomous or wired rovers to navigate brutal obstacle courses and speed circuits.',
 '1. Robot chassis must fit within 300mm x 300mm x 300mm bounding box at scrutiny.\n2. Battery voltage capped at 12V DC nominal.\n3. Maximum 2 student operators per arena heat.'),

('22222222-2222-2222-2222-222222222222', 
 'Quiz', 
 'quiz', 
 '#7C3AED', 
 'Multi-round inter-school technical quiz testing fundamentals of science, engineering, computing, and tech history.',
 '1. Preliminary written elimination followed by live stage buzzer finals.\n2. Negative marks for wrong answers in buzzer round.'),

('33333333-3333-3333-3333-333333333333', 
 'Ideathon', 
 'ideathon', 
 '#059669', 
 'Pitch groundbreaking technological solutions and innovations solving critical real-world industry or social challenges.',
 '1. 5-minute slide pitch followed by 3-minute jury Q&A.\n2. Evaluation based on novelty, technical feasibility, and societal impact.'),

('44444444-4444-4444-4444-444444444444', 
 'Science Project Competition', 
 'science-project', 
 '#0284C7', 
 'Exhibit functional working models, experimental setups, and applied scientific research projects.',
 '1. Working model demonstration mandatory before jury.\n2. Chart display explaining hypothesis and experimental results.'),

('55555555-5555-5555-5555-555555555555', 
 'Useless Project Competition', 
 'useless-projects', 
 '#DC2626', 
 'Channel peak over-engineering absurdity to construct impeccably fabricated working machines that solve utterly trivial problems.',
 '1. Machine must genuinely function and perform its stated useless task autonomously.\n2. Deadpan stage pitch required before judges.'),

('66666666-6666-6666-6666-666666666666', 
 'Article Writing', 
 'article-writing', 
 '#D97706', 
 'Original on-the-spot technical essays and foresight articles addressing emerging frontiers in engineering and AI.',
 '1. On-the-spot prompt revealed at 10:30 AM.\n2. Maximum 1500 words. Plagiarism disqualifies immediately.'),

('77777777-7777-7777-7777-777777777777', 
 'Poster Presentation', 
 'poster-presentation', 
 '#DB2777', 
 'Visual infographics and technical poster exhibitions communicating engineering research and scientific principles.',
 '1. Standard A1 poster format.\n2. Presenters must be stationed at their poster booth during judge inspection.'),

('88888888-8888-8888-8888-888888888888', 
 'New Product Development from Scrap', 
 'build-from-scrap', 
 '#166534', 
 'Transform discarded industrial scrap, e-waste, and discarded mechanical hardware into working, functional machines.',
 '1. Base scrap materials sourced from the allotment junkyard.\n2. Working prototype demonstration required during judging.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  color = EXCLUDED.color,
  description = EXCLUDED.description,
  rules = EXCLUDED.rules;

-- 4. INSERT / UPSERT OFFICIAL SCORING RUBRIC CRITERIA
INSERT INTO public.scoring_criteria (id, track_id, name, weight, max_score) VALUES
-- Robotics
('aaaa0001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Autonomous Execution & Navigation', 0.40, 10),
('aaaa0001-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'Mechanical Chassis & Wiring', 0.30, 10),
('aaaa0001-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'Obstacle Course Speed', 0.30, 10),

-- Quiz
('aaaa0002-0002-0002-0002-000000000001', '22222222-2222-2222-2222-222222222222', 'Preliminary Score', 0.40, 10),
('aaaa0002-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', 'Buzzer Stage Speed & Accuracy', 0.60, 10),

-- Ideathon
('aaaa0003-0003-0003-0003-000000000001', '33333333-3333-3333-3333-333333333333', 'Innovation & Problem Originality', 0.40, 10),
('aaaa0003-0003-0003-0003-000000000002', '33333333-3333-3333-3333-333333333333', 'Feasibility & Technical Roadmap', 0.30, 10),
('aaaa0003-0003-0003-0003-000000000003', '33333333-3333-3333-3333-333333333333', 'Stage Pitch & Defense', 0.30, 10),

-- Science Project
('aaaa0004-0004-0004-0004-000000000001', '44444444-4444-4444-4444-444444444444', 'Scientific Depth & Hypothesis', 0.35, 10),
('aaaa0004-0004-0004-0004-000000000002', '44444444-4444-4444-4444-444444444444', 'Working Demonstration', 0.35, 10),
('aaaa0004-0004-0004-0004-000000000003', '44444444-4444-4444-4444-444444444444', 'Poster & Documentation', 0.30, 10),

-- Useless Project
('aaaa0005-0005-0005-0005-000000000001', '55555555-5555-5555-5555-555555555555', 'Concept Absurdity & Humor', 0.40, 10),
('aaaa0005-0005-0005-0005-000000000002', '55555555-5555-5555-5555-555555555555', 'Technical Over-engineering', 0.40, 10),
('aaaa0005-0005-0005-0005-000000000003', '55555555-5555-5555-5555-555555555555', 'Deadpan Stage Presentation', 0.20, 10),

-- Article Writing
('aaaa0006-0006-0006-0006-000000000001', '66666666-6666-6666-6666-666666666666', 'Technical Depth & Content', 0.40, 10),
('aaaa0006-0006-0006-0006-000000000002', '66666666-6666-6666-6666-666666666666', 'Structure & Clarity', 0.30, 10),
('aaaa0006-0006-0006-0006-000000000003', '66666666-6666-6666-6666-666666666666', 'Originality of Perspective', 0.30, 10),

-- Poster Presentation
('aaaa0007-0007-0007-0007-000000000001', '77777777-7777-7777-7777-777777777777', 'Visual Infographic Quality', 0.40, 10),
('aaaa0007-0007-0007-0007-000000000002', '77777777-7777-7777-7777-777777777777', 'Technical Rigor', 0.30, 10),
('aaaa0007-0007-0007-0007-000000000003', '77777777-7777-7777-7777-777777777777', 'Q&A Booth Defense', 0.30, 10),

-- Scrap Product
('aaaa0008-0008-0008-0008-000000000001', '88888888-8888-8888-8888-888888888888', 'Scrap Resourcefulness & Re-use', 0.35, 10),
('aaaa0008-0008-0008-0008-000000000002', '88888888-8888-8888-8888-888888888888', 'Functional Machine Output', 0.35, 10),
('aaaa0008-0008-0008-0008-000000000003', '88888888-8888-8888-8888-888888888888', 'Structural Craft & Rigidity', 0.30, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  weight = EXCLUDED.weight,
  max_score = EXCLUDED.max_score;

-- 5. INSERT / UPSERT CAMPUS VENUES
INSERT INTO public.venues (id, name, location, capacity) VALUES
('eeee0001-0001-0001-0001-000000000001', 'Near Reception', 'Main Administrative Building (Ground Floor)', 200),
('eeee0002-0002-0002-0002-000000000002', 'College Auditorium', 'Auditorium Complex', 800),
('eeee0003-0003-0003-0003-000000000003', 'College Dome', 'Central Campus Dome', 500),
('eeee0004-0004-0004-0004-000000000004', 'Smart Classroom (2nd Floor)', 'Academic Block - 2nd Floor', 80),
('eeee0005-0005-0005-0005-000000000005', 'EG001 and EG002', 'Engineering Block G - Ground Floor', 120),
('eeee0006-0006-0006-0006-000000000006', 'Computer Lab 1', 'IT Block - 1st Floor', 70),
('eeee0007-0007-0007-0007-000000000007', 'ES001 and ES002', 'Engineering Block S - Ground Floor', 120),
('eeee0008-0008-0008-0008-000000000008', 'Computer Lab 3', 'IT Block - 3rd Floor', 70),
('eeee0009-0009-0009-0009-000000000009', 'Mechanical Workshop', 'Mechanical Engineering Block', 150)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  capacity = EXCLUDED.capacity;

-- 6. AUTO-CONFIRM USERS TRIGGER
CREATE OR REPLACE FUNCTION public.auto_confirm_new_users()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, now());
  NEW.confirmation_token := COALESCE(NEW.confirmation_token, '');
  NEW.recovery_token := COALESCE(NEW.recovery_token, '');
  NEW.email_change_token_new := COALESCE(NEW.email_change_token_new, '');
  NEW.email_change := COALESCE(NEW.email_change, '');
  NEW.email_change_token_current := COALESCE(NEW.email_change_token_current, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_new_users();

UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, '')
WHERE email_confirmed_at IS NULL;

-- 7. ROBUST FACTORY RESET RPC FUNCTION
CREATE OR REPLACE FUNCTION public.factory_reset_fest()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.checkins WHERE true;
  DELETE FROM public.scores WHERE true;
  DELETE FROM public.results WHERE true;
  DELETE FROM public.students WHERE true;
  DELETE FROM public.teams WHERE true;
  DELETE FROM public.school_tickets WHERE true;
  DELETE FROM public.volunteer_duties WHERE true;
  DELETE FROM public.issue_reports WHERE true;
  DELETE FROM public.schedule_items WHERE true;
  DELETE FROM public.announcements WHERE true;
  DELETE FROM public.schools WHERE true;
  DELETE FROM public.audit_log WHERE true;
  UPDATE public.profiles SET school_id = NULL WHERE true;
END;
$$;

-- 8. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
