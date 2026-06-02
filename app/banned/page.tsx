import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, LogOut, Mail } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BannedPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user.isBanned) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-rose-500/10 flex items-center justify-center ring-8 ring-rose-500/5">
                        <AlertTriangle className="h-12 w-12 text-rose-500" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black tracking-tighter text-rose-500 uppercase">Access Denied</h1>
                    <p className="text-muted-foreground font-medium">
                        Your account has been suspended for violating our platform's community guidelines or safety protocols.
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-muted/30 border-2 border-dashed border-muted-foreground/10 space-y-4">
                    <div className="flex items-start gap-4 text-left">
                        <div className="mt-1 h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                            <Mail className="h-4 w-4 text-rose-500" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Dispute this action?</p>
                            <p className="text-xs text-muted-foreground">If you believe this was a mistake, please contact our support team at <span className="text-rose-500 font-bold">legal@agrinet.com</span> with your User ID.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button variant="outline" className="h-12 rounded-xl font-bold gap-2" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Return to Home
                        </Link>
                    </Button>
                </div>

                <div className="pt-8 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40">
                    System Security Protocol • AGRINET-7
                </div>
            </div>
        </div>
    );
}
