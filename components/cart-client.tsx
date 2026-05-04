"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { updateCartQuantityAction, removeFromCartAction } from "@/actions/cart-actions"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function CartClient({ cart }: { cart: any }) {
    const [items, setItems] = useState(cart.items)
    const [loading, setLoading] = useState<string | null>(null)

    const subtotal = items.reduce((acc: number, item: any) => {
        return acc + (item.product.price * item.quantity);
    }, 0);

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        setLoading(itemId)
        try {
            const res = await updateCartQuantityAction(itemId, newQuantity)
            if (res.success) {
                if (newQuantity <= 0) {
                    setItems(items.filter((i: any) => i.id !== itemId))
                } else {
                    setItems(items.map((i: any) => i.id === itemId ? { ...i, quantity: newQuantity } : i))
                }
            } else {
                toast.error(res.error)
            }
        } catch (err) {
            toast.error("Failed to update quantity")
        } finally {
            setLoading(null)
        }
    }

    const handleRemove = async (itemId: string) => {
        setLoading(itemId)
        try {
            const res = await removeFromCartAction(itemId)
            if (res.success) {
                setItems(items.filter((i: any) => i.id !== itemId))
                toast.success("Item removed from cart")
            } else {
                toast.error(res.error)
            }
        } catch (err) {
            toast.error("Failed to remove item")
        } finally {
            setLoading(null)
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center">
                    < ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                    <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
                </div>
                <Link href="/marketplace">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
                    <CardHeader className="px-0 sm:px-6">
                        <CardTitle className="text-2xl">Cart Items ({items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <div className="overflow-x-auto">
                           <Table>
                               <TableHeader className="hidden sm:table-header-group">
                                   <TableRow>
                                       <TableHead>Product</TableHead>
                                       <TableHead>Price</TableHead>
                                       <TableHead>Quantity</TableHead>
                                       <TableHead>Total</TableHead>
                                       <TableHead className="text-right"></TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {items.map((item: any) => (
                                       <TableRow key={item.id} className="flex flex-col sm:table-row border-b sm:border-none p-4 sm:p-0">
                                           <TableCell className="sm:table-cell p-0 sm:p-4">
                                               <div className="flex items-center gap-4">
                                                   <div className="h-20 w-20 sm:h-16 sm:w-16 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border/50">
                                                       {item.product.images[0] && (
                                                           <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                                       )}
                                                   </div>
                                                   <div>
                                                       <p className="font-semibold text-base sm:text-sm">{item.product.name}</p>
                                                       <p className="text-xs text-muted-foreground font-medium">Farmer: {item.product.farmer.name}</p>
                                                       <p className="sm:hidden font-bold text-primary mt-1">{item.product.price.toFixed(2)} ETB</p>
                                                   </div>
                                               </div>
                                           </TableCell>
                                           <TableCell className="hidden sm:table-cell">
                                              <span className="font-medium">{item.product.price.toFixed(2)} ETB</span>
                                           </TableCell>
                                           <TableCell className="sm:table-cell p-0 sm:p-4 mt-4 sm:mt-0">
                                               <div className="flex items-center justify-between sm:justify-start gap-4">
                                                   <span className="sm:hidden text-sm text-muted-foreground">Quantity</span>
                                                   <div className="flex items-center gap-2 bg-muted/30 rounded-full p-1 border">
                                                       <Button
                                                           variant="ghost"
                                                           size="icon"
                                                           className="h-8 w-8 rounded-full hover:bg-background"
                                                           onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                           disabled={loading === item.id}
                                                       >
                                                           <Minus className="h-3 w-3" />
                                                       </Button>
                                                       <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                       <Button
                                                           variant="ghost"
                                                           size="icon"
                                                           className="h-8 w-8 rounded-full hover:bg-background"
                                                           onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                           disabled={loading === item.id}
                                                       >
                                                           <Plus className="h-3 w-3" />
                                                       </Button>
                                                   </div>
                                               </div>
                                           </TableCell>
                                           <TableCell className="hidden sm:table-cell font-bold text-primary">{(item.product.price * item.quantity).toFixed(2)} ETB</TableCell>
                                           <TableCell className="sm:table-cell p-0 sm:p-4 mt-2 sm:mt-0 text-right">
                                               <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   className="text-destructive hover:bg-destructive/10 sm:h-9 sm:w-9 sm:p-0"
                                                   onClick={() => handleRemove(item.id)}
                                                   disabled={loading === item.id}
                                               >
                                                   < Trash2 className="h-4 w-4 mr-2 sm:mr-0" />
                                                   <span className="sm:hidden">Remove Item</span>
                                               </Button>
                                           </TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="premium-shadow border-primary/10">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">{subtotal.toFixed(2)} ETB</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-green-500 font-semibold uppercase text-sm tracking-wider">Free</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-xl text-primary">
                            <span>Total</span>
                            <span>{subtotal.toFixed(2)} ETB</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href="/checkout" className="w-full">
                            <Button className="w-full text-lg h-14 shadow-lg shadow-primary/20" size="lg">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 py-3 rounded-lg border border-dashed border-border">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Secure payment and encrypted transaction.
                </div>
            </div>
        </div>
    );
}

// Helper icons that were missing in previous edit
const ShieldCheck = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
)
