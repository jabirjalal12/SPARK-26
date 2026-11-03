-- ============================================================================
-- SPARK TECH FEST MANAGER - CORE CONFIGURATION
-- Competition Tracks & Criteria (All Events, Venues, and Notices are added by Admin)
-- ============================================================================

-- 1. COMPETITION TRACKS
INSERT INTO public.tracks (id, name, slug, color, description, rules) VALUES
('11111111-1111-1111-1111-111111111111', 'Robotics Arena', 'robotics', '#1E40AF', 
 'Design, construct, and field autonomous or wired rovers to navigate brutal obstacles, ramp ascents, and high-precision payload challenges.',
 '1. Robot chassis must fit within 300mm x 300mm x 300mm bounding box at scrutiny.
2. Battery voltage capped at 12V DC nominal.
3. No IC engines or combustive propellants permitted.
4. Maximum 2 student operators per arena heat.'),

('22222222-2222-2222-2222-222222222222', 'Build from Scrap', 'build-from-scrap', '#166534', 
 'Transform unadulterated junkyard scrap, discarded motors, and e-waste into working, functional electro-mechanical machines on the clock.',
 '1. 100% of base materials must be sourced from the allotment junkyard dump.
2. Fasteners, adhesives, and wiring provided at central tool station.
3. 4-hour strict build window. No pre-assembled subsystems permitted.
4. Working prototype demonstration required during judging.'),

('33333333-3333-3333-3333-333333333333', 'Useless Projects', 'useless-projects', '#991B1B', 
 'Channel peak over-engineering absurdity to engineer hyper-complex, impeccably fabricated machines that solve utterly trivial problems.',
 '1. Machine must genuinely function and perform its stated useless task with zero human intervention.
2. Must integrate at least one active electronic, micro-controller, or mechanical actuator.
3. 3-minute deadpan stage pitch required before judges.
4. Safety scrutiny applies: no mains AC voltage or hazardous chemicals.')
ON CONFLICT (id) DO NOTHING;

-- 2. SCORING CRITERIA
INSERT INTO public.scoring_criteria (id, track_id, name, weight, max_score) VALUES
('aa1', '11111111-1111-1111-1111-111111111111', 'Autonomous Execution & Navigation', 0.40, 10),
('aa2', '11111111-1111-1111-1111-111111111111', 'Mechanical Chassis & Wiring Integrity', 0.30, 10),
('aa3', '11111111-1111-1111-1111-111111111111', 'Course Speed & Obstacle Handling', 0.30, 10),

('bb1', '22222222-2222-2222-2222-222222222222', 'Scrap Resourcefulness & Re-use Ratio', 0.35, 10),
('bb2', '22222222-2222-2222-2222-222222222222', 'Functional Output & Working Prototype', 0.35, 10),
('bb3', '22222222-2222-2222-2222-222222222222', 'Structural Rigidity & Craft Finish', 0.30, 10),

('cc1', '33333333-3333-3333-3333-333333333333', 'Concept Absurdity & Novelty', 0.40, 10),
('cc2', '33333333-3333-3333-3333-333333333333', 'Technical Over-engineering & Circuitry', 0.40, 10),
('cc3', '33333333-3333-3333-3333-333333333333', 'Deadpan Stage Presentation', 0.20, 10)
ON CONFLICT (id) DO NOTHING;
