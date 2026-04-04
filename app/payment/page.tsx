import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import axios from "axios"

export default async function PaymentPage({ searchParams }: { searchParams: { orderId: string } }) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect("/sign-in")

    const order = await prisma.order.findUnique({
        where: { id: searchParams.orderId },
        include: { items: { include: { product: true } } },
    })

    if (!order || order.buyerId !== session.user.id) {
        redirect("/dashboard/buyer/orders")
    }

    if (order.paymentStatus === "PAID") {
        redirect("/dashboard/buyer/orders")
    }

    // Initializing Chapa payment
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL
    let tx_ref = order.tx_ref

    if (!tx_ref) {
        tx_ref = `AGRINET-${Date.now()}`

        await prisma.order.update({
            where: { id: order.id },
            data: { tx_ref, paymentStatus: "PENDING" }
        })
    }

    const chapaResponse = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        {
            amount: order.totalPrice,
            currency: "ETB",
            email: session.user.email,
            first_name: session.user.name || "Customer",
            tx_ref,
            callback_url: `${APP_URL}/api/payment/verify?orderId=${order.id}`,
            return_url: `${APP_URL}/api/payment/verify?orderId=${order.id}&tx_ref=${tx_ref}`,
        },
        {
            headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
        }
    )

    // Redirect to payment page
    if (chapaResponse.data?.data?.checkout_url) {
        redirect(chapaResponse.data.data.checkout_url)
    }

    return <div>Redirecting to payment...</div>
}