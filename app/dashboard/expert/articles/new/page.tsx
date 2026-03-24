import { ArticleForm } from "@/components/dashboard/article-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewArticlePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/expert/articles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Write New Article</h1>
                    <p className="text-muted-foreground">Share your knowledge with the farming community.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                    <CardDescription>Provide a catchy title and informative content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ArticleForm />
                </CardContent>
            </Card>
        </div>
    );
}
