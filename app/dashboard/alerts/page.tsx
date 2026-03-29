import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AlertsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in");

    // Fetch alerts from the database
    const alerts = await prisma.marketAlert.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            postedBy: {
                select: { name: true, verificationStatus: true }
            }
        }
    });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard" 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Bell className="w-6 h-6 text-amber-500" />
                            Market Alerts & Trends
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Real-time updates from agricultural experts
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                    {alerts.length} Active Updates
                </Badge>
            </div>

            <div className="grid gap-4">
                {alerts.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-slate-50">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No alerts yet</h3>
                        <p className="text-slate-500">Check back later for market updates.</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <Card key={alert.id} className="group overflow-hidden border-none shadow-sm ring-1 ring-slate-200 hover:ring-primary/50 transition-all">
                            <div className="flex flex-col md:flex-row">
                                {/* Side Accent (Changes color based on potential priority) */}
                                <div className="w-full md:w-2 bg-amber-500" />
                                
                                <div className="flex-1">
                                    <CardHeader className="pb-2">
                                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                            <div className="flex gap-2">
                                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {alert.region}
                                                </Badge>
                                                <Badge variant="outline" className="bg-white text-gray-700">
                                                    Market Trend
                                                </Badge>
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(alert.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            {alert.title}
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-4">
                                        <p className="text-slate-600 leading-relaxed">
                                            {alert.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {alert.postedBy?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-900 leading-none">
                                                        {alert.postedBy?.name}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                        {alert.postedBy?.verificationStatus === "VERIFIED" ? "Verified Expert" : "Not Verified"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}