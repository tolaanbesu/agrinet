"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, BookOpen, Send, Clock, ChevronRight } from "lucide-react";

interface farmerProps {
  queries: any[];
  articles: any[];
  experts: any[];
}

export default function FarmerQueriesPageContent({
  queries,
  articles,
  experts
}: farmerProps) {
  const [selectedExpert, setSelectedExpert] = useState(experts[0]?.id || "");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [localQueries, setLocalQueries] = useState(
    queries.map((q) => ({
      ...q,
      read: q.read ?? true
    }))
  );

  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);

  const uniqueConversations = useMemo(() => {
    const map = new Map();
    [...localQueries].reverse().forEach((q) => {
      map.set(q.expertId, q);
    });
    return Array.from(map.values()).reverse();
  }, [localQueries]);

  const toggleReadMore = (id: string) => {
    setExpandedArticles((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendQuestion = async () => {
    if (!question.trim() || !selectedExpert) return;
    try {
      setLoading(true);
      const res = await fetch("/api/farmer-queries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expertId: selectedExpert, question })
      });

      if (!res.ok) throw new Error("Failed");

      const expert = experts.find((e) => e.id === selectedExpert);
      setLocalQueries((prev) => [
        {
          id: Date.now().toString(),
          question,
          status: "OPEN",
          expertResponse: null,
          expert,
          expertId: selectedExpert,
          read: true,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
      setQuestion("");
    } catch (error) {
      alert("Failed to send question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <MessageSquare className="w-6 h-6 text-primary" /> Help Desk
          </h2>
          <p className="text-muted-foreground">
            Get professional advice directly from our verified agricultural experts.
          </p>
        </div>

        <Card className="lg:col-span-2 shadow-sm border-2">
          <CardHeader className="pb-4">
            <CardTitle>Ask a New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Expert</label>
              <select
                className="w-full border rounded-md p-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                value={selectedExpert}
                onChange={(e) => setSelectedExpert(e.target.value)}
              >
                {experts.map((exp) => (
                  <option key={exp.id} value={exp.id}>{exp.name} (Specialist)</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Question</label>
              <textarea
                className="w-full border rounded-md p-3 h-28 resize-none focus:ring-2 focus:ring-primary outline-none"
                placeholder="Describe your issue in detail (e.g., pests, soil quality...)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <Button 
                className="w-full md:w-auto px-8" 
                onClick={handleSendQuestion} 
                disabled={loading || !question.trim()}
            >
              {loading ? "Sending..." : "Send to Expert"}
              <Send className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* <section className="space-y-4">
        <h2 className="text-xl font-bold px-1 flex items-center gap-2">
            Recent Conversations
        </h2>
        <div className="grid gap-3">
            {uniqueConversations.length === 0 ? (
                <div className="p-10 text-center border rounded-xl bg-slate-50 text-muted-foreground">
                    No messages yet.
                </div>
            ) : (
                uniqueConversations.map((q: any) => (
                    <div 
                        key={q.id} 
                        className="flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:border-primary/40 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold border shrink-0">
                            {q.expert?.name?.charAt(0) || "E"}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className="font-bold text-slate-900 truncate">
                                    {q.expert?.name || "Expert Specialist"}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider hidden sm:inline">
                                        {new Date(q.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-500 truncate italic">
                                "{q.expertResponse || q.question}"
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pl-2">
                           
                            {q.expertResponse && !q.read && (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
      </section> */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Recent Conversations
          </h2>
          <span className="text-xs text-muted-foreground">
            Your latest messages
          </span>
        </div>

        <div className="space-y-3">
          {(() => {
            // Show only the current user's queries
            const userConversations = uniqueConversations.filter(
              (q: any) => q.farmerId === q?.farmerId
            );

            if (userConversations.length === 0) {
              return (
                <div className="p-10 text-center border rounded-xl bg-muted/30 text-muted-foreground">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  No conversations yet.
                </div>
              );
            }

            return [...userConversations]
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((q: any, index: number) => {
                const isNewest = index === 0;

                return (
                  <div
                    key={q.id}
                    className={`group flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${
                      isNewest
                        ? "bg-primary/5 border-primary/30"
                        : "bg-background"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold border shrink-0">
                      {q.expert?.name?.charAt(0) || "E"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold truncate">
                          {q.expert?.name || "Expert"}
                        </h4>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              q.status === "RESOLVED"
                                ? "default"
                                : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {q.status}
                          </Badge>

                          <span className="text-[10px] text-muted-foreground hidden sm:block">
                            {new Date(q.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {q.expertResponse
                          ? `Expert: ${q.expertResponse}`
                          : `You: ${q.question}`}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {q.expertResponse && !q.read && (
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      )}

                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </div>
                );
              });
          })()}
        </div>
      </section>

      
      <section className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Knowledge Base
            </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art: any) => {
            const isExpanded = expandedArticles.includes(art.id);
            return (
              <Card key={art.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {art.imageUrl && (
                  <div className="relative h-48 w-full">
                    <img src={art.imageUrl} alt={art.title} className="object-cover w-full h-full" />
                  </div>
                )}
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg leading-tight mb-2">{art.title}</h3>
                  <p className="text-xs font-medium text-primary mb-3">By {art.expert?.name || "Expert"}</p>
                  <p className={`text-sm text-muted-foreground mb-4 ${!isExpanded && "line-clamp-3"}`}>
                    {art.content}
                  </p>
                  <div className="mt-auto">
                      <Button
                          variant="ghost"
                          className="p-0 h-auto font-semibold text-primary hover:bg-transparent"
                          onClick={() => toggleReadMore(art.id)}
                      >
                          {isExpanded ? "Show Less" : "Read Full Article →"}
                      </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
