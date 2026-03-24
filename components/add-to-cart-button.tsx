"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { addToCartAction } from "@/actions/cart-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AddToCartButton({ productId, disabled }: { productId: string, disabled?: boolean }) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleAddToCart = async () => {
        setIsPending(true)
        try {
            const result = await addToCartAction(productId, 1)
            if (result.success) {
                toast.success("Added to cart")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to add to cart")
                if (result.error === "Unauthorized") {
                    router.push("/sign-in")
                }
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Button
            className="w-full gap-2 h-12 text-lg"
            disabled={disabled || isPending}
            onClick={handleAddToCart}
        >
            <ShoppingCart className="h-5 w-5" />
            {isPending ? "Adding..." : "Add to Cart"}
        </Button>
    )
}
