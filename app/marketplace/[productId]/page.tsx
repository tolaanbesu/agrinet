import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { productService } from "@/lib/services/product-service";
import { notFound, redirect } from "next/navigation";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    MessageSquare, 
    MapPin, 
    User, 
    ArrowLeft, 
    ShieldCheck, 
    Info, 
    Store
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Separator } from "@/components/ui/separator";

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
    const status = product.farmer.verificationStatus;

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/*Back Navigation */}
            <nav className="mb-8">
                <Link 
                    href="/marketplace" 
                    className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </Link>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LEFT COLUMN: Image Gallery (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-200 font-bold uppercase text-8xl select-none">
                                {product.name.charAt(0)}
                            </div>
                        )}
                        
                        {/* Price Tag Overlay */}
                        <div className="absolute bottom-4 left-4">
                            <Badge className="text-xl py-2 px-4 bg-white/90 backdrop-blur-md text-slate-900 border-none shadow-xl hover:bg-white">
                                <span className="font-black text-emerald-600">{product.price}birr</span>
                                <span className="text-slate-500 text-sm font-medium ml-1">/ {product.unit}</span>
                            </Badge>
                        </div>
                    </div>

                    {product.images?.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((img: string, i: number) => (
                                <div key={i} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                                    <img src={img} alt={`${product.name} ${i}`} className="object-cover w-full h-full" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Product Info (7 cols) */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="flex-1 space-y-6">
                        {/* Title & Status */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 capitalize">
                                    {product.category}
                                </Badge>
                                {product.status === "AVAILABLE" ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                        In Stock
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-200">Out of Stock</Badge>
                                )}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-1 text-muted-foreground font-medium">
                                <MapPin className="h-4 w-4 text-rose-500" />
                                <span>{product.location}</span>
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Description Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-900 font-bold">
                                <Info className="h-4 w-4" />
                                <h2>Product Description</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-lg italic">
                                "{product.description}"
                            </p>
                        </div>

                        {/* Purchase Card */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-inner space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm text-slate-500 font-medium">Stock Availability</p>
                                    <p className="font-bold text-xl text-slate-900">
                                        {product.quantity} <span className="text-slate-500 font-normal">{product.unit} left</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {isFarmer ? (
                                    <Button className="w-full h-12 text-md font-semibold" variant="outline" asChild>
                                        <Link href={`/dashboard/farmer/products/edit/${product.id}`}>Edit Listing</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <AddToCartButton
                                            productId={product.id}
                                            disabled={product.status !== "AVAILABLE"}
                                        />
                                        <Button className="w-full gap-2 h-12 bg-white hover:bg-gray-200 text-gray-900 hover:text-gray-900 border-slate-200 shadow-sm" variant="outline" asChild>
                                            <Link href={`/dashboard/chat?farmerId=${product.farmerId}`}>
                                                <MessageSquare className="h-5 w-5" />
                                                Contact Farmer
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Farmer Profile Footer */}
                    <Card className="mt-8 border-none bg-slate-900 text-white overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full border-2 border-white/20 p-0.5 relative">
                                        {product.farmer.image ? (
                                            <img src={product.farmer.image} alt={product.farmer.name || ""} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full rounded-full bg-white/10 flex items-center justify-center">
                                                <User className="h-7 w-7 text-white" />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Listed by</p>
                                        <p className="font-bold text-lg leading-tight flex items-center gap-1">
                                            {product.farmer.name}
                                        </p>
                                        {status === "VERIFIED" && <p className="text-emerald-400 text-xs font-bold">Verified Seller</p>}
                                        {status === "PENDING" && <p className="text-yellow-500 text-xs font-bold">Pending</p>}
                                        {status === "REJECTED" && <p className="text-rose-500 text-xs font-bold">Not Verified</p>}
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 hover:text-white rounded-full border border-white/20">
                                    <Link href={`/dashboard/farmer/${product.farmerId}`} className="flex items-center gap-2">
                                        <Store className="h-4 w-4" />
                                        Store
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
