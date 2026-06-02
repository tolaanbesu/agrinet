"use server"

import { protectAction } from "@/lib/session-utils"
import { orderService } from "@/lib/services/order-service"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
    let session;
    try {
        session = await protectAction();
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    // Authorization check would normally happen in the service, 
    // but we add an extra layer here if needed.

    try {
        const order = await orderService.updateOrderStatus(orderId, status, session.user.id)

        revalidatePath("/dashboard/farmer/orders")
        revalidatePath("/dashboard/buyer/orders")

        return { success: true, order }
    } catch (error: any) {
        console.error("Order update failed:", error)
        return { success: false, error: error.message }
    }
}
