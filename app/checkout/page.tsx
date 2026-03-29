import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cartService } from "@/lib/services/cart-service";
import { CheckoutClient } from "@/components/checkout-client";
import prisma from "@/lib/prisma";

interface CheckoutPageProps {
  searchParams?: { orderId?: string };
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in?callbackUrl=/checkout");
    }

    let cart;

    // Load pending order if orderId is provided
    if (searchParams?.orderId) {
        const order = await prisma.order.findUnique({
            where: { id: searchParams.orderId },
            include: { items: { include: { product: true } } },
        });

        if (!order) {
            redirect("/dashboard/buyer/orders");
        }

        cart = {
            items: order.items.map(item => ({
                ...item,
                product: item.product,
            }))
        };
    } else {
        cart = await cartService.getCart(session.user.id);

        if (!cart || cart.items.length === 0) {
            redirect("/cart");
        }
    }

    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Checkout</h1>
                <p className="text-muted-foreground mt-2">Complete your purchase from our farmers.</p>
            </div>

            <CheckoutClient cart={cart} session={session} orderId={searchParams?.orderId} />
        </div>
    );
}

// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { cartService } from "@/lib/services/cart-service";
// import { CheckoutClient } from "@/components/checkout-client";


// export default async function CheckoutPage() {
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });

//     if (!session) {
//         redirect("/sign-in?callbackUrl=/checkout");
//     }

//     const cart = await cartService.getCart(session.user.id);

//     if (!cart || cart.items.length === 0) {
//         redirect("/cart");
//     }

//     return (
//         <div className="container mx-auto py-12 px-4 space-y-8">
//             <div>
//                 <h1 className="text-4xl font-bold">Checkout</h1>
//                 <p className="text-muted-foreground mt-2">Complete your purchase from our farmers.</p>
//             </div>

//             <CheckoutClient cart={cart} session={session} />
//         </div>
//     );
// }
