-- ==============================================================================
-- MAKE//BREAK DATABASE RLS POLICIES - 002_rls_policies.sql
-- Role-based Row Level Security
-- Roles: 'organizer', 'faculty', 'volunteer', 'judge', 'participant'
-- ==============================================================================

-- Helper Security Definer Functions to avoid recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_profile()
RETURNS TABLE (
    id UUID,
    role TEXT,
    school_id UUID,
    approved BOOLEAN,
    assigned_track_id UUID
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
    SELECT id, role, school_id, approved, assigned_track_id 
    FROM public.profiles 
    WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.current_user_school_id()
RETURNS UUID 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
    SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_organizer()
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'organizer' AND approved = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'faculty' AND approved = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_volunteer()
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'volunteer' AND approved = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_judge()
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'judge' AND approved = true
    );
$$;

-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_duties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. SETTINGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can read settings"
ON public.settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Organizers manage settings"
ON public.settings FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 2. TRACKS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can read tracks"
ON public.tracks FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Organizers manage tracks"
ON public.tracks FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 3. SCORING CRITERIA POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can read scoring criteria"
ON public.scoring_criteria FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Organizers manage scoring criteria"
ON public.scoring_criteria FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 4. VENUES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can read venues"
ON public.venues FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Organizers manage venues"
ON public.venues FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 5. SCHOOLS POLICIES
-- ------------------------------------------------------------------------------
-- Public/students need to read approved school names and codes to join
CREATE POLICY "Public and users can view approved schools"
ON public.schools FOR SELECT
TO anon, authenticated
USING (
    approved = true 
    OR public.is_organizer() 
    OR public.is_volunteer()
    OR (public.is_faculty() AND id = public.current_user_school_id())
    OR faculty_id = auth.uid()
);

-- Faculty can register their school during registration
CREATE POLICY "Authenticated users can insert school on registration"
ON public.schools FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Faculty can update their own school"
ON public.schools FOR UPDATE
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_faculty() AND id = public.current_user_school_id())
    OR faculty_id = auth.uid()
)
WITH CHECK (
    public.is_organizer() 
    OR (public.is_faculty() AND id = public.current_user_school_id())
    OR faculty_id = auth.uid()
);

CREATE POLICY "Organizers can delete schools"
ON public.schools FOR DELETE
TO authenticated
USING (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 6. PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (
    id = auth.uid() 
    OR public.is_organizer()
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR public.is_organizer());

CREATE POLICY "Users can update own basic profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.is_organizer())
WITH CHECK (
    (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())) 
    OR public.is_organizer()
);

CREATE POLICY "Organizers can delete profiles"
ON public.profiles FOR DELETE
TO authenticated
USING (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 7. TEAMS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view teams"
ON public.teams FOR SELECT
TO anon, authenticated
USING (
    public.is_organizer() 
    OR public.is_volunteer() 
    OR public.is_judge()
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
    OR EXISTS (
        SELECT 1 FROM public.students s 
        WHERE s.team_id = public.teams.id 
        AND s.user_id = auth.uid()
    )
);

CREATE POLICY "Faculty can manage their school teams"
ON public.teams FOR INSERT
TO authenticated
WITH CHECK (
    public.is_organizer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
);

CREATE POLICY "Faculty can update their school teams"
ON public.teams FOR UPDATE
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
)
WITH CHECK (
    public.is_organizer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
);

CREATE POLICY "Faculty can delete their school teams"
ON public.teams FOR DELETE
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
);

-- ------------------------------------------------------------------------------
-- 8. STUDENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "View students policy"
ON public.students FOR SELECT
TO anon, authenticated
USING (
    public.is_organizer() 
    OR public.is_volunteer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
    OR user_id = auth.uid()
    OR (
        -- Allow lookup by school code during join
        EXISTS (
            SELECT 1 FROM public.schools sc 
            WHERE sc.id = public.students.school_id AND sc.approved = true
        )
    )
);

CREATE POLICY "Faculty can insert students for their school"
ON public.students FOR INSERT
TO authenticated
WITH CHECK (
    public.is_organizer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
);

CREATE POLICY "Faculty can update their students"
ON public.students FOR UPDATE
TO authenticated
USING (
    public.is_organizer() 
    OR public.is_volunteer() -- for checking in
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
    OR user_id = auth.uid()
    OR (user_id IS NULL AND auth.uid() IS NOT NULL) -- for linking student record on join
)
WITH CHECK (
    public.is_organizer() 
    OR public.is_volunteer()
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
    OR user_id = auth.uid()
);

CREATE POLICY "Faculty can delete their students"
ON public.students FOR DELETE
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
);

