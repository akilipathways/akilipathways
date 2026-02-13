import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardService, StudentSummary } from "@/services/dashboardService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export function TeacherDashboard() {
    const { user } = useAuth();
    const [students, setStudents] = useState<StudentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [gradeFilter, setGradeFilter] = useState<number | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            if (user) {
                const data = await dashboardService.getTeacherStudents(user.id);
                setStudents(data);
            }
            setLoading(false);
        };
        fetchStudents();
    }, [user]);

    const filteredStudents = students.filter(s => {
        const matchesGrade = gradeFilter === 'ALL' || s.grade_level === gradeFilter;
        const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGrade && matchesSearch;
    });

    if (loading) {
        return <div className="p-8 text-center">Loading class roster...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">
                        Teacher Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Managing {students.length} students at {students[0]?.school_name || "Your School"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export Report</Button>
                    <Button>Add Student</Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search student name..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setGradeFilter('ALL')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${gradeFilter === 'ALL' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            All Grades
                        </button>
                        {[7, 8, 9].map(grade => (
                            <button
                                key={grade}
                                onClick={() => setGradeFilter(grade)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${gradeFilter === grade ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Grade {grade}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Student Grid/Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map(student => (
                    <Card key={student.id} className="hover:border-primary-blue/50 transition-colors cursor-pointer group">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    {student.full_name.charAt(0)}
                                </div>
                                <Badge variant={student.grade_level === 9 ? "default" : "secondary"}>
                                    Grade {student.grade_level}
                                </Badge>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{student.full_name}</h3>
                            <p className="text-sm text-slate-500 mb-4">ID: {student.id.split('-')[0]}...</p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Pathway Fit</span>
                                    <span className="font-medium flex items-center gap-1">
                                        {student.primary_pathway}
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${student.pathway_confidence! > 75 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {student.pathway_confidence}%
                                        </span>
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Recent Score</span>
                                    <span className="font-medium">{student.last_assessment_score}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <p>No students found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
