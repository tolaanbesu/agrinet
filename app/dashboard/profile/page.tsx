import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {DirectUpload} from "./components/DirectUpload"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/sign-in");

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ... existing fields: Name, Email, Phone, Location ... */}
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-semibold">{user.name || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-semibold">{user.phone || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold">{user.location || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verification</p>
            <p className="font-semibold">{user.verificationStatus}</p>
          </div>

          {/* FARMER VERIFICATION DOCUMENT */}
          {session.user.role === "FARMER" && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-1">Verification Document</p>

              {user.verificationDocument ? (
                <div className="flex flex-col space-y-2">
                  <a
                    href={user.verificationDocument}
                    target="_blank"
                    className="text-blue-500 underline text-sm"
                  >
                    View Uploaded Document
                  </a>
                </div>
              ) : (
                <p className="text-sm text-red-500 mb-2">
                  No document uploaded. Please upload your license for verification.
                </p>
              )}

              {/* Directly handles the file selection and API call */}
              <DirectUpload />
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/dashboard/profile/edit"
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Edit Profile
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}