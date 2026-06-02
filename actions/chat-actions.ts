"use server"

import { protectAction } from "@/lib/session-utils"
import { chatService } from "@/lib/services/chat-service"
import { revalidatePath } from "next/cache"

export async function sendMessageAction(receiverId: string, message: string) {
    let session;
    try {
        session = await protectAction();
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    try {
        const newMessage = await chatService.sendMessage(session.user.id, receiverId, message)
        revalidatePath("/dashboard/chat")
        return { success: true, message: newMessage }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function markAsReadAction(senderId: string) {
    let session;
    try {
        session = await protectAction();
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    try {
        await chatService.markAsRead(session.user.id, senderId)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
