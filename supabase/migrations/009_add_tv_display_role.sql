-- ============================================================================
-- SPARK TECH FEST - MIGRATION 009: ADD TV DISPLAY ROLE
-- ============================================================================

-- 1. Update profiles table role check constraint to include 'tv_display'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('faculty', 'volunteer', 'organizer', 'judge', 'tv_display', 'tv'));

-- 2. Allow TV Display profiles to be read publicly
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles
FOR SELECT TO public
USING (true);

-- Reload schema
NOTIFY pgrst, 'reload schema';
