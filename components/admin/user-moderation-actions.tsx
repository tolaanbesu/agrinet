"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    ShieldCheck, 
    ShieldAlert, 
    UserX, 
    UserCheck, 
    Trash2,
    RotateCcw
} from "lucide-react";
import { toggleUserBan, updateVerificationStatus, deleteUser } from "@/actions/admin-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserModerationActions({ user: initialUser }: { user: any }) {
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggleBan = async () => {
        setLoading(true);
        try {
            await toggleUserBan(user.id, !user.isBanned);
            setUser({ ...user, isBanned: !user.isBanned });
            toast.success(user.isBanned ? "User unbanned" : "User banned");
        } catch (error) {
            toast.error("Failed to update user status");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (status: "VERIFIED" | "REJECTED" | "PENDING") => {
        setLoading(true);
        try {
            // We cast status to any here because updateVerificationStatus expects only VERIFIED | REJECTED 
            // but we might want to extend it or just handle it here.
            await updateVerificationStatus(user.id, status as any);
            setUser({ ...user, verificationStatus: status });
            toast.success(`User set to ${status.toLowerCase()}`);
        } catch (error) {
            toast.error("Failed to update verification status");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you absolutely sure? This action cannot be undone and will permanently delete the user's account and all associated data.")) {
            return;
        }

        setLoading(true);
        try {
            await deleteUser(user.id);
            toast.success("User deleted successfully");
            router.push("/dashboard/admin?tab=users");
        } catch (error) {
            toast.error("Failed to delete user. They might have active dependencies.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                {/* Verification Actions */}
                {user.verificationStatus === "PENDING" ? (
                    <>
                        <Button 
                            onClick={() => handleVerify("VERIFIED")} 
                            className="bg-green-600 hover:bg-green-700"
                            disabled={loading}
                        >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Approve Verification
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => handleVerify("REJECTED")}
                            disabled={loading}
                        >
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Reject Verification
                        </Button>
                    </>
                ) : (
                    <Button 
                        variant="outline"
                        onClick={() => handleVerify("PENDING")}
                        disabled={loading}
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Verification to Pending
                    </Button>
                )}
            </div>

            <div className="border-t pt-6 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-4">
                    {/* Ban Action */}
                    <Button 
                        variant={user.isBanned ? "outline" : "destructive"} 
                        onClick={handleToggleBan}
                        disabled={loading}
                        className="w-40"
                    >
                        {user.isBanned ? (
                            <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Unban User
                            </>
                        ) : (
                            <>
                                <UserX className="mr-2 h-4 w-4" />
                                Ban User
                            </>
                        )}
                    </Button>
                </div>

                {/* Delete Action */}
                <Button 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                    onClick={handleDelete}
                    disabled={loading}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Permanently
                </Button>
            </div>
        </div>
    );
}
