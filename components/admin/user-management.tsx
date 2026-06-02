"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldAlert, ShieldCheck, UserX, UserCheck, Trash2, ExternalLink } from "lucide-react";
import { toggleUserBan, updateVerificationStatus, deleteUser } from "@/actions/admin-actions";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface UserManagementProps {
    initialUsers: any[];
}

export function UserManagement({ initialUsers }: UserManagementProps) {
    const [users, setUsers] = useState(initialUsers);

    const handleToggleBan = async (userId: string, isBanned: boolean) => {
        try {
            await toggleUserBan(userId, !isBanned);
            setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !isBanned } : u));
            toast.success(isBanned ? "User unbanned" : "User banned");
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    const handleVerify = async (userId: string, status: "VERIFIED" | "REJECTED") => {
        try {
            await updateVerificationStatus(userId, status);
            setUsers(users.map(u => u.id === userId ? { ...u, verificationStatus: status } : u));
            toast.success(`User ${status.toLowerCase()}`);
        } catch (error) {
            toast.error("Failed to verify user");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted");
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow 
                            key={user.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => window.location.href = `/dashboard/admin/users/${user.id}`}
                        >
                            <TableCell className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={user.verificationStatus === "VERIFIED" ? "default" : user.verificationStatus === "PENDING" ? "secondary" : "destructive"}
                                >
                                    {user.verificationStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {user.isBanned ? (
                                    <Badge variant="destructive">BANNED</Badge>
                                ) : (
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 border-none">ACTIVE</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/admin/users/${user.id}`}>
                                        Manage
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
