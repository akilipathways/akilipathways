-- =============================================
-- AKILI PATHWAYS™ COMPLETE DATABASE SCHEMA
-- Version: 3.0
-- For: KNEC Psychometric Integration & Longitudinal Assessment
-- =============================================

-- =============================================
-- PART 1: CORE REFERENCE DATA
-- =============================================

-- 1.1 PATHWAYS (EXACT 3)
CREATE TABLE IF NOT EXISTS pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (name IN ('STEM', 'SOCIAL SCIENCES', 'ARTS & SPORTS SCIENCE')),
  code TEXT UNIQUE NOT NULL CHECK (code IN ('STEM', 'SOSC', 'ARTS')),
  description TEXT,
  icon TEXT,
  color TEXT,
  national_target_percentage INTEGER, -- STEM: 60-70%, SOSC: 25%, ARTS: 15%
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert pathways if not exists
INSERT INTO pathways (name, code, description, color, national_target_percentage) VALUES
('STEM', 'STEM', 'Science, Technology, Engineering & Mathematics', '#2C5AA0', 65),
('SOCIAL SCIENCES', 'SOSC', 'Humanities, Business, Languages & Literature', '#0D9276', 25),
('ARTS & SPORTS SCIENCE', 'ARTS', 'Creative Arts, Performing Arts, Sports Science', '#D97706', 10)
ON CONFLICT (code) DO NOTHING;

-- 1.2 TRACKS (Ministry Defined)
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID REFERENCES pathways(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  UNIQUE(pathway_id, name)
);

-- Insert STEM Tracks
INSERT INTO tracks (pathway_id, name, code, description)
SELECT id, 'PURE SCIENCES', 'PURE_SCI', 'Biology, Chemistry, Physics, Mathematics'
FROM pathways WHERE code = 'STEM'
ON CONFLICT (code) DO NOTHING;

INSERT INTO tracks (pathway_id, name, code, description)
SELECT id, 'APPLIED SCIENCES', 'APP_SCI', 'Agriculture, Computer Studies, Aviation, Marine'
FROM pathways WHERE code = 'STEM'
ON CONFLICT (code) DO NOTHING;

INSERT INTO tracks (pathway_id, name, code, description)
SELECT id, 'TECHNICAL STUDIES', 'TECH', 'Building, Electrical, Metal, Wood, Power Mechanics'
FROM pathways WHERE code = 'STEM'
ON CONFLICT (code) DO NOTHING;

-- Insert Social Sciences Tracks
INSERT INTO tracks (pathway_id, name, code, description)
SELECT id, 'LANGUAGES & LITERATURE', 'LANG_LIT', 'English, Kiswahili, French, German, Mandarin, Literature'
FROM pathways WHERE code = 'SOSC'
ON CONFLICT (code) DO NOTHING;

INSERT INTO tracks (pathway_id, name, code, description)
SELECT id, 'HUMANITIES & BUSINESS STUDIES', 'HUM_BUS', 'History, Geography, CRE, IRE, Business Studies, Economics'
FROM pathways WHERE code = 'SOSC'
ON CONFLICT (code) DO NOTHING;

-- Insert Arts & Sports Tracks
INSERT INTO tracks (pathway_id, name, code, description)
SELECT id, 'ARTS', 'ARTS_T', 'Fine Art, Music, Theatre, Dance, Film'
FROM pathways WHERE code = 'ARTS'
ON CONFLICT (code) DO NOTHING;

INSERT INTO tracks (pathway_id, name, code, description)
SELECT id, 'SPORTS SCIENCE', 'SPORTS', 'Physical Education, Sports Management, Recreation'
FROM pathways WHERE code = 'ARTS'
ON CONFLICT (code) DO NOTHING;

