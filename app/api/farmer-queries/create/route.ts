import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { contentSchema } from "@/lib/shared-schemas";

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

        if (!expertId) {
            return NextResponse.json({ error: "Expert ID is required" }, { status: 400 });
        }

        const questionVal = contentSchema.safeParse(question);
        if (!questionVal.success) {
            return NextResponse.json({ error: questionVal.error.errors[0].message }, { status: 400 });
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