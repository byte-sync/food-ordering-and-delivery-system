import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8082/api/cart"

export async function PUT(
  request: NextRequest,
  { params }: { params: { customerId: string; restaurantId: string; itemId: string } },
) {
  const { customerId, restaurantId, itemId } = params

  try {
    const body = await request.json()

    const response = await fetch(`${BASE_URL}/update/${customerId}/${restaurantId}/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Error updating cart item: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}
