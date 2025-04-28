"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Define the type for a category
interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

const DisplayCategoriesFood = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for the container element
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch all categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost:8083/categories");
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Handle scrolling to the left
  const handleScrollLeft = () => {
    if (containerRef.current) {
      const newScrollPosition = Math.max(
        0,
        containerRef.current.scrollLeft - containerRef.current.offsetWidth
      );
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Handle scrolling to the right
  const handleScrollRight = () => {
    if (containerRef.current) {
      const newScrollPosition =
        containerRef.current.scrollLeft + containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white overflow-hidden">
      {/* Ensure no vertical scrollbar */}
      <h1 className="text-2xl font-bold text-amber-700 mb-6">
        Available Categories
      </h1>

      {/* Horizontal Slider Container */}
      <div className="relative overflow-hidden">
        {/* Navigation Buttons */}
        <button
          onClick={handleScrollLeft}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/80 transition duration-300 z-10"
        >
          <ChevronLeftIcon size={24} />
        </button>
        <button
          onClick={handleScrollRight}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/80 transition duration-300 z-10"
        >
          <ChevronRightIcon size={24} />
        </button>

        {/* Category Cards */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-hidden overflow-y-hidden ml-20 mr-20"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/customer/categories/${encodeURIComponent(category.name)}`}
              className="group min-w-[200px] flex-shrink-0 bg-gray-100 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            >
              {/* Image Section */}
              <img
                src={category.imageUrl}
                alt={`Category: ${category.name}`}
                className="w-full h-32 object-cover group-hover:opacity-90 transition-opacity"
              />
              {/* Name Section */}
              <div className="p-3">
                <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {category.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayCategoriesFood;