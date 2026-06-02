"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    ShieldAlert,
    UserX,
    UserCheck,
    Trash2,
    RotateCcw,
    Zap,
    History
} from "lucide-react";
import { toggleUserBan, updateVerificationStatus, deleteUser } from "@/actions/admin-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function UserModerationActions({ user: initialUser }: { user: any }) {
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggleBan = async () => {
        setLoading(true);
        try {
            await toggleUserBan(user.id, !user.isBanned);
            setUser({ ...user, isBanned: !user.isBanned });
            toast.success(user.isBanned ? "User account restored successfully" : "User account has been suspended", {
                description: `Action performed for ${user.email}`,
                icon: user.isBanned ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />
            });
        } catch (error) {
            toast.error("Process failed", {
                description: "Unable to update account suspension status."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (status: "VERIFIED" | "REJECTED" | "PENDING") => {
        setLoading(true);
        try {
            await updateVerificationStatus(user.id, status as any);
            setUser({ ...user, verificationStatus: status });
            toast.success(`Identity status: ${status}`, {
                description: `Records updated for ${user.name}`,
                icon: status === "VERIFIED" ? <ShieldCheck className="h-4 w-4" /> : status === "REJECTED" ? <ShieldAlert className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />
            });
        } catch (error) {
            toast.error("Verification update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("CRITICAL WARNING: This action is permanent. Deleting this user will remove all their historical data, products, orders, and logs. Proceed?")) {
            return;
        }

        setLoading(true);
        try {
            await deleteUser(user.id);
            toast.success("Account deleted", {
                description: "All records have been permanently removed."
            });
            router.push("/dashboard/admin?tab=users");
        } catch (error) {
            toast.error("Deletion failed", {
                description: "Critical dependencies found. Consider suspending instead."
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    {user.verificationStatus !== "PENDING" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerify("PENDING")}
                            disabled={loading}
                            className="h-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted"
                        >
                            <History className="mr-1.5 h-3 w-3" />
                            Reset Queue
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                        onClick={() => handleVerify("VERIFIED")}
                        className={`h-16 rounded-2xl border-none shadow-sm transition-all duration-300 font-bold text-lg flex items-center justify-start gap-4 px-6 ${user.verificationStatus === "VERIFIED"
                            ? "bg-emerald-500 hover:bg-emerald-600 ring-4 ring-emerald-500/10"
                            : "bg-background border-2 border-muted hover:bg-muted"
                            }`}
                        variant={user.verificationStatus === "VERIFIED" ? "default" : "outline"}
                        disabled={loading || user.verificationStatus === "VERIFIED"}
                    >
                        <div className={`p-2 rounded-xl bg-white/20`}>
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="leading-tight">Approve</p>                        </div>
                    </Button>

                    <Button
                        onClick={() => handleVerify("REJECTED")}
                        className={`h-16 rounded-2xl border-none shadow-sm transition-all duration-300 font-bold text-lg flex items-center justify-start gap-4 px-6 ${user.verificationStatus === "REJECTED"
                            ? "bg-rose-500 hover:bg-rose-600 ring-4 ring-rose-500/10 text-white"
                            : "bg-background border-2 border-muted hover:bg-muted text-rose-500"
                            }`}
                        variant={user.verificationStatus === "REJECTED" ? "default" : "outline"}
                        disabled={loading || user.verificationStatus === "REJECTED"}
                    >
                        <div className={`p-2 rounded-xl bg-rose-500/10`}>
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="leading-tight">Reject</p>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">
                    Account Suspension
                </h3>

                <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-muted/30 border-2 border-dashed border-muted-foreground/10">
                    <div className="space-y-1">
                        <p className="font-bold">System Suspension</p>
                        <p className="text-xs text-muted-foreground font-medium">Prevent all platform interactions immediately.</p>
                    </div>
                    <Button
                        variant={user.isBanned ? "default" : "destructive"}
                        onClick={handleToggleBan}
                        disabled={loading}
                        className="rounded-full px-8 h-12 font-black tracking-tighter uppercase shadow-sm"
                    >
                        {user.isBanned ? (
                            <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Release Hold
                            </>
                        ) : (
                            <>
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend Account
                            </>
                        )}
                    </Button>
                </div>

                <div className="flex items-center justify-center pt-2">
                    <Button
                        variant="ghost"
                        className="text-xs font-bold text-red-600/60 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
