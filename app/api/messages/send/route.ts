import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return NextResponse.json({ error: "Unauthorized" });

    const formData = await req.formData();
    const receiverId = formData.get("receiverId") as string;
    const message = formData.get("message") as string;

    await prisma.chat.create({
        data: {
            senderId: session.user.id,
            receiverId,
            message
        }
    });

    return NextResponse.redirect(new URL("/dashboard/expert/messages", req.url));
}