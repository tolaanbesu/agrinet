"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; 
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ReportForm({ 
  submitReport 
}: { 
  submitReport: (fd: FormData) => Promise<{ success?: boolean; error?: string } | void> 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function clientAction(formData: FormData) {
    startTransition(async () => {
      const result = await submitReport(formData);

      if (result?.success) {
        toast.success("Report submitted successfully");
        router.push("/dashboard");
      } else if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <form action={clientAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
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
        <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="destructive" 
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}