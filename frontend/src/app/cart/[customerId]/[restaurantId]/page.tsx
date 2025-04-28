"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function CartPage({ params }: { params: { customerId: string; restaurantId: string } }) {
  const { customerId, restaurantId } = params
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await axios.put(`/api/cart/update/${customerId}/${restaurantId}/${itemId}`, {
        newQuantity,
      })

      // Update local state to avoid refetching
      if (cart) {
        const updatedItems = cart.items.map((item) => {
          if (item.itemId === itemId) {
            const updatedItem = {
              ...item,
              quantity: newQuantity,
              totalPrice: item.price * newQuantity,
            }
            return updatedItem
          }
          return item
        })

        // If quantity is 0, remove the item
        const filteredItems = updatedItems.filter((item) => item.quantity > 0)

        // Calculate new total price
        const newTotalPrice = filteredItems.reduce((sum, item) => sum + item.totalPrice, 0)

        setCart({
          ...cart,
          items: filteredItems,
          totalPrice: newTotalPrice,
        })
      }

      toast({
        title: "Success",
        description: "Cart updated successfully",
      })
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/cart/remove/${customerId}/${restaurantId}/${itemId}`)

      // Update local state
      if (cart) {
        const updatedItems = cart.items.filter((item) => item.itemId !== itemId)
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)

        setCart({
          ...cart,
          items: updatedItems,
          totalPrice: newTotalPrice,
        })
      }

      toast({
        title: "Success",
        description: "Item removed from cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return
    }

    try {
      await axios.delete(`/api/cart/clear/${customerId}/${restaurantId}`)

      // Update local state
      if (cart) {
        setCart({
          ...cart,
          items: [],
          totalPrice: 0,
        })
      }

      toast({
        title: "Success",
        description: "Cart cleared successfully",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleContinueShopping = () => {
    router.push("/menu")
  }

  const handleCheckout = () => {
    router.push(`/checkout/${customerId}/${restaurantId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/5" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </Card>
            ))}
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

      <div className="max-w-3xl mx-auto">
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button onClick={handleContinueShopping}>Browse Menu</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.items.map((item) => (
                <Card key={item.itemId} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.itemName}
                            fill
                            className="object-cover"
                            unoptimized={!item.image.startsWith("/")}
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.itemName}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.potionSize}</p>
                        <p className="text-sm">
                          ${item.price.toFixed(2)} × {item.quantity} = ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateItemQuantity(item.itemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateItemQuantity(item.itemId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.itemId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(cart.totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(cart.totalPrice * 1.08).toFixed(2)}</span>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex flex-col gap-4">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>

                <div className="flex justify-between w-full gap-4">
                  <Button variant="outline" className="flex-1" onClick={handleContinueShopping}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                    onClick={clearCart}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
