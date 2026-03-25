import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { User, Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers"; 
import { revalidatePath } from "next/cache"; 
import Image from "next/image";

export default async function ArticleDetailsPage({
    params,
}: {
    params: Promise<{ articleId: string }>;
}) {
   
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const { articleId } = await params;
    const article = await prisma.article.findUnique({
        where: { id: articleId },
        include: {
            expert: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });

    if (!article) {
        notFound();
    }

    
    async function followAuthor() {
        "use server";
        
        console.log(`User ${session?.user.name} followed ${article?.expert.name}`);
        revalidatePath(`/advisory/${articleId}`);
    }

    return (
        <article className="max-w-4xl mx-auto py-12 px-4 space-y-8">
            <Link href="/advisory" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Advisory
            </Link>

            <header className="space-y-6">
                <div className="flex items-center gap-4 text-sm font-medium text-primary uppercase tracking-widest">
                    <Tag className="h-4 w-4" />
                    <span>{article.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y py-4 border-muted">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                            {article.expert.image ? (
                                <img src={article.expert.image} alt={article.expert.name || ""} className="object-cover h-full w-full" />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <span className="font-semibold text-foreground">{article.expert.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(article.createdAt), "MMMM d, yyyy")}</span>
                    </div>
                </div>
            </header>

            {article.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-video border shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                    {/* <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    /> */}
                    <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    />
                </div>
            )}

            <div className="prose dark:prose-invert max-w-none pt-4">
                {article.content.split('\n').map((paragraph: string, i: number) => (
                    paragraph ? <p key={i} className="mb-4 text-lg leading-relaxed text-foreground/80">{paragraph}</p> : <br key={i} />
                ))}
            </div>

            <div className="border-t pt-12 mt-12">
                <div className="bg-secondary/30 backdrop-blur-sm p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-muted">
                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0 ring-4 ring-background">
                        {article.expert.image ? (
                            <img src={article.expert.image} alt={article.expert.name || ""} className="object-cover h-full w-full" />
                        ) : (
                            <User className="h-12 w-12 text-primary" />
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl font-bold mb-2">About the Author</h3>
                        <p className="text-muted-foreground mb-6 max-w-xl">
                            {article.expert.name} is a verified expert on the AGRINET platform, providing valuable insights and guidance to the agricultural community.
                        </p>
                        
                        <form action={followAuthor}>
                            <Button variant="default" className="px-8 rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                                Follow Author
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </article>
    );
}
