import { supabase } from '@/lib/supabase';
import { PathwayFitResult } from '@/types';

export interface StudentProfile {
    id: string;
    gender: 'MALE' | 'FEMALE';
    home_county: string;
    home_sub_county: string;
    achievement_level: number;
    stanine: number;
    sub_county_rank?: number;
}

export class RecommendationService {
    /**
     * Ministry Quotas for automatic placement
     */
    public static readonly QUOTAS = {
        'STEM': 6,
        'SOCIAL_SCIENCE': 3,
        'ARTS_SPORTS': 2
    };

    /**
     * Cluster difficulty penalty for safety scoring
     */
    private static readonly CLUSTER_DIFFICULTY: Record<string, number> = {
        'C1': 40,
        'C2': 30,
        'C3': 20,
        'C4': 10,
        'PR': 5
    };

    /**
     * Main recommendation logic following the 4-4-4 matrix and 9/3 split
     */
    static async getRecommendations(profile: StudentProfile, assessment: PathwayFitResult) {
        // 1. Get top 3 combinations for the student's pathway
        const combinations = await this.getTopCombinations(assessment.primary_pathway);

        const recommendations: any[] = [];

        // 2. Iterate through each combination to fill its 4 slots
        for (let i = 0; i < combinations.length; i++) {
            const combo = combinations[i];

            // a. 2 Out-of-County Boarding
            const outCounty = await this.fetchSchools({
                combination_id: combo.id,
                accommodation: 'BOARDING',
                exclude_county: profile.home_county,
                limit: 2
            });
            recommendations.push(...outCounty.map(s => ({ ...s, selection_type: 'BOARDING_OUTSIDE_COUNTY', combination_idx: i })));

            // b. 1 In-County Boarding
            const inCounty = await this.fetchSchools({
                combination_id: combo.id,
                accommodation: 'BOARDING',
                county: profile.home_county,
                limit: 1
            });
            recommendations.push(...inCounty.map(s => ({ ...s, selection_type: 'BOARDING_WITHIN_COUNTY', combination_idx: i })));

            // c. 1 In-Sub-County Day
            const daySchool = await this.fetchSchools({
                combination_id: combo.id,
                accommodation: 'DAY',
                sub_county: profile.home_sub_county,
                limit: 1
            });
            recommendations.push(...daySchool.map(s => ({ ...s, selection_type: 'DAY_WITHIN_SUB_COUNTY', combination_idx: i })));
        }

        return recommendations;
    }

    /**
     * Fetches schools from Supabase based on criteria
     */
    private static async fetchSchools(filters: any) {
        let query = supabase
            .from('schools')
            .select(`
                *,
                school_subject_combinations!inner(combination_id)
            `)
            .eq('school_subject_combinations.combination_id', filters.combination_id)
            .eq('accommodation', filters.accommodation)
            .limit(filters.limit);

        if (filters.county) query = query.eq('county', filters.county);
        if (filters.exclude_county) query = query.neq('county', filters.exclude_county);
        if (filters.sub_county) query = query.eq('sub_county', filters.sub_county);

        const { data, error } = await query;
        if (error) throw error;

        return data.map(school => ({
            ...school,
            safety_score: this.calculateSafetyScore(school, 8) // Mock stanine 8 for now
        }));
    }

    /**
     * Calculates probability of placement (0-100)
     */
    static calculateSafetyScore(school: any, studentStanine: number): number {
        let probability = 100;
        const difficulty = this.CLUSTER_DIFFICULTY[school.cluster] || 10;
        const stanineImpact = (9 - studentStanine) * 10;

        probability -= (difficulty + stanineImpact);
        return Math.max(0, Math.min(100, probability));
    }

    private static async getTopCombinations(pathwayCode: string) {
        const { data } = await supabase
            .from('subject_combinations')
            .select(`
                *,
                pathways!inner(code)
            `)
            .eq('pathways.code', pathwayCode)
            .limit(3);
        return data || [];
    }
}
