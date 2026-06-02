"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    PieChart,
    Pie,
    LineChart,
    Line,
    CartesianGrid,
    AreaChart,
    Area
} from "recharts";

interface AnalyticsChartsProps {
    usersByRole: { name: string; value: number }[];
    ordersTrend: { date: string; count: number }[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export function AnalyticsCharts({ usersByRole, ordersTrend }: AnalyticsChartsProps) {
    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border border-muted/50 shadow-md bg-card/40 backdrop-blur-xl overflow-hidden">
                <CardHeader className="pb-0 pt-6 px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight">Growth Velocity</CardTitle>
                            <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60 mt-1">
                                Transaction Volume • Last 7 Epochs
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-[10px] font-black text-primary uppercase">Live Feed</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 pt-6">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ordersTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    fontFamily="Inter, sans-serif"
                                    fontWeight={600}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                    dx={-10}
                                    fontFamily="Inter, sans-serif"
                                    fontWeight={600}
                                />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(0,0,0,0.8)', 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        color: '#fff',
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                                        backdropFilter: 'blur(8px)',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={0}
                                    dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3 border border-muted/50 shadow-md bg-card/40 backdrop-blur-xl flex flex-col">
                <CardHeader className="pt-6 px-6">
                    <CardTitle className="text-xl font-black tracking-tight">Ecosystem Mix</CardTitle>
                    <CardDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60 mt-1">
                        Active User Segment Distribution
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={usersByRole}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {usersByRole.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                            className="hover:opacity-80 transition-opacity cursor-pointer shadow-2xl"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                     contentStyle={{ 
                                        backgroundColor: 'rgba(255,255,255,0.95)', 
                                        borderRadius: '12px', 
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        fontSize: '11px',
                                        fontWeight: 'black'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-8 px-4">
                        {usersByRole.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-muted-foreground/5 hover:bg-muted/50 transition-colors">
                                <div
                                    className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">{entry.name}</span>
                                    <span className="text-sm font-bold tracking-tight">{entry.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
