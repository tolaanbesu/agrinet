"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { chatService } from "@/lib/services/chat-service"
import { revalidatePath } from "next/cache"

export async function sendMessageAction(receiverId: string, message: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) return { success: false, error: "Unauthorized" }

    try {
        const newMessage = await chatService.sendMessage(session.user.id, receiverId, message)
        revalidatePath("/dashboard/chat")
        return { success: true, message: newMessage }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function markAsReadAction(senderId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) return { success: false, error: "Unauthorized" }

    try {
        await chatService.markAsRead(session.user.id, senderId)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
