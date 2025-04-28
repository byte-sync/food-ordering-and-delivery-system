import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface OrderSummaryProps {
  cart: Cart
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  // Calculate totals
  const subtotal = cart.totalPrice || 0
  const deliveryFee = 5.0
  const tax = Number((subtotal * 0.08).toFixed(2))
  const total = Number((subtotal + deliveryFee + tax).toFixed(2))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cart.items.map((item) => (
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

        <Separator />

        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 mt-2">
        <div className="flex justify-between w-full text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
