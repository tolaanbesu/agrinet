
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function QueriesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "EXPERT") redirect("/dashboard");

  const queries = await prisma.farmerQuery.findMany({
    where: { expertResponse: null },
    include: { farmer: true },
    orderBy: { createdAt: "desc" },
  });

  const uniqueFarmers: Record<string, any> = {};
  queries.forEach((q) => {
    if (q.farmer) uniqueFarmers[q.farmer.id] = q.farmer;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Farmers with Queries</h1>

      {Object.keys(uniqueFarmers).length === 0 ? (
        <p className="text-muted-foreground">No farmers currently.</p>
      ) : (
        Object.values(uniqueFarmers).map((farmer: any) => (
          <Card key={farmer.id}>
            <CardHeader>
              <CardTitle>{farmer.name || "Farmer"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/dashboard/expert/chat/${farmer.id}`}
                className="text-blue-600 underline"
              >
                Open Chat
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
