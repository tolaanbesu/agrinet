import { auth } from "@/lib/auth"  
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OrdersPage() {

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/sign-in")
    }

    const orders = await prisma.order.findMany({
        where: {
            buyerId: session.user.id
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    if (!orders.length) {
        return (
            <div className="container py-16 text-center">
                <h2 className="text-3xl font-bold">No Orders Yet</h2>
                <p className="text-muted-foreground mt-2">
                    When you buy products from farmers they will appear here.
                </p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 space-y-6">

            <h1 className="text-4xl font-bold">My Orders</h1>

            {orders.map(order => (

                <Card key={order.id}>

                    <CardHeader className="flex flex-row justify-between items-center">

                        <div>
                            <CardTitle>
                                Order #{order.id.slice(0, 8)}
                            </CardTitle>

                            {/* STATUS BADGES */}
                            <div className="flex gap-2 mt-2">

                                {/* Payment Status */}
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold
                                    ${order.paymentStatus === "PAID" && "bg-green-100 text-green-700"}
                                    ${order.paymentStatus === "PENDING" && "bg-yellow-100 text-yellow-700"}
                                    ${order.paymentStatus === "FAILED" && "bg-red-100 text-red-700"}
                                `}>
                                    {order.paymentStatus}
                                </span>

                                {/* Order Status */}
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold
                                    ${order.status === "CONFIRMED" && "bg-blue-100 text-blue-700"}
                                    ${order.status === "PENDING" && "bg-gray-100 text-gray-700"}
                                    ${order.status === "SHIPPED" && "bg-purple-100 text-purple-700"}
                                    ${order.status === "DELIVERED" && "bg-green-100 text-green-700"}
                                `}>
                                    {order.status}
                                </span>

                            </div>
                        </div>

                        <span className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </span>

                    </CardHeader>

                    <CardContent className="space-y-3">

                        {order.items.map(item => (

                            <div
                                key={item.id}
                                className="flex justify-between border-b pb-2"
                            >

                                <div>
                                    <p className="font-medium">
                                        {item.product.name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <p className="font-medium">
                                    {item.price * item.quantity} ETB
                                </p>

                            </div>

                        ))}

                        <div className="flex justify-between font-bold pt-4">

                            <span>Total</span>

                            <span>{order.totalPrice} ETB</span>

                        </div>

                    </CardContent>

                    {/* Pay Now ONLY if still pending */}
                    {order.paymentStatus === "PENDING" && (
                        <CardFooter>
                            <Link href={`/payment?orderId=${order.id}`}>
                                <Button className="w-full" size="lg">
                                    Pay Now
                                </Button>
                            </Link>
                        </CardFooter>
                    )}

                </Card>

            ))}

        </div>
    )
}

// import { auth } from "@/lib/auth" 
// import { headers } from "next/headers"
// import { redirect } from "next/navigation"
// import prisma from "@/lib/prisma"
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"

// export default async function OrdersPage() {

//     const session = await auth.api.getSession({
//         headers: await headers(),
//     })

//     if (!session) {
//         redirect("/sign-in")
//     }

//     const orders = await prisma.order.findMany({
//         where: {
//             buyerId: session.user.id
//         },
//         include: {
//             items: {
//                 include: {
//                     product: true
//                 }
//             }
//         },
//         orderBy: {
//             createdAt: "desc"
//         }
//     })

//     if (!orders.length) {
//         return (
//             <div className="container py-16 text-center">
//                 <h2 className="text-3xl font-bold">No Orders Yet</h2>
//                 <p className="text-muted-foreground mt-2">
//                     When you buy products from farmers they will appear here.
//                 </p>
//             </div>
//         )
//     }

//     return (
//         <div className="container mx-auto py-12 space-y-6">

//             <h1 className="text-4xl font-bold">My Orders</h1>

//             {orders.map(order => (

//                 <Card key={order.id}>

//                     <CardHeader className="flex flex-row justify-between">

//                         <CardTitle>
//                             Order #{order.id.slice(0, 8)}
//                         </CardTitle>

//                         <span className="text-sm text-muted-foreground">
//                             {new Date(order.createdAt).toLocaleDateString()}
//                         </span>

//                     </CardHeader>

//                     <CardContent className="space-y-3">

//                         {order.items.map(item => (

//                             <div
//                                 key={item.id}
//                                 className="flex justify-between border-b pb-2"
//                             >

//                                 <div>
//                                     <p className="font-medium">
//                                         {item.product.name}
//                                     </p>

//                                     <p className="text-xs text-muted-foreground">
//                                         Qty: {item.quantity}
//                                     </p>
//                                 </div>

//                                 <p className="font-medium">
//                                     {item.price * item.quantity} ETB
//                                 </p>

//                             </div>

//                         ))}

//                         <div className="flex justify-between font-bold pt-4">

//                             <span>Total</span>

//                             <span>{order.totalPrice} ETB</span>

//                         </div>

//                     </CardContent>

//                     {/* Only show Pay Now if order is pending */}
//                     {order.paymentStatus === "PENDING" && (
//                         <CardFooter>
//                             <Link href={`/payment?orderId=${order.id}`}>
//                                 <Button className="w-full" size="lg">
//                                     Pay Now
//                                 </Button>
//                             </Link>
//                         </CardFooter>
//                     )}

//                 </Card>

//             ))}

//         </div>
//     )
// }

// import { auth } from "@/lib/auth"
// import { headers } from "next/headers"
// import { redirect } from "next/navigation"
// import prisma from "@/lib/prisma"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// export default async function OrdersPage() {

//     const session = await auth.api.getSession({
//         headers: await headers(),
//     })

//     if (!session) {
//         redirect("/sign-in")
//     }

//     const orders = await prisma.order.findMany({
//         where: {
//             buyerId: session.user.id
//         },
//         include: {
//             items: {
//                 include: {
//                     product: true
//                 }
//             }
//         },
//         orderBy: {
//             createdAt: "desc"
//         }
//     })

//     if (!orders.length) {
//         return (
//             <div className="container py-16 text-center">
//                 <h2 className="text-3xl font-bold">No Orders Yet</h2>
//                 <p className="text-muted-foreground mt-2">
//                     When you buy products from farmers they will appear here.
//                 </p>
//             </div>
//         )
//     }

//     return (
//         <div className="container mx-auto py-12 space-y-6">

//             <h1 className="text-4xl font-bold">My Orders</h1>

//             {orders.map(order => (

//                 <Card key={order.id}>

//                     <CardHeader className="flex flex-row justify-between">

//                         <CardTitle>
//                             Order #{order.id.slice(0, 8)}
//                         </CardTitle>

//                         <span className="text-sm text-muted-foreground">
//                             {new Date(order.createdAt).toLocaleDateString()}
//                         </span>

//                     </CardHeader>

//                     <CardContent className="space-y-3">

//                         {order.items.map(item => (

//                             <div
//                                 key={item.id}
//                                 className="flex justify-between border-b pb-2"
//                             >

//                                 <div>
//                                     <p className="font-medium">
//                                         {item.product.name}
//                                     </p>

//                                     <p className="text-xs text-muted-foreground">
//                                         Qty: {item.quantity}
//                                     </p>
//                                 </div>

//                                 <p className="font-medium">
//                                     {item.price * item.quantity} ETB
//                                 </p>

//                             </div>

//                         ))}

//                         <div className="flex justify-between font-bold pt-4">

//                             <span>Total</span>

//                             <span>{order.totalPrice} ETB</span>

//                         </div>

//                     </CardContent>

//                 </Card>

//             ))}

//         </div>
//     )
// }