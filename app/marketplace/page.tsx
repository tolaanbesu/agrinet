import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBagIcon, LayoutDashboard, User, Package } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { MarketplaceFilters } from "@/components/marketplace-filters";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface MarketplacePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {

    const resolvedParams = await searchParams;
    const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
    const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "all";

    const session = await auth.api.getSession({
        headers: await headers(),
    });


    const products = await prisma.product.findMany({
        where: {
            status: "AVAILABLE",
            AND: [
                search ? { name: { contains: search, mode: "insensitive" } } : {},
                category !== "all" ? { category: category } : {},
            ],
        },
        include: {
            farmer: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container mx-auto py-12 px-4 space-y-10">
         
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Marketplace</h1>
                    <p className="text-xl text-muted-foreground">
                        Fresh organic products <span className="text-green-600 font-medium">directly from the source.</span>
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <Suspense fallback={<div className="h-10 w-64 bg-muted animate-pulse rounded-md" />}>
                        <MarketplaceFilters initialSearch={search} initialCategory={category} />
                    </Suspense>
                    
                    {session && (
                        <Button asChild className="bg-green-600 hover:bg-green-700 shadow-md transition-all active:scale-95">
                            <Link href="/dashboard" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Go to Dashboard
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-secondary/10 rounded-3xl border-2 border-dashed">
                    <ShoppingBagIcon className="h-20 w-20 text-muted-foreground/20 mb-4" />
                    <h3 className="text-2xl font-semibold">No products found</h3>
                    <p className="text-muted-foreground max-w-xs mt-2">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden group border-muted/60 hover:shadow-2xl hover:border-green-500/30 transition-all duration-300 flex flex-col">
                            <Link href={`/marketplace/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground/20 font-bold text-6xl italic">
                                        {product.name.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border border-white/20">
                                    <span className="text-green-600 dark:text-green-400">{product.price}birr</span>
                                    <span className="text-muted-foreground font-normal text-xs ml-1">/{product.unit}</span>
                                </div>
                            </Link>
                            
                            <CardHeader className="p-5 pb-2">
                                <CardTitle className="text-xl group-hover:text-green-600 transition-colors line-clamp-1">
                                    {product.name}
                                </CardTitle>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                                    {product.location}
                                </div>
                            </CardHeader>
                            
                            <CardContent className="px-5 pb-4 pt-2 flex flex-col gap-2 flex-grow">
                                <div className="flex items-center justify-between text-sm py-2 border-y border-muted/40">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                            <User className="h-3 w-3" />
                                        </div>
                                        <span className="text-muted-foreground truncate max-w-[100px] font-medium">
                                            {product.farmer.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                        <Package className="h-3.5 w-3.5 text-blue-500" />
                                        {product.quantity} <span className="text-[10px] text-muted-foreground uppercase">{product.unit}</span>
                                    </div>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="p-5 pt-0">
                                <Button asChild className="w-full group/btn relative overflow-hidden  bg-green-500 hover:bg-green-600 hover:text-white transition-all duration-300 border-none shadow-none">
                                    <Link href={`/marketplace/${product.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}




