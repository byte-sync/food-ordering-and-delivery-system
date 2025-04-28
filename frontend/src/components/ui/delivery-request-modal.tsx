"use client"

import { useState } from "react"
import { MapPin, Timer, DollarSign, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DeliveryMap } from "@/components/ui/delivery-map"
import { cn } from "@/lib/utils"

interface DeliveryRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  delivery: {
    id: string
    orderId: string
    restaurant: {
      name: string
      address: string
      location: { lat: number; lng: number }
    }
    customer: {
      name: string
      address: string
      location: { lat: number; lng: number }
    }
    items: Array<{ name: string; quantity: number }>
    estimatedTime: string
    distance: string
    amount: string
  }
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}

export function DeliveryRequestModal({ open, onOpenChange, delivery, onAccept, onDecline }: DeliveryRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      onAccept(delivery.id)
      setIsLoading(false)
    }, 1000)
  }

  const handleDecline = () => {
    onDecline(delivery.id)
  }

  // Calculate driver's initial position (halfway between restaurant and customer)
  const driverLocation = {
    lat: (delivery.restaurant.location.lat + delivery.customer.location.lat) / 2,
    lng: (delivery.restaurant.location.lng + delivery.customer.location.lng) / 2,
    label: "You",
    icon: "driver" as "driver",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            New Delivery Request
          </DialogTitle>
          <DialogDescription>Order #{delivery.orderId}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <DeliveryMap
            driverLocation={driverLocation}
            pickupLocation={{
              lat: delivery.restaurant.location.lat,
              lng: delivery.restaurant.location.lng,
              label: delivery.restaurant.name,
              icon: "restaurant",
            }}
            dropoffLocation={{
              lat: delivery.customer.location.lat,
              lng: delivery.customer.location.lng,
              label: delivery.customer.name,
              icon: "customer",
            }}
            className="h-[200px]"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pickup</span>
              </div>
              <div className="pl-6">
                <p className="text-sm">{delivery.restaurant.name}</p>
                <p className="text-xs text-muted-foreground">{delivery.restaurant.address}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dropoff</span>
              </div>
              <div className="pl-6">
                <p className="text-sm">{delivery.customer.name}</p>
                <p className="text-xs text-muted-foreground">{delivery.customer.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className={cn("flex flex-col items-center rounded-lg border p-3")}>
              <Timer className="mb-1 h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Est. Time</span>
              <span className="text-sm">{delivery.estimatedTime}</span>
            </div>
            <div className={cn("flex flex-col items-center rounded-lg border p-3")}>
              <MapPin className="mb-1 h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Distance</span>
              <span className="text-sm">{delivery.distance}</span>
            </div>
            <div className={cn("flex flex-col items-center rounded-lg border p-3")}>
              <DollarSign className="mb-1 h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Payout</span>
              <span className="text-sm">${delivery.amount}</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <span className="text-sm font-medium">Order Summary</span>
            <ul className="space-y-1">
              {delivery.items.map((item, index) => (
                <li key={index} className="flex justify-between text-xs">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="sm:flex-1" onClick={handleDecline} disabled={isLoading}>
            Decline
          </Button>
          <Button className="sm:flex-1" onClick={handleAccept} disabled={isLoading}>
            {isLoading ? "Accepting..." : "Accept Delivery"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
