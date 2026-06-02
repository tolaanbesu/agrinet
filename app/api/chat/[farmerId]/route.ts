import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { contentSchema } from "@/lib/shared-schemas";

export async function GET(
  req: Request,
  context: { params: Promise<{ farmerId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { farmerId } = await context.params;
  const expertId = session.user.id;

  const initialQuery = await prisma.farmerQuery.findFirst({
    where: {
      farmerId: farmerId,
      expertId: expertId,
    },
    orderBy: { createdAt: "asc" },
  });

  const chatMessages = await prisma.chat.findMany({
    where: {
      OR: [
        { senderId: expertId, receiverId: farmerId },
        { senderId: farmerId, receiverId: expertId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  const formattedInitialQuery = initialQuery
    ? [
        {
          id: initialQuery.id,
          senderId: farmerId, 
          receiverId: expertId,
          message: initialQuery.question,
          createdAt: initialQuery.createdAt,
          isInitialQuery: true, 
        },
      ]
    : [];

  
  return NextResponse.json([...formattedInitialQuery, ...chatMessages]);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ farmerId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { farmerId } = await context.params;
  const body = await req.json();

  const messageVal = contentSchema.safeParse(body.message);
  if (!messageVal.success) {
    return NextResponse.json({ error: messageVal.error.errors[0].message }, { status: 400 });
  }

  await prisma.chat.create({
    data: {
      senderId: session.user.id,
      receiverId: farmerId,
      message: body.message,
    },
  });

  return NextResponse.json({ success: true });
}