-- ------------------------------------------------------------------------------
-- 9. SCHEDULE ITEMS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view schedule items"
ON public.schedule_items FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Organizers manage schedule items"
ON public.schedule_items FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 10. ANNOUNCEMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "View announcements policy"
ON public.announcements FOR SELECT
TO anon, authenticated
USING (
    published = true AND (
        audience = 'all'
        OR (audience = 'faculty' AND public.is_faculty())
        OR (audience = 'volunteers' AND public.is_volunteer())
        OR (audience = 'track' AND (
            public.is_organizer() 
            OR public.is_judge()
            OR public.is_volunteer()
            OR EXISTS (
                SELECT 1 FROM public.students s 
                WHERE s.user_id = auth.uid() AND s.track_id = public.announcements.track_id
            )
        ))
    )
    OR public.is_organizer()
);

CREATE POLICY "Organizers manage announcements"
ON public.announcements FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 11. CHECKINS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "View checkins policy"
ON public.checkins FOR SELECT
TO authenticated
USING (
    public.is_organizer() 
    OR public.is_volunteer() 
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
);

CREATE POLICY "Volunteers and Organizers can insert checkins"
ON public.checkins FOR INSERT
TO authenticated
WITH CHECK (public.is_organizer() OR public.is_volunteer());

CREATE POLICY "Organizers can delete checkins"
ON public.checkins FOR DELETE
TO authenticated
USING (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 12. VOLUNTEER DUTIES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "View volunteer duties"
ON public.volunteer_duties FOR SELECT
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_volunteer() AND volunteer_id = auth.uid())
);

CREATE POLICY "Organizers manage volunteer duties"
ON public.volunteer_duties FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 13. SCORES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "View scores policy"
ON public.scores FOR SELECT
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_judge() AND judge_id = auth.uid())
);

CREATE POLICY "Judges can insert scores for their assigned tracks"
ON public.scores FOR INSERT
TO authenticated
WITH CHECK (
    public.is_organizer() 
    OR (
        public.is_judge() 
        AND judge_id = auth.uid()
        AND locked = false
        AND EXISTS (
            SELECT 1 FROM public.teams t
            JOIN public.profiles p ON p.id = auth.uid()
            WHERE t.id = public.scores.team_id 
            AND (p.assigned_track_id IS NULL OR p.assigned_track_id = t.track_id)
        )
    )
);

CREATE POLICY "Judges can update scores if not locked"
ON public.scores FOR UPDATE
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_judge() AND judge_id = auth.uid() AND locked = false)
)
WITH CHECK (
    public.is_organizer() 
    OR (public.is_judge() AND judge_id = auth.uid() AND locked = false)
);

CREATE POLICY "Organizers manage all scores"
ON public.scores FOR DELETE
TO authenticated
USING (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 14. RESULTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view published results"
ON public.results FOR SELECT
TO anon, authenticated
USING (published = true OR public.is_organizer());

CREATE POLICY "Organizers manage results"
ON public.results FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 15. ISSUE REPORTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "View issue reports"
ON public.issue_reports FOR SELECT
TO authenticated
USING (
    public.is_organizer() 
    OR (public.is_volunteer() AND reporter_id = auth.uid())
);

CREATE POLICY "Volunteers and Organizers can report issues"
ON public.issue_reports FOR INSERT
TO authenticated
WITH CHECK (public.is_organizer() OR public.is_volunteer());

CREATE POLICY "Organizers can update issue reports"
ON public.issue_reports FOR UPDATE
TO authenticated
USING (public.is_organizer() OR (public.is_volunteer() AND reporter_id = auth.uid()))
WITH CHECK (public.is_organizer() OR (public.is_volunteer() AND reporter_id = auth.uid()));

CREATE POLICY "Organizers can delete issue reports"
ON public.issue_reports FOR DELETE
TO authenticated
USING (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 16. AUDIT LOG POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Only organizers can view audit log"
ON public.audit_log FOR SELECT
TO authenticated
USING (public.is_organizer());

-- ------------------------------------------------------------------------------
-- 17. CERTIFICATES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "View certificates"
ON public.certificates FOR SELECT
TO authenticated
USING (
    public.is_organizer()
    OR (public.is_faculty() AND school_id = public.current_user_school_id())
    OR EXISTS (
        SELECT 1 FROM public.students s 
        WHERE s.id = public.certificates.student_id AND s.user_id = auth.uid()
    )
);

CREATE POLICY "Organizers manage certificates"
ON public.certificates FOR ALL
TO authenticated
USING (public.is_organizer())
WITH CHECK (public.is_organizer());
