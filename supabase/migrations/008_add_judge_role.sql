-- ============================================================================
-- SPARK TECH FEST - MIGRATION 008: ADD JUDGE ROLE & ID PASS PRIVILEGES
-- ============================================================================

-- 1. Update profiles table role check constraint to include 'judge'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('faculty', 'volunteer', 'organizer', 'judge'));

-- 2. Allow judges to enter and update scores in scores table
DROP POLICY IF EXISTS "scores_insert_judge" ON public.scores;
CREATE POLICY "scores_insert_judge" ON public.scores
FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "scores_modify_judge" ON public.scores;
CREATE POLICY "scores_modify_judge" ON public.scores
FOR ALL TO public
USING (true);

-- Reload schema
NOTIFY pgrst, 'reload schema';
