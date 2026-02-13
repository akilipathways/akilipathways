import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const domainData = [
    { domain: "Num", score: 8, fullName: "Numerical Reasoning" },
    { domain: "Ver", score: 6, fullName: "Verbal Reasoning" },
    { domain: "Abs", score: 7, fullName: "Abstract Reasoning" },
    { domain: "Mec", score: 8, fullName: "Mechanical Reasoning" },
    { domain: "Spa", score: 7, fullName: "Spatial Ability" },
    { domain: "Cre", score: 5, fullName: "Creative Thinking" },
    { domain: "Sit", score: 6, fullName: "Situational Judgement" },
];

export function PsychometricDomainProfile() {
    return (
        <Card className="col-span-2 md:col-span-1">
            <CardHeader>
                <CardTitle>Psychometric Profile (Stanine)</CardTitle>
                <CardDescription>
                    Performanc across 9 KNEC domains (1-9 Scale)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={domainData}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 9]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
                            <YAxis type="category" dataKey="domain" width={40} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-2 border rounded shadow-sm">
                                                <p className="font-bold">{data.fullName}</p>
                                                <p>Stanine Score: <span className="font-bold text-primary-blue">{data.score}</span></p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <ReferenceLine x={4} stroke="#666" strokeDasharray="3 3" label="Avg" />
                            <ReferenceLine x={6} stroke="#666" strokeDasharray="3 3" />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={30}>
                                {domainData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.score >= 7 ? '#2C5AA0' : entry.score >= 4 ? '#0D9276' : '#D97706'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
