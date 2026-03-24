import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cartService } from "@/lib/services/cart-service";
import { CartClient } from "@/components/cart-client";
import Link from "next/link";

export default async function CartPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in?callbackUrl=/cart");
    }

    const cart = await cartService.getCart(session.user.id);

    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Your Cart</h1>
                    <p className="text-muted-foreground mt-2">
                        Finish your order and support local farmers.
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Go to Dashboard
                </Link>
            </div>
            <CartClient cart={cart} />
        </div>
    );
}
