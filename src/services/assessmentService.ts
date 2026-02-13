import { supabase } from '@/lib/supabase';

export const assessmentService = {
    // Start a new assessment session
    async startSession(userId: string, domainCode: string): Promise<string | null> {
        try {
            // 1. Get Domain ID from Code
            const { data: domainData, error: domainError } = await supabase
                .from('psychometric_domains')
                .select('id')
                .eq('code', domainCode)
                .single();

            if (domainError || !domainData) {
                console.error('Error finding domain:', domainCode, domainError);
                return null;
            }

            // 2. Create Session
            const { data: sessionData, error: sessionError } = await supabase
                .from('psychometric_sessions')
                .insert({
                    student_id: userId,
                    started_at: new Date().toISOString(),
                    is_complete: false
                })
                .select('id')
                .single();

            if (sessionError) {
                console.error('Error creating session:', sessionError);
                return null;
            }

            return sessionData.id;
        } catch (err) {
            console.error('Unexpected error starting session:', err);
            return null;
        }
    },

    // Complete a session and save the score
    async completeSession(
        sessionId: string,
        userId: string,
        domainCode: string,
        rawScore: number,
        maxScore: number
    ): Promise<boolean> {
        try {
            const completedAt = new Date().toISOString();

            // 1. Get Domain ID
            const { data: domainData } = await supabase
                .from('psychometric_domains')
                .select('id')
                .eq('code', domainCode)
                .single();

            if (!domainData) return false;

            // 2. Update Session
            const { error: updateError } = await supabase
                .from('psychometric_sessions')
                .update({
                    completed_at: completedAt,
                    is_complete: true,
                    // calculate time taken if we had start time, simpler to just mark complete for now
                })
                .eq('id', sessionId);

            if (updateError) {
                console.error('Error updating session:', updateError);
                return false;
            }

            // 3. Calculate Scaled Score (Simple percentage for now)
            // In a real psychometric test, this would use lookup tables/norms
            const percentage = Math.round((rawScore / maxScore) * 100);

            // Stanine Mock Calculation (Normal distribution simulation)
            // 0-10: 1, 11-20: 2, 21-40: 3, 41-60: 4, 61-80: 5, 81-90: 6, 91-95: 7, 96-98: 8, 99-100: 9
            // This is just a placeholder logic
            let stanine = 5;
            if (percentage < 10) stanine = 1;
            else if (percentage < 20) stanine = 2;
            else if (percentage < 40) stanine = 3;
            else if (percentage < 50) stanine = 4;
            else if (percentage < 70) stanine = 5;
            else if (percentage < 80) stanine = 6;
            else if (percentage < 90) stanine = 7;
            else if (percentage < 95) stanine = 8;
            else stanine = 9;

            // 4. Save Domain Score
            // Check if exists first to update or insert
            const { error: scoreError } = await supabase
                .from('psychometric_domain_scores')
                .upsert({
                    session_id: sessionId,
                    student_id: userId,
                    domain_id: domainData.id,
                    raw_score: rawScore,
                    scaled_score: percentage,
                    stanine: stanine,
                    percentile_rank: percentage, // simplified
                });

            if (scoreError) {
                console.error('Error saving score:', scoreError);
                return false;
            }

            return true;

        } catch (err) {
            console.error('Error completing session:', err);
            return false;
        }
    },

    // Get user's progress
    async getUserProgress(userId: string) {
        const { data, error } = await supabase
            .from('psychometric_domain_scores')
            .select(`
                domain_id,
                scaled_score,
                stanine,
                psychometric_domains (
                    code,
                    name
                )
            `)
            .eq('student_id', userId);

        if (error) return [];
        return data;
    }
};
