"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { productService } from "@/lib/services/product-service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProductAction(data: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || session.user.role !== "FARMER") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const product = await productService.createProduct({
            ...data,
            farmerId: session.user.id,
        })

        return { success: true, product }
    } catch (error: any) {
        console.error("Failed to create product:", error)
        return { success: false, error: error.message || "Failed to create product" }
    }
}

export async function deleteProductAction(productId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || session.user.role !== "FARMER") return

    await productService.deleteProduct(productId)

    revalidatePath("/dashboard/farmer/products")
}

export async function updateProductAction(formData: FormData) {

    const productId = formData.get("productId") as string

    const data = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        status: formData.get("status") as any
    }

    await productService.updateProduct(productId, data)

    revalidatePath("/dashboard/farmer/products")
    redirect("/dashboard/farmer/products")
}