
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Clock,
  ArrowRight,
  User,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
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
      status: "AVAILABLE",
      NOT: {
        orderItems: {
          some: { order: { buyerId: session.user.id } },
        },
      },
    },
    take: 5,
  });

  const recentOrders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      items: {
        include: { product: { select: { farmerId: true, name: true } } },
      },
    },
  });

  const totalOrders = await prisma.order.count({
    where: { buyerId: session.user.id },
  });

  const activeShipments = await prisma.order.count({
    where: {
      buyerId: session.user.id,
      status: { in: ["CONFIRMED", "SHIPPED"] },
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
      description: "Orders placed",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Shipments",
      value: activeShipments,
      icon: Clock,
      description: "Items on the way",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Items in Cart",
      value: cartItemsCount,
      icon: ShoppingBag,
      description: "Waiting for checkout",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Pending Payments",
      value: pendingPaymentsCount,
      icon: CreditCard,
      description: "Awaiting payment",
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-medium text-foreground">{session.user.name}</span>. Find fresh products from local farmers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" /> My Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href="/marketplace">
              <ShoppingBag className="mr-2 h-4 w-4" /> Browse Marketplace
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Card */}
        <Card className="col-span-full lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-1">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Stay updated on your latest purchases.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/buyer/orders" className="text-xs">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"} className="text-[10px] uppercase">
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Link
                        href={`/dashboard/report/${order.items[0]?.product?.farmerId}`}
                        className="text-[10px] flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <AlertCircle className="h-3 w-3" /> Report Seller
                      </Link>
                      
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No recent activity found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Products Card */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Fresh finds based on your interests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/marketplace/${product.id}`} 
                    className="group flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-[200px] mb-4">Start browsing the marketplace for recommendations.</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/marketplace">Explore Now</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}