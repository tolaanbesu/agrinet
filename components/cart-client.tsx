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
import { Input } from "@/components/ui/input"
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
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Cart Items ({items.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
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
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                                    {item.product.images[0] && (
                                                        <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-xs text-muted-foreground font-medium">Farmer: {item.product.farmer.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.product.price.toFixed(2)}ETB</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={loading === item.id}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={loading === item.id}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{(item.product.price * item.quantity).toFixed(2)}ETB</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => handleRemove(item.id)}
                                                disabled={loading === item.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{subtotal.toFixed(2)}ETB</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-green-500 font-medium">Free</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{subtotal.toFixed(2)}ETB</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href="/checkout" className="w-full">
                            <Button className="w-full text-lg h-12" size="lg">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                <p className="text-xs text-muted-foreground text-center">
                    Secure payment and encrypted transaction.
                </p>
            </div>
        </div>
    );
}
