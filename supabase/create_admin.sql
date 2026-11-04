CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id uuid;
  v_email text := 'admin@spark.in';
  v_password text := '123456';
  v_encrypted_pw text;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    v_encrypted_pw := crypt(v_password, gen_salt('bf', 10));

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
      confirmation_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      v_email,
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Lead Organizer"}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now(),
      ''
    );

    BEGIN
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
        v_user_id::text,
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_email),
        'email',
        v_email,
        now(),
        now(),
        now()
      );
    EXCEPTION WHEN undefined_column THEN
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        v_user_id::text,
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_email),
        'email',
        now(),
        now(),
        now()
      );
    END;
  ELSE
    UPDATE auth.users
    SET 
      encrypted_password = crypt(v_password, gen_salt('bf', 10)),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
    WHERE id = v_user_id;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_user_id, v_email, 'Lead Organizer', 'organizer')
  ON CONFLICT (id) DO UPDATE SET 
    role = 'organizer',
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;

  INSERT INTO public.organizer_roles (user_id, sub_role)
  VALUES (v_user_id, 'super_admin')
  ON CONFLICT (user_id, sub_role) DO NOTHING;

  RAISE NOTICE 'SUCCESS: admin@spark.in configured with password 123456 and Super Admin role! UUID: %', v_user_id;
END $$;
