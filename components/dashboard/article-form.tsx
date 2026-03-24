"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createArticleAction } from "@/actions/expert-actions"

const articleFormSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(50, "Content must be at least 50 characters"),
    category: z.string().min(2, "Category is required"),
    imageUrl: z.string().url("Please provide a valid image URL").optional().or(z.literal("")),
})

export function ArticleForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof articleFormSchema>>({
        resolver: zodResolver(articleFormSchema),
        defaultValues: {
            title: "",
            content: "",
            category: "",
            imageUrl: "",
        },
    })

    async function onSubmit(values: z.infer<typeof articleFormSchema>) {
        setLoading(true)
        try {
            const result = await createArticleAction(values)

            if (result.success) {
                toast.success("Article published successfully!")
                router.push("/dashboard/expert/articles")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to publish article")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Best Practices for Organic Farming" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input placeholder="Organic Farming, Pest Control, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Image URL (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your article here..."
                                    className="min-h-[300px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Publishing..." : "Publish Article"}
                </Button>
            </form>
        </Form>
    )
}
