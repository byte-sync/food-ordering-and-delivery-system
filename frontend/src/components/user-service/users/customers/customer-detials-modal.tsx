"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, ShoppingBag, Calendar } from "lucide-react"

interface CustomerDetailsModalProps {
  open: boolean
  customer: any
  onClose: () => void
}

export function CustomerDetailsModal({ open, customer, onClose }: CustomerDetailsModalProps) {
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            {customer.email} • {customer.contactNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={customer.profilePicture || "/placeholder.svg"}
              alt={`${customer.firstName} ${customer.lastName}`}
            />
            <AvatarFallback>
              {customer.firstName[0]}
              {customer.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">
              {customer.firstName} {customer.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            <p className="text-sm text-muted-foreground">{customer.contactNumber}</p>
          </div>
        </div>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Account Information
              </h4>
              <div className="rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Join Date</p>
                    <p className="text-sm text-muted-foreground">{customer.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Orders</p>
                    <p className="text-sm text-muted-foreground">{customer.ordersCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="pt-4">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Customer Location
              </h4>
              <div className="h-[300px] rounded-md bg-muted">
                {/* Map would be rendered here */}
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Map View: {customer.location.lat}, {customer.location.lng}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="pt-4">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <ShoppingBag className="h-4 w-4" />
                Recent Orders
              </h4>
              <div className="rounded-md border">
                <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  Order history would be displayed here
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