-- 1.3 SUBJECT COMBINATIONS (ST-CODES)
CREATE TABLE IF NOT EXISTS subject_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  subjects TEXT[] NOT NULL,
  subject_count INTEGER GENERATED ALWAYS AS (array_length(subjects, 1)) STORED,
  career_clusters TEXT[],
  difficulty_rating DECIMAL(2,1) CHECK (difficulty_rating BETWEEN 1 AND 5),
  demand_level TEXT CHECK (demand_level IN ('HIGH', 'MEDIUM', 'LOW')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sample STEM combinations (ST-codes)
INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1004', ARRAY['Mathematics', 'Biology', 'Chemistry'], 
  ARRAY['Medicine', 'Pharmacy', 'Nursing', 'Laboratory Sciences'], 4.5, 'HIGH'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1035', ARRAY['Mathematics', 'Electricity', 'Physics'], 
  ARRAY['Electrical Engineering', 'Electronics', 'Telecommunications'], 4.2, 'HIGH'
FROM tracks WHERE code = 'TECH'
ON CONFLICT (code) DO NOTHING;

-- Real STEM Combinations from Ministry Portal
INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1044', ARRAY['Biology', 'Building & Construction', 'Chemistry'], 
  ARRAY['Construction Management', 'Civil Engineering', 'Architecture'], 4.3, 'MEDIUM'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1042', ARRAY['Agriculture', 'Biology', 'Chemistry'], 
  ARRAY['Agricultural Science', 'Botany', 'Food Science'], 4.0, 'MEDIUM'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1026', ARRAY['Core Mathematics', 'Business Studies', 'General Science'], 
  ARRAY['Business Administration', 'Economics', 'Statistics'], 3.8, 'HIGH'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1035', ARRAY['Core Mathematics', 'Electricity', 'Physics'], 
  ARRAY['Electrical Engineering', 'Physics', 'Telecommunications'], 4.4, 'HIGH'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1005', ARRAY['Core Mathematics', 'Biology', 'Building & Construction'], 
  ARRAY['Architecture', 'Quantity Surveying', 'Construction'], 4.2, 'MEDIUM'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1016', ARRAY['Core Mathematics', 'Chemistry', 'Geography'], 
  ARRAY['Geology', 'Environmental Science', 'Mining Engineering'], 4.1, 'MEDIUM'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;

INSERT INTO subject_combinations (track_id, code, subjects, career_clusters, difficulty_rating, demand_level)
SELECT id, 'ST1043', ARRAY['Aviation', 'Biology', 'Chemistry'], 
  ARRAY['Aeronautical Engineering', 'Pilot', 'Aviation Management'], 4.8, 'HIGH'
FROM tracks WHERE code = 'PURE_SCI'
ON CONFLICT (code) DO NOTHING;


-- 1.4 KENYA COUNTIES (47)
CREATE TABLE IF NOT EXISTS kenya_counties (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE,
  region TEXT,
  headquarters TEXT
);

-- Insert 47 counties
INSERT INTO kenya_counties (name, code, region, headquarters) VALUES
('Mombasa', '001', 'Coast', 'Mombasa'),
('Kwale', '002', 'Coast', 'Kwale'),
('Kilifi', '003', 'Coast', 'Kilifi'),
('Tana River', '004', 'Coast', 'Hola'),
('Lamu', '005', 'Coast', 'Lamu'),
('Taita-Taveta', '006', 'Coast', 'Voi'),
('Garissa', '007', 'North Eastern', 'Garissa'),
('Wajir', '008', 'North Eastern', 'Wajir'),
('Mandera', '009', 'North Eastern', 'Mandera'),
('Marsabit', '010', 'Eastern', 'Marsabit'),
('Isiolo', '011', 'Eastern', 'Isiolo'),
('Meru', '012', 'Eastern', 'Meru'),
('Tharaka-Nithi', '013', 'Eastern', 'Chuka'),
('Embu', '014', 'Eastern', 'Embu'),
('Kitui', '015', 'Eastern', 'Kitui'),
('Machakos', '016', 'Eastern', 'Machakos'),
('Makueni', '017', 'Eastern', 'Wote'),
('Nyandarua', '018', 'Central', 'Ol Kalou'),
('Nyeri', '019', 'Central', 'Nyeri'),
('Kirinyaga', '020', 'Central', 'Kerugoya'),
('Murang''a', '021', 'Central', 'Murang''a'),
('Kiambu', '022', 'Central', 'Kiambu'),
('Turkana', '023', 'Rift Valley', 'Lodwar'),
('West Pokot', '024', 'Rift Valley', 'Kapenguria'),
('Samburu', '025', 'Rift Valley', 'Maralal'),
('Trans Nzoia', '026', 'Rift Valley', 'Kitale'),
('Uasin Gishu', '027', 'Rift Valley', 'Eldoret'),
('Elgeyo-Marakwet', '028', 'Rift Valley', 'Iten'),
('Nandi', '029', 'Rift Valley', 'Kapsabet'),
('Baringo', '030', 'Rift Valley', 'Kabarnet'),
('Laikipia', '031', 'Rift Valley', 'Rumuruti'),
('Nakuru', '032', 'Rift Valley', 'Nakuru'),
('Narok', '033', 'Rift Valley', 'Narok'),
('Kajiado', '034', 'Rift Valley', 'Kajiado'),
('Kericho', '035', 'Rift Valley', 'Kericho'),
('Bomet', '036', 'Rift Valley', 'Bomet'),
('Kakamega', '037', 'Western', 'Kakamega'),
('Vihiga', '038', 'Western', 'Vihiga'),
('Bungoma', '039', 'Western', 'Bungoma'),
('Busia', '040', 'Western', 'Busia'),
('Siaya', '041', 'Nyanza', 'Siaya'),
('Kisumu', '042', 'Nyanza', 'Kisumu'),
('Homa Bay', '043', 'Nyanza', 'Homa Bay'),
('Migori', '044', 'Nyanza', 'Migori'),
('Kisii', '045', 'Nyanza', 'Kisii'),
('Nyamira', '046', 'Nyanza', 'Nyamira'),
('Nairobi', '047', 'Nairobi', 'Nairobi')
ON CONFLICT (code) DO NOTHING;

-- 1.5 SCHOOLS (Ministry Portal Structure)
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  sex TEXT NOT NULL CHECK (sex IN ('BOYS', 'GIRLS', 'MIXED')),
  accommodation TEXT NOT NULL CHECK (accommodation IN ('DAY', 'BOARDING', 'HYBRID', 'DAY & BOARDING')),
  cluster TEXT NOT NULL CHECK (cluster IN ('C1', 'C2', 'C3', 'C4', 'PR')),
  category TEXT NOT NULL CHECK (category IN ('REGULAR', 'SNE', 'INTEGRATED')),
  school_type TEXT CHECK (school_type IN ('PUBLIC', 'PRIVATE')),
  region TEXT,
  UNIQUE(school_name, county),
  
  -- CBE Pathway Offering
  pathway_offering TEXT CHECK (pathway_offering IN ('TRIPLE', 'DOUBLE')),
  offered_pathways TEXT[], -- Array of pathway codes
  offered_tracks TEXT[], -- Array of track codes
  merit_category TEXT CHECK (merit_category IN ('NATIONAL', 'EXTRA_COUNTY', 'COUNTY', 'SUB_COUNTY')),
  
  -- SNE Specific
  has_sne_unit BOOLEAN DEFAULT FALSE,
  sne_disability_types TEXT[] CHECK (
    sne_disability_types <@ ARRAY['HEARING IMPAIRED', 'VISUALLY IMPAIRED', 'PHYSICALLY IMPAIRED', 'INTELLECTUAL', 'AUTISM', 'MULTIPLE']
  ),
  sne_capacity INTEGER,
  
  -- Capacity & Performance
  total_capacity INTEGER,
  available_slots INTEGER,
  mean_score_kcse_2024 DECIMAL(4,2),
  university_transition_rate DECIMAL(5,2),
  
  -- Contact
  uic TEXT UNIQUE,
  knec_code TEXT,
  phone_primary TEXT,
  email_admissions TEXT,
  website TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample schools (Updated with Real Ministry Data)
INSERT INTO schools (school_name, county, sub_county, sex, accommodation, cluster, category, pathway_offering, offered_pathways, merit_category, total_capacity) VALUES
('Alliance High School', 'Kiambu', 'Kikuyu', 'BOYS', 'BOARDING', 'C1', 'REGULAR', 'TRIPLE', ARRAY['STEM', 'SOSC', 'ARTS'], 'NATIONAL', 800),
('Kenya High School', 'Nairobi', 'Westlands', 'GIRLS', 'BOARDING', 'C1', 'REGULAR', 'TRIPLE', ARRAY['STEM', 'SOSC', 'ARTS'], 'NATIONAL', 750),
('Mang''u High School', 'Kiambu', 'Gatundu South', 'BOYS', 'BOARDING', 'C1', 'REGULAR', 'TRIPLE', ARRAY['STEM', 'SOSC', 'ARTS'], 'NATIONAL', 900),

-- Real schools from screenshot
('Prince Alex Mixed', 'Tharaka-Nithi', 'Chuka', 'MIXED', 'DAY', 'C4', 'REGULAR', 'DOUBLE', ARRAY['STEM', 'SOSC'], 'SUB_COUNTY', 200),
('Tarakwa', 'Bomet', 'Bomet East', 'MIXED', 'DAY', 'C4', 'REGULAR', 'DOUBLE', ARRAY['STEM', 'SOSC'], 'SUB_COUNTY', 180),
('Gatanga Girls'' Secondary School', 'Murang''a', 'Gatanga', 'GIRLS', 'BOARDING', 'C2', 'REGULAR', 'TRIPLE', ARRAY['STEM', 'SOSC', 'ARTS'], 'EXTRA_COUNTY', 400),
('Chebarus Secondary School', 'Nandi', 'Tinderet', 'MIXED', 'DAY', 'C4', 'REGULAR', 'DOUBLE', ARRAY['STEM', 'SOSC'], 'SUB_COUNTY', 250),
('St Charles Lunganyiro Girls', 'Kakamega', 'Matungu', 'MIXED', 'DAY', 'C4', 'REGULAR', 'DOUBLE', ARRAY['STEM', 'SOSC'], 'SUB_COUNTY', 300), -- Marked Mixed in portal
('Bungu Sec', 'Kilifi', 'Ganze', 'MIXED', 'DAY', 'C4', 'REGULAR', 'DOUBLE', ARRAY['STEM', 'SOSC'], 'SUB_COUNTY', 150),
('Namamba Mixed', 'Kakamega', 'Lugari', 'BOYS', 'BOARDING', 'C3', 'REGULAR', 'DOUBLE', ARRAY['STEM', 'SOSC'], 'COUNTY', 350) -- Marked Boys in portal

ON CONFLICT (uic) DO NOTHING;

-- 1.6 SCHOOL SUBJECT COMBINATIONS
CREATE TABLE IF NOT EXISTS school_subject_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  combination_id UUID REFERENCES subject_combinations(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  total_slots INTEGER,
  available_slots INTEGER,
  applicants_last_year INTEGER,
  cutoff_grade_2024 DECIMAL(3,1),
  UNIQUE(school_id, combination_id)
);

-- =============================================
-- PART 2: USER MANAGEMENT & PROFILES
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'PARENT', 'TEACHER', 'ADMIN', 'SCHOOL_ADMIN')),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Student-specific
  grade_level INTEGER CHECK (grade_level BETWEEN 6 AND 10),
  current_school_id UUID REFERENCES schools(id),
  assessment_number TEXT, -- KNEC assessment number
  home_county TEXT,
  home_sub_county TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('MALE', 'FEMALE')),
  
  -- Parent-specific
  parent_of UUID[], -- Array of student IDs
  
  -- Teacher-specific
  tsc_number TEXT, -- Teacher Service Commission number
  teaches_at UUID REFERENCES schools(id),
  
  -- Subscription
  subscription_tier TEXT CHECK (subscription_tier IN ('FREE', 'BASIC', 'PREMIUM', 'COMPREHENSIVE')),
  subscription_expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PART 3: LONGITUDINAL ASSESSMENT TRACKING (GRADE 6-9)
