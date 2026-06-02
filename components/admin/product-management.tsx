"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    Eye,
    EyeOff,
    Trash2,
    ExternalLink,
    Store,
    Tag,
    Search
} from "lucide-react";
import { toggleProductStatus, deleteProduct } from "@/actions/admin-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface ProductManagementProps {
    initialProducts: any[];
}

export function ProductManagement({ initialProducts }: ProductManagementProps) {
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter(product => 
        product.name?.toLowerCase().includes(search.toLowerCase()) || 
        product.farmer?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleStatus = async (productId: string, currentStatus: string) => {
        const newStatus = currentStatus === "AVAILABLE" ? "DRAFT" : "AVAILABLE";
        try {
            await toggleProductStatus(productId, newStatus);
            setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus } : p));
            toast.success(`Inventory updated: ${newStatus === "AVAILABLE" ? "Public" : "Archived"}`);
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to permanently remove this product listing? This will affect existing cart items.")) return;
        try {
            await deleteProduct(productId);
            setProducts(products.filter(p => p.id !== productId));
            toast.success("Listing removed from database");
        } catch (error) {
            toast.error("Deletion failed", {
                description: "Product might be linked to active orders and cannot be removed."
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                        placeholder="Search products or farmers..." 
                        className="pl-10 h-11 border-none shadow-sm bg-muted/50 focus-visible:ring-primary/20 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-muted-foreground/10 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-black/5">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b-muted-foreground/10">
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 pl-6">Market Offering</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Origin Farmer</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-center">Unit Valuation</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Availability</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right pr-6">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id} className="group hover:bg-muted/30 transition-all border-b-muted-foreground/5 last:border-0">
                                    <TableCell className="py-5 pl-6">
                                        <div className="flex items-center gap-4">
                                            {product.images?.[0] ? (
                                                <div className="h-12 w-12 rounded-xl overflow-hidden shadow-lg border border-muted group-hover:scale-105 transition-transform">
                                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                                    <Tag className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="space-y-0.5">
                                                <div className="font-black tracking-tight text-sm">{product.name}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60 flex items-center gap-1">
                                                    <Tag className="h-3 w-3" />
                                                    {product.category}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold tracking-tight">{product.farmer.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">{product.farmer.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 text-center">
                                        <Badge className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20 rounded-full px-3 font-black text-xs">
                                            {product.price} ETB / {product.unit}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        {product.status === "AVAILABLE" ? (
                                            <div className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-black uppercase tracking-tighter">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                                Published
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-muted-foreground/60 text-[11px] font-black uppercase tracking-tighter">
                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40"></div>
                                                Archived
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-5 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-lg shadow-sm"
                                                onClick={() => window.open(`/marketplace/${product.id}`, '_blank')}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-lg shadow-sm"
                                                onClick={() => handleToggleStatus(product.id, product.status)}
                                            >
                                                {product.status === "AVAILABLE" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                                        <Store className="h-12 w-12" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Market inventory is empty</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
