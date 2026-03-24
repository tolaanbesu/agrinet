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
import { MoreHorizontal, ShieldAlert, ShieldCheck, UserX, UserCheck, Trash2 } from "lucide-react";
import { toggleUserBan, updateVerificationStatus, deleteUser } from "@/actions/admin-actions";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
                        <TableRow key={user.id}>
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
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleToggleBan(user.id, user.isBanned)}>
                                            {user.isBanned ? <UserCheck className="mr-2 h-4 w-4" /> : <UserX className="mr-2 h-4 w-4" />}
                                            {user.isBanned ? "Unban User" : "Ban User"}
                                        </DropdownMenuItem>

                                        {user.verificationStatus === "PENDING" && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleVerify(user.id, "VERIFIED")}>
                                                    <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                                                    Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleVerify(user.id, "REJECTED")}>
                                                    <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />
                                                    Reject
                                                </DropdownMenuItem>
                                            </>
                                        )}

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
