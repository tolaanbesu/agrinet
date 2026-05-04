import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBagIcon, LayoutDashboard, User, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { MarketplaceFilters } from "@/components/marketplace-filters";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";

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
        <div className="bg-muted/10 min-h-screen pb-24">
            <div className="container mx-auto py-12 px-4 max-w-7xl space-y-12">
            
                {/* Modern Header Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-10 border-b border-border/50">
                    <div className="space-y-4 max-w-2xl">
                        <Badge variant="outline" className="px-4 py-1.5 rounded-full text-primary border-primary/20 bg-primary/5 shadow-sm mb-2">
                            Fresh & Organic
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                            Marketplace
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Discover premium, locally-sourced agricultural products directly from verified farmers.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <Suspense fallback={<div className="h-12 w-full sm:w-72 bg-muted/50 animate-pulse rounded-full border border-border/50" />}>
                            <MarketplaceFilters initialSearch={search} initialCategory={category} />
                        </Suspense>
                        
                        {session && (
                            <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 h-12 px-6 w-full sm:w-auto">
                                <Link href="/dashboard" className="gap-2 font-medium">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-background rounded-[2rem] border shadow-sm">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                            <ShoppingBagIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">No products found</h3>
                        <p className="text-muted-foreground max-w-md mt-3 text-lg">We couldn't find anything matching your criteria. Try tweaking your search or exploring different categories.</p>
                        <Button variant="outline" asChild className="mt-8 rounded-full h-12 px-8">
                            <Link href="/marketplace">Clear Filters</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <Link href={`/marketplace/${product.id}`} key={product.id} className="group flex flex-col h-full rounded-[2rem] bg-background border border-transparent hover:border-border/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] sm:aspect-[4/5] bg-muted/30 overflow-hidden m-2 rounded-[1.5rem]">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 text-muted-foreground/30 font-black text-6xl select-none">
                                            {product.name.charAt(0)}
                                        </div>
                                    )}
                                    
                                    {/* Float Badges */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <Badge variant="secondary" className="glass px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-background/60 border-none text-foreground/80">
                                            {product.category}
                                        </Badge>
                                    </div>
                                    
                                    {/* Price Tag Overlay bottom-right inside image */}
                                    <div className="absolute bottom-4 right-4 glass px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md bg-background/80 border border-white/20 dark:border-black/20">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-primary">{product.price}</span>
                                            <span className="text-xs font-medium text-foreground uppercase">birr/{product.unit}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Content Container */}
                                <div className="flex flex-col flex-1 p-5 pt-4">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 font-medium">
                                        <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                                        <span className="truncate">{product.location}</span>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center border border-primary/20">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Farmer</span>
                                                <span className="text-sm font-semibold text-foreground truncate max-w-[100px]">{product.farmer.name}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="h-10 w-10 rounded-full bg-muted/50 flex flex-shrink-0 items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}




