"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Clock, User } from "lucide-react";

interface AuditLogViewProps {
    logs: any[];
}

export function AuditLogView({ logs }: AuditLogViewProps) {
    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] border-dashed border-2 rounded-lg text-muted-foreground">
                <Activity className="h-10 w-10 mb-2 opacity-20" />
                <p>No activity logs found.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    System Activity Logs
                </h3>
                <p className="text-sm text-muted-foreground">Recent actions performed across the platform.</p>
            </div>
            <ScrollArea className="h-[500px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead>Admin/User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead className="text-right">ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">{log.user?.name || "System"}</div>
                                            <div className="text-[10px] text-muted-foreground">{log.user?.email || "internal@agrinet.com"}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono text-[10px]">
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono text-[10px] text-muted-foreground">
                                    {log.id.slice(0, 8)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
