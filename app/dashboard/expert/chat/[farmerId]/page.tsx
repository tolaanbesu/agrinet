"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, User, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const { farmerId } = useParams();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!farmerId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${farmerId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (e) {
        console.error("Chat fetch error", e);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [farmerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    try {
      await fetch(`/api/chat/${farmerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      setInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-[#f0f2f5] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      
      <div className="bg-white p-4 border-b flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <User className="text-green-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 leading-tight">Farmer Consultation</h2>
          <p className="text-xs text-green-500 font-medium animate-pulse">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://p6.itc.cn/images01/20210519/847796d860e6402488a071852c009d13.png')] bg-repeat">
        {messages.map((msg, index) => {
          const isMe = msg.senderId !== farmerId;
          const isQuery = msg.isInitialQuery;

          return (
            <div key={msg.id || index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm transition-all
                  ${isMe 
                    ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none border-l-2 border-green-400" 
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  } ${isQuery ? "border-t-4 border-t-orange-400" : ""}`}
              >
                {isQuery && (
                  <span className="block text-[10px] uppercase font-bold text-orange-600 mb-1">
                    Initial Query
                  </span>
                )}
                <p className="leading-relaxed">{msg.message}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {/* {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />} */}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center gap-3">
        <input
          className="flex-1 bg-gray-100 text-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Write your response..."
        />
        <Button 
          onClick={sendMessage} 
          disabled={!input.trim() || loading}
          className="rounded-xl bg-green-600 hover:bg-green-700 h-11 px-5"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
