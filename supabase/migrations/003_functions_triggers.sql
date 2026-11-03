-- ==============================================================================
-- MAKE//BREAK DATABASE FUNCTIONS & TRIGGERS - 003_functions_triggers.sql
-- Handles auth hooks, audit logging, realtime, and result calculations
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AUTH HOOK: Handle New User Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    v_role TEXT;
    v_school_id UUID;
    v_full_name TEXT;
    v_phone TEXT;
    v_approved BOOLEAN;
    v_track_id UUID;
BEGIN
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'faculty');
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    v_phone := NEW.raw_user_meta_data->>'phone';
    
    -- Parse optional school_id or track_id
    IF NEW.raw_user_meta_data->>'school_id' IS NOT NULL THEN
        v_school_id := (NEW.raw_user_meta_data->>'school_id')::UUID;
    END IF;

    IF NEW.raw_user_meta_data->>'assigned_track_id' IS NOT NULL THEN
        v_track_id := (NEW.raw_user_meta_data->>'assigned_track_id')::UUID;
    END IF;

    -- Organizers and participants default to approved. Faculty, volunteer, judge accounts require organizer approval.
    IF v_role = 'organizer' OR v_role = 'participant' THEN
        v_approved := TRUE;
    ELSE
        v_approved := COALESCE((NEW.raw_user_meta_data->>'approved')::BOOLEAN, FALSE);
    END IF;

    INSERT INTO public.profiles (
        id,
        role,
        school_id,
        full_name,
        email,
        phone,
        avatar_url,
        approved,
        assigned_track_id,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        v_role,
        v_school_id,
        v_full_name,
        NEW.email,
        v_phone,
        NEW.raw_user_meta_data->>'avatar_url',
        v_approved,
        v_track_id,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        updated_at = NOW();

    -- If a faculty member created a school during registration, link it
    IF v_school_id IS NOT NULL AND v_role = 'faculty' THEN
        UPDATE public.schools 
        SET faculty_id = NEW.id 
        WHERE id = v_school_id AND faculty_id IS NULL;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. AUDIT LOGGING TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    v_action TEXT;
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
    v_record_id UUID := NULL;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_action := 'DELETE';
        v_old_data := to_jsonb(OLD);
        v_record_id := OLD.id;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_action := 'UPDATE';
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        v_record_id := NEW.id;
    ELSIF (TG_OP = 'INSERT') THEN
        v_action := 'INSERT';
        v_new_data := to_jsonb(NEW);
        v_record_id := NEW.id;
    END IF;

    INSERT INTO public.audit_log (
        actor_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        created_at
    ) VALUES (
        auth.uid(),
        v_action,
        TG_TABLE_NAME,
        v_record_id,
        v_old_data,
        v_new_data,
        NOW()
    );

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- Attach audit log triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_schools ON public.schools;
CREATE TRIGGER audit_schools
AFTER INSERT OR UPDATE OR DELETE ON public.schools
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_scores ON public.scores;
CREATE TRIGGER audit_scores
AFTER INSERT OR UPDATE OR DELETE ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_results ON public.results;
CREATE TRIGGER audit_results
AFTER INSERT OR UPDATE OR DELETE ON public.results
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_announcements ON public.announcements;
CREATE TRIGGER audit_announcements
AFTER INSERT OR UPDATE OR DELETE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- ------------------------------------------------------------------------------
-- 3. LEADERBOARD RECALCULATION FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalculate_track_results(p_track_id UUID)
RETURNS VOID 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    -- Recalculate weighted total scores for all teams in the track
    WITH team_totals AS (
        SELECT 
            t.id AS team_id,
            t.track_id,
            COALESCE(
                SUM(s.value * sc.weight) / NULLIF(COUNT(DISTINCT s.judge_id), 0),
                0
            ) AS computed_score
        FROM public.teams t
        JOIN public.scoring_criteria sc ON sc.track_id = t.track_id
        LEFT JOIN public.scores s ON s.team_id = t.id AND s.criterion_id = sc.id
        WHERE t.track_id = p_track_id
        GROUP BY t.id, t.track_id
    ),
    ranked_teams AS (
        SELECT 
            team_id,
            track_id,
            computed_score,
            DENSE_RANK() OVER (ORDER BY computed_score DESC) as computed_rank
        FROM team_totals
    )
    INSERT INTO public.results (track_id, team_id, total_score, rank, updated_at)
    SELECT track_id, team_id, computed_score, computed_rank, NOW()
    FROM ranked_teams
    ON CONFLICT (track_id, team_id) DO UPDATE SET
        total_score = EXCLUDED.total_score,
        rank = EXCLUDED.rank,
        updated_at = NOW();
END;
$$;

-- Trigger to recalculate results when a score changes
CREATE OR REPLACE FUNCTION public.trigger_recalc_on_score()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    v_track_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        SELECT track_id INTO v_track_id FROM public.teams WHERE id = OLD.team_id;
    ELSE
        SELECT track_id INTO v_track_id FROM public.teams WHERE id = NEW.team_id;
    END IF;

    IF v_track_id IS NOT NULL THEN
        PERFORM public.recalculate_track_results(v_track_id);
    END IF;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS recalc_results_after_score ON public.scores;
CREATE TRIGGER recalc_results_after_score
AFTER INSERT OR UPDATE OR DELETE ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.trigger_recalc_on_score();

-- ------------------------------------------------------------------------------
-- 4. REALTIME PUBLICATION SETUP
-- ------------------------------------------------------------------------------
-- Enable replication for live updates on client
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schools;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.checkins;
