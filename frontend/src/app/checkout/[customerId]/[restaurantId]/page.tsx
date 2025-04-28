"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Check, ChevronRight, CreditCard, ShoppingBag, MapPin, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderSummary } from "@/components/order/order-summary"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081/api"

interface CartItem {
  itemId: string
  itemName: string
  quantity: number
  potionSize: string
  price: number
  totalPrice: number
  image: string
}

interface Cart {
  id: string
  customerId: string
  restaurantId: string
  items: CartItem[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export default function CheckoutPage({ params }: { params: { customerId: string; restaurantId: string } }) {
  const { customerId, restaurantId } = params
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    customerContact: "",
    longitude: -73.9857, // Default to NYC coordinates
    latitude: 40.7484,
  })
  const [paymentType, setPaymentType] = useState<string>("CASH_ON_DELIVERY")
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetchCart()
  }, [customerId, restaurantId])

  const fetchCart = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<Cart>(`/api/cart/${customerId}/${restaurantId}`)
      setCart(response.data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Failed to load cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerInfo((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        toast({
          title: "Success",
          description: "Location detected successfully",
        })
      },
      () => {
        toast({
          title: "Error",
          description: "Unable to retrieve your location",
          variant: "destructive",
        })
      },
    )
  }

  const handleSubmitCustomerInfo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerInfo.customerName || !customerInfo.customerContact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    setStep(2)
  }

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    placeOrder()
  }

  // Update the placeOrder function to handle the response structure correctly
  const placeOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare order request
      const orderRequest = {
        customerId,
        restaurantId,
        customerName: customerInfo.customerName,
        customerContact: customerInfo.customerContact,
        longitude: customerInfo.longitude,
        latitude: customerInfo.latitude,
        paymentType,
      }

      // Call order API
      const response = await axios.post(`/api/order/create`, orderRequest)

      // Check if we have a valid order response
      if (response.data) {
        // Clear cart in local state
        setCart(null)

        // Navigate to order success page with the orderId from the response
        // The Spring Boot backend returns the orderId directly in the OrderDTO
        router.push(`/order/success/${response.data.orderId}`)
      } else {
        throw new Error("Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      router.push(`/cart/${customerId}/${restaurantId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some items to your cart to proceed with checkout</p>
          <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Checkout</h1>

      {/* Checkout steps */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-center">
          <div className="flex items-center">
            <div
              className={`rounded-full ${step >= 1 ? "bg-green-600" : "bg-gray-300"} h-8 w-8 flex items-center justify-center text-white`}
            >
              {step > 1 ? <Check size={16} /> : 1}
            </div>
            <div className="text-sm font-medium ml-2">Customer Info</div>
          </div>
          <div className="mx-2 border-t w-16 border-gray-300 self-center"></div>
          <div className="flex items-center">
            <div
              className={`rounded-full ${step >= 2 ? "bg-green-600" : "bg-gray-300"} h-8 w-8 flex items-center justify-center text-white`}
            >
              {step > 2 ? <Check size={16} /> : 2}
            </div>
            <div className="text-sm font-medium ml-2">Payment</div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: Form */}
          <div className="md:col-span-2">
            <Card>
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitCustomerInfo} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Full Name</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={customerInfo.customerName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerContact">Phone Number</Label>
                        <Input
                          id="customerContact"
                          name="customerContact"
                          value={customerInfo.customerContact}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Delivery Location</Label>
                        <div className="flex items-center gap-2">
                          <Button type="button" onClick={getLocation} variant="secondary" className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Detect My Location
                          </Button>
                          <div className="text-sm text-muted-foreground">
                            {customerInfo.latitude !== 40.7484 ? "Location detected" : "Default location"}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <Button type="button" variant="outline" onClick={goBack}>
                          Back to Cart
                        </Button>
                        <Button type="submit">
                          Continue to Payment <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </>
              )}

              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitPayment} className="space-y-4">
                      <RadioGroup value={paymentType} onValueChange={setPaymentType} className="space-y-3">
                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <RadioGroupItem value="CASH_ON_DELIVERY" id="cash" />
                          <Label htmlFor="cash" className="flex-1 flex items-center cursor-pointer">
                            Cash on Delivery
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 border rounded-md p-3">
                          <RadioGroupItem value="CREDIT_CARD" id="credit" />
                          <Label htmlFor="credit" className="flex-1 flex items-center cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Credit Card
                            <span className="ml-auto text-sm text-muted-foreground">(Pay at delivery)</span>
                          </Label>
                        </div>
                      </RadioGroup>

                      <div className="pt-4 flex justify-between">
                        <Button type="button" variant="outline" onClick={goBack}>
                          Back
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Place Order</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </>
              )}
            </Card>
          </div>

          {/* Right column: Order summary */}
          <div>
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}
