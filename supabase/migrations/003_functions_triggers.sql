-- ============================================================================
-- SPARK TECH FEST MANAGER - FUNCTIONS & TRIGGERS
-- Automatic audit logging, score recalculation, and ticket token generator
-- ============================================================================

-- 1. AUDIT LOGGING TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $
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
$;

-- Apply audit triggers to key tables
DROP TRIGGER IF EXISTS trg_audit_schools ON public.schools;
CREATE TRIGGER trg_audit_schools AFTER INSERT OR UPDATE OR DELETE ON public.schools
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_students ON public.students;
CREATE TRIGGER trg_audit_students AFTER INSERT OR UPDATE OR DELETE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_checkins ON public.checkins;
CREATE TRIGGER trg_audit_checkins AFTER INSERT OR UPDATE OR DELETE ON public.checkins
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_scores ON public.scores;
CREATE TRIGGER trg_audit_scores AFTER INSERT OR UPDATE OR DELETE ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_results ON public.results;
CREATE TRIGGER trg_audit_results AFTER INSERT OR UPDATE OR DELETE ON public.results
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS trg_audit_organizer_roles ON public.organizer_roles;
CREATE TRIGGER trg_audit_organizer_roles AFTER INSERT OR UPDATE OR DELETE ON public.organizer_roles
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- 2. AUTOMATIC TICKET GENERATION ON SCHOOL APPROVAL
CREATE OR REPLACE FUNCTION public.generate_ticket_on_approval()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    random_token TEXT;
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        -- Generate random 32-character hex token
        random_token := encode(gen_random_bytes(16), 'hex');
        
        -- Insert into school_tickets if not already present
        IF NOT EXISTS (SELECT 1 FROM public.school_tickets WHERE school_id = NEW.id AND revoked_at IS NULL) THEN
            INSERT INTO public.school_tickets (school_id, token_hash)
            VALUES (NEW.id, 'TKT-' || NEW.code || '-' || UPPER(SUBSTRING(random_token, 1, 8)));
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_ticket ON public.schools;
CREATE TRIGGER trg_generate_ticket AFTER INSERT OR UPDATE OF status ON public.schools
FOR EACH ROW EXECUTE FUNCTION public.generate_ticket_on_approval();

-- 3. AUTOMATIC WEIGHTED TOTAL RECALCULATION
CREATE OR REPLACE FUNCTION public.recalculate_team_score()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    target_team_id UUID;
    target_track_id UUID;
    computed_weighted_score NUMERIC(5,2);
BEGIN
    target_team_id := COALESCE(NEW.team_id, OLD.team_id);
    SELECT track_id INTO target_track_id FROM public.teams WHERE id = target_team_id;

    -- Calculate sum(value * weight) / sum(weight)
    SELECT COALESCE(
        ROUND(SUM(s.value * c.weight) / NULLIF(SUM(c.weight), 0), 2),
        0.00
    ) INTO computed_weighted_score
    FROM public.scores s
    JOIN public.scoring_criteria c ON c.id = s.criterion_id
    WHERE s.team_id = target_team_id;

    -- Upsert result for team
    INSERT INTO public.results (track_id, team_id, rank, weighted_score)
    VALUES (target_track_id, target_team_id, 1, computed_weighted_score)
    ON CONFLICT (track_id, team_id) DO UPDATE
    SET weighted_score = computed_weighted_score;

    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_recalculate_score ON public.scores;
CREATE TRIGGER trg_recalculate_score AFTER INSERT OR UPDATE OR DELETE ON public.scores
FOR EACH ROW EXECUTE FUNCTION public.recalculate_team_score();
