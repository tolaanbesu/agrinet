import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { productService } from "@/lib/services/product-service";
import { ProductStatus } from "@prisma/client";
import { updateProductAction } from "@/actions/product-actions";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
    params: Promise<{ productId: string }>;
}

export default async function EditProductPage({ params }: Props) {


    const { productId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "FARMER") {
        redirect("/sign-in");
    }

    const product = await productService.getProductById(productId);

    if (!product) {
        redirect("/dashboard/farmer/products");
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                </CardHeader>
                <CardContent>

                    
                    <form action={updateProductAction} className="space-y-4">

                        <input type="hidden" name="productId" value={product.id} />

                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                name="name"
                                defaultValue={product.name}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Category</label>
                            <input
                                name="category"
                                defaultValue={product.category}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Price (ETB)</label>
                            <input
                                name="price"
                                type="number"
                                defaultValue={product.price}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Quantity</label>
                            <input
                                name="quantity"
                                type="number"
                                defaultValue={product.quantity}
                                className="mt-1 block w-full border rounded px-2 py-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select
                                name="status"
                                defaultValue={product.status}
                                className="mt-1 block w-full border rounded px-2 py-1 text-white bg-gray-900"
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="OUT_OF_STOCK">Out of Stock</option>
                                <option value="DISCONTINUED">Discontinued</option>
                            </select>
                        </div>

                        <Button type="submit">
                            Update Product
                        </Button>

                    </form>

                </CardContent>
            </Card>
        </div>
    );
}