-- =============================================

-- 2.1 ASSESSMENT TYPES (KPSEA, SBA, KJSEA, KNEC Psychometric)
CREATE TABLE IF NOT EXISTS assessment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  grade_level INTEGER CHECK (grade_level BETWEEN 6 AND 9),
  is_national_exam BOOLEAN DEFAULT FALSE,
  is_psychometric BOOLEAN DEFAULT FALSE,
  weight_in_placement DECIMAL(5,2), -- Percentage (0-100)
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO assessment_types (name, code, grade_level, is_national_exam, is_psychometric, weight_in_placement) VALUES
('KPSEA', 'KPSEA', 6, TRUE, FALSE, 20.00),
('School-Based Assessment - Grade 7', 'SBA7', 7, FALSE, FALSE, 6.67),
('School-Based Assessment - Grade 8', 'SBA8', 8, FALSE, FALSE, 6.67),
('School-Based Assessment - Grade 9', 'SBA9', 9, FALSE, FALSE, 6.66),
('KJSEA', 'KJSEA', 9, TRUE, FALSE, 60.00),
('KNEC Psychometric Assessment', 'KNEC_PSYCH', 9, TRUE, TRUE, 0.00)
ON CONFLICT (code) DO NOTHING;

-- 2.2 ASSESSMENT COMPONENTS/SUBJECTS
CREATE TABLE IF NOT EXISTS assessment_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_type_id UUID REFERENCES assessment_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  max_score DECIMAL(5,2),
  is_core BOOLEAN DEFAULT TRUE,
  UNIQUE(assessment_type_id, name)
);

