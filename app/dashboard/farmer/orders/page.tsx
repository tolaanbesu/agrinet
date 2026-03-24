import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { orderService } from "@/lib/services/order-service";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Package, Truck } from "lucide-react";
import { OrderStatusDropdown } from "@/components/dashboard/order-status-dropdown";

import { OrderStatus } from "@prisma/client";

export default async function FarmerOrdersPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "FARMER") {
        redirect("/sign-in");
    }

    const orders = await orderService.getFarmerOrders(session.user.id);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Farmer Orders</h1>
                        <p className="text-muted-foreground mt-1">
                            Process and track incoming requests from buyers.
                        </p>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center p-20 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                        <Package className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <CardTitle className="text-2xl">No orders yet</CardTitle>
                    <CardDescription className="max-w-md mt-2 text-lg">
                        You haven't received any orders from our customers yet. Make sure your products are competitive and well-described.
                    </CardDescription>
                </Card>
            ) : (
                <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Manage Incoming Orders</CardTitle>
                                <CardDescription>Orders requiring your attention.</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-primary border-primary/20">
                                {orders.length} ACTIVE
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/20">
                                <TableRow>
                                    <TableHead className="px-6">Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Purchased Items</TableHead>
                                    <TableHead>Total Earnings</TableHead>
                                    <TableHead>Order Status</TableHead>
                                    <TableHead className="text-right px-6 pr-10">Quick Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order: any) => (
                                    <TableRow key={order.id} className="hover:bg-muted/10 transition-colors">
                                        <TableCell className="px-6 font-mono text-xs font-semibold text-primary">
                                            #{order.id.substring(0, 8)}
                                        </TableCell>

                
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-sm text-foreground">
                                                    {order.buyer.name}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                    <Truck className="h-3 w-3" />
                                                    {order.buyer.location || "Location not provided"}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-sm">
                                            {order.items.length} {order.items.length === 1 ? 'Product' : 'Products'}
                                        </TableCell>

                                        <TableCell className="font-bold text-primary">
                                            {order.totalPrice.toFixed(2)} ETB
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === "DELIVERED" ? "secondary" :
                                                    order.status === "PENDING" ? "default" : "outline"
                                                }
                                                className={`capitalize ${
                                                    order.status === "CONFIRMED"
                                                        ? "border-green-500/50 text-green-600 bg-green-500/5"
                                                        : ""
                                                }`}
                                            >
                                                {order.status.toLowerCase()}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right px-6 pr-10">
                                            <OrderStatusDropdown
                                                orderId={order.id}
                                                currentStatus={order.status}
                                            />
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