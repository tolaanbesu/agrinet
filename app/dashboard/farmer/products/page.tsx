import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { productService } from "@/lib/services/product-service";
import { deleteProductAction } from "@/actions/product-actions";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function FarmerProductsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "FARMER") {
        redirect("/sign-in");
    }

    const products = await productService.getFarmerProducts(session.user.id);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your listed products and inventory.
                    </p>
                </div>
                <Link href="/dashboard/farmer/products/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground/20 mb-4" />
                    <CardTitle>No products yet</CardTitle>
                    <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                        You haven't listed any products yet. Start selling by adding your first product.
                    </p>
                    <Link href="/dashboard/farmer/products/new">
                        <Button variant="outline">Create your first listing</Button>
                    </Link>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Product Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">
                                            {product.name}
                                        </TableCell>

                                        <TableCell className="capitalize">
                                            {product.category}
                                        </TableCell>

                                        
                                        <TableCell>
                                            {product.price.toFixed(2)} ETB / {product.unit}
                                        </TableCell>

                                        <TableCell>
                                            {product.quantity} {product.unit}
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.status === "AVAILABLE"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : product.status === "OUT_OF_STOCK"
                                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                }`}
                                            >
                                                {product.status.replace("_", " ")}
                                            </span>
                                        </TableCell>

                                       
                                        <TableCell className="text-right flex justify-end gap-2">
                                            <Link href={`/dashboard/farmer/products/${product.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <form action={deleteProductAction.bind(null, product.id)}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}