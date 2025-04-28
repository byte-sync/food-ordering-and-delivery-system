import { type NextRequest, NextResponse } from "next/server"

const ORDER_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081/api/order"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Call the order service API
    const response = await fetch(`${ORDER_API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Error creating order: ${response.status}`)
    }

    const data = await response.json()

    // Clear the cart using cart service API (optional)
    if (data && data.orderId) {
      try {
        await fetch(`/api/cart/clear/${body.customerId}/${body.restaurantId}`, {
          method: "DELETE",
        })
      } catch (cartError) {
        console.error("Error clearing cart:", cartError)
        // Continue with order creation even if cart clearing fails
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
