import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session || session.user.role !== "EXPERT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const articleId = params.id;

        const article = await prisma.article.findUnique({ where: { id: articleId } });
        if (!article || article.expertId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.article.delete({ where: { id: articleId } });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const body = await req.json();
        const { title, content, category, imageUrl } = body;

        if (!session || session.user.role !== "EXPERT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const article = await prisma.article.update({
            where: { id: params.id, expertId: session.user.id },
            data: { title, content, category, imageUrl }
        });

        return NextResponse.json(article);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}