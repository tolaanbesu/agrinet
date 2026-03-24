import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { chatService } from "@/lib/services/chat-service";
import { ChatClient } from "@/components/dashboard/chat-client";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default async function ChatPage({
    searchParams,
}: {
    searchParams: Promise<{ farmerId?: string, buyerId?: string, expertId?: string }>;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const params = await searchParams;
    const otherUserId = params.farmerId || params.buyerId || params.expertId;

    if (!otherUserId) {

        const conversations = await chatService.getConversations(session.user.id);

        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conversations.length === 0 ? (
                        <Card className="col-span-full p-12 text-center text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No conversations yet. Start chatting from the marketplace or advisory section!</p>
                        </Card>
                    ) : (
                        conversations.map((user: any) => (
                            <Link key={user.id} href={`/dashboard/chat?${user.role.toLowerCase()}Id=${user.id}`}>
                                <Card className="hover:bg-accent transition-colors cursor-pointer">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            {user.image ? <img src={user.image} className="rounded-full" /> : <UserIcon className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        );
    }

    const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId }
    });

    if (!otherUser) {
        return <div>User not found</div>;
    }

    const messages = await chatService.getChatHistory(session.user.id, otherUserId);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Chat with {otherUser.name}</h1>
            <ChatClient
                initialMessages={messages}
                receiver={otherUser}
                currentUser={session.user}
            />
        </div>
    );
}

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