-- KPSEA Components
INSERT INTO assessment_components (assessment_type_id, name, code, max_score, is_core)
SELECT id, 'Mathematics', 'MAT', 100, TRUE FROM assessment_types WHERE code = 'KPSEA'
ON CONFLICT (assessment_type_id, name) DO NOTHING;

INSERT INTO assessment_components (assessment_type_id, name, code, max_score, is_core)
SELECT id, 'English', 'ENG', 100, TRUE FROM assessment_types WHERE code = 'KPSEA'
ON CONFLICT (assessment_type_id, name) DO NOTHING;

-- Continue for other subjects... (abbreviated for space)

-- 2.3 STUDENT ASSESSMENT RECORDS (LONGITUDINAL)
CREATE TABLE IF NOT EXISTS student_assessment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  assessment_type_id UUID REFERENCES assessment_types(id) ON DELETE CASCADE,
  assessment_component_id UUID REFERENCES assessment_components(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  grade TEXT,
  percentile_rank DECIMAL(5,2),
  stanine INTEGER CHECK (stanine BETWEEN 1 AND 9),
  assessment_date DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(student_id, assessment_component_id, assessment_date)
);

-- =============================================
-- PART 4: KNEC PSYCHOMETRIC DOMAINS
-- =============================================

CREATE TABLE IF NOT EXISTS psychometric_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  pathway_weight_stem DECIMAL(3,2),
  pathway_weight_sosc DECIMAL(3,2),
  pathway_weight_arts DECIMAL(3,2),
  typical_question_count INTEGER,
  display_order INTEGER
);

