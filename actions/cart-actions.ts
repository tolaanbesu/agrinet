"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { cartService } from "@/lib/services/cart-service"
import { revalidatePath } from "next/cache"
import { quantityNumberSchema } from "@/lib/shared-schemas"

export async function addToCartAction(productId: string, quantity: number = 1) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return { success: false, error: "Please sign in to add items to cart" }
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
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) return { success: false, error: "Unauthorized" }

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
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) return { success: false, error: "Unauthorized" }

    try {
        await cartService.removeFromCart(itemId)
        revalidatePath("/cart")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
