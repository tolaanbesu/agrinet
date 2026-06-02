import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Users,
    Package,
    ShoppingCart,
    AlertTriangle
} from "lucide-react";

import {
    getAdminStats,
    getUsers,
    getReports,
    getAuditLogs,
    getProducts
} from "@/actions/admin-actions";

import { StatsOverview } from "@/components/admin/stats-overview";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { UserManagement } from "@/components/admin/user-management";
import { ProductManagement } from "@/components/admin/product-management";
import { ModerationPanel } from "@/components/admin/moderation-panel";
import { AuditLogView } from "@/components/admin/audit-log-view";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const { tab } = await searchParams;
    const defaultTab = tab || "overview";

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const [stats, users, reports, logs, products] = await Promise.all([
        getAdminStats(),
        getUsers(),
        getReports(),
        getAuditLogs(),
        getProducts(),
    ]);

    const fallbackStats = [
        { title: "Total Users", value: "0", icon: Users, description: "Registered platform users" },
        { title: "Total Products", value: "0", icon: Package, description: "Active listings" },
        { title: "Total Orders", value: "0", icon: ShoppingCart, description: "Transactions handled" },
        { title: "Active Reports", value: "0", icon: AlertTriangle, description: "Need attention" },
    ];

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Control Panel</h1>
                <p className="text-muted-foreground mt-1">
                    Overview of the AGRINET system and user management.
                </p>
            </div>
            <Tabs value={defaultTab} className="space-y-6">
                <TabsContent value="overview" className="space-y-8">
                    <StatsOverview stats={stats} />
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {fallbackStats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={stat.title} className="border-none shadow-md bg-gradient-to-br from-card to-muted/30">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                            {stat.title}
                                        </CardTitle>
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Icon className="h-4 w-4 text-primary" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {stat.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <AnalyticsCharts
                        usersByRole={stats.usersByRole}
                        ordersTrend={stats.ordersTrend}
                    />
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <UserManagement initialUsers={users} />
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                    <ProductManagement initialProducts={products} />
                </TabsContent>

                <TabsContent value="moderation" className="space-y-4">
                    <ModerationPanel reports={reports} />
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                    <AuditLogView logs={logs} />
                </TabsContent>
            </Tabs>

        </div>
    );
}