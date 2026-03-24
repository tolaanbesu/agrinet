"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, User as UserIcon } from "lucide-react"
import { sendMessageAction } from "@/actions/chat-actions"
import { toast } from "sonner"
import { format } from "date-fns"

export function ChatClient({ initialMessages, receiver, currentUser }: { initialMessages: any[], receiver: any, currentUser: any }) {
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || isSending) return

        const msgContent = newMessage.trim()
        setNewMessage("")
        setIsSending(true)

        // Optimistic update
        const tempId = Math.random().toString()
        const optimisticMsg = {
            id: tempId,
            senderId: currentUser.id,
            receiverId: receiver.id,
            message: msgContent,
            createdAt: new Date().toISOString(),
            read: false
        }
        setMessages([...messages, optimisticMsg])

        try {
            const result = await sendMessageAction(receiver.id, msgContent)
            if (!result.success) {
                toast.error(result.error)
                setMessages(messages.filter(m => m.id !== tempId))
            } else {
                // Replace optimistic message with real one
                setMessages(prev => prev.map(m => m.id === tempId ? result.message : m))
            }
        } catch (err) {
            toast.error("Failed to send message")
            setMessages(messages.filter(m => m.id !== tempId))
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={receiver.image || ""} />
                        <AvatarFallback><UserIcon /></AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{receiver.name}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize">{receiver.role.toLowerCase()}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <div
                    className="h-full p-6 overflow-y-auto scroll-smooth"
                    ref={scrollRef}
                >
                    <div className="space-y-4">
                        {messages.map((msg: any) => {
                            const isMine = msg.senderId === currentUser.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMine
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted rounded-tl-none"
                                            }`}
                                    >
                                        <p>{msg.message}</p>
                                        <p className={`text-[10px] mt-1 opacity-70 ${isMine ? "text-right" : "text-left"}`}>
                                            {format(new Date(msg.createdAt), "HH:mm")}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
            <div className="p-4 border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </Card>
    )
}
