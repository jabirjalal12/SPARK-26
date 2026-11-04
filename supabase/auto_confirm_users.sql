-- ============================================================================
-- SPARK TECH FEST - AUTO-CONFIRM USER REGISTRATIONS
-- Ensures visiting faculty can immediately sign in without waiting for an email.
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aestqtbstvyhcpwkkyut/sql/new
-- ============================================================================

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
