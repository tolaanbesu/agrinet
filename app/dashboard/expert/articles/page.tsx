
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DeleteArticleButton } from "./delete-button";
import { EditArticleModal } from "./edit-article-modal"; 

export default async function ExpertArticlesPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "EXPERT") redirect("/sign-in");

    const articles = await prisma.article.findMany({
        where: { expertId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
                    <p className="text-muted-foreground mt-1">Manage your educational content.</p>
                </div>
                <Link href="/dashboard/expert/articles/new">
                    <Button className="gap-2"><Plus className="h-4 w-4" /> New Article</Button>
                </Link>
            </div>

            {articles.length === 0 ? (
                <Card className="border-dashed p-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <CardTitle>No articles yet</CardTitle>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Card key={article.id} className="overflow-hidden flex flex-col shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{article.category}</span>
                                    <span className="text-xs text-muted-foreground">{format(new Date(article.createdAt), "MMM d, yyyy")}</span>
                                </div>
                                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                            </CardContent>
                            <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">

                                <EditArticleModal article={article} />
                                <DeleteArticleButton articleId={article.id} />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
