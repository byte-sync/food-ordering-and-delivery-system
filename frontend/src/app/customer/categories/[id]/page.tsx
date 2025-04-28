"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import MenuItems from "@/components/customer/menu-items";

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

const CategoryMenuPage = () => {
  const { id } = useParams(); // Extract the category name from the URL
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Ensure categoryName is a string
        if (!id || typeof id !== "string") {
          throw new Error("Invalid category name.");
        }

        const response = await axios.get<MenuItem[]>(
          `http://localhost:8083/menu/category/${id}`
        );

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("No menu items found.");
        }

        setMenuItems(response.data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg">Loading menu items...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Restaurant Name Title */}
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">
        {decodeURIComponent(id as string)}
      </h1>

      {/* Display Menu Items */}
      <MenuItems menuItems={menuItems} />
    </div>
  );
};

export default CategoryMenuPage;