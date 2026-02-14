/**
 * PathwayFit™ Smart Recommendation Engine
 * Implements Ministry of Education (Kenya) Grade 10 Selection Rules
 */

class RecommendationEngine {
    constructor(db) {
        this.db = db; // Database client (Supabase/Postgres)
    }

    /**
     * Recommends 12 schools based on student profile and assessment
     */
    async recommendSchools(studentProfile, assessmentResults) {
        const { home_county, home_sub_county, gender, achievement_level } = studentProfile;
        const { primary_pathway, secondary_pathway } = assessmentResults;

        // 1. Get top 3 combinations for the primary pathway
        const combinations = await this.getTopCombinations(primary_pathway);

        // 2. Selection Matrix (4 schools per combination)
        const finalSelection = [];

        for (const combination of combinations) {
            const blockSelections = await this.getSelectionBlock(combination, studentProfile);
            finalSelection.push(...blockSelections);
        }

        return {
            recommendations: finalSelection,
            metadata: {
                total_schools: finalSelection.length,
                pathway: primary_pathway.name,
                strategy: "BALANCED"
            }
        };
    }

    /**
     * Logic for the 4-school block (2 Out-County Boarding, 1 In-County Boarding, 1 In-Sub-County Day)
     */
    async getSelectionBlock(combination, profile) {
        const schools = [];

        // Rule: 2 Out-of-County Boarding
        const outCountyBoarding = await this.querySchools({
            combination_id: combination.id,
            accommodation: 'BOARDING',
            exclude_county: profile.home_county,
            limit: 2
        });
        schools.push(...outCountyBoarding.map(s => ({ ...s, selection_type: 'BOARDING_OUTSIDE_COUNTY' })));

        // Rule: 1 In-County Boarding
        const inCountyBoarding = await this.querySchools({
            combination_id: combination.id,
            accommodation: 'BOARDING',
            county: profile.home_county,
            limit: 1
        });
        schools.push(...inCountyBoarding.map(s => ({ ...s, selection_type: 'BOARDING_WITHIN_COUNTY' })));

        // Rule: 1 In-Sub-County Day
        const inSubCountyDay = await this.querySchools({
            combination_id: combination.id,
            accommodation: 'DAY',
            sub_county: profile.home_sub_county,
            limit: 1
        });
        schools.push(...inSubCountyDay.map(s => ({ ...s, selection_type: 'DAY_WITHIN_SUB_COUNTY' })));

        return schools;
    }

    /**
     * Calculates the "Safety Score" (Probability of Placement)
     * Factors in student's stanine, average grade, and school's cluster/competition
     */
    calculateSafetyScore(studentStanine, schoolCluster, schoolCategory) {
        let probability = 100;
        const clusterDifficulty = { 'C1': 40, 'C2': 30, 'C3': 20, 'C4': 10, 'PR': 5 };
        const difficulty = clusterDifficulty[schoolCluster] || 10;
        const stanineImpact = (9 - studentStanine) * 10;
        probability -= (difficulty + stanineImpact);
        return Math.max(0, Math.min(100, probability));
    }

    /**
     * Implements the Ministry Quota logic (Top X per sub-county)
     */
    getQuotaChance(profile, trackType) {
        const quotas = { 'STEM': 6, 'SOCIAL_SCIENCE': 3, 'ARTS_SPORTS': 2 };
        const limit = quotas[trackType] || 2;
        return {
            quota_limit: limit,
            is_high_probability: profile.sub_county_rank <= limit
        };
    }

    async querySchools(filters) {
        console.log(`Querying schools with filters:`, filters);
        return [];
    }

    async getTopCombinations(pathway) {
        return [{ id: 'mock-1', name: 'Mock Combination' }];
    }
}

module.exports = RecommendationEngine;
