import prisma from "@/lib/prisma";

export const cartService = {
    async getCart(buyerId: string) {
        let cart = await prisma.cart.findUnique({
            where: { buyerId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                farmer: {
                                    select: {
                                        name: true,
                                    }
                                }
                            }
                        },
                    }
                },
            },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { buyerId },
                include: { items: { include: { product: { include: { farmer: { select: { name: true } } } } } } }
            });
        }

        return cart;
    },

    async addToCart(buyerId: string, productId: string, quantity: number) {
        const cart = await this.getCart(buyerId);

        const existingItem = (cart.items as any[]).find(item => item.productId === productId);

        if (existingItem) {
            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        }

        return prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    },

    async updateQuantity(itemId: string, quantity: number) {
        if (quantity <= 0) {
            return prisma.cartItem.delete({
                where: { id: itemId },
            });
        }

        return prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    },

    async removeFromCart(itemId: string) {
        return prisma.cartItem.delete({
            where: { id: itemId },
        });
    },

    async clearCart(buyerId: string) {
        const cart = await prisma.cart.findUnique({
            where: { buyerId },
        });

        if (cart) {
            return prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }
    }
};
