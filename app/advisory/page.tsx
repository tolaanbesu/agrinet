import prisma from "@/lib/prisma";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookText, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function AdvisoryPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.q || "";

    const articles = await prisma.article.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } },
            ],
        },
        include: {
            expert: {
                select: {
                    name: true,
                    image: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container mx-auto py-12 px-4 space-y-12">
            <div className="relative flex flex-col md:flex-row justify-between items-end gap-6 pb-8 border-b">
                <div className="max-w-2xl">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        Knowledge Base
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Expert Advisory</h1>
                    <p className="text-xl text-muted-foreground mt-4 leading-relaxed">
                        Insights, guides, and best practices from agricultural experts.
                    </p>
                </div>

                <form action="/advisory" method="GET" className="w-full md:w-auto flex gap-2">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            name="q" 
                            defaultValue={query} 
                            placeholder="Search articles..." 
                            className="pl-9 bg-background" 
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-32 rounded-3xl bg-secondary/10 border-2 border-dashed">
                    <BookText className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold italic">No results found</h2>
                    <Button variant="link" asChild className="mt-4">
                        <Link href="/advisory">Clear search</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/advisory/${article.id}`} className="group">
                            <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl border-muted/40">
                                {article.imageUrl && (
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{article.category}</span>
                                        <span className="text-xs text-muted-foreground">{format(new Date(article.createdAt), "MMM d, yyyy")}</span>
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">{article.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-2 mb-6 text-sm">
                                        {article.content}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                                {article.expert.image ? (
                                                    <img src={article.expert.image} alt="" className="object-cover h-full w-full" />
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )}
                                            </div>
                                            <span className="text-xs font-medium">{article.expert.name}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
