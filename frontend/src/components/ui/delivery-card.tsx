"use client"

import { Clock, MapPin, Phone, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge, type DeliveryStatus } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

export interface DeliveryCardProps {
  id: string
  status: DeliveryStatus
  orderId: string
  restaurant: {
    name: string
    address: string
    phone: string
  }
  customer: {
    name: string
    address: string
    phone: string
  }
  driver?: {
    name: string
    phone: string
    vehicle?: string
  }
  estimatedTime?: string
  distance?: string
  amount?: string
  createdAt: string
  className?: string
  onViewDetails?: (id: string) => void
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  onPickup?: (id: string) => void
  onDeliver?: (id: string) => void
  onCancel?: (id: string) => void
  viewType?: "driver" | "restaurant" | "customer" | "admin"
}

export function DeliveryCard({
  id,
  status,
  orderId,
  restaurant,
  customer,
  driver,
  estimatedTime,
  distance,
  amount,
  createdAt,
  className,
  onViewDetails,
  onAccept,
  onDecline,
  onPickup,
  onDeliver,
  onCancel,
  viewType = "driver",
}: DeliveryCardProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Order #{orderId}</CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        <div className="space-y-2">
          {viewType !== "restaurant" && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-xs font-medium leading-none">Pickup</p>
                <p className="text-xs text-muted-foreground">{restaurant.name}</p>
                <p className="text-xs text-muted-foreground">{restaurant.address}</p>
              </div>
            </div>
          )}

          {viewType !== "customer" && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-xs font-medium leading-none">Dropoff</p>
                <p className="text-xs text-muted-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.address}</p>
              </div>
            </div>
          )}

          {driver && viewType !== "driver" && (
            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-xs font-medium leading-none">Driver</p>
                <p className="text-xs text-muted-foreground">{driver.name}</p>
                {driver.vehicle && <p className="text-xs text-muted-foreground">{driver.vehicle}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{formatTime(createdAt)}</span>
            </div>

            <div className="flex gap-3">
              {estimatedTime && <span className="text-xs text-muted-foreground">ETA: {estimatedTime}</span>}
              {distance && <span className="text-xs text-muted-foreground">{distance}</span>}
              {amount && viewType === "driver" && <span className="text-xs font-medium">${amount}</span>}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-0">
        {status === "PENDING" && viewType === "driver" && (
          <>
            <Button size="sm" className="flex-1" onClick={() => onAccept?.(id)}>
              Accept
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onDecline?.(id)}>
              Decline
            </Button>
          </>
        )}

        {status === "ACCEPTED" && viewType === "driver" && (
          <>
            <Button size="sm" className="flex-1" onClick={() => onPickup?.(id)}>
              Mark as Picked Up
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onCancel?.(id)}>
              Cancel
            </Button>
          </>
        )}

        {status === "ACCEPTED" && viewType === "restaurant" && (
          <Button size="sm" className="flex-1" onClick={() => onPickup?.(id)}>
            Hand to Driver
          </Button>
        )}

        {status === "IN_PROGRESS" && viewType === "driver" && (
          <Button size="sm" className="flex-1" onClick={() => onDeliver?.(id)}>
            Mark as Delivered
          </Button>
        )}

        {onViewDetails && (
          <Button
            size="sm"
            variant={status === "PENDING" && viewType === "driver" ? "outline" : "default"}
            className={status === "PENDING" && viewType === "driver" ? "w-full" : "flex-1"}
            onClick={() => onViewDetails(id)}
          >
            View Details
          </Button>
        )}

        {viewType === "customer" && ["ACCEPTED", "IN_PROGRESS"].includes(status) && (
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <a href={`tel:${driver?.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call Driver
            </a>
          </Button>
        )}

        {viewType !== "customer" && ["ACCEPTED", "IN_PROGRESS"].includes(status) && (
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <a href={`tel:${customer.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call Customer
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
