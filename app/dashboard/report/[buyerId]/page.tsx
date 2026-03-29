import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import ReportForm from "../reportForm";

export default async function ReportPage(props: {
  params: Promise<{ buyerId: string }>;
}) {
  const { buyerId } = await props.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const reportedUser = await prisma.user.findUnique({
    where: { id: buyerId },
  });

  if (!reportedUser) redirect("/dashboard");

  // This remains a Server Action
  async function submitReport(formData: FormData) {
    "use server";
    const reason = formData.get("reason") as string;

    if (!reason || reason.length < 10) return { error: "Reason too short" };

    try {
      await prisma.report.create({
        data: {
          reporterId: session!.user.id,
          reportedUserId: buyerId,
          reason,
        },
      });
      return { success: true };
    } catch (e) {
      return { error: "Something went wrong" };
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-xl w-full shadow-lg border-red-100">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">Security & Trust</span>
          </div>
          <CardTitle className="text-2xl font-bold">Submit a Report</CardTitle>
          <CardDescription>
            You are reporting <span className="font-semibold text-foreground">{reportedUser.name || "this user"}</span>. 
            Please provide clear details about the issue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportForm submitReport={submitReport} />
        </CardContent>
      </Card>
    </div>
  );
}
