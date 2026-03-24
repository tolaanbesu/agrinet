import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "EXPERT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, region, description } = await req.json();

  const updated = await prisma.marketAlert.update({
    where: { id, postedById: session.user.id },
    data: { title, region, description },
  });

  return NextResponse.json(updated);
}