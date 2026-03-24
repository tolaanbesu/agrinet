import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ShoppingBag,
    ShoppingCart,
    CreditCard,
    Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function BuyerDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== "BUYER") {
        redirect("/dashboard");
    }

    const recommendedProducts = await prisma.product.findMany({
        where: {
            status: 'AVAILABLE',
            NOT: {
            orderItems: {
                some: { order: { buyerId: session.user.id } }
            }
            }
        },
        take: 5
    });

    const recentOrders = await prisma.order.findMany({
        where: { buyerId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            items: {
            include: { product: true }
            }
        }
    });

    const totalOrders = await prisma.order.count({
        where: {
            buyerId: session.user.id,
        },
    });

    const activeShipments = await prisma.order.count({
        where: {
            buyerId: session.user.id,
            status: {
            in: ["CONFIRMED", "SHIPPED"], // corrected from "PAID"
            },
        },
    });

    const pendingPaymentsCount = await prisma.order.count({
        where: {
            buyerId: session.user.id,
            paymentStatus: "PENDING",
        },
    });

    const cart = await prisma.cart.findUnique({
        where: { buyerId: session.user.id },
        include: { items: true },
    });
    
    const cartItemsCount = cart?.items.length || 0;

    const stats = [
  { 
    title: "Total Orders", 
    value: totalOrders, 
    icon: ShoppingCart, 
    description: "Orders placed"
  },
  { 
    title: "Active Shipments", 
    value: activeShipments, 
    icon: Clock, 
    description: "Items on the way"
  },
  { 
    title: "Items in Cart", 
    value: cartItemsCount, 
    icon: ShoppingBag, 
    description: "Products waiting for checkout"
  },
  { 
    title: "Pending Payments", 
    value: pendingPaymentsCount, 
    icon: CreditCard, 
    description: "Orders waiting for payment"
  },
];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {session.user.name}. Find fresh products from local farmers.
                    </p>
                </div>
                <Link href="/marketplace">
                    <Button className="gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Browse Marketplace
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Stay updated on your latest activities.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex flex-col gap-2 overflow-y-auto">
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                            <div key={order.id} className="p-2 border-b last:border-0">
                                <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-xs text-muted-foreground">
                                {order.items.length} item(s) — Status: {order.status}
                                </p>
                            </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                            No recent activity found.
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recommended for You</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        {recommendedProducts.length > 0 ? (
                            recommendedProducts.map(product => (
                            <Link key={product.id} href={`/marketplace/${product.id}`} className="p-2 border rounded hover:bg-muted/50 transition">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                            </Link>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-sm mb-4">Start browsing the marketplace to see recommendations.</p>
                            <Link href="/marketplace">
                                <Button variant="outline" size="sm">Explore</Button>
                            </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
