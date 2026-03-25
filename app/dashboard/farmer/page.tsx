import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SalesChart from "@/components/dashboard/sales-chart";
import Link from "next/link"; 
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
    Bell, 
    ArrowRight
} from "lucide-react";

export default async function FarmerDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in");
    if (session.user.role !== "FARMER") redirect("/dashboard");

    const farmerId = session.user.id;

    const alertCount = await prisma.marketAlert.count();

    const totalProducts = await prisma.product.count({
        where: { farmerId }
    });

    const orders = await prisma.order.findMany({
        where: { farmerId },
        include: {
            buyer: {
                select: { id: true, name: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const pendingOrders = orders.filter(
        (o) => o.status === "PENDING" || o.status === "CONFIRMED"
    ).length;

    const revenue = orders
        .filter(o => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.totalPrice, 0);

    const customers = new Set(orders.map(o => o.buyerId)).size;
    const recentOrders = orders.slice(0, 5);

    const salesByDate: Record<string, number> = {};
    orders
        .filter(o => o.paymentStatus === "PAID")
        .forEach(order => {
            const date = order.createdAt.toISOString().split("T")[0];
            if (!salesByDate[date]) salesByDate[date] = 0;
            salesByDate[date] += order.totalPrice;
        });

    const salesData = Object.entries(salesByDate).map(([date, revenue]) => ({
        date,
        revenue
    }));

    const stats = [
        { title: "Total Products", value: totalProducts, icon: Package, description: "Active listings" },
        { title: "Orders", value: pendingOrders, icon: ShoppingCart, description: "To be fulfilled" },
        { title: "Revenue", value: `${revenue.toFixed(2)} ETB`, icon: TrendingUp, description: "Total earnings" },
        { title: "Customers", value: customers, icon: Users, description: "Unique buyers" },
    ];

    return (
        <div className="relative min-h-screen space-y-8 pb-20">
            
            <Link 
                href="/dashboard/alerts" 
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-primary-foreground pl-4 pr-3 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all group border border-white/20"
            >
                <div className="flex flex-col items-start mr-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Market Updates</span>
                    <span className="text-sm font-bold">View Expert Alerts</span>
                </div>
                
                <div className="relative bg-white/20 p-2 rounded-xl">
                    <Bell className="w-5 h-5 animate-pulse" />
                    {alertCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-primary">
                            {alertCount}
                        </span>
                    )}
                </div>
            </Link>

            {/* <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {session.user.name}. Here's your farm's performance.
                    </p>
                </div>
            </div> */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {session.user.name}. Here's your farm's performance.
                    </p>
                </div>

                {/* PROFILE ACTIONS */}
                <div className="flex gap-2">
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 transition"
                    >
                        <Users className="w-4 h-4" />
                        My Profile
                    </Link>
                    {/* {!session.user.phone || !session.user.location ? (
                    <Link
                        href="/dashboard/profile/edit"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
                    >
                        Complete Profile
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                   ) : null} */}
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-none shadow-sm ring-1 ring-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader><CardTitle>Sales Overview</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        {salesData.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground border-dashed border-2 rounded-lg">No sales data yet</div>
                        ) : ( <SalesChart data={salesData} /> )}
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest orders from buyers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent orders.</p>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">{order.buyer?.name || "Customer"}</p>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{order.status}</p>

                                        {/* REPORT BUTTON */}
                                        {order.buyer && (
                                            <Link
                                                href={`/dashboard/report/${order.buyer.id}`}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Report Buyer
                                            </Link>
                                        )}
                                    </div>
                                    <div className="text-sm font-bold">{order.totalPrice.toFixed(2)} ETB</div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
