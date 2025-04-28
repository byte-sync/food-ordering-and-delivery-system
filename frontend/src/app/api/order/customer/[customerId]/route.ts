import { type NextRequest, NextResponse } from "next/server"

const ORDER_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081/api/order"

export async function GET(request: NextRequest, { params }: { params: { customerId: string } }) {
  const { customerId } = params

  try {
    const response = await fetch(`${ORDER_API_URL}/customer/${customerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching customer orders: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    return NextResponse.json({ error: "Failed to fetch customer orders" }, { status: 500 })
  }
}
