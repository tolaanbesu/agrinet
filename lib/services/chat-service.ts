import prisma from "@/lib/prisma";

export const chatService = {
    async sendMessage(senderId: string, receiverId: string, message: string) {
        return prisma.chat.create({
            data: {
                senderId,
                receiverId,
                message,
            },
        });
    },

    async getChatHistory(userId: string, otherId: string) {
        return prisma.chat.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherId },
                    { senderId: otherId, receiverId: userId },
                ],
            },
            orderBy: { createdAt: "asc" },
        });
    },

    async getConversations(userId: string) {
        // Get all unique users who have had a conversation with this user
        const sent = await prisma.chat.findMany({
            where: { senderId: userId },
            select: { receiver: true },
            distinct: ["receiverId"],
        });
        const received = await prisma.chat.findMany({
            where: { receiverId: userId },
            select: { sender: true },
            distinct: ["senderId"],
        });

        const users = new Map();
        sent.forEach((s: any) => users.set(s.receiver.id, s.receiver));
        received.forEach((r: any) => users.set(r.sender.id, r.sender));

        return Array.from(users.values());
    },

    async markAsRead(userId: string, senderId: string) {
        return prisma.chat.updateMany({
            where: {
                receiverId: userId,
                senderId: senderId,
                read: false,
            },
            data: { read: true },
        });
    }
};
