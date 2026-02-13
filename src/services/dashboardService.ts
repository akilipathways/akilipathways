import { supabase } from '@/lib/supabase';
// import { Profile } from '@/types';

export interface StudentSummary {
    id: string;
    full_name: string;
    grade_level: number;
    school_name: string;
    primary_pathway?: string;
    pathway_confidence?: number;
    last_assessment_score?: number;
    last_assessment_date?: string;
    avatar_url?: string;
}

export const dashboardService = {
    // Get all children for a parent
    async getParentChildren(parentId: string): Promise<StudentSummary[]> {
        try {
            // 1. Get parent profile to find 'parent_of' array
            const { data: parentProfile, error: parentError } = await supabase
                .from('profiles')
                .select('parent_of')
                .eq('id', parentId)
                .single();

            if (parentError || !parentProfile?.parent_of || parentProfile.parent_of.length === 0) {
                return [];
            }

            const studentIds = parentProfile.parent_of;

            // 2. Fetch student profiles
            const { data: students, error: studentsError } = await supabase
                .from('profiles')
                .select('id, full_name, grade_level, current_school_id')
                .in('id', studentIds);

            if (studentsError) {
                console.error('Error fetching children:', studentsError);
                return [];
            }

            // 3. For each student, we would ideally fetch their school name and latest results
            // For now, let's mock or fetch basics.
            // Let's try to fetch school names.
            const schoolIds = students.map(s => s.current_school_id).filter(id => id) as string[];
            let schoolsMap: Record<string, string> = {};

            if (schoolIds.length > 0) {
                const { data: schools } = await supabase
                    .from('schools')
                    .select('id, school_name')
                    .in('id', schoolIds);

                schools?.forEach(s => {
                    schoolsMap[s.id] = s.school_name;
                });
            }

            // Map to summary
            return students.map(s => ({
                id: s.id,
                full_name: s.full_name,
                grade_level: s.grade_level || 9,
                school_name: s.current_school_id ? schoolsMap[s.current_school_id] : 'Unknown School',
                primary_pathway: 'STEM', // Mock for now
                pathway_confidence: 85, // Mock
                last_assessment_score: 340 + Math.floor(Math.random() * 50),
            }));

        } catch (err) {
            console.error('Error in getParentChildren:', err);
            return [];
        }
    },

    // Get all students for a teacher (in their school)
    async getTeacherStudents(teacherId: string): Promise<StudentSummary[]> {
        try {
            // 1. Get teacher's school
            const { data: teacherProfile, error: teacherError } = await supabase
                .from('profiles')
                .select('teaches_at')
                .eq('id', teacherId)
                .single();

            if (teacherError || !teacherProfile?.teaches_at) {
                return [];
            }

            const schoolId = teacherProfile.teaches_at;

            // 2. Fetch all students in that school
            const { data: students, error: studentsError } = await supabase
                .from('profiles')
                .select('id, full_name, grade_level')
                .eq('current_school_id', schoolId)
                .eq('role', 'STUDENT')
                .limit(50); // Pagination in real app

            if (studentsError) {
                console.error('Error fetching students:', studentsError);
                return [];
            }

            // Map to summary (Mocking performance data for demo)
            return students.map(s => ({
                id: s.id,
                full_name: s.full_name,
                grade_level: s.grade_level || 9,
                school_name: 'Your School', // Teacher knows the school
                primary_pathway: Math.random() > 0.6 ? 'STEM' : (Math.random() > 0.5 ? 'SOSC' : 'ARTS'),
                pathway_confidence: 60 + Math.floor(Math.random() * 35),
                last_assessment_score: 250 + Math.floor(Math.random() * 150),
            }));

        } catch (err) {
            console.error('Error in getTeacherStudents:', err);
            return [];
        }
    }
};
