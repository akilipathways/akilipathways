import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Info, MapPin, Building2, School as SchoolIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecommendationService, StudentProfile } from '@/services/recommendationService';
import { School, SelectionSlot, PathwayFitResult } from '@/types';

// Mock data for integration
const MOCK_PROFILE: StudentProfile = {
    id: 'student-123',
    gender: 'MALE',
    home_county: 'NAIROBI',
    home_sub_county: 'WESTLANDS',
    achievement_level: 8,
    stanine: 8,
    sub_county_rank: 2
};

const MOCK_ASSESSMENT: PathwayFitResult = {
    student_id: 'student-123',
    stem_score: 85,
    sosc_score: 60,
    arts_score: 45,
    primary_pathway: 'STEM',
    secondary_pathway: 'SOSC',
    confidence: 0.92
};

const MOCK_SCHOOLS: School[] = [
    { id: '1', school_name: 'Nairobi School', category: 'REGULAR', cluster: 'C1', sex: 'BOYS', accommodation: 'BOARDING', county: 'NAIROBI', sub_county: 'WESTLANDS' } as School,
    { id: '2', school_name: 'Kenya High', category: 'REGULAR', cluster: 'C1', sex: 'GIRLS', accommodation: 'BOARDING', county: 'NAIROBI', sub_county: 'WESTLANDS' } as School,
    { id: '3', school_name: 'Alliance High', category: 'REGULAR', cluster: 'C1', sex: 'BOYS', accommodation: 'BOARDING', county: 'KIAMBU', sub_county: 'KIKUYU' } as School,
    { id: '4', school_name: 'Dagoretti High', category: 'REGULAR', cluster: 'C3', sex: 'BOYS', accommodation: 'BOARDING', county: 'NAIROBI', sub_county: 'DAGORETTI' } as School,
    { id: '5', school_name: 'Buruburu Girls', category: 'REGULAR', cluster: 'C4', sex: 'GIRLS', accommodation: 'DAY', county: 'NAIROBI', sub_county: 'MAKADARA' } as School,
];

