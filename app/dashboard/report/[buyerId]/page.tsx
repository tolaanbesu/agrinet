import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, User } from "lucide-react";

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

  async function submitReport(formData: FormData) {
    "use server";
    const reason = formData.get("reason") as string;

    if (!reason || reason.length < 10) return;

    await prisma.report.create({
      data: {
        reporterId: session!.user.id,
        reportedUserId: buyerId,
        reason,
      },
    });

    redirect("/dashboard?reported=success");
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
          <form action={submitReport} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Reason for report
              </label>
              <Textarea
                name="reason"
                required
                minLength={10}
                placeholder="Example: The user failed to provide the agreed-upon agricultural goods..."
                className="min-h-[150px] resize-none focus-visible:ring-red-500"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Minimum 10 characters. Your report will be reviewed by our moderation team.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button variant="outline" type="button" asChild>
                <a href="/dashboard">Cancel</a>
              </Button>
              <Button type="submit" variant="destructive" className="bg-red-600 hover:bg-red-700">
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}