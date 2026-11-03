-- ============================================================================
-- MAKE//BREAK TECH FEST MANAGER - ROW LEVEL SECURITY (RLS) POLICIES
-- Strict role and sub-role matrix enforcement at Postgres database level
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_duties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SECURITY DEFINER HELPER FUNCTIONS
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_school_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_organizer_sub_role(req_sub_role TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organizer_roles
        WHERE user_id = auth.uid() AND sub_role = req_sub_role
    );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT (public.get_auth_role() = 'organizer') AND public.is_organizer_sub_role('super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_event_coordinator()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT (public.get_auth_role() = 'organizer') AND (
        public.is_organizer_sub_role('event_coordinator') OR public.is_organizer_sub_role('super_admin')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_registration_head()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT (public.get_auth_role() = 'organizer') AND (
        public.is_organizer_sub_role('registration_head') OR public.is_organizer_sub_role('super_admin')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_volunteer()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT public.get_auth_role() = 'volunteer';
$$;

CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT public.get_auth_role() = 'faculty';
$$;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.get_auth_role() = 'organizer');

CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.is_super_admin());

-- ----------------------------------------------------------------------------
-- ORGANIZER ROLES POLICIES (SA manages, EC/RH view)
-- ----------------------------------------------------------------------------
CREATE POLICY "organizer_roles_select" ON public.organizer_roles FOR SELECT TO authenticated
USING (public.get_auth_role() = 'organizer');

CREATE POLICY "organizer_roles_modify_sa" ON public.organizer_roles FOR ALL TO authenticated
USING (public.is_super_admin());

-- ----------------------------------------------------------------------------
-- SCHOOLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "schools_select" ON public.schools FOR SELECT TO authenticated
USING (
    public.get_auth_role() = 'organizer'
    OR public.is_volunteer()
    OR (public.is_faculty() AND id = public.get_auth_school_id())
);

CREATE POLICY "schools_insert_public" ON public.schools FOR INSERT TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "schools_update_admin" ON public.schools FOR UPDATE TO authenticated
USING (
    public.is_registration_head()
    OR (public.is_faculty() AND id = public.get_auth_school_id())
);

