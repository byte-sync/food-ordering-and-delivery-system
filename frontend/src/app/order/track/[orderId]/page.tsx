"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Clock, MapPin, Package, Truck, CheckCircle, Home, User, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface DriverDetails {
  driverId: string
  driverName: string
  vehicleNumber: string
}

interface Order {
  orderId: string
  customerId: string
  restaurantId: string
  customerDetails: {
    name: string
    contact: string
    longitude: number
    latitude: number
  }
  orderStatus: string
  driverDetails?: DriverDetails
  createdAt: string
  updatedAt: string
}

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()

    // Set up periodic refresh for tracking updates
    const intervalId = setInterval(fetchOrderDetails, 30000) // Every 30 seconds

    return () => clearInterval(intervalId)
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<Order>(`/api/order/${orderId}`)
      setOrder(response.data)
    } catch (error) {
      console.error("Error fetching order:", error)
      toast({
        title: "Error",
        description: "Failed to load order tracking information.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to determine completed steps based on order status
  const getCompletedSteps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return 4 // All steps complete
      case "out for delivery":
        return 3 // Order received, confirmed, and out for delivery
      case "confirmed":
        return 2 // Order received and confirmed
      case "pending":
      default:
        return 1 // Only order received
    }
  }

  const formatDate = (dateString: string, includeTime = true) => {
    const date = new Date(dateString)
    if (includeTime) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3 mb-2" />
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-6 text-center">
          <div className="mb-6 text-red-500">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find any order with the ID: {orderId}</p>
          <Button asChild>
            <Link href="/menu">Return to Menu</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const completedSteps = getCompletedSteps(order.orderStatus)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Order Tracking</CardTitle>
            <div className="flex justify-between items-center text-sm">
              <div>
                Order ID: <span className="font-medium">{order.orderId}</span>
              </div>
              <div>
                Placed on: <span className="font-medium">{formatDate(order.createdAt, false)}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Tracking Steps */}
            <div>
              <div className="relative flex items-center justify-between">
                {/* Progress Line */}
                <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-200 -translate-y-1/2"></div>
                <div
                  className={`absolute left-0 top-1/2 h-0.5 w-full bg-green-600 -translate-y-1/2 transition-all duration-500 ${
                    completedSteps === 1
                      ? "w-0"
                      : completedSteps === 2
                        ? "w-1/3"
                        : completedSteps === 3
                          ? "w-2/3"
                          : "w-full"
                  }`}
                ></div>

                {/* Step 1: Order Received */}
                <div className="relative z-10">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      completedSteps >= 1 ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    <Package size={20} />
                  </div>
                  <p className="mt-2 text-xs font-medium">Order Received</p>
                </div>

                {/* Step 2: Order Confirmed */}
                <div className="relative z-10">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      completedSteps >= 2 ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    <CheckCircle size={20} />
                  </div>
                  <p className="mt-2 text-xs font-medium">Confirmed</p>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="relative z-10">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      completedSteps >= 3 ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    <Truck size={20} />
                  </div>
                  <p className="mt-2 text-xs font-medium">Out for Delivery</p>
                </div>

                {/* Step 4: Delivered */}
                <div className="relative z-10">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      completedSteps >= 4 ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    <Home size={20} />
                  </div>
                  <p className="mt-2 text-xs font-medium">Delivered</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Current Status
              </h3>
              <p className="text-sm">
                {order.orderStatus === "Pending" && "Your order has been received and is waiting to be confirmed."}
                {order.orderStatus === "Confirmed" && "Your order has been confirmed and is being prepared."}
                {order.orderStatus === "Out for Delivery" && "Your order is on its way to you!"}
                {order.orderStatus === "Delivered" && "Your order has been delivered. Enjoy your meal!"}
                {order.orderStatus === "Cancelled" && "This order has been cancelled."}
              </p>

              {order.driverDetails && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="text-sm font-medium mb-2">Delivery Agent Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span> {order.driverDetails.driverName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vehicle:</span> {order.driverDetails.vehicleNumber}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div>
              <h3 className="font-medium mb-3">Delivery Information</h3>
              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{order.customerDetails.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm">{order.customerDetails.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery coordinates:</p>
                      <p className="text-sm">
                        {order.customerDetails.latitude}, {order.customerDetails.longitude}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full">
              <Link href={`/order/success/${order.orderId}`}>View Order Details</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/menu">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
