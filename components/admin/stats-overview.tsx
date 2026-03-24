"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, AlertTriangle, ShieldCheck } from "lucide-react";

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
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            description: "Registered platform users",
            color: "text-blue-500",
        },
        {
            title: "Active Products",
            value: stats.totalProducts,
            icon: Package,
            description: "Listings in marketplace",
            color: "text-green-500",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
            description: "Successful transactions",
            color: "text-purple-500",
        },
        {
            title: "Pending Approvals",
            value: stats.pendingVerifications,
            icon: ShieldCheck,
            description: "Farmers/Experts waiting",
            color: "text-orange-500",
        },
        {
            title: "Active Reports",
            value: stats.reports,
            icon: AlertTriangle,
            description: "Moderation requested",
            color: "text-red-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {items.map((item) => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
