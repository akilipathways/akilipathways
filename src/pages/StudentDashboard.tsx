import { useState } from "react";
import { GradeLevelSelector } from "@/components/dashboard/GradeLevelSelector";
import { AcademicPerformanceTrend } from "@/components/dashboard/AcademicPerformanceTrend";
import { PathwayFitEvolution } from "@/components/dashboard/PathwayFitEvolution";
import { PsychometricDomainProfile } from "@/components/dashboard/PsychometricDomainProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function StudentDashboard() {
    const [currentGrade, setCurrentGrade] = useState(9);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">
                        Welcome back, Juma!
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Grade 9 Student • St. Austin's Academy • Nairobi County
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <GradeLevelSelector currentGrade={currentGrade} onSelect={setCurrentGrade} />
                    <Button>View Full Report</Button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-primary-blue text-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm opacity-80 mb-1">Top Pathway Fit™</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-3xl font-bold">STEM</h3>
                        <span className="text-2xl font-bold opacity-90">92%</span>
                    </div>
                    <p className="text-xs mt-2 bg-white/20 px-2 py-1 rounded inline-block">High Confidence</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500 mb-1">KJSEA Prediction</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-3xl font-bold text-slate-900">342<span className="text-lg text-slate-500">/500</span></h3>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">On Track</Badge>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500 mb-1">School Selection</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-3xl font-bold text-slate-900">8<span className="text-lg text-slate-500">/12</span></h3>
                        <p className="text-xs text-orange-600 font-medium">4 Pending</p>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                        <div className="bg-accent-orange h-full w-[66%]"></div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500 mb-1">Psychometric</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-3xl font-bold text-slate-900">7<span className="text-lg text-slate-500">/9</span></h3>
                        <Button variant="link" className="h-auto p-0 text-primary-blue">Resume</Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Next: Spatial Ability</p>
                </div>
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AcademicPerformanceTrend />
                <PathwayFitEvolution />
            </div>

            {/* Secondary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PsychometricDomainProfile />
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Next Steps</h3>
                        <ul className="space-y-4 mt-6">
                            <li className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center font-bold">1</div>
                                <div>
                                    <p className="font-semibold">Complete Spatial Ability Game</p>
                                    <p className="text-sm opacity-70">Estimated time: 15 mins</p>
                                </div>
                                <Button size="sm" variant="secondary" className="ml-auto">Start</Button>
                            </li>
                            <li className="flex gap-3 items-center opacity-75">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
                                <div>
                                    <p className="font-semibold">Finalize School Selections</p>
                                    <p className="text-sm opacity-70">4 schools remaining</p>
                                </div>
                                <Button size="sm" variant="ghost" className="ml-auto border border-white/20">Resume</Button>
                            </li>
                            <li className="flex gap-3 items-center opacity-50">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">3</div>
                                <div>
                                    <p className="font-semibold">Download Guidance Report</p>
                                    <p className="text-sm opacity-70">Available after steps 1-2</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
