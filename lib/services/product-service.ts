import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

export const productService = {
    async getAllProducts(filters?: {
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        status?: ProductStatus;
    }) {
        return prisma.product.findMany({
            where: {
                status: filters?.status || "AVAILABLE",
                AND: [
                    filters?.search ? { name: { contains: filters.search, mode: "insensitive" } } : {},
                    filters?.category && filters.category !== "all" ? { category: filters.category } : {},
                    filters?.minPrice ? { price: { gte: filters.minPrice } } : {},
                    filters?.maxPrice ? { price: { lte: filters.maxPrice } } : {},
                ],
            },
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        location: true,
                    }
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    async getProductById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        location: true,
                        phone: true,
                    }
                },
            },
        });
    },

    async getFarmerProducts(farmerId: string) {
        return prisma.product.findMany({
            where: { farmerId },
            orderBy: { createdAt: "desc" },
        });
    },

    async createProduct(data: {
        farmerId: string;
        name: string;
        category: string;
        description: string;
        price: number;
        quantity: number;
        unit: string;
        images: string[];
        location: string;
    }) {
        return prisma.product.create({
            data,
        });
    },

    async updateProduct(id: string, data: Partial<{
        name: string;
        category: string;
        description: string;
        price: number;
        quantity: number;
        unit: string;
        images: string[];
        location: string;
        status: ProductStatus;
    }>) {
        return prisma.product.update({
            where: { id },
            data,
        });
    },

    async deleteProduct(id: string) {
        return prisma.product.delete({
            where: { id },
        });
    }
};
