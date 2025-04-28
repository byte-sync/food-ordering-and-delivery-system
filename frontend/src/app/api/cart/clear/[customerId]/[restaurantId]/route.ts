import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8082/api/cart"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { customerId: string; restaurantId: string } },
) {
  const { customerId, restaurantId } = params

  try {
    const response = await fetch(`${BASE_URL}/clear/${customerId}/${restaurantId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error clearing cart: ${response.status}`)
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
