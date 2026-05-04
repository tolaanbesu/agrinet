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
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search fresh products..."
                    className="pl-9 h-11 md:h-10 bg-background/50 focus:bg-background transition-all"
                    defaultValue={initialSearch}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <Select
                    defaultValue={initialCategory}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger className="flex-1 md:w-[180px] h-11 md:h-10 bg-background/50">
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
                {isPending && <div className="text-[10px] uppercase tracking-widest text-primary animate-pulse font-bold ml-2">Updating...</div>}
            </div>
        </div>
    )
}
