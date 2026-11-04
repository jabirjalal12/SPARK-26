-- ============================================================================
-- SPARK TECH FEST - PROVISION ALL DEFAULT ACCOUNTS
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aestqtbstvyhcpwkkyut/sql/new
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper function to provision or reset an account safely
CREATE OR REPLACE FUNCTION public.provision_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text,
  p_sub_role text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id uuid;
  v_encrypted_pw text;
BEGIN
  -- 1. Find or create auth user
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
  v_encrypted_pw := crypt(p_password, gen_salt('bf', 10));

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      p_email,
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', p_full_name, 'role', p_role),
      'authenticated',
      'authenticated',
      now(),
      now(),
      '',
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', p_email),
      'email',
      v_user_id::text,
      now(),
      now(),
      now()
    );
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = v_encrypted_pw,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      confirmation_token = COALESCE(confirmation_token, ''),
      recovery_token = COALESCE(recovery_token, ''),
      email_change_token_new = COALESCE(email_change_token_new, ''),
      email_change = COALESCE(email_change, ''),
      email_change_token_current = COALESCE(email_change_token_current, ''),
      updated_at = now()
    WHERE id = v_user_id;
  END IF;

  -- 2. Upsert profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_user_id, p_email, p_full_name, p_role)
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;

  -- 3. If organizer, insert sub_role
  IF p_role = 'organizer' AND p_sub_role IS NOT NULL THEN
    INSERT INTO public.organizer_roles (user_id, sub_role)
    VALUES (v_user_id, p_sub_role)
    ON CONFLICT (user_id, sub_role) DO NOTHING;
  END IF;

  RETURN v_user_id;
END;
$$;

-- Provision all essential staff accounts:
SELECT public.provision_user('admin@spark.in', '123456', 'Super Administrator', 'organizer', 'super_admin');
SELECT public.provision_user('admin@spark.edu', '123456', 'Super Administrator', 'organizer', 'super_admin');
SELECT public.provision_user('judge@spark.in', '123456', 'Dr. Evelyn Reed (Chief Jury)', 'judge');
SELECT public.provision_user('volunteer@spark.in', '123456', 'Campus Operations Volunteer', 'volunteer');
SELECT public.provision_user('faculty@spark.in', '123456', 'Visiting Faculty Coordinator', 'faculty');

-- Reload schema
NOTIFY pgrst, 'reload schema';
