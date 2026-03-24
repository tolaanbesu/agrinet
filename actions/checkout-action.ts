"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { cartService } from "@/lib/services/cart-service"
import { orderService } from "@/lib/services/order-service"
import { revalidatePath } from "next/cache"
import axios from "axios"
import prisma from "@/lib/prisma"

export async function placeOrderAction(data: { phone: string, address: string, paymentMethod: string }) {

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) return { success: false, error: "Unauthorized" }

    try {

        const cart = await cartService.getCart(session.user.id)

        if (!cart || cart.items.length === 0) {
            return { success: false, error: "Your cart is empty" }
        }

        const itemsByFarmer: Record<string, any[]> = {}

        cart.items.forEach(item => {
            const farmerId = item.product.farmerId
            if (!itemsByFarmer[farmerId]) itemsByFarmer[farmerId] = []
            itemsByFarmer[farmerId].push(item)
        })

        const orders = []


        const tx_ref = `AGRINET-${Date.now()}`

        for (const farmerId in itemsByFarmer) {

            const items = itemsByFarmer[farmerId]

            const totalPrice = items.reduce(
                (acc, item) => acc + (item.product.price * item.quantity),
                0
            )

            const order = await orderService.createOrder({
                buyerId: session.user.id,
                farmerId,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                totalPrice,
                tx_ref 
            })

            orders.push(order)
        }

        const totalAmount = orders.reduce(
            (acc, order) => acc + order.totalPrice,
            0
        )

        if (data.paymentMethod === "CHAPA") {

            const chapaResponse = await axios.post(
                "https://api.chapa.co/v1/transaction/initialize",
                {
                    amount: totalAmount,
                    currency: "ETB",
                    email: session.user.email,
                    first_name: session.user.name || "Customer",

                    tx_ref,

                    callback_url: "http://localhost:3000/api/payment/verify",
                    return_url: `http://localhost:3000/api/payment/verify?tx_ref=${tx_ref}`,
                    // return_url: "http://localhost:3000/dashboard/buyer/orders"
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
                    }
                }
            )

            return {
                success: true,
                checkout_url: chapaResponse.data.data.checkout_url
            }
        }

        revalidatePath("/cart")

        return { success: true, orders }

    } catch (error: any) {
        console.error("Checkout failed:", error)
        return { success: false, error: error.message }
    }
}
