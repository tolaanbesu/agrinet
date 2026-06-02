"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { titleSchema, contentSchema } from "@/lib/shared-schemas";

async function checkAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session;
}

async function createAuditLog(action: string, userId?: string) {
    if (userId) {
        await prisma.auditLog.create({
            data: {
                action,
                performedBy: userId,
            },
        });
    }
}

export async function getAdminStats() {
    await checkAdmin();

    const [totalUsers, totalProducts, totalOrders, pendingVerifications, reports] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count({
            where: {
                role: { in: ["FARMER", "EXPERT"] },
                verificationStatus: "PENDING",
            },
        }),
        prisma.report.count(),
    ]);

    const usersByRole = await prisma.user.groupBy({
        by: ["role"],
        _count: {
            role: true,
        },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo,
            },
        },
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const groupedOrders: Record<string, number> = {};
    orders.forEach(order => {
        const date = order.createdAt.toLocaleDateString();
        groupedOrders[date] = (groupedOrders[date] || 0) + 1;
    });

    const ordersTrend = Object.entries(groupedOrders).map(([date, count]) => ({
        date,
        count,
    }));

    return {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingVerifications,
        reports,
        usersByRole: usersByRole.map((u: any) => ({ name: u.role, value: u._count.role })),
        ordersTrend,
    };
}

export async function updateUserRole(userId: string, role: string) {
    const session = await checkAdmin();

    const user = await prisma.user.update({
        where: { id: userId },
        data: { role: role as any },
    });

    await createAuditLog(`Updated role for ${user.email} to ${role}`, session.user.id);
    revalidatePath("/dashboard/admin");
}

export async function getUsers(query?: string, role?: string, status?: string) {
    await checkAdmin();

    return await prisma.user.findMany({
        where: {
            OR: query ? [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ] : undefined,
            role: role ? (role as any) : undefined,
            verificationStatus: status ? (status as any) : undefined,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getUserById(id: string) {
    await checkAdmin();
    return await prisma.user.findUnique({
        where: { id },
    });
}


export async function updateVerificationStatus(userId: string, status: "VERIFIED" | "REJECTED" | "PENDING") {
    const session = await checkAdmin();

    const user = await prisma.user.update({
        where: { id: userId },
        data: { verificationStatus: status },
    });

    await createAuditLog(`${status} user verification for ${user.email}`, session.user.id);
    revalidatePath("/dashboard/admin");
}

export async function toggleUserBan(userId: string, ban: boolean) {
    const session = await checkAdmin();

    const user = await prisma.user.update({
        where: { id: userId },
        data: { isBanned: ban },
    });

    await createAuditLog(`${ban ? "Banned" : "Unbanned"} user ${user.email}`, session.user.id);
    revalidatePath("/dashboard/admin");
}

export async function deleteUser(userId: string) {
    const session = await checkAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.user.delete({
        where: { id: userId },
    });

    await createAuditLog(`Deleted user ${user?.email}`, session.user.id);
    revalidatePath("/dashboard/admin");
}

export async function getProducts() {
    await checkAdmin();
    return await prisma.product.findMany({
        include: {
            farmer: { select: { name: true, email: true } },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function toggleProductStatus(productId: string, status: "AVAILABLE" | "DRAFT") {
    const session = await checkAdmin();
    const product = await prisma.product.update({
        where: { id: productId },
        data: { status },
    });
    await createAuditLog(`Changed product ${product.name} status to ${status}`, session.user.id);
    revalidatePath("/dashboard/admin");
}

export async function getAuditLogs() {
    await checkAdmin();

    return await prisma.auditLog.findMany({
        include: {
            user: { select: { name: true, email: true } },
        },
        orderBy: {
            timestamp: "desc",
        },
        take: 50,
    });
}

export async function getReports() {
    await checkAdmin();

    return await prisma.report.findMany({
        include: {
            reporter: { select: { name: true, email: true } },
            reportedUser: { select: { name: true, email: true } },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getMarketAlerts() {
    await checkAdmin();
    return await prisma.marketAlert.findMany({
        include: {
            postedBy: { select: { name: true, email: true } },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createMarketAlert(data: { title: string, description: string, region: string }) {
    const session = await checkAdmin();

    const titleVal = titleSchema.safeParse(data.title);
    if (!titleVal.success) {
        throw new Error(titleVal.error.errors[0].message);
    }

    const descVal = contentSchema.safeParse(data.description);
    if (!descVal.success) {
        throw new Error(descVal.error.errors[0].message);
    }

    const alert = await prisma.marketAlert.create({
        data: {
            ...data,
            postedById: session.user.id,
        },
    });

    await createAuditLog(`Created market alert: ${data.title}`, session.user.id);
    revalidatePath("/dashboard/admin");
    return alert;
}
