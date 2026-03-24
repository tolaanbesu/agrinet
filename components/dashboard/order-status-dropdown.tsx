"use client"

import { useState } from "react"
import { OrderStatus } from "@prisma/client"
import { updateOrderStatusAction } from "@/actions/order-actions"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export function OrderStatusDropdown({
    orderId,
    currentStatus
}: {
    orderId: string,
    currentStatus: OrderStatus
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<OrderStatus>(currentStatus)

    const handleUpdate = async (newStatus: OrderStatus) => {
        setIsLoading(true)
        try {
            const result = await updateOrderStatusAction(orderId, newStatus)
            if (result.success) {
                setStatus(newStatus)
                toast.success(`Order set to ${newStatus}`)
            } else {
                toast.error(result.error || "Failed to update status")
            }
        } catch (err) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                disabled={isLoading}
                defaultValue={status}
                onValueChange={(val) => handleUpdate(val as OrderStatus)}
            >
                <SelectTrigger className="w-[140px] h-9">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Updating...</span>
                        </div>
                    ) : (
                        <SelectValue placeholder="Status" />
                    )}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
