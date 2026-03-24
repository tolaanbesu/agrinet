"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function createArticleAction(data: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || session.user.role !== "EXPERT") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const article = await prisma.article.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
                imageUrl: data.imageUrl,
                expertId: session.user.id,
            },
        })

        return { success: true, article }
    } catch (error: any) {
        console.error("Failed to create article:", error)
        return { success: false, error: error.message || "Failed to create article" }
    }
}
