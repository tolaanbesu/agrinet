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