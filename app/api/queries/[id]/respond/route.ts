import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const formData = await req.formData();
    const response = formData.get("response") as string;

    await prisma.farmerQuery.update({
        where: { id: params.id },
        data: {
            expertResponse: response,
            status: "RESOLVED"
        }
    });

    return NextResponse.redirect(new URL("/dashboard/expert/queries", req.url));
}