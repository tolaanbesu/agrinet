"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EditArticleModal({ article }: { article: any }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: article.title,
        content: article.content,
        category: article.category,
        imageUrl: article.imageUrl || ""
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/articles/${article.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setOpen(false);
                router.refresh();
            } else {
                alert("Update failed");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Article</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleUpdate} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                            id="title" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input 
                            id="category" 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input 
                            id="imageUrl" 
                            value={formData.imageUrl} 
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea 
                            id="content" 
                            className="min-h-[200px]" 
                            value={formData.content} 
                            onChange={(e) => setFormData({...formData, content: e.target.value})} 
                            required 
                        />
                    </div>

                    <DialogFooter className="sticky bottom-0 bg-background pt-2">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}