INSERT INTO psychometric_domains (name, code, description, pathway_weight_stem, pathway_weight_sosc, pathway_weight_arts, display_order) VALUES
('Numerical Reasoning', 'NUM_REAS', 'Mathematical problem-solving, patterns, data interpretation', 0.35, 0.15, 0.05, 1),
('Verbal Reasoning', 'VER_REAS', 'Reading comprehension, vocabulary, logical deduction', 0.10, 0.35, 0.15, 2),
('Abstract Reasoning', 'ABS_REAS', 'Pattern recognition, non-verbal logic, analogies', 0.20, 0.10, 0.15, 3),
('Mechanical Reasoning', 'MEC_REAS', 'Physical principles, tool identification, technical comprehension', 0.20, 0.05, 0.05, 4),
('Spatial Ability', 'SPA_ABIL', '3D rotation, mental folding, navigation, visualization', 0.10, 0.05, 0.15, 5),
('Creative Thinking', 'CRE_THINK', 'Divergent thinking, originality, elaboration, ideation', 0.02, 0.10, 0.25, 6),
('Situational Judgement', 'SIT_JUDG', 'Decision-making, ethics, interpersonal skills, empathy', 0.01, 0.15, 0.10, 7),
('Interest Inventory', 'INT_INV', 'Activity preferences, career aspirations, subject enjoyment', 0.01, 0.03, 0.05, 8),
('Personality Indicators', 'PER_IND', 'Learning style, collaboration preference, resilience, motivation', 0.01, 0.02, 0.05, 9)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS psychometric_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES psychometric_domains(id) ON DELETE CASCADE,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  time_allowed_seconds INTEGER,
  question_text TEXT NOT NULL,
  stimulus_url TEXT,
  stimulus_type TEXT CHECK (stimulus_type IN ('IMAGE', 'AUDIO', 'VIDEO', 'TEXT', 'NONE')),
  response_type TEXT CHECK (response_type IN ('MULTIPLE_CHOICE', 'DRAG_DROP', 'PATTERN_COMPLETE', 'ROTATION', 'ORDERING', 'LIKERT_SCALE')),
  response_options JSONB NOT NULL,
  correct_response JSONB,
  discrimination_index DECIMAL(4,2),
  difficulty_index DECIMAL(4,2),
  guess_probability DECIMAL(4,2),
  is_culturally_adapted BOOLEAN DEFAULT TRUE,
  cultural_context TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psychometric_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  time_taken_seconds INTEGER,
  is_complete BOOLEAN DEFAULT FALSE,
  is_abandoned BOOLEAN DEFAULT FALSE,
  is_timed BOOLEAN DEFAULT TRUE,
  difficulty_adaptive BOOLEAN DEFAULT FALSE,
  device_info JSONB,
  browser_info TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psychometric_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES psychometric_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES psychometric_questions(id) ON DELETE CASCADE,
  response_data JSONB NOT NULL,
  response_time_ms INTEGER,
  is_correct BOOLEAN,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  next_question_difficulty INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psychometric_domain_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES psychometric_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  domain_id UUID REFERENCES psychometric_domains(id) ON DELETE CASCADE,
  raw_score INTEGER,
  scaled_score INTEGER CHECK (scaled_score BETWEEN 0 AND 100),
  stanine INTEGER CHECK (stanine BETWEEN 1 AND 9),
  percentile_rank DECIMAL(5,2),
  national_mean DECIMAL(5,2),
  national_stdev DECIMAL(5,2),
  cohort_rank INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, domain_id, session_id)
);

