import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { productService } from "@/lib/services/product-service";
import { notFound, redirect } from "next/navigation"; // Added redirect
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageSquare, MapPin, User, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ productId: string }>;
}) {
   
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

   
    const { productId } = await params;
    const product = await productService.getProductById(productId);

    if (!product) {
        notFound();
    }

    const isFarmer = session?.user?.id === product.farmerId;

    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-xl overflow-hidden relative border">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground/30 font-bold uppercase text-6xl">
                                {product.name.charAt(0)}
                            </div>
                        )}
                        <Badge className="absolute top-4 right-4 text-lg py-1 px-3">
                            ${product.price} / {product.unit}
                        </Badge>
                    </div>
                    {product.images?.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img: string, i: number) => (
                                <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity">
                                    <img src={img} alt={`${product.name} ${i}`} className="object-cover w-full h-full" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">{product.category}</Badge>
                            {product.status === "AVAILABLE" ? (
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">In Stock</Badge>
                            ) : (
                                <Badge variant="destructive">Out of Stock</Badge>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold">{product.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-2">
                            <MapPin className="h-4 w-4" />
                            <span>{product.location}</span>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-6 border border-dashed border-muted">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground font-medium">Availability</span>
                            <span className="font-bold text-lg">{product.quantity} {product.unit} available</span>
                        </div>

                        {isFarmer ? (
                            <Link href={`/dashboard/farmer/products/edit/${product.id}`} className="w-full">
                                <Button className="w-full" variant="outline">Edit Listing</Button>
                            </Link>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <AddToCartButton
                                    productId={product.id}
                                    disabled={product.status !== "AVAILABLE"}
                                />
                                <Link href={`/dashboard/chat?farmerId=${product.farmerId}`} className="w-full">
                                    <Button className="w-full gap-2 h-12" variant="secondary">
                                        <MessageSquare className="h-5 w-5" />
                                        Contact Farmer
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        {product.farmer.image ? (
                                            <img src={product.farmer.image} alt={product.farmer.name || ""} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            <User className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold">{product.farmer.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <ShieldCheck className="h-3 w-3 text-green-500" />
                                            <span>Verified Farmer</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/farmers/${product.farmerId}`}>View Profile</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
