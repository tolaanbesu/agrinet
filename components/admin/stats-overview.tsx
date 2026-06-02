"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, AlertTriangle, ShieldCheck, TrendingUp, ArrowUpRight } from "lucide-react";

interface StatsOverviewProps {
    stats: {
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        pendingVerifications: number;
        reports: number;
    };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    const items = [
        {
            title: "Platform Users",
            value: stats.totalUsers,
            icon: Users,
            description: "Registered & Active",
            gradient: "from-blue-500 to-indigo-600",
            shadow: "shadow-blue-500/20",
        },
        {
            title: "Market Inventory",
            value: stats.totalProducts,
            icon: Package,
            description: "Verified Listings",
            gradient: "from-emerald-500 to-teal-600",
            shadow: "shadow-emerald-500/20",
        },
        {
            title: "Transaction Flow",
            value: stats.totalOrders,
            icon: ShoppingCart,
            description: "Orders Processing",
            gradient: "from-violet-500 to-purple-600",
            shadow: "shadow-violet-500/20",
        },
        {
            title: "Trust Queue",
            value: stats.pendingVerifications,
            icon: ShieldCheck,
            description: "Identity Verification",
            gradient: "from-amber-500 to-orange-600",
            shadow: "shadow-amber-500/20",
        },
        {
            title: "System Integrity",
            value: stats.reports,
            icon: AlertTriangle,
            description: "Critical Reports",
            gradient: "from-rose-500 to-red-600",
            shadow: "shadow-rose-500/20",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {items.map((item, index) => (
                <Card 
                    key={item.title} 
                    className={`border-none shadow-xl ${item.shadow} group hover:scale-[1.02] transition-all duration-500 overflow-hidden relative`}
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-[0.03] group-hover:opacity-10 rounded-full -mr-12 -mt-12 transition-all duration-700`}></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">{item.title}</CardTitle>
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg shadow-black/10 group-hover:rotate-12 transition-transform duration-500`}>
                            <item.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                             <div className="text-3xl font-black tracking-tighter">{item.value.toLocaleString()}</div>
                             <div className="text-[10px] font-bold text-emerald-500 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                                +2%
                             </div>
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground mt-2 flex items-center gap-1 group-hover:text-primary transition-colors">
                            {item.description}
                            <ArrowUpRight className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-4px] group-hover:translate-x-0" />
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
