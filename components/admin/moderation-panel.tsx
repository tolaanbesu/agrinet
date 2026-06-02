"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    Clock,
    ShieldAlert,
    Scale,
    Gavel
} from "lucide-react";
import { resolveReport } from "@/actions/admin-actions";
import { toast } from "sonner";

interface ModerationPanelProps {
    reports: any[];
}

export function ModerationPanel({ reports: initialReports }: ModerationPanelProps) {
    const [reports, setReports] = useState(initialReports);
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (reportId: string, userId: string, action: "BAN" | "DISMISS") => {
        setLoading(reportId);
        try {
            await resolveReport(reportId, userId, action);
            setReports(reports.filter(r => r.id !== reportId));
            toast.success(action === "BAN" ? "User suspended and report closed" : "Report dismissed successfully");
        } catch (error) {
            toast.error("Failed to process moderation action");
        } finally {
            setLoading(null);
        }
    };

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-muted rounded-3xl text-muted-foreground animate-in fade-in duration-500">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 opacity-20 text-emerald-500" />
                </div>
                <p className="font-black uppercase tracking-widest text-xs opacity-50">Justice System Clear</p>
                <p className="text-[10px] mt-2 italic font-medium">No pending user reports found in the queue.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <div className="h-8 w-1 bg-rose-500 rounded-full"></div>
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <Scale className="h-5 w-5 text-rose-500" />
                    Reported Messages
                </h2>
            </div>

            <div className="grid gap-6">
                {reports.map((report) => (
                    <Card key={report.id} className="border border-muted/50 shadow-sm bg-card/60 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden group hover:scale-[1.002] transition-transform">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        <CardHeader className="pb-3 px-8 pt-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                            <ShieldAlert className="h-4 w-4" />
                                            ID #{report.id.slice(0, 8).toUpperCase()}
                                        </CardTitle>
                                        <Badge variant="outline" className="rounded-full bg-muted/30 border-none text-[10px] font-bold px-3">
                                            <Clock className="h-3 w-3 mr-1.5 opacity-60" />
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </Badge>
                                    </div>
                                    <div className="text-[11px] font-medium text-muted-foreground pt-1">
                                        Source: <span className="text-foreground font-bold">{report.reporter.name}</span> <span className="opacity-40 italic">({report.reporter.email})</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-rose-500/5 rounded-2xl -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                                <div className="relative bg-muted/30 p-5 rounded-2xl border-2 border-rose-500/10 italic text-sm font-medium leading-relaxed">
                                    "{report.reason}"
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Report Target</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                                            {report.reportedUser.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold tracking-tight">{report.reportedUser.name}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground">{report.reportedUser.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest border-2 hover:bg-muted"
                                        onClick={() => handleAction(report.id, report.reportedUserId, "DISMISS")}
                                        disabled={loading === report.id}
                                    >
                                        Dismiss Case
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="destructive"
                                        className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm bg-rose-500 hover:bg-rose-600 border-none flex items-center gap-2"
                                        onClick={() => handleAction(report.id, report.reportedUserId, "BAN")}
                                        disabled={loading === report.id}
                                    >
                                        <Gavel className="h-4 w-4" />
                                        Authorize Suspension
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
