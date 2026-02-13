import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ClipboardCheck, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { assessmentService } from '@/services/assessmentService';

// Define the static structure of assessments
const ASSESSMENT_DOMAINS = [
    { id: 'NUM_REAS', path: 'numerical', name: 'Numerical Reasoning', type: 'Game', time: '15 min' },
    { id: 'VER_REAS', path: 'verbal', name: 'Verbal Reasoning', type: 'Game', time: '15 min' },
    { id: 'ABS_REAS', path: 'abstract', name: 'Abstract Reasoning', type: 'Game', time: '20 min' },
    { id: 'MEC_REAS', path: 'mechanical', name: 'Mechanical Reasoning', type: 'Game', time: '15 min' },
    { id: 'SPA_ABIL', path: 'spatial', name: 'Spatial Ability', type: 'Game', time: '20 min' },
    { id: 'CRE_THINK', path: 'creative', name: 'Creative Thinking', type: 'Game', time: '25 min' },
    { id: 'SIT_JUDG', path: 'sit', name: 'Situational Judgement', type: 'Survey', time: '10 min' },
    { id: 'INT_INV', path: 'int', name: 'Interest Inventory', type: 'Survey', time: '10 min' },
    { id: 'PER_IND', path: 'per', name: 'Personality Indicators', type: 'Survey', time: '10 min' },
];

export function AssessmentLobby() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [completedDomains, setCompletedDomains] = useState<string[]>([]);

    useEffect(() => {
        const loadProgress = async () => {
            if (user) {
                const progress = await assessmentService.getUserProgress(user.id);
                // Extract domain codes (not IDs, need to match my static list if possible, or mapping)
                // My service returns domain_id and joined psychometric_domains(code)
                // Let's assert the type returned by service
                const codes = progress.map((p: any) => p.psychometric_domains?.code);
                setCompletedDomains(codes);
            }
        };
        loadProgress();
    }, [user]);

    // Initial logic: Scale availability based on order?
    // For now, let's unlock them sequentially or all at once?
    // Requirement says: "Ensure... correctly routed". Let's unlock all for testing,
    // or keep the lock logic but base it on completion of previous?
    // Let's make them all available for the MVP demo except surveys if not implemented.

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Assessment Lobby</h1>
                <p className="mt-2 text-slate-600">
                    Complete all modules to unlock your personalized pathway recommendations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ASSESSMENT_DOMAINS.map((domain) => {
                    const isCompleted = completedDomains.includes(domain.id);
                    // Unlock everything for now for demo purposes, or maybe lock backend ones?
                    // Let's simulate Status
                    let status: 'Ready' | 'Locked' | 'Completed' = 'Ready';
                    if (isCompleted) status = 'Completed';

                    // Specific locks for unimplemented surveys
                    if (domain.id === 'INT_INV' || domain.id === 'PER_IND') status = 'Locked';

                    return (
                        <Card key={domain.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        "p-3 rounded-lg",
                                        domain.type === 'Game' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                                    )}>
                                        {domain.type === 'Game' ? <Play className="w-6 h-6" /> : <ClipboardCheck className="w-6 h-6" />}
                                    </div>
                                    {status === 'Completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                                    {status === 'Locked' && <Lock className="w-6 h-6 text-slate-300" />}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">{domain.name}</h3>

                                <div className="flex items-center text-sm text-slate-500 mb-6">
                                    <span className="bg-slate-100 px-2 py-1 rounded mr-3">{domain.type}</span>
                                    <span>{domain.time}</span>
                                </div>

                                <Button
                                    className="w-full"
                                    variant={status === 'Completed' ? 'outline' : 'default'}
                                    disabled={status === 'Locked'}
                                    onClick={() => {
                                        if (domain.type === 'Game') {
                                            navigate(`/assessment/game/${domain.path}`);
                                        } else {
                                            navigate(`/assessment/${domain.path}`);
                                        }
                                    }}
                                >
                                    {status === 'Completed' ? 'Retake' : 'Start Assessment'}
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
