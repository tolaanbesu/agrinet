import prisma from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export const orderService = {
    async createOrder(data: {
        buyerId: string;
        farmerId: string;
        items: { productId: string; quantity: number; price: number }[];
        totalPrice: number;
        tx_ref?: string;
    }) {
        return prisma.$transaction(async (tx) => {
            // 1. Check for duplicate order if tx_ref exists
            if (data.tx_ref) {
                const existingOrder = await tx.order.findFirst({
                    where: { tx_ref: data.tx_ref }
                });
                if (existingOrder) return existingOrder;
            }

            // 2. Create the order
            const order = await tx.order.create({
                data: {
                    buyerId: data.buyerId,
                    farmerId: data.farmerId,
                    totalPrice: data.totalPrice,
                    status: "PENDING",
                    paymentStatus: "PENDING",
                    tx_ref: data.tx_ref,
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });

            // 3. Update product stock
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // 4. Clear cart items for this buyer
            await tx.cartItem.deleteMany({
                where: {
                    cart: { buyerId: data.buyerId },
                    productId: { in: data.items.map(i => i.productId) },
                },
            });

            // 5. Log the order creation
            await tx.auditLog.create({
                data: {
                    action: `Order created: ${order.id}`,
                    performedBy: data.buyerId,
                },
            });

            return order;
        });
    },

    async getBuyerOrders(buyerId: string) {
        return prisma.order.findMany({
            where: { buyerId },
            include: {
                items: { include: { product: true } },
                farmer: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async getFarmerOrders(farmerId: string) {
        return prisma.order.findMany({
            where: { farmerId },
            include: {
                items: { include: { product: true } },
                buyer: { select: { name: true, email: true, phone: true, location: true } }
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async updateOrderStatus(orderId: string, status: OrderStatus, performedBy: string) {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        await prisma.auditLog.create({
            data: {
                action: `Order ${orderId} status updated to ${status}`,
                performedBy,
            },
        });

        return order;
    }
};