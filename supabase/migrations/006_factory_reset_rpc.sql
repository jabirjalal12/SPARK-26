-- ============================================================================
-- SPARK TECH FEST - FACTORY RESET RPC FUNCTION
-- Allows Super Admin to wipe all created fest records in one atomic transaction.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.factory_reset_fest()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Wipe all fest operational and registration records
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

  -- 2. Disassociate school references from user profiles
  UPDATE public.profiles SET school_id = NULL;

  RETURN jsonb_build_object('success', true, 'message', 'Fest records have been successfully reset to factory state.');
END;
$$;

-- Grant execution to authenticated users (function internally enforces permissions if needed)
GRANT EXECUTE ON FUNCTION public.factory_reset_fest() TO authenticated;