export function SchoolSelectionStep() {
    const [activeTab, setActiveTab] = useState("0");
    const [isLoading, setIsLoading] = useState(false);

    // Initialize 12 slots based on the 4-4-4 and 9-3 rules
    const [slots, setSlots] = useState<SelectionSlot[]>([
        // Combination 1
        { id: 0, combination_index: 0, type: 'BOARDING_OUTSIDE_COUNTY', school: null },
        { id: 1, combination_index: 0, type: 'BOARDING_OUTSIDE_COUNTY', school: null },
        { id: 2, combination_index: 0, type: 'BOARDING_WITHIN_COUNTY', school: null },
        { id: 3, combination_index: 0, type: 'DAY_WITHIN_SUB_COUNTY', school: null },
        // Combination 2
        { id: 4, combination_index: 1, type: 'BOARDING_OUTSIDE_COUNTY', school: null },
        { id: 5, combination_index: 1, type: 'BOARDING_OUTSIDE_COUNTY', school: null },
        { id: 6, combination_index: 1, type: 'BOARDING_WITHIN_COUNTY', school: null },
        { id: 7, combination_index: 1, type: 'DAY_WITHIN_SUB_COUNTY', school: null },
        // Combination 3
        { id: 8, combination_index: 2, type: 'BOARDING_OUTSIDE_COUNTY', school: null },
        { id: 9, combination_index: 2, type: 'BOARDING_OUTSIDE_COUNTY', school: null },
        { id: 10, combination_index: 2, type: 'BOARDING_WITHIN_COUNTY', school: null },
        { id: 11, combination_index: 2, type: 'DAY_WITHIN_SUB_COUNTY', school: null },
    ]);

    const applyRecommendations = async () => {
        setIsLoading(true);
        try {
            const recommendations = await RecommendationService.getRecommendations(MOCK_PROFILE, MOCK_ASSESSMENT);

            const updatedSlots = [...slots];
            recommendations.forEach((recSchool: any) => {
                const targetSlot = updatedSlots.find(s =>
                    s.combination_index === recSchool.combination_idx &&
                    s.type === recSchool.selection_type &&
                    s.school === null
                );
                if (targetSlot) targetSlot.school = recSchool;
            });
            setSlots(updatedSlots);
        } catch (error) {
            console.error("Failed to apply recommendations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectSchool = (slotId: number, school: School) => {
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, school } : s));
    };

    const handleRemoveSchool = (slotId: number) => {
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, school: null } : s));
    };

    const getSlotLabel = (type: string) => {
        switch (type) {
            case 'BOARDING_OUTSIDE_COUNTY': return 'Boarding (Out-of-County)';
            case 'BOARDING_WITHIN_COUNTY': return 'Boarding (In-County)';
            case 'DAY_WITHIN_SUB_COUNTY': return 'Day School (Sub-County)';
            default: return 'School';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Senior School Selection</h2>
                    <p className="text-slate-500 max-w-lg mt-1">
                        Select 12 schools distributed across your 3 chosen subject combinations.
                    </p>
                </div>
                <div className="bg-primary-blue/5 border border-primary-blue/20 px-4 py-2 rounded-full flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                                {slots.filter(s => s.combination_index === i - 1 && s.school).length}/4
                            </div>
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-primary-blue">Total: {slots.filter(s => s.school).length}/12</span>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8 bg-slate-100 p-1 rounded-xl h-14">
                    <TabsTrigger value="0" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Combination 1</TabsTrigger>
                    <TabsTrigger value="1" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Combination 2</TabsTrigger>
                    <TabsTrigger value="2" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Combination 3</TabsTrigger>
                </TabsList>

                {[0, 1, 2].map((comboIdx) => (
                    <TabsContent key={comboIdx} value={comboIdx.toString()} className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Slots Column */}
                            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {slots.filter(s => s.combination_index === comboIdx).map((slot) => (
                                    <div key={slot.id} className="group relative">
                                        <Card className={cn(
                                            "h-full border-2 border-dashed transition-all duration-300",
                                            slot.school ? "border-solid border-primary-blue ring-4 ring-primary-blue/5" : "hover:border-slate-300 hover:bg-slate-50"
                                        )}>
                                            <CardHeader className="p-4 pb-0">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{getSlotLabel(slot.type)}</span>
                                                    {slot.school && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => handleRemoveSchool(slot.id)}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2 flex flex-col items-center justify-center text-center min-h-[120px]">
                                                {slot.school ? (
                                                    <div className="animate-in zoom-in-95 duration-200">
                                                        <SchoolIcon className="w-8 h-8 text-primary-blue mb-2 mx-auto" />
                                                        <h4 className="font-display font-bold text-slate-900 leading-tight">{slot.school.school_name}</h4>
                                                        <div className="flex justify-center gap-1 mt-2">
                                                            <Badge variant="secondary" className="text-[9px] px-1 h-4">{slot.school.category}</Badge>
                                                            <Badge variant="outline" className="text-[9px] px-1 h-4">{slot.school.cluster}</Badge>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-blue/10 group-hover:text-primary-blue transition-colors">
                                                            <Plus className="w-5 h-5" />
                                                        </div>
                                                        <p className="text-xs text-slate-400 font-medium">Add School</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                        {!slot.school && (
                                            <button
                                                className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
                                                onClick={() => handleSelectSchool(slot.id, MOCK_SCHOOLS[Math.floor(Math.random() * MOCK_SCHOOLS.length)])}
                                                aria-label="Add school"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendation Banner */}
                        <div className="mt-8 bg-gradient-to-r from-primary-blue to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-primary-blue/20 overflow-hidden relative">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Info className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-bold">PathwayFit™ Recommendation</h3>
                                        <p className="text-white/80 text-sm">Our algorithm has identified schools that match your STEM aptitude.</p>
                                    </div>
                                </div>
                                <Button
                                    className="bg-white text-primary-blue hover:bg-white/90 font-bold px-8 h-12 rounded-xl shadow-lg border-none"
                                    onClick={applyRecommendations}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Suggesting...</>
                                    ) : (
                                        "Apply Suggestions"
                                    )}
                                </Button>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="bg-orange-50/50 border-orange-100">
                    <CardContent className="p-4 flex gap-4">
                        <MapPin className="w-6 h-6 text-orange-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-orange-800 text-sm">Geographic Balancing</h4>
                            <p className="text-xs text-orange-700/80 mt-1">Remember to pick 6 schools outside your county to ensure regional equity.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50/50 border-green-100">
                    <CardContent className="p-4 flex gap-4">
                        <Building2 className="w-6 h-6 text-green-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-green-800 text-sm">Boarding Capacity</h4>
                            <p className="text-xs text-green-700/80 mt-1">9 schools must be Boarding to qualify for Ministry residential quotas.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-indigo-50/50 border-indigo-100">
                    <CardContent className="p-4 flex gap-4">
                        <Info className="w-6 h-6 text-indigo-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-indigo-800 text-sm">Academic Merit</h4>
                            <p className="text-xs text-indigo-700/80 mt-1">Schools in Cluster C1 (National) require Achievement Level 7+.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
