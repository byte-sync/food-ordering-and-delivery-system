import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8082/api/cart"

export async function POST(request: NextRequest, { params }: { params: { customerId: string; restaurantId: string } }) {
  const { customerId, restaurantId } = params

  try {
    const body = await request.json()

    const response = await fetch(`${BASE_URL}/add/${customerId}/${restaurantId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Error adding item to cart: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}
