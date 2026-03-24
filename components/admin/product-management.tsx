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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import { toggleProductStatus } from "@/actions/admin-actions";
import { toast } from "sonner";

interface ProductManagementProps {
  initialProducts: any[];
}

export function ProductManagement({ initialProducts }: ProductManagementProps) {
  const [products, setProducts] = useState(initialProducts);

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "DRAFT" : "AVAILABLE";
    try {
      await toggleProductStatus(productId, newStatus);
      setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus } : p));
      toast.success(`Product ${newStatus === "AVAILABLE" ? "restored" : "hidden"}`);
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Farmer</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover border"
                    />
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.category}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm">{product.farmer.name}</div>
                  <div className="text-[10px] text-muted-foreground">{product.farmer.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono">${product.price}/{product.unit}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={product.status === "AVAILABLE" ? "default" : "secondary"}
                  className={product.status === "AVAILABLE" ? "bg-green-500 hover:bg-green-600 border-none" : ""}
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => window.open(`/marketplace/${product.id}`, '_blank')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Product
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(product.id, product.status)}>
                      {product.status === "AVAILABLE" ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                      {product.status === "AVAILABLE" ? "Hide Product" : "Publish Product"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Permanently
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
