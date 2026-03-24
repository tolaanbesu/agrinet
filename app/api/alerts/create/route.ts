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

    await prisma.marketAlert.create({
        data: {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            region: formData.get("region") as string,
            postedById: session.user.id
        }
    });

    return NextResponse.redirect(new URL("/dashboard/expert/alerts", req.url));
}