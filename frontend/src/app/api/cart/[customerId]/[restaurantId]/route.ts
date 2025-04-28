import { type NextRequest, NextResponse } from "next/server";

// Base URL for the backend API
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8082/api/cart";

export async function GET(request: NextRequest, { params }: { params: { customerId: string; restaurantId: string } }) {
  const { customerId, restaurantId } = params;

  // Validate customerId and restaurantId
  if (!customerId || !restaurantId) {
    return NextResponse.json(
      { error: "Invalid customer ID or restaurant ID" },
      { status: 400 }
    );
  }

  try {
    // Log the base URL for debugging purposes
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
      console.warn("NEXT_PUBLIC_BACKEND_URL is not set. Using default URL:", BASE_URL);
    }

    // Fetch cart data from the backend
    const response = await fetch(`${BASE_URL}/${customerId}/${restaurantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorDetails = await response.text(); // Attempt to extract error details
      throw new Error(`Error fetching cart: ${response.status} - ${errorDetails}`);
    }

    // Parse and return the cart data
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cart:", error);

    // Return a user-friendly error message
    return NextResponse.json(
      { error: "Failed to fetch cart. Please try again later." },
      { status: 500 }
    );
  }
}