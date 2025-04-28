"use client"; // Mark this file as a client component
import React from "react";
import Link from "next/link"; // Import Link for navigation
import { BsCartPlus } from "react-icons/bs"; // Import the Cart Plus icon

interface MenuItem {
  id: number;
  restaurantId: number;
  itemName: string;
  description: string;
  category: string;
  availabilityStatus: boolean;
  offer: number;
  imageUrl?: string;
  imagePublicId?: string;
  portions: {
    id: number;
    portionSize: string;
    price: number;
  }[];
}

interface MenuItemsProps {
  menuItems: MenuItem[];
}

const MenuItems = ({ menuItems }: MenuItemsProps) => {
  return (
    <div className="max-w-8xl mx-auto p-6 bg-background shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">
        Menu Items
      </h1>

      {/* Grid Layout for Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={`/customer/restaurant/menuItem/${item.id}`} // Navigate to the menu item details page
            className="bg-card rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg relative block"
          >
            {/* Image Section */}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.itemName}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Details Section */}
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-card-foreground">
                {item.itemName}
              </h2>
              <p className="text-muted-foreground">{item.description}</p>
              <p className="text-sm text-accent-foreground">
                Category: {item.category}
              </p>
              <p className="text-xl font-bold text-primary">
                Starting at $
                {item.portions && item.portions.length > 0
                  ? Math.min(...item.portions.map((p) => p.price)).toFixed(2)
                  : "Price not available"}
              </p>
              <div className="space-y-1">
                {item.portions &&
                  item.portions.map((portion) => (
                    <p key={portion.id} className="text-sm text-muted-foreground">
                      {portion.portionSize}: ${portion.price.toFixed(2)}
                    </p>
                  ))}
              </div>
            </div>

            {/* Add to Cart Icon */}
            <button
              className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition duration-300 cursor-pointer"
              aria-label={`Add ${item.itemName} to cart`}
            >
              <BsCartPlus size={20} />
            </button>
          </Link>
        ))}
      </div>

      {/* No Menu Items Found */}
      {menuItems.length === 0 && (
        <div className="text-center text-muted-foreground mt-6">
          No menu items available.
        </div>
      )}
    </div>
  );
};

export default MenuItems;