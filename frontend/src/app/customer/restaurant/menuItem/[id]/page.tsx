"use client"; // Mark this file as a client component
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
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

export default function MenuItemDetails() {
  const { id } = useParams(); // Extract the 'id' parameter from the URL
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get<MenuItem>(
          `http://localhost:8083/menu/${id}` // Replace with your API endpoint
        );
        if (!response.data) {
          throw new Error("Menu item data is invalid or missing.");
        }
        setMenuItem(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu item:", err);
        setError("Failed to load menu item details.");
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  if (loading) {
    return <p>Loading menu item...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!menuItem) {
    return <p>Menu item not found.</p>;
  }

  // Function to handle adding an item to the cart
  const handleAddToCart = (itemId: number) => {
    console.log(`Item with ID ${itemId} added to cart`);
    // You can implement actual cart functionality here (e.g., updating state or calling an API)
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-primary mb-6 flex items-center justify-between">
        <span>{menuItem.itemName}</span>
        {/* Add to Cart Button */}
        <button
          onClick={() => handleAddToCart(menuItem.id)}
          className="p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition duration-300 cursor-pointer"
          aria-label={`Add ${menuItem.itemName} to cart`}
        >
          <BsCartPlus size={24} />
        </button>
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Section */}
        {menuItem.imageUrl && (
          <div className="md:w-1/2">
            <img
              src={menuItem.imageUrl}
              alt={menuItem.itemName}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Details Section */}
        <div className="md:w-1/2 space-y-4">
          <p className="text-lg text-muted-foreground">{menuItem.description}</p>
          <p className="text-lg font-semibold text-accent-foreground">
            Category: {menuItem.category}
          </p>
          <p className="text-lg font-semibold text-primary">
            Starting at $
            {menuItem.portions && menuItem.portions.length > 0
              ? Math.min(...menuItem.portions.map((p) => p.price)).toFixed(2)
              : "Price not available"}
          </p>
          <div className="space-y-1">
            {menuItem.portions &&
              menuItem.portions.map((portion) => (
                <p key={portion.id} className="text-sm text-muted-foreground">
                  {portion.portionSize}: ${portion.price.toFixed(2)}
                </p>
              ))}
          </div>
          <p className="text-lg font-semibold text-green-600">
            Availability:{" "}
            {menuItem.availabilityStatus ? "Available" : "Not Available"}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            Offer: {menuItem.offer}% off
          </p>
        </div>
      </div>
    </div>
  );
}