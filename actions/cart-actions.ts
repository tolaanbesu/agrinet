"use server"

import { protectAction } from "@/lib/session-utils"
import { cartService } from "@/lib/services/cart-service"
import { revalidatePath } from "next/cache"
import { quantityNumberSchema } from "@/lib/shared-schemas"

export async function addToCartAction(productId: string, quantity: number = 1) {
    let session;
    try {
        session = await protectAction();
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    const quantityValidation = quantityNumberSchema.safeParse(quantity)
    if (!quantityValidation.success) {
        return { success: false, error: quantityValidation.error.errors[0].message }
    }

    try {
        await cartService.addToCart(session.user.id, productId, quantity)
        revalidatePath("/cart")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateCartQuantityAction(itemId: string, quantity: number) {
    let session;
    try {
        session = await protectAction();
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    const quantityValidation = quantityNumberSchema.safeParse(quantity)
    if (!quantityValidation.success) {
        return { success: false, error: quantityValidation.error.errors[0].message }
    }

    try {
        await cartService.updateQuantity(itemId, quantity)
        revalidatePath("/cart")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function removeFromCartAction(itemId: string) {
    let session;
    try {
        session = await protectAction();
    } catch (error: any) {
        return { success: false, error: error.message }
    }

    try {
        await cartService.removeFromCart(itemId)
        revalidatePath("/cart")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
