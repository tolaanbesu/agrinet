
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cartService } from "@/lib/services/cart-service";
import { CheckoutClient } from "@/components/checkout-client";


export default async function CheckoutPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in?callbackUrl=/checkout");
    }

    const cart = await cartService.getCart(session.user.id);

    if (!cart || cart.items.length === 0) {
        redirect("/cart");
    }

    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Checkout</h1>
                <p className="text-muted-foreground mt-2">Complete your purchase from our farmers.</p>
            </div>

            <CheckoutClient cart={cart} session={session} />
        </div>
    );
}
