import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8082/api/cart"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { customerId: string; restaurantId: string; itemId: string } },
) {
  const { customerId, restaurantId, itemId } = params

  try {
    const response = await fetch(`${BASE_URL}/remove/${customerId}/${restaurantId}/${itemId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error removing item from cart: ${response.status}`)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error removing item from cart:", error)
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 })
  }
}