-- ----------------------------------------------------------------------------
-- SCHOOL TICKETS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "tickets_select" ON public.school_tickets FOR SELECT TO authenticated
USING (
    public.get_auth_role() = 'organizer'
    OR public.is_volunteer()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

CREATE POLICY "tickets_modify_rh_sa" ON public.school_tickets FOR ALL TO authenticated
USING (public.is_registration_head());

-- ----------------------------------------------------------------------------
-- STUDENTS POLICIES (Minors: NO public access; faculty only own school)
-- ----------------------------------------------------------------------------
CREATE POLICY "students_select" ON public.students FOR SELECT TO authenticated
USING (
    public.get_auth_role() = 'organizer'
    OR public.is_volunteer()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

CREATE POLICY "students_insert" ON public.students FOR INSERT TO authenticated
WITH CHECK (
    public.is_registration_head()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

CREATE POLICY "students_update" ON public.students FOR UPDATE TO authenticated
USING (
    public.is_registration_head()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

CREATE POLICY "students_delete" ON public.students FOR DELETE TO authenticated
USING (
    public.is_registration_head()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

-- ----------------------------------------------------------------------------
-- TEAMS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "teams_select" ON public.teams FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "teams_modify" ON public.teams FOR ALL TO authenticated
USING (
    public.is_registration_head()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

-- ----------------------------------------------------------------------------
-- CHECKINS POLICIES (Volunteer / Organizer desk checkin; Undo by SA/RH only)
-- ----------------------------------------------------------------------------
CREATE POLICY "checkins_select" ON public.checkins FOR SELECT TO authenticated
USING (
    public.get_auth_role() = 'organizer'
    OR public.is_volunteer()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

CREATE POLICY "checkins_insert" ON public.checkins FOR INSERT TO authenticated
WITH CHECK (
    public.is_volunteer() OR public.get_auth_role() = 'organizer'
);

CREATE POLICY "checkins_update_undo" ON public.checkins FOR UPDATE TO authenticated
USING (public.is_registration_head());

-- ----------------------------------------------------------------------------
-- SCORES POLICIES (Writable by SA and EC until locked)
-- ----------------------------------------------------------------------------
CREATE POLICY "scores_select" ON public.scores FOR SELECT TO authenticated
USING (
    public.get_auth_role() = 'organizer'
    OR EXISTS (SELECT 1 FROM public.results r WHERE r.is_published = true)
);

CREATE POLICY "scores_insert_update" ON public.scores FOR ALL TO authenticated
USING (
    (public.is_event_coordinator() OR public.is_super_admin())
    AND NOT EXISTS (
        SELECT 1 FROM public.teams t
        JOIN public.tracks tr ON tr.id = t.track_id
        WHERE t.id = scores.team_id AND tr.scores_locked = true
    )
);

-- ----------------------------------------------------------------------------
-- RESULTS POLICIES (SA only to lock/publish)
-- ----------------------------------------------------------------------------
CREATE POLICY "results_select" ON public.results FOR SELECT TO anon, authenticated
USING (is_published = true OR public.get_auth_role() = 'organizer');

CREATE POLICY "results_modify_sa" ON public.results FOR ALL TO authenticated
USING (public.is_super_admin());

-- ----------------------------------------------------------------------------
-- ANNOUNCEMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT TO anon, authenticated
USING (
    audience = 'all'
    OR (audience = 'faculty' AND (public.is_faculty() OR public.get_auth_role() = 'organizer'))
    OR (audience = 'volunteers' AND (public.is_volunteer() OR public.get_auth_role() = 'organizer'))
);

CREATE POLICY "announcements_modify" ON public.announcements FOR ALL TO authenticated
USING (public.is_event_coordinator());

-- ----------------------------------------------------------------------------
-- SCHEDULE & VENUES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "schedule_select" ON public.schedule_items FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "schedule_modify" ON public.schedule_items FOR ALL TO authenticated
USING (public.is_event_coordinator());

CREATE POLICY "venues_select" ON public.venues FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "venues_modify" ON public.venues FOR ALL TO authenticated
USING (public.is_event_coordinator());

-- ----------------------------------------------------------------------------
-- VOLUNTEER DUTIES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "duties_select" ON public.volunteer_duties FOR SELECT TO authenticated
USING (volunteer_id = auth.uid() OR public.get_auth_role() = 'organizer');

CREATE POLICY "duties_modify" ON public.volunteer_duties FOR ALL TO authenticated
USING (public.is_event_coordinator());

-- ----------------------------------------------------------------------------
-- ISSUE REPORTS & GALLERY POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "issues_select" ON public.issue_reports FOR SELECT TO authenticated
USING (reported_by = auth.uid() OR public.get_auth_role() = 'organizer');

CREATE POLICY "issues_insert" ON public.issue_reports FOR INSERT TO authenticated
WITH CHECK (public.is_volunteer() OR public.get_auth_role() = 'organizer');

CREATE POLICY "issues_update" ON public.issue_reports FOR UPDATE TO authenticated
USING (public.is_event_coordinator());

CREATE POLICY "gallery_select" ON public.gallery FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "gallery_modify" ON public.gallery FOR ALL TO authenticated
USING (public.is_event_coordinator());

-- ----------------------------------------------------------------------------
-- AUDIT LOG POLICIES (SA and EC view only)
-- ----------------------------------------------------------------------------
CREATE POLICY "audit_log_select" ON public.audit_log FOR SELECT TO authenticated
USING (public.is_super_admin() OR public.is_event_coordinator());

-- ----------------------------------------------------------------------------
-- CERTIFICATES POLICIES (Faculty can download own; SA generates)
-- ----------------------------------------------------------------------------
CREATE POLICY "certificates_select" ON public.certificates FOR SELECT TO authenticated
USING (
    public.is_super_admin()
    OR (public.is_faculty() AND school_id = public.get_auth_school_id())
);

CREATE POLICY "certificates_modify_sa" ON public.certificates FOR ALL TO authenticated
USING (public.is_super_admin());
