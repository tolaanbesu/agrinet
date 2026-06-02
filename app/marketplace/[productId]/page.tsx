import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { productService } from "@/lib/services/product-service";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    MessageSquare, 
    MapPin, 
    User, 
    ShieldCheck, 
    Truck, 
    PackageCheck,
    ChevronRight,
    Star
} from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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

    if (session.user.isBanned) {
        redirect("/banned");
    }

    const { productId } = await params;
    const product = await productService.getProductById(productId);

    if (!product) {
        notFound();
    }

    const isFarmer = session?.user?.id === product.farmerId;
    const status = product.farmer.verificationStatus;

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="container mx-auto px-4 max-w-7xl pt-6">
                
                <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-primary hover:underline transition-colors shrink-0">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2 shrink-0 opacity-50" />
                    <Link href="/marketplace" className="hover:text-primary hover:underline transition-colors shrink-0">Marketplace</Link>
                    <ChevronRight className="h-4 w-4 mx-2 shrink-0 opacity-50" />
                    <Link href={`/marketplace?category=${product.category.toLowerCase()}`} className="capitalize hover:text-primary hover:underline transition-colors shrink-0">{product.category}</Link>
                    <ChevronRight className="h-4 w-4 mx-2 shrink-0 opacity-50" />
                    <span className="text-foreground font-medium truncate">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    
                    {/* LEFT COLUMN: Standard Image Gallery */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        <div className="aspect-square bg-slate-50/50 rounded-lg overflow-hidden relative border">
                            {product.images?.[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-cover w-full h-full mix-blend-multiply"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground/20 font-bold uppercase text-6xl bg-muted/20">
                                    No Image
                                </div>
                            )}
                            {product.status !== "AVAILABLE" && (
                                <div className="absolute top-4 left-4">
                                    <Badge variant="destructive" className="rounded-sm font-semibold">Out of Stock</Badge>
                                </div>
                            )}
                        </div>

                        {product.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                                {product.images.map((img: string, i: number) => (
                                    <div key={i} className="flex-shrink-0 w-24 h-24 aspect-square bg-slate-50/50 rounded-md overflow-hidden border cursor-pointer hover:border-primary transition-colors snap-start">
                                        <img src={img} alt={`${product.name} thumbnail ${i}`} className="object-cover w-full h-full mix-blend-multiply" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Product Details */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        
                        {/* Title & Brand/Farmer */}
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center gap-4 text-sm">
                                <Link 
                                    href={`/dashboard/farmer/${product.farmerId}`} 
                                    className="font-medium text-primary hover:underline flex items-center gap-1.5"
                                >
                                    {status === "VERIFIED" && <ShieldCheck className="h-4 w-4" />}
                                    {product.farmer.name}
                                </Link>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                    <span className="text-muted-foreground ml-1">(0 reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Block */}
                        <div className="mb-6">
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-4xl font-bold tracking-tight text-foreground">{product.price} ETB</span>
                                <span className="text-lg text-muted-foreground mb-1">/ {product.unit}</span>
                            </div>
                            <p className="text-sm text-green-600 font-medium flex items-center gap-1.5 mt-2">
                                <PackageCheck className="h-4 w-4" />
                                {product.status === "AVAILABLE" ? "In Stock and ready to ship" : "Currently Unavailable"}
                            </p>
                        </div>

                        {/* Core Details */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-foreground">
                                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                                <span><span className="font-semibold text-muted-foreground">Location:</span> {product.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-foreground">
                                <Truck className="h-5 w-5 text-muted-foreground shrink-0" />
                                <span><span className="font-semibold text-muted-foreground">Delivery options:</span> Contact farmer for delivery availability.</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-foreground">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground shrink-0" />
                                <span><span className="font-semibold text-muted-foreground">Buyer protection:</span> Secure payments and verified farmers.</span>
                            </div>
                        </div>

                        <Separator className="mb-8" />

                        {/* Actions */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between text-sm mb-4">
                                <span className="font-medium">Quantity Available</span>
                                <span className="font-bold">{product.quantity} {product.unit}</span>
                            </div>

                            {isFarmer ? (
                                <Button size="lg" className="w-full text-base font-semibold h-12" asChild>
                                    <Link href={`/dashboard/farmer/products/edit/${product.id}`}>Edit Listing</Link>
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <AddToCartButton
                                        productId={product.id}
                                        disabled={product.status !== "AVAILABLE"}
                                        className="h-12 w-full text-base font-semibold"
                                    />
                                    <Button size="lg" className="w-full h-12 font-semibold bg-secondary/50 text-foreground hover:bg-secondary border shadow-none" variant="outline" asChild>
                                        <Link href={`/dashboard/chat?farmerId=${product.farmerId}`} className="flex justify-center items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Message Seller
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Separator className="mb-8" />

                        {/* Description Accordion/Section */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-foreground">Product Description</h3>
                            <div className="prose prose-sm max-w-none text-muted-foreground">
                                <p className="leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* Seller profile snippet */}
                        <div className="mt-12 p-6 rounded-lg border bg-muted/20">
                            <h4 className="font-bold text-base mb-4">About the Seller</h4>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full border bg-background flex items-center justify-center overflow-hidden shrink-0">
                                    {product.farmer.image ? (
                                        <img src={product.farmer.image} alt={product.farmer.name || ""} className="object-cover w-full h-full" />
                                    ) : (
                                        <User className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">{product.farmer.name}</p>
                                    {status === "VERIFIED" ? (
                                        <p className="text-primary text-sm flex items-center gap-1.5 mt-1">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Verified Seller
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground text-sm mt-1">New Seller</p>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" asChild className="shrink-0 bg-background">
                                    <Link href={`/dashboard/farmer/${product.farmerId}`}>
                                        View Store
                                    </Link>
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
