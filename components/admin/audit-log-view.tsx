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
import { Activity, Clock, Shield, AlertCircle, Info, Zap, Trash2 } from "lucide-react";

interface AuditLogViewProps {
    logs: any[];
}

export function AuditLogView({ logs }: AuditLogViewProps) {
    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-muted rounded-3xl text-muted-foreground animate-in fade-in duration-500">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Activity className="h-8 w-8 opacity-20" />
                </div>
                <p className="font-black uppercase tracking-widest text-xs opacity-50">Log database is empty</p>
            </div>
        );
    }

    const getLogStyles = (action: string) => {
        const lowerAction = action.toLowerCase();

        // Critical / Serious Actions
        if (lowerAction.includes("delete") || lowerAction.includes("ban") || lowerAction.includes("rejected") || lowerAction.includes("suspend")) {
            return {
                bg: "bg-rose-500/10",
                text: "text-rose-500",
                border: "border-rose-500/20",
                icon: <Trash2 className="h-3 w-3" />,
                severity: "CRITICAL"
            };
        }

        // Warning / Important Actions
        if (lowerAction.includes("role") || lowerAction.includes("alert") || lowerAction.includes("verified") || lowerAction.includes("unbanned")) {
            return {
                bg: "bg-amber-500/10",
                text: "text-amber-500",
                border: "border-amber-500/20",
                icon: <Zap className="h-3 w-3" />,
                severity: "MODERATE"
            };
        }

        // Info / Routine Actions
        return {
            bg: "bg-blue-500/10",
            text: "text-blue-500",
            border: "border-blue-500/20",
            icon: <Info className="h-3 w-3" />,
            severity: "ROUTINE"
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                    <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Logs
                    </h2>
                </div>
                <Badge variant="outline" className="rounded-full bg-muted/50 px-3 font-bold border-none text-[10px] uppercase tracking-widest">
                    Last 50 Records
                </Badge>
            </div>

            <div className="rounded-3xl border border-muted-foreground/10 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm ring-1 ring-black/5">
                <ScrollArea className="h-[600px]">
                    <Table>
                        <TableHeader className="bg-muted/30 sticky top-0 z-10">
                            <TableRow className="hover:bg-transparent border-b-muted-foreground/10">
                                <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 pl-8 w-[200px]">Timeline</TableHead>
                                <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">User</TableHead>
                                <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Operation Detail</TableHead>
                                <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right pr-8">Context ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => {
                                const styles = getLogStyles(log.action);
                                return (
                                    <TableRow key={log.id} className="group hover:bg-muted/30 transition-all border-b-muted-foreground/5 last:border-0">
                                        <TableCell className="py-5 pl-8">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 font-black text-xs">
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {new Date(log.timestamp).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground/60 pl-5">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border-2 border-background shadow-sm overflow-hidden">
                                                    {log.user?.image ? (
                                                        <img src={log.user.image} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black tracking-tight">{log.user?.name || "System"}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium">{log.user?.email || "internal@system.agrinet"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${styles.bg} ${styles.text} ${styles.border} group-hover:scale-[1.02] transition-transform`}>
                                                {styles.icon}
                                                <span className="text-xs font-black tracking-tight">{log.action}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 text-right pr-8">
                                            <Badge variant="outline" className="font-mono text-[9px] px-2 py-0.5 rounded bg-muted/20 border-none text-muted-foreground/60 group-hover:text-primary transition-colors">
                                                RID-{log.id.slice(0, 8).toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