-- =============================================
-- PART 5: PATHWAY FIT™ ENGINE
-- =============================================

CREATE TABLE IF NOT EXISTS pathway_fit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  session_id UUID REFERENCES psychometric_sessions(id),
  assessment_date DATE DEFAULT CURRENT_DATE,
  grade_level INTEGER CHECK (grade_level BETWEEN 6 AND 9),
  
  -- Pathway Fit™ Scores (0-100)
  stem_score INTEGER CHECK (stem_score BETWEEN 0 AND 100),
  social_sciences_score INTEGER CHECK (social_sciences_score BETWEEN 0 AND 100),
  arts_sports_score INTEGER CHECK (arts_sports_score BETWEEN 0 AND 100),
  
  -- Primary/Secondary Determination
  primary_pathway_id UUID REFERENCES pathways(id),
  primary_pathway_confidence DECIMAL(5,2),
  secondary_pathway_id UUID REFERENCES pathways(id),
  secondary_pathway_confidence DECIMAL(5,2),
  
  -- Recommendations
  recommended_combination_ids UUID[],
  alternative_combination_ids UUID[],
  recommended_track_ids UUID[],
  
  -- Longitudinal Comparison
  previous_stem_score INTEGER,
  previous_sosc_score INTEGER,
  previous_arts_score INTEGER,
  score_trend TEXT CHECK (score_trend IN ('IMPROVING', 'DECLINING', 'STABLE', 'VOLATILE')),
  
  -- Confidence Metrics
  percentile_rank DECIMAL(5,2),
  confidence_interval DECIMAL(5,2),
  sample_size INTEGER,
  
  algorithm_version TEXT,
  algorithm_date DATE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE pathway_fit_results IS 'Pathway Fit™ proprietary algorithm results. Trademark of Dymz Ltd.';

