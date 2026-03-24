import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    FileText,
    HelpCircle,
    AlertTriangle,
    Users
} from "lucide-react";

import ContentStatsChart from "@/components/content-stats-chart";

export default async function ExpertDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in");
    if (session.user.role !== "EXPERT") redirect("/dashboard");

    const expertId = session.user.id;


    const [
    articlesCount,
    pendingQueriesCount,
    marketAlertsCount,
    followersCount,
    recentQueries
] = await Promise.all([
    prisma.article.count({
        where: { expertId }
    }),
    prisma.farmerQuery.count({
        where: { status: "OPEN" }
    }),
    prisma.marketAlert.count({
        where: { postedById: expertId }
    }),

    prisma.chat.findMany({
        where: { receiverId: expertId },
        select: { senderId: true },
        distinct: ["senderId"]
    }).then(res => res.length),

    prisma.farmerQuery.findMany({
        where: { status: "OPEN" },
        include: { farmer: true },
        orderBy: { createdAt: "desc" },
        take: 5
    })
]);

    const stats = [
        {
            title: "My Articles",
            value: articlesCount,
            icon: FileText,
            description: "Published content"
        },
        {
            title: "Pending Queries",
            value: pendingQueriesCount,
            icon: HelpCircle,
            description: "Farmer questions"
        },
        {
            title: "Market Alerts",
            value: marketAlertsCount,
            icon: AlertTriangle,
            description: "Active alerts"
        },
        {
            title: "Followers",
            value: followersCount,
            icon: Users,
            description: "Farmers reached"
        },
    ];

    const chartData = [
    { name: "Articles", value: articlesCount },
    { name: "Queries", value: pendingQueriesCount },
    { name: "Alerts", value: marketAlertsCount },
    { name: "Followers", value: followersCount },
];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Expert Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back, {session.user.name}.
                </p>
            </div>

            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Farmer Queries</CardTitle>
                        <CardDescription>
                            Farmers need your expert advice.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {recentQueries.length === 0 ? (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No pending queries.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentQueries.map((query) => (
                                    <div key={query.id} className="border-b pb-2">
                                        <p className="font-medium">
                                            {query.question}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            By {query.farmer?.name || "Farmer"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Content Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                    <ContentStatsChart data={chartData} />
                </CardContent>
                </Card>
            </div>
        </div>
    );
}