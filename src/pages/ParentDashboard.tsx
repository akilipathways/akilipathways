import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardService, StudentSummary } from "@/services/dashboardService";
import { AcademicPerformanceTrend } from "@/components/dashboard/AcademicPerformanceTrend";
import { PathwayFitEvolution } from "@/components/dashboard/PathwayFitEvolution";
import { PsychometricDomainProfile } from "@/components/dashboard/PsychometricDomainProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, School, GraduationCap, Activity } from "lucide-react";

export function ParentDashboard() {
    const { user } = useAuth();
    const [children, setChildren] = useState<StudentSummary[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildren = async () => {
            if (user) {
                const data = await dashboardService.getParentChildren(user.id);
                setChildren(data);
                if (data.length > 0) {
                    setSelectedChildId(data[0].id);
                }
            }
            setLoading(false);
        };
        fetchChildren();
    }, [user]);

    const selectedChild = children.find(c => c.id === selectedChildId);

    if (loading) {
        return <div className="p-8 text-center">Loading parent portal...</div>;
    }

    if (children.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500">
                <h2 className="text-2xl font-bold mb-2">Welcome, Parent!</h2>
                <p>No students are linked to your account yet.</p>
                <Button className="mt-4">Link Student Account</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">
                    Parent Portal
                </h1>
                <p className="text-slate-500 mt-1">
                    Monitoring progress for {children.length} student{children.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Child Selector */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {children.map(child => (
                    <button
                        key={child.id}
                        onClick={() => setSelectedChildId(child.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all min-w-[250px] ${selectedChildId === child.id
                            ? 'bg-primary-blue text-white border-primary-blue ring-2 ring-primary-blue ring-offset-2'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary-blue/50'
                            }`}
                    >
                        <div className={`p-2 rounded-full ${selectedChildId === child.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                            <User size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold">{child.full_name}</p>
                            <p className="text-xs opacity-80">Grade {child.grade_level}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Selected Child View */}
            {selectedChild && (
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                    <School size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">School</p>
                                    <p className="font-bold text-slate-900">{selectedChild.school_name}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Primary Pathway Fit</p>
                                    <p className="font-bold text-slate-900">{selectedChild.primary_pathway} ({selectedChild.pathway_confidence}%)</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Recent Score</p>
                                    <p className="font-bold text-slate-900">{selectedChild.last_assessment_score || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Reuse */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AcademicPerformanceTrend />
                        <PathwayFitEvolution />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <PsychometricDomainProfile />
                    </div>
                </div>
            )}
        </div>
    );
}
