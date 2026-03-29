import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { DirectUpload } from "./components/DirectUpload";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Edit2
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/sign-in");

  
  const statusColor = 
    user.verificationStatus === "VERIFIED" ? "bg-green-100 text-green-700 hover:bg-green-100" :
    user.verificationStatus === "PENDING" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
    "bg-red-100 text-red-700 hover:bg-red-100";

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and account security.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/profile/edit" className="flex items-center gap-2">
            <Edit2 size={16} />
            Edit Profile
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <User size={24} />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Public and private details associated with your account.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Field: Name */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User size={14} /> <span>Full Name</span>
              </div>
              <p className="font-medium text-base">{user.name || "Not set"}</p>
            </div>

            {/* Field: Email */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} /> <span>Email Address</span>
              </div>
              <p className="font-medium text-base">{user.email}</p>
            </div>

            {/* Field: Phone */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} /> <span>Phone Number</span>
              </div>
              <p className="font-medium text-base">{user.phone || "Not set"}</p>
            </div>

            {/* Field: Location */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} /> <span>Location</span>
              </div>
              <p className="font-medium text-base">{user.location || "Not set"}</p>
            </div>

            {/* Field: Verification */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck size={14} /> <span>Account Status</span>
              </div>
              <div>
                <Badge variant="secondary" className={statusColor}>
                  {user.verificationStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* FARMER VERIFICATION DOCUMENT */}
          {session.user.role === "FARMER" && (
            <div className="mt-10 pt-8 border-t">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-primary" size={20} />
                <h3 className="text-lg font-semibold">Farmer Verification</h3>
              </div>

              <div className="bg-muted/40 rounded-lg p-6 border border-dashed border-muted-foreground/20">
                {user.verificationDocument ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded border">
                        <FileText size={24} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Identity Document</p>
                        <p className="text-xs text-muted-foreground">Document is currently on file.</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={user.verificationDocument} target="_blank" className="flex items-center gap-2">
                        View Document <ExternalLink size={14} />
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm font-medium text-destructive mb-4">
                      Missing Verification Document
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      To sell on our platform, please upload your agricultural license or ID.
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                   <DirectUpload />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}