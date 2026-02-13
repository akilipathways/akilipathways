import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
    { grade: "G6", STEM: 60, SOSC: 40, ARTS: 30 },
    { grade: "G7", STEM: 65, SOSC: 45, ARTS: 35 },
    { grade: "G8", STEM: 75, SOSC: 42, ARTS: 38 },
    { grade: "G9", STEM: 88, SOSC: 40, ARTS: 35 },
];

export function PathwayFitEvolution() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pathway Fit™ Evolution</CardTitle>
                <CardDescription>
                    How your affinity has changed over time
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorSTEM" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2C5AA0" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#2C5AA0" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSOSC" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0D9276" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0D9276" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorARTS" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="grade" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Area
                                type="monotone"
                                dataKey="STEM"
                                stroke="#2C5AA0"
                                fillOpacity={1}
                                fill="url(#colorSTEM)"
                            />
                            <Area
                                type="monotone"
                                dataKey="SOSC"
                                stroke="#0D9276"
                                fillOpacity={1}
                                fill="url(#colorSOSC)"
                            />
                            <Area
                                type="monotone"
                                dataKey="ARTS"
                                stroke="#D97706"
                                fillOpacity={1}
                                fill="url(#colorARTS)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary-blue" /> STEM
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary-teal" /> Social
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent-orange" /> Arts
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
