import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FarmerQueriesPageContent from "./FarmerQueriesPageContent"; 
import prisma from "@/lib/prisma";

export default async function FarmerQueriesPage() {

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  if (session.user.role !== "FARMER") redirect("/dashboard");

  
  const queries = await prisma.farmerQuery.findMany({
    where: { farmerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 10, 
    include: {
      expert: { select: { id: true, name: true, profileImage: true } },
    },
  });

  
  const experts = await prisma.user.findMany({
    where: { role: "EXPERT" },
    select: { id: true, name: true, profileImage: true },
  });

  return (
    <FarmerQueriesPageContent
      queries={queries}
      articles={articles}
      experts={experts}
    />
  );
}