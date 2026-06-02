import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getUserById } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    Mail, 
    Phone, 
    MapPin, 
    Calendar,
    FileText,
    ArrowLeft,
    Shield,
    Activity,
    User as UserIcon,
    Fingerprint
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
        <div className="flex-1 space-y-10 p-8 pt-6 max-w-7xl mx-auto">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-5">
                    <Button variant="outline" size="icon" asChild className="rounded-full h-12 w-12 border-2 hover:bg-muted transition-all">
                        <Link href="/dashboard/admin?tab=users">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                           <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
                           {user.isBanned && (
                               <Badge variant="destructive" className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20">
                                   Suspended
                               </Badge>
                           )}
                        </div>
                        <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2">
                            <Fingerprint className="h-4 w-4" />
                            User ID: <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded italic">{user.id}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/5 text-primary border-primary/20 font-bold text-sm">
                        {user.role}
                    </Badge>
                    <Badge
                        className={`px-4 py-1.5 rounded-full font-bold text-sm shadow-md ${
                            user.verificationStatus === "VERIFIED" 
                            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                            : user.verificationStatus === "PENDING" 
                            ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" 
                            : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                        }`}
                    >
                        {user.verificationStatus}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
                {/* Lateral Column - Profile Info */}
                <div className="md:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl overflow-hidden group">
                        <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-primary/40 relative">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        </div>
                        <CardHeader className="relative pt-0 pb-6 flex flex-col items-center -mt-16">
                            <div className="p-1.5 bg-background rounded-full shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                <Avatar className="h-32 w-32 border-4 border-background">
                                    <AvatarImage src={user.profileImage || user.image || ""} />
                                    <AvatarFallback className="text-4xl font-black bg-muted">
                                        {user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-center mt-6">
                                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                                <CardDescription className="text-base font-medium">{user.email}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-0 border-t bg-muted/5">
                            <div className="grid gap-5 py-6">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Email</p>
                                        <p className="text-sm font-semibold">{user.email}</p>
                                    </div>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover/item:bg-orange-500 group-hover/item:text-white transition-all duration-300">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Phone</p>
                                            <p className="text-sm font-semibold">{user.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-300">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Location</p>
                                            <p className="text-sm font-semibold">{user.location}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 group/item">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all duration-300">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Member Since</p>
                                        <p className="text-sm font-semibold">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-primary/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Growth Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-medium text-muted-foreground">Profile Completion</span>
                                    <span className="text-xs font-bold">85%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic mt-2 text-center font-medium">
                                    All required documents have been uploaded and verified.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Column - Moderation & Documents */}
                <div className="md:col-span-8 space-y-8">
                    {/* Management Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-8 w-1 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Governance & Moderation
                            </h2>
                        </div>
                        
                        <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl border border-white/5 shadow-black/5 ring-1 ring-black/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold">Account Interventions</CardTitle>
                                <CardDescription className="text-sm font-medium">Direct management tools for this specific account.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <UserModerationActions user={user} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Verification Document Section */}
                    {user.verificationDocument && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-8 w-1 bg-amber-500 rounded-full"></div>
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-amber-500" />
                                    Legal Verification
                                </h2>
                            </div>

                            <Card className="border-none shadow-2xl overflow-hidden group/doc ring-1 ring-black/5">
                                <CardHeader className="bg-muted/30 border-b">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg font-bold">Proof of Identity / License</CardTitle>
                                            <CardDescription className="font-medium">Original document submission for review.</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-background/50 font-bold uppercase tracking-tighter text-[10px]">
                                            Confidential
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="relative aspect-video md:aspect-[16/9] bg-muted/20 flex items-center justify-center overflow-hidden">
                                        {user.verificationDocument.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                            <div className="w-full h-full p-6 relative group">
                                                <img 
                                                    src={user.verificationDocument} 
                                                    alt="Verification Document" 
                                                    className="w-full h-full object-contain rounded-xl shadow-2xl group-hover:scale-[1.02] transition-all duration-700 pointer-events-none select-none"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                     <Button variant="outline" className="glass bg-white/20 text-white border-white/20 font-bold hover:bg-white hover:text-black transition-all" asChild>
                                                        <a href={user.verificationDocument} target="_blank" rel="noopener noreferrer">
                                                            Expand Image in New Tab
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-24 space-y-6 group">
                                                <div className="h-32 w-32 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-amber-500/10">
                                                    <FileText className="h-16 w-16" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-black tracking-tight">Non-visual Media File</p>
                                                    <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto mt-2">
                                                        This identity document is stored in a format that requires external viewing.
                                                    </p>
                                                </div>
                                                <Button size="lg" className="rounded-full shadow-2xl shadow-amber-500/20 px-10 h-14 font-black tracking-tighter uppercase" asChild>
                                                    <a href={user.verificationDocument} target="_blank" rel="noopener noreferrer">
                                                        Download / View Document
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
