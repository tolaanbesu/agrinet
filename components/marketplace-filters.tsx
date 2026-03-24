"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useState, useEffect, useTransition } from "react"

export function MarketplaceFilters({
    initialSearch = "",
    initialCategory = "all"
}: {
    initialSearch?: string,
    initialCategory?: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [searchTerm, setSearchTerm] = useState(initialSearch)

    useEffect(() => {
        if (searchTerm === initialSearch) return

        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (searchTerm) {
                params.set("search", searchTerm)
            } else {
                params.delete("search")
            }
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`)
            })
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm, pathname, router, searchParams, initialSearch])

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (category && category !== "all") {
            params.set("category", category)
        } else {
            params.delete("category")
        }
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    className="pl-9"
                    defaultValue={initialSearch}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select
                defaultValue={initialCategory}
                onValueChange={handleCategoryChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="poultry">Poultry</SelectItem>
                </SelectContent>
            </Select>
            {isPending && <div className="text-xs text-muted-foreground animate-pulse ml-2 whitespace-nowrap">Updating...</div>}
        </div>
    )
}
