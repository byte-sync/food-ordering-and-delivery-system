import MenuItems from "@/components/customer/menu-items";
import { notFound } from "next/navigation";

// Fetch menu items on the server side
async function fetchMenuItems(restaurantId: string) {
  try {
    const response = await fetch(
      `http://localhost:8083/menu/restaurant/${restaurantId}`, // Include the restaurant ID in the URL
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch menu items");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return null; // Return null to indicate failure
  }
}

export default async function MenuPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; // Extract the restaurant ID from the dynamic route

  // Fetch menu items for the given restaurant ID
  const menuItems = await fetchMenuItems(id);

  // Handle cases where menu items are not found
  if (!menuItems) {
    notFound(); // Use Next.js's `notFound` to render a 404 page
  }

  return (
    <div>
      {/* Pass the fetched menu items to the MenuItems component */}
      <MenuItems menuItems={menuItems} />
    </div>
  );
}