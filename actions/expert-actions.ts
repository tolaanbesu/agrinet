"use server"

import { protectAction } from "@/lib/session-utils"
import prisma from "@/lib/prisma"
import { titleSchema, contentSchema } from "@/lib/shared-schemas"

export async function createArticleAction(data: any) {
    let session;
    try {
        session = await protectAction();
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    if (session.user.role !== "EXPERT") {
        return { success: false, error: "Unauthorized" }
    }

    const titleVal = titleSchema.safeParse(data.title)
    if (!titleVal.success) {
        return { success: false, error: titleVal.error.errors[0].message }
    }

    const contentVal = contentSchema.safeParse(data.content)
    if (!contentVal.success) {
        return { success: false, error: contentVal.error.errors[0].message }
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
