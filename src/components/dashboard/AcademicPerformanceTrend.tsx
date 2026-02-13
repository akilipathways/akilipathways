import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AcademicData {
    grade: string;
    score: number;
    average: number;
}

const data: AcademicData[] = [
    { grade: "Grade 6 (KPSEA)", score: 340, average: 300 },
    { grade: "Grade 7 (SBA)", score: 78, average: 65 },
    { grade: "Grade 8 (SBA)", score: 82, average: 68 },
    { grade: "Grade 9 (Proj)", score: 85, average: 70 },
];

export function AcademicPerformanceTrend() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Academic Performance Trajectory</CardTitle>
                <CardDescription>
                    Longitudinal progress from Grade 6 to Grade 9
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="grade" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="score"
                                name="Your Score"
                                stroke="#2C5AA0"
                                strokeWidth={3}
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="average"
                                name="National Avg"
                                stroke="#94A3B8"
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
