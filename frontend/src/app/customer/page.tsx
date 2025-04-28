import React from "react";
import MenuItemsWithOffers from "@/components/customer/offer-menu-items";

// Define the type for a menu item
interface MenuItem {
  id: number;
  restaurantId: number;
  itemName: string;
  description: string;
  category: string;
  availabilityStatus: boolean;
  offer: number; // Offer percentage (e.g., 10 for 10% off)
  imageUrl?: string;
  imagePublicId?: string;
  portions: {
    id: number;
    portionSize: string;
    price: number;
  }[];
}

async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch("http://localhost/api/menu-service/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }

  return response.json();
}

export default async function Page() {
  const menuItems = await fetchMenuItems();

  // Filter menu items with offers
  const menuItemsWithOffers = menuItems.filter(
    (item: MenuItem) => item.offer > 0
  );

  return (
    <div>
      <MenuItemsWithOffers menuItems={menuItemsWithOffers} />
    </div>
  );
}