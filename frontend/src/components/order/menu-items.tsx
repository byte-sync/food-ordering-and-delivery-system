"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Edit, Plus, Minus } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Portion {
  id: number
  portionSize: string
  price: number
}

interface MenuItem {
  id: number
  restaurantId: number
  itemName: string
  description: string
  category: string
  availabilityStatus: boolean
  offer: number
  imageUrl?: string
  imagePublicId?: string
  portions: Portion[]
}

interface MenuItemsProps {
  menuItems: MenuItem[]
  customerId: string
  restaurantId: number
}

export function MenuItems({ menuItems, customerId, restaurantId }: MenuItemsProps) {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [portionSize, setPortionSize] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (itemId: number) => {
    router.push(`/restaurant/menu/${itemId}`)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const resetDialog = () => {
    setSelectedItem(null)
    setQuantity(1)
    setPortionSize("")
  }

  const handleAddToCart = async () => {
    if (!selectedItem || !portionSize) {
      toast({
        title: "Error",
        description: "Please select a portion size",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Find the selected portion details
      const selectedPortion = selectedItem.portions.find((portion) => portion.portionSize === portionSize)

      if (!selectedPortion) {
        throw new Error("Invalid portion size")
      }

      // Map the portion size to the backend's expected enum format
      // Assuming the backend expects Small, Medium, or Large
      let potionSizeEnum
      if (portionSize.toLowerCase().includes("small")) {
        potionSizeEnum = "Small"
      } else if (portionSize.toLowerCase().includes("medium")) {
        potionSizeEnum = "Medium"
      } else if (portionSize.toLowerCase().includes("large")) {
        potionSizeEnum = "Large"
      } else {
        potionSizeEnum = portionSize // Use as is if it doesn't match
      }

      // Prepare the request payload
      const payload = {
        itemId: String(selectedItem.id),
        itemName: selectedItem.itemName,
        quantity,
        potionSize: potionSizeEnum,
        unitPrice: selectedPortion.price,
        image: selectedItem.imageUrl || "/placeholder.svg",
      }

      // Call the backend API to add the item to the cart
      await axios.post(`/api/cart/add/${customerId}/${restaurantId}`, payload)

      toast({
        title: "Success",
        description: `${selectedItem.itemName} (${portionSize}) added to cart!`,
      })

      // Ask if user wants to view cart
      const viewCart = window.confirm("Item added to cart. Do you want to view your cart?")
      if (viewCart) {
        router.push(`/cart/${customerId}/${restaurantId}`)
      }

      resetDialog()
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems && menuItems.length > 0 ? (
        menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.itemName}
                  fill
                  className="object-cover"
                  unoptimized={!item.imageUrl.startsWith("/")}
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              {item.offer > 0 && <Badge className="absolute top-2 left-2 bg-red-500">{item.offer}% OFF</Badge>}
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => handleEdit(item.id)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{item.itemName}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
              <div className="mt-2">
                <span className="text-sm font-medium">Category: </span>
                <span className="text-sm text-muted-foreground">{item.category}</span>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium">Available Sizes:</p>
                {item.portions.map((portion) => (
                  <div key={portion.id} className="flex justify-between text-sm">
                    <span>{portion.portionSize}</span>
                    <span className="font-semibold">${portion.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Dialog
                onOpenChange={(open) => {
                  if (open) {
                    setSelectedItem(item)
                  } else {
                    resetDialog()
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add to Cart</DialogTitle>
                  </DialogHeader>

                  {selectedItem && (
                    <div className="space-y-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden">
                          {selectedItem.imageUrl ? (
                            <Image
                              src={selectedItem.imageUrl || "/placeholder.svg"}
                              alt={selectedItem.itemName}
                              fill
                              className="object-cover"
                              unoptimized={!selectedItem.imageUrl.startsWith("/")}
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
                        <div>
                          <h3 className="font-semibold">{selectedItem.itemName}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{selectedItem.description}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Portion Size</label>
                        <Select value={portionSize} onValueChange={setPortionSize}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedItem.portions.map((portion) => (
                              <SelectItem key={portion.id} value={portion.portionSize}>
                                {portion.portionSize} - ${portion.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantity</label>
                        <div className="flex items-center">
                          <Button type="button" variant="outline" size="icon" onClick={decrementQuantity}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-4 font-medium">{quantity}</span>
                          <Button type="button" variant="outline" size="icon" onClick={incrementQuantity}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {portionSize && (
                        <div className="pt-2">
                          <p className="text-sm font-medium">Total Price:</p>
                          <p className="text-lg font-bold">
                            ${(selectedItem.portions.find((p) => p.portionSize === portionSize)?.price || 0).toFixed(2)}
                            {quantity > 1 &&
                              ` × ${quantity} = $${(
                                (selectedItem.portions.find((p) => p.portionSize === portionSize)?.price || 0) *
                                  quantity
                              ).toFixed(2)}`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddToCart} disabled={!portionSize || isLoading}>
                      {isLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No menu items available</p>
        </div>
      )}
    </div>
  )
}
