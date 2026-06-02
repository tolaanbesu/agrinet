import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getUserById, updateVerificationStatus, toggleUserBan, deleteUser } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    ShieldCheck, 
    ShieldAlert, 
    UserX, 
    UserCheck, 
    Trash2, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar,
    FileText,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import UserModerationActions from "@/components/admin/user-moderation-actions";

export default async function UserDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const user = await getUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/admin?tab=users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                    <p className="text-muted-foreground mt-1">
                        Moderate and manage {user.name}&apos;s account.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* User Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.profileImage || user.image || ""} />
                                <AvatarFallback className="text-2xl">
                                    {user.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl">{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline">{user.role}</Badge>
                                <Badge
                                    variant={user.verificationStatus === "VERIFIED" ? "default" : user.verificationStatus === "PENDING" ? "secondary" : "destructive"}
                                >
                                    {user.verificationStatus}
                                </Badge>
                                {user.isBanned && (
                                    <Badge variant="destructive">BANNED</Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user.email}</span>
                        </div>
                        {user.phone && (
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                        {user.location && (
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Moderation & Verification */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Management Actions</CardTitle>
                            <CardDescription>Control user access and verification status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserModerationActions user={user} />
                        </CardContent>
                    </Card>

                    {user.verificationDocument && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Verification Document
                                </CardTitle>
                                <CardDescription>Submitted document for verification.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    {user.verificationDocument.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                        <div className="space-y-4">
                                            <img 
                                                src={user.verificationDocument} 
                                                alt="Verification Document" 
                                                className="max-h-[500px] w-full object-contain rounded-md shadow-sm"
                                            />
                                            <Button variant="outline" className="w-full" asChild>
                                                <a href={user.verificationDocument} target="_blank" rel="noopener noreferrer">
                                                    View Original Image
                                                </a>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                            <FileText className="h-16 w-16 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground text-center">
                                                This document might be a PDF or other file type.
                                            </p>
                                            <Button asChild>
                                                <a href={user.verificationDocument} target="_blank" rel="noopener noreferrer">
                                                    Open Document
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
