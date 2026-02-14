export type PathwayCode = 'STEM' | 'SOSC' | 'ARTS';
export type TrackCode = 'PURE_SCI' | 'APP_SCI' | 'TECH' | 'LANG_LIT' | 'HUM_BUS' | 'ARTS_T' | 'SPORTS';
export type SchoolCluster = 'C1' | 'C2' | 'C3' | 'C4';
export type SchoolCategory = 'REGULAR' | 'SNE' | 'INTEGRATED';
export type SchoolAccommodation = 'DAY' | 'BOARDING' | 'HYBRID' | 'DAY & BOARDING';
export type SchoolGender = 'BOYS' | 'GIRLS' | 'MIXED';
export type UserRole = 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN' | 'SCHOOL_ADMIN';

export interface Pathway {
    id: string;
    name: string;
    code: PathwayCode;
    description: string;
    color: string;
    national_target_percentage: number;
}

export interface Track {
    id: string;
    pathway_id: string;
    name: string;
    code: TrackCode;
    description: string;
}

export interface SubjectCombination {
    id: string;
    track_id: string;
    code: string;
    subjects: string[];
    career_clusters: string[];
    difficulty_rating: number;
    demand_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface School {
    id: string;
    school_name: string;
    county: string;
    sub_county: string;
    sex: SchoolGender;
    accommodation: SchoolAccommodation;
    cluster: SchoolCluster;
    category: SchoolCategory;
    pathway_offering: 'TRIPLE' | 'DOUBLE';
    offered_pathways: PathwayCode[];
    offered_tracks: TrackCode[];
    merit_category: 'NATIONAL' | 'EXTRA_COUNTY' | 'COUNTY' | 'SUB_COUNTY';
    knec_code: string;
    total_capacity: number;
}

export interface AssessmentRecord {
    id: string;
    student_id: string;
    assessment_type: 'KPSEA' | 'SBA7' | 'SBA8' | 'SBA9' | 'KJSEA';
    subject_name: string;
    score: number;
    grade: string;
    date: string;
}

export interface PsychometricDomainScore {
    domain_code: string; // e.g., 'NUM_REAS'
    raw_score: number;
    stanine: number; // 1-9
    percentile: number;
}

export interface PathwayFitResult {
    student_id: string;
    stem_score: number;
    sosc_score: number;
    arts_score: number;
    primary_pathway: PathwayCode;
    secondary_pathway: PathwayCode;
    confidence: number;
}

export interface StudentProfile {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    grade_level: 6 | 7 | 8 | 9;
    current_school: string;
    home_county: string;
    home_sub_county: string;
}

export interface Profile {
    id: string;
    role: UserRole;
    full_name: string;
    email: string;
    phone?: string;
    created_at: string;
}

export interface PsychometricSession {
    id: string;
    student_id: string;
    domain_id: string;
    started_at: string;
    completed_at?: string;
    time_taken_seconds?: number;
    is_complete: boolean;
}

export interface AssessmentResponse {
    id: string;
    session_id: string;
    question_id: string;
    is_correct: boolean;
    response_time_ms: number;
}

export interface SelectionSlot {
    id: number;
    combination_index: number;
    type: 'BOARDING_OUTSIDE_COUNTY' | 'BOARDING_WITHIN_COUNTY' | 'DAY_WITHIN_SUB_COUNTY';
    school: School | null;
}
