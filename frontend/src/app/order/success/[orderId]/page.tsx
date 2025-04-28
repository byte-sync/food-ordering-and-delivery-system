"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Check, ArrowRight, ShoppingBag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface DriverDetails {
  driverId: string
  driverName: string
  vehicleNumber: string
}

interface CartItem {
  itemId: string
  itemName: string
  quantity: number
  potionSize: string
  price: number
  totalPrice: number
  image: string
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
  cartItems: CartItem[]
  orderTotal: number
  deliveryFee: number
  totalAmount: number
  paymentType: string
  orderStatus: string
  driverDetails?: DriverDetails
  createdAt: string
  updatedAt: string
}

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
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
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "out for delivery":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-center mb-4">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3 mb-2" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
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
            <ShoppingBag className="h-16 w-16 mx-auto" />
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="pb-0 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Order Successful!</CardTitle>
            <p className="text-muted-foreground mt-2">
              Your order has been placed successfully and is now being processed
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Order Info */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="text-sm font-medium">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Restaurant ID</span>
                <span className="text-sm font-medium">{order.restaurantId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="text-sm">{order.paymentType.replace("_", " ")}</span>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.cartItems.map((item) => (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.quantity}x</span> {item.itemName}{" "}
                      <Badge variant="outline" className="ml-1">
                        {item.potionSize}
                      </Badge>
                    </div>
                    <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${(order.totalAmount - order.orderTotal - order.deliveryFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-muted rounded-md p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Delivery Information
              </h3>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">Customer:</span> {order.customerDetails.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Contact:</span> {order.customerDetails.contact}
                </div>
                {order.driverDetails && (
                  <>
                    <div className="mt-3 font-medium">Driver Information</div>
                    <div>
                      <span className="text-muted-foreground">Driver:</span> {order.driverDetails.driverName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vehicle:</span> {order.driverDetails.vehicleNumber}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full">
              <Link href={`/order/track/${order.orderId}`}>
                Track Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
