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
    ExternalLink, 
    ShieldCheck, 
    ShieldAlert, 
    Clock, 
    MoreHorizontal,
    Search
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface UserManagementProps {
    initialUsers: any[];
}

export function UserManagement({ initialUsers }: UserManagementProps) {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(search.toLowerCase()) || 
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                        placeholder="Search identities by name or email..." 
                        className="pl-10 h-11 border-none shadow-sm bg-muted/50 focus-visible:ring-primary/20 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="hidden md:flex gap-2">
                    <Badge variant="outline" className="h-11 px-4 rounded-xl border-dashed">Total: {users.length}</Badge>
                </div>
            </div>

            <div className="rounded-3xl border border-muted-foreground/10 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-black/5">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b-muted-foreground/10">
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 pl-6">Profile Identifier</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Operational Role</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Trust Status</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right pr-6">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow 
                                    key={user.id}
                                    className="cursor-pointer hover:bg-muted/30 group transition-all duration-300 border-b-muted-foreground/5 last:border-0"
                                    onClick={() => window.location.href = `/dashboard/admin/users/${user.id}`}
                                >
                                    <TableCell className="py-5 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="h-11 w-11 rounded-xl shadow-lg ring-2 ring-background group-hover:ring-primary/20 transition-all duration-500">
                                                    <AvatarImage src={user.image} className="object-cover" />
                                                    <AvatarFallback className="rounded-xl font-bold bg-muted text-muted-foreground">
                                                        {user.name?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {user.isBanned && (
                                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full border-2 border-background ring-2 ring-rose-500/20 animate-pulse"></div>
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="font-black tracking-tight text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
                                                    {user.name}
                                                    {user.isBanned && <Badge className="h-4 px-1.5 rounded bg-rose-500 hover:bg-rose-500 text-[8px] font-black uppercase border-none">Suspended</Badge>}
                                                </div>
                                                <div className="text-[11px] font-medium text-muted-foreground/70">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black tracking-tighter bg-primary/5 text-primary border-primary/20">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        {user.verificationStatus === "VERIFIED" ? (
                                            <div className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-black uppercase tracking-tighter">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                                Verified
                                            </div>
                                        ) : user.verificationStatus === "REJECTED" ? (
                                            <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-black uppercase tracking-tighter">
                                                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                                                Rejected
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-500 text-[11px] font-black uppercase tracking-tighter">
                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                                                Pending
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-5 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                        <Button variant="outline" size="sm" asChild className="rounded-xl h-9 hover:bg-primary hover:text-white transition-all shadow-sm">
                                            <Link href={`/dashboard/admin/users/${user.id}`}>
                                                <MoreHorizontal className="h-4 w-4 mr-2" />
                                                Moderate
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                                        <Search className="h-12 w-12" />
                                        <p className="text-sm font-bold uppercase tracking-widest">No matching identities found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
