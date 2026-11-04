-- ============================================================================
-- SPARK TECH FEST - COMPLETE ALL-IN-ONE DATABASE FIX
-- Run this ONCE in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aestqtbstvyhcpwkkyut/sql/new
-- ============================================================================

-- 1. FIX AUTH USERS: Auto-confirm emails and prevent GoTrue token schema errors
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

-- Fix any existing users in auth.users
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, '');

-- 2. FIX AUDIT LOG TRIGGER: Prevent foreign key violation when user profile doesn't exist yet
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_actor_id UUID := NULL;
BEGIN
    -- Only use auth.uid() if it actually exists in public.profiles
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

-- 3. SCHOOLS RLS POLICIES (Allow public registration and viewing)
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
FOR UPDATE TO public 
USING (true);

-- 4. PROFILES RLS POLICIES (Allow profile creation during signup)
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
FOR UPDATE TO public 
USING (true);

-- 5. SCHOOL TICKETS RLS POLICIES (Allow QR pass creation & verification)
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
FOR ALL TO public 
USING (true);

-- 6. STUDENTS RLS POLICIES (Allow faculty to add & manage student roster)
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

-- 7. TEAMS RLS POLICIES (Allow team creation & viewing)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teams_select" ON public.teams;
CREATE POLICY "teams_select" ON public.teams 
FOR SELECT TO public 
USING (true);

DROP POLICY IF EXISTS "teams_insert" ON public.teams;
CREATE POLICY "teams_insert" ON public.teams 
FOR INSERT TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "teams_modify" ON public.teams;
CREATE POLICY "teams_modify" ON public.teams 
FOR ALL TO public 
USING (true);

-- 8. CHECKINS & AUDIT LOG RLS POLICIES (Allow registration desk check-ins)
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "checkins_select" ON public.checkins;
CREATE POLICY "checkins_select" ON public.checkins 
FOR SELECT TO public 
USING (true);

DROP POLICY IF EXISTS "checkins_insert" ON public.checkins;
CREATE POLICY "checkins_insert" ON public.checkins 
FOR INSERT TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "checkins_modify" ON public.checkins;
CREATE POLICY "checkins_modify" ON public.checkins 
FOR ALL TO public 
USING (true);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_select" ON public.audit_log;
CREATE POLICY "audit_select" ON public.audit_log 
FOR SELECT TO public 
USING (true);

DROP POLICY IF EXISTS "audit_insert" ON public.audit_log;
CREATE POLICY "audit_insert" ON public.audit_log 
FOR INSERT TO public 
WITH CHECK (true);

-- Reload schema cache to apply immediately
NOTIFY pgrst, 'reload schema';
