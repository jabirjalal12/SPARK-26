-- ==============================================================================
-- MAKE//BREAK RLS VERIFICATION TESTS - rls_test.sql
-- Automated SQL assertions to verify permissions per role:
-- 1. participant
-- 2. faculty
-- 3. volunteer
-- 4. judge
-- 5. organizer
-- ==============================================================================

BEGIN;

-- Create test auth users
CREATE OR REPLACE FUNCTION test_rls_suite()
RETURNS TABLE (test_name TEXT, status TEXT, message TEXT) AS $$
DECLARE
    v_organizer_id UUID := gen_random_uuid();
    v_faculty1_id UUID := gen_random_uuid();
    v_faculty2_id UUID := gen_random_uuid();
    v_volunteer_id UUID := gen_random_uuid();
    v_judge_id UUID := gen_random_uuid();
    v_student_id UUID := gen_random_uuid();
    
    v_school1_id UUID := 'a0000001-0000-0000-0000-000000000001';
    v_school2_id UUID := 'a0000002-0000-0000-0000-000000000002';
    v_robo_track_id UUID := '11111111-1111-1111-1111-111111111111';
    
    v_count INTEGER;
BEGIN
    -- --------------------------------------------------------------------------
    -- TEST 1: Faculty cannot read other school's students
    -- --------------------------------------------------------------------------
    -- Temporarily set context to faculty 1 (School 1)
    PERFORM set_config('request.jwt.claim.sub', v_faculty1_id::text, true);
    PERFORM set_config('role', 'authenticated', true);

    -- Mock profile for faculty 1
    INSERT INTO public.profiles (id, role, school_id, full_name, email, approved)
    VALUES (v_faculty1_id, 'faculty', v_school1_id, 'Faculty Lead 1', 'faculty1@test.edu', true)
    ON CONFLICT (id) DO UPDATE SET school_id = v_school1_id, role = 'faculty';

    -- Count students visible to faculty 1
    SELECT COUNT(*) INTO v_count FROM public.students 
    WHERE school_id = v_school2_id;

    IF v_count = 0 THEN
        test_name := 'Faculty Isolation: School 1 Faculty cannot read School 2 Students';
        status := 'PASS';
        message := 'Correctly filtered 0 rows for other school';
        RETURN NEXT;
    ELSE
        test_name := 'Faculty Isolation: School 1 Faculty cannot read School 2 Students';
        status := 'FAIL';
        message := 'Faculty could view ' || v_count || ' students from another school!';
        RETURN NEXT;
    END IF;

    -- --------------------------------------------------------------------------
    -- TEST 2: Volunteer can search students for check-in
    -- --------------------------------------------------------------------------
    PERFORM set_config('request.jwt.claim.sub', v_volunteer_id::text, true);
    INSERT INTO public.profiles (id, role, full_name, email, approved)
    VALUES (v_volunteer_id, 'volunteer', 'Volunteer Lead', 'vol@test.edu', true)
    ON CONFLICT (id) DO UPDATE SET role = 'volunteer';

    SELECT COUNT(*) INTO v_count FROM public.students;
    IF v_count >= 20 THEN
        test_name := 'Volunteer Search: Volunteer can see all students to check-in';
        status := 'PASS';
        message := 'Volunteer sees full roster (' || v_count || ' students) for check-in';
        RETURN NEXT;
    ELSE
        test_name := 'Volunteer Search: Volunteer can see all students to check-in';
        status := 'FAIL';
        message := 'Volunteer was unable to query students';
        RETURN NEXT;
    END IF;

    -- --------------------------------------------------------------------------
    -- TEST 3: Judge cannot score tracks they are not assigned to
    -- --------------------------------------------------------------------------
    PERFORM set_config('request.jwt.claim.sub', v_judge_id::text, true);
    INSERT INTO public.profiles (id, role, full_name, email, approved, assigned_track_id)
    VALUES (v_judge_id, 'judge', 'Robotics Judge', 'judge@test.edu', true, v_robo_track_id)
    ON CONFLICT (id) DO UPDATE SET role = 'judge', assigned_track_id = v_robo_track_id;

    -- Attempt to insert score for Build from Scrap team (should fail RLS)
    BEGIN
        INSERT INTO public.scores (team_id, judge_id, criterion_id, value)
        VALUES ('t2222222-0001-0000-0000-000000000001', v_judge_id, 'bb222222-2222-2222-2222-222222222221', 9.5);
        
        test_name := 'Judge Track Restriction: Cannot score unassigned track';
        status := 'FAIL';
        message := 'Judge was able to insert score for unassigned track!';
        RETURN NEXT;
    EXCEPTION WHEN insufficient_privilege THEN
        test_name := 'Judge Track Restriction: Cannot score unassigned track';
        status := 'PASS';
        message := 'RLS blocked score insertion for unassigned track';
        RETURN NEXT;
    END;

    -- --------------------------------------------------------------------------
    -- TEST 4: Organizer has full access
    -- --------------------------------------------------------------------------
    PERFORM set_config('request.jwt.claim.sub', v_organizer_id::text, true);
    INSERT INTO public.profiles (id, role, full_name, email, approved)
    VALUES (v_organizer_id, 'organizer', 'Chief Organizer', 'admin@makebreak.tech', true)
    ON CONFLICT (id) DO UPDATE SET role = 'organizer', approved = true;

    SELECT COUNT(*) INTO v_count FROM public.schools;
    IF v_count >= 5 THEN
        test_name := 'Organizer Admin: Full access to all schools';
        status := 'PASS';
        message := 'Organizer queried all ' || v_count || ' registered schools';
        RETURN NEXT;
    ELSE
        test_name := 'Organizer Admin: Full access to all schools';
        status := 'FAIL';
        message := 'Organizer was restricted';
        RETURN NEXT;
    END IF;

    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Run the tests
SELECT * FROM test_rls_suite();

ROLLBACK;
