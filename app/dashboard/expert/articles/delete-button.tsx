"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteArticleButton({ articleId }: { articleId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/articles/${articleId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh(); 
            } else {
                alert("Failed to delete article");
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 border-red-100 hover:bg-red-50 hover:text-destructive"
            onClick={onDelete}
            disabled={loading}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}