-- ============================================================================
-- SPARK TECH FEST - FIX AUDIT LOG FOREIGN KEY & REGISTRATION RLS
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aestqtbstvyhcpwkkyut/sql/new
-- ============================================================================

-- 1. FIX AUDIT LOG TRIGGER: Prevent foreign key violation when user has no profile yet
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_actor_id UUID := NULL;
BEGIN
    -- Check if auth.uid() actually exists in public.profiles before referencing it
    IF auth.uid() IS NOT NULL THEN
        SELECT id INTO v_actor_id FROM public.profiles WHERE id = auth.uid();
    END IF;

    INSERT INTO public.audit_log (
        action,
        actor_id,
        target_type,
        target_id,
        old_data,
        new_data,
        created_at
    ) VALUES (
        TG_OP,
        v_actor_id,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        now()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2. SCHOOLS TABLE RLS
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

-- 3. PROFILES TABLE RLS
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

-- 4. SCHOOL TICKETS TABLE RLS
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

-- 5. STUDENTS TABLE RLS
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