-- =============================================
-- PART 6: SENIOR SCHOOL SELECTION (3 Combinations × 4 Schools)
-- =============================================

CREATE TABLE IF NOT EXISTS selection_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  year INTEGER DEFAULT 2025,
  selected_pathway_id UUID REFERENCES pathways(id),
  current_step INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP,
  submission_reference TEXT,
  home_county TEXT,
  home_sub_county TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_combination_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES selection_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  choice_order INTEGER CHECK (choice_order BETWEEN 1 AND 3),
  combination_id UUID REFERENCES subject_combinations(id),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(session_id, choice_order)
);

CREATE TABLE IF NOT EXISTS student_school_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES selection_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  combination_choice_id UUID REFERENCES student_combination_choices(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id),
  cluster_position INTEGER CHECK (cluster_position BETWEEN 1 AND 4),
  selection_type TEXT CHECK (selection_type IN (
    'BOARDING_OUTSIDE_COUNTY',
    'BOARDING_WITHIN_COUNTY',
    'DAY_WITHIN_SUB_COUNTY'
  )),
  overall_priority INTEGER CHECK (overall_priority BETWEEN 1 AND 12),
  placement_status TEXT DEFAULT 'PENDING' CHECK (placement_status IN ('PENDING', 'PLACED', 'NOT_PLACED', 'CONFIRMED')),
  placement_rank INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, overall_priority)
);

-- =============================================
-- PART 7: ROW LEVEL SECURITY POLICIES
-- =============================================

ALTER TABLE student_assessment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychometric_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychometric_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychometric_domain_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_fit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_school_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Students own their data
CREATE POLICY "Students own assessment records" ON student_assessment_records
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students own psychometric sessions" ON psychometric_sessions
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Students own psychometric responses" ON psychometric_responses
  FOR ALL USING (EXISTS (
    SELECT 1 FROM psychometric_sessions 
    WHERE psychometric_sessions.id = psychometric_responses.session_id 
    AND psychometric_sessions.student_id = auth.uid()
  ));

CREATE POLICY "Students own domain scores" ON psychometric_domain_scores
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students own pathway results" ON pathway_fit_results
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students manage school selections" ON student_school_selections
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Users can view and update own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- =============================================
-- PART 8: INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_assessment_records_student_date ON student_assessment_records(student_id, assessment_date);
CREATE INDEX idx_assessment_records_component ON student_assessment_records(assessment_component_id);
CREATE INDEX idx_psychometric_sessions_student ON psychometric_sessions(student_id);
CREATE INDEX idx_psychometric_domain_scores_student ON psychometric_domain_scores(student_id);
CREATE INDEX idx_pathway_fit_results_student ON pathway_fit_results(student_id, grade_level);
CREATE INDEX idx_selection_sessions_student ON selection_sessions(student_id);
CREATE INDEX idx_school_selections_student ON student_school_selections(student_id);
CREATE INDEX idx_school_selections_school ON student_school_selections(school_id);
CREATE INDEX idx_school_combinations ON school_subject_combinations(school_id, combination_id);
