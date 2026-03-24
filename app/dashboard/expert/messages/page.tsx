import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function MessagesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in");
    if (session.user.role !== "EXPERT") redirect("/dashboard");

    const expertId = session.user.id;

    const messages = await prisma.chat.findMany({
        where: {
            OR: [
                { senderId: expertId },
                { receiverId: expertId }
            ]
        },
        include: {
            sender: true,
            receiver: true
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Messages</h1>

            {messages.map((msg) => (
                <div key={msg.id} className="border p-3 rounded">
                    <p className="text-sm text-muted-foreground">
                        {msg.sender.name} → {msg.receiver.name}
                    </p>
                    <p>{msg.message}</p>
                </div>
            ))}

            {/* Send message */}
            <form action="/api/messages/send" method="POST" className="mt-6">
                <input name="receiverId" placeholder="Receiver ID" className="border p-2 w-full mb-2" />
                <textarea name="message" placeholder="Message..." className="border p-2 w-full mb-2" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Send
                </button>
            </form>
        </div>
    );
}