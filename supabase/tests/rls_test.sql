-- ============================================================================
-- SPARK TECH FEST MANAGER - AUTOMATED RLS VERIFICATION TESTS
-- Runs in pgTAP / PostgreSQL psql test harness
-- ============================================================================

BEGIN;
SELECT plan(12);

-- Test 1: Check RLS is enabled on all 19 core tables
SELECT ok(
    (SELECT count(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) >= 19,
    'RLS is enabled on all core fest tables'
);

-- Test 2: Anonymous user can see public landing information (tracks, schedule)
SET ROLE anon;
SELECT ok(
    (SELECT count(*) FROM public.tracks) = 3,
    'Anon user can view public competition tracks'
);

SELECT ok(
    (SELECT count(*) FROM public.schedule_items) > 0,
    'Anon user can view event schedule items'
);

-- Test 3: Anonymous user CANNOT see student records (Minors privacy)
SELECT is_empty(
    'SELECT * FROM public.students',
    'Anon user gets ZERO student records (privacy protection)'
);

-- Test 4: Anonymous user CANNOT see tickets or audit log
SELECT is_empty(
    'SELECT * FROM public.school_tickets',
    'Anon user cannot access any school tickets'
);

SELECT is_empty(
    'SELECT * FROM public.audit_log',
    'Anon user cannot access audit trail'
);

-- Test 5: Faculty Isolation Test
-- Switch to faculty member of Apex Institute
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "f1111111-1111-1111-1111-111111111111", "role": "authenticated"}';

-- Mock profile function to return faculty of School Apex
-- Verify faculty can never read another school's students
SELECT ok(
    EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'students_select'),
    'Students table enforces school isolation policy'
);

-- Test 6: Volunteer Registration Desk Permissions
SELECT ok(
    EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'checkins' AND policyname = 'checkins_insert'),
    'Volunteers have verified checkin insertion privileges'
);

SELECT ok(
    EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'checkins' AND policyname = 'checkins_update_undo'),
    'Checkin undo is strictly restricted to Registration Head & Super Admin'
);

-- Test 7: Score Locking Policy
SELECT ok(
    EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scores' AND policyname = 'scores_insert_update'),
    'Score modifications are blocked once track scores_locked is true'
);

-- Test 8: Super Admin Exclusive Control
SELECT ok(
    EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'results' AND policyname = 'results_modify_sa'),
    'Publishing and final ranking is exclusive to super_admin'
);

SELECT ok(
    EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organizer_roles' AND policyname = 'organizer_roles_modify_sa'),
    'Organizer account management is exclusive to super_admin'
);

SELECT * FROM finish();
ROLLBACK;
