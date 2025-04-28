import { MenuItems } from "@/components/order/menu-items"

// Fetch menu items on the server side
async function fetchMenuItems(restaurantId: number) {
  try {
    const response = await fetch(`http://localhost:8083/menu/all?restaurantId=${restaurantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch menu items")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return []
  }
}

export default async function MenuPage({ params }: { params: { restaurantId: string } }) {
  // Extract restaurantId from params and convert it to a number
  const restaurantId = Number(params.restaurantId)

  // Fetch menu items for the given restaurantId
  const menuItems = await fetchMenuItems(restaurantId)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>
      <MenuItems menuItems={menuItems} customerId="customer123" restaurantId={restaurantId} />
    </div>
  )
}