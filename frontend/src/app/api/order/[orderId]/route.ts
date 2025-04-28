import { type NextRequest, NextResponse } from "next/server"

const ORDER_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081/api/order"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params

  try {
    const response = await fetch(`${ORDER_API_URL}/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching order: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
