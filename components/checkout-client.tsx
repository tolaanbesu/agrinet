"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { ShoppingBag, CreditCard, Wallet, Truck, CheckCircle2 } from "lucide-react"

import { placeOrderAction } from "@/actions/checkout-action"

export function CheckoutClient({ cart, session }: { cart: any, session: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        phone: session.user.phone || "",
        address: session.user.location || "",
        paymentMethod: "COD"
    })

    const subtotal = cart.items.reduce((acc: number, item: any) => {
        return acc + (item.product.price * item.quantity);
    }, 0);

    const handleCheckout = async () => {
        if (!formData.phone || !formData.address) {
            toast.error("Please fill in all the required fields")
            return
        }

        setLoading(true)
        try {
            // Optional: simplify order creation by grouping items by farmerId if needed
            const result = await placeOrderAction({
                phone: formData.phone,
                address: formData.address,
                paymentMethod: formData.paymentMethod
            })

            if (result.checkout_url) {
                window.location.href = result.checkout_url
                return
            }

            if (result.success) {
                setSuccess(true)
                toast.success("Order placed successfully!")
                setTimeout(() => {
                    router.push("/dashboard/buyer/orders") // Keep the buyer orders redirect
                }, 3000)
            } else {
                toast.error(result.error || "Failed to place order")
            }
        } catch (err) {
            toast.error("An error occurred during checkout")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold">Thank you for your order!</h2>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        Your order has been placed successfully. You can track your order status in your dashboard.
                    </p>
                </div>
                <Link href="/cart">
                    <Button size="lg">View My Orders</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                        <CardDescription>Where should we deliver your fresh products?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="+1234567890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Delivery Address</Label>
                            <Input
                                id="address"
                                placeholder="123 Farm Road, Village Name"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Select how you would like to pay.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="COD" onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}>
                            <div className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="COD" id="cod" />
                                <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer w-full">
                                    <Truck className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Cash on Delivery</p>
                                        <p className="text-xs text-muted-foreground">Pay when your items arrive</p>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors mt-4">
                                <RadioGroupItem value="CHAPA" id="chapa" />
                                <Label htmlFor="chapa" className="flex items-center gap-3 cursor-pointer w-full">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Pay with Chapa</p>
                                        <p className="text-xs text-muted-foreground">Card, Telebirr, Mobile Wallet</p>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors mt-4 opacity-50">
                                <RadioGroupItem value="WALLET" id="wallet" disabled />
                                <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer w-full">
                                    <Wallet className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Mobile Wallet (Coming Soon)</p>
                                        <p className="text-xs text-muted-foreground">M-Pesa, Airtel Money, etc.</p>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Order Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 max-h-[300px] overflow-y-auto px-1">
                            {cart.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.product.name}</span>
                                        <span className="text-muted-foreground text-xs">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)}ETB</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{subtotal.toFixed(2)}ETB</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-500 font-medium">Free</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{subtotal.toFixed(2)}ETB</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full text-lg h-12"
                            size="lg"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Place Order"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}