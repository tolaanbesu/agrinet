import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AlertClientList from "./alert-client-list"; // We'll create this next

export default async function AlertsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in");
    if (session.user.role !== "EXPERT") redirect("/dashboard");

    const alerts = await prisma.marketAlert.findMany({
        where: { postedById: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Megaphone className="text-red-500 w-8 h-8" />
                        Market Alerts
                    </h1>
                    <p className="text-muted-foreground mt-1">Broadcast updates to the community.</p>
                </div>
                <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">Expert Portal</Badge>
            </header>

            {/* Pass the data to the Client Component */}
            <AlertClientList initialAlerts={alerts} />
        </div>
    );
}