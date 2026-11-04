-- ============================================================================
-- SPARK TECH FEST - FIX REGISTRATION RLS POLICIES
-- Allows visiting faculty and registration flow to create schools, profiles,
-- and school tickets without hitting RLS errors.
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aestqtbstvyhcpwkkyut/sql/new
-- ============================================================================

-- 1. SCHOOLS TABLE
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "schools_select" ON public.schools;
CREATE POLICY "schools_select" ON public.schools 
FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "schools_insert_public" ON public.schools;
CREATE POLICY "schools_insert_public" ON public.schools 
FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "schools_update_admin" ON public.schools;
CREATE POLICY "schools_update_admin" ON public.schools 
FOR UPDATE TO authenticated
USING (
    public.is_registration_head()
    OR public.is_super_admin()
    OR (public.is_faculty() AND id = public.get_auth_school_id())
);

-- 2. PROFILES TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles 
FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
CREATE POLICY "profiles_insert_self" ON public.profiles 
FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles 
FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.is_super_admin());

-- 3. SCHOOL TICKETS TABLE
ALTER TABLE public.school_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tickets_select" ON public.school_tickets;
CREATE POLICY "tickets_select" ON public.school_tickets 
FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "tickets_insert_registration" ON public.school_tickets;
CREATE POLICY "tickets_insert_registration" ON public.school_tickets 
FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "tickets_modify_rh_sa" ON public.school_tickets;
CREATE POLICY "tickets_modify_rh_sa" ON public.school_tickets 
FOR ALL TO authenticated
USING (public.is_registration_head() OR public.is_super_admin());

-- 4. STUDENTS TABLE (Allow faculty to insert & select their squad)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students_select" ON public.students;
CREATE POLICY "students_select" ON public.students 
FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "students_insert" ON public.students;
CREATE POLICY "students_insert" ON public.students 
FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "students_modify" ON public.students;
CREATE POLICY "students_modify" ON public.students 
FOR ALL TO public
USING (true);
