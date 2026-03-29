import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { productService } from "@/lib/services/product-service";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Store } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function FarmerStorePage({
    params,
}: {
    params: Promise<{ farmerId: string }>;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in");

    const { farmerId } = await params;

    const products = await productService.getFarmerProducts(farmerId);

    if (!products || products.length === 0) {
        notFound();
    }

    const farmer = products[0].farmer;

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">

            {/* Back */}
            <Link href="/marketplace" className="flex items-center gap-2 mb-6 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
            </Link>

            {/* Farmer Info */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                    {farmer.image && (
                        <img src={farmer.image} className="w-full h-full object-cover" />
                    )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        {farmer.name}'s Store
                    </h1>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {farmer.location}
                    </p>
                </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition">

                        <CardContent className="p-4 space-y-3">

                            {/* Clickable Image */}
                            <Link href={`/marketplace/${product.id}`}>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                                    {product.images?.[0] && (
                                        <img
                                            src={product.images[0]}
                                            className="w-full h-full object-cover hover:scale-105 transition"
                                        />
                                    )}
                                </div>
                            </Link>

                            {/* Clickable Name */}
                            <Link href={`/marketplace/${product.id}`}>
                                <h2 className="font-semibold text-lg hover:underline cursor-pointer">
                                    {product.name}
                                </h2>
                            </Link>

                            {/* Location */}
                            <div className="flex items-center text-sm text-muted-foreground gap-1">
                                <MapPin className="h-3 w-3" />
                                {product.location}
                            </div>

                            {/* Price */}
                            <Badge>
                                {product.price} birr / {product.unit}
                            </Badge>
                            <AddToCartButton
                                productId={product.id}
                                disabled={product.status !== "AVAILABLE"}
                            />

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}