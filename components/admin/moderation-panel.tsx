"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserX } from "lucide-react";

interface ModerationPanelProps {
    reports: any[];
}

export function ModerationPanel({ reports }: ModerationPanelProps) {
    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] border-dashed border-2 rounded-lg text-muted-foreground">
                <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
                <p>No active reports to moderate.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <Card key={report.id}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold">Report #{report.id.slice(0, 8)}</CardTitle>
                            <Badge variant="outline">{new Date(report.createdAt).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>
                            Reported by: <span className="font-medium">{report.reporter.name}</span> ({report.reporter.email})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-3 rounded-md mb-4 text-sm italic">
                            "{report.reason}"
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs text-muted-foreground">Target User:</span>
                                <p className="text-sm font-medium">{report.reportedUser.name} ({report.reportedUser.email})</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="destructive" className="flex items-center gap-2">
                                    <UserX className="h-4 w-4" />
                                    Take Action (Ban)
                                </Button>
                                <Button size="sm" variant="outline">Dismiss</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
