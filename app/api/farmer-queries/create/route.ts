import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { expertId, question } = body;

        if (!expertId || !question?.trim()) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        await prisma.farmerQuery.create({
            data: {
                farmerId: session.user.id,
                expertId,
                question,
                
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}