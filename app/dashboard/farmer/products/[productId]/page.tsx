import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { productService } from "@/lib/services/product-service";
import { updateProductAction } from "@/actions/product-actions";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Card className="shadow-lg border border-muted">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Edit Product
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Update your product details below.
                    </p>
                </CardHeader>

                <CardContent>
                    <form action={updateProductAction} className="space-y-6">
                        <input type="hidden" name="productId" value={product.id} />

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Product Name
                            </label>
                            <input
                                name="name"
                                defaultValue={product.name}
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Category
                            </label>
                            <input
                                name="category"
                                defaultValue={product.category}
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Grid for numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Price (ETB)
                                </label>
                                <input
                                    name="price"
                                    type="number"
                                    defaultValue={product.price}
                                    className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Quantity
                                </label>
                                <input
                                    name="quantity"
                                    type="number"
                                    defaultValue={product.quantity}
                                    className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                defaultValue={product.status}
                                className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="OUT_OF_STOCK">Out of Stock</option>
                                <option value="DISCONTINUED">Discontinued</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/farmer/products">
                                    Cancel
                                </Link>
                            </Button>

                            <Button type="submit">
                                Update Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


