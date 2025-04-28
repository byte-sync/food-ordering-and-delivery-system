"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter,useParams } from "next/navigation"; // Import useRouter for navigation
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the schema for form validation using Zod
const updateMenuSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  itemName: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  availabilityStatus: z.boolean(),
  offer: z.number().min(0, "Offer must be non-negative"),
  image: z.instanceof(File).optional(), // Add image as an optional File type
  portions: z.array(
    z.object({
      portionSize: z.string().min(1, "Portion size is required"),
      price: z.number().min(0, "Price must be non-negative"),
    })
  ),
});

// Infer the type from the schema
type UpdateMenuFormValues = z.infer<typeof updateMenuSchema>;

// Define the MenuItem interface
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

const UpdateMenuItem = () => {
  const router = useRouter(); // Initialize useRouter
  const { id } = useParams(); // Extract the 'id' parameter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Initialize form with react-hook-form and Zod validation
  const formMethods = useForm<UpdateMenuFormValues>({
    resolver: zodResolver(updateMenuSchema),
    defaultValues: {
      restaurantId: "",
      itemName: "",
      description: "",
      category: "",
      availabilityStatus: true,
      offer: 0,
      image: undefined,
      portions: [],
    },
  });

  // Fetch the menu item details
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";
        const response = await axios.get<MenuItem>(`${API_URL}/menu/${id}`);
        const fetchedMenuItem = response.data;

        if (!fetchedMenuItem) {
          setError("Menu item data is invalid or missing.");
          setLoading(false);
          return;
        }

        // Set initial form values
        formMethods.setValue("restaurantId", String(fetchedMenuItem.restaurantId));
        formMethods.setValue("itemName", fetchedMenuItem.itemName);
        formMethods.setValue("description", fetchedMenuItem.description);
        formMethods.setValue("category", fetchedMenuItem.category);
        formMethods.setValue("availabilityStatus", fetchedMenuItem.availabilityStatus);
        formMethods.setValue("offer", fetchedMenuItem.offer);
        formMethods.setValue("portions", fetchedMenuItem.portions);

        if (fetchedMenuItem.imageUrl) {
          setPreview(fetchedMenuItem.imageUrl); // Set preview for existing image
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch menu item details.");
        setLoading(false);
        console.error("Error fetching menu item:", err);
      }
    };

    fetchMenuItem();
  }, [id, formMethods]);

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      formMethods.setValue("image", files[0]); // Update form state with the selected file
      setPreview(URL.createObjectURL(files[0])); // Update preview
    }
  };

  // Handle form submission
  const onSubmit = async (values: UpdateMenuFormValues) => {
    const formDataToSend = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        console.warn(`Skipping field '${key}' because it is undefined or null.`);
        return; // Skip undefined or null values
      }

      if (value instanceof File) {
        formDataToSend.append(key, value);
      } else if (typeof value === "boolean") {
        formDataToSend.append(key, value.toString());
      } else if (key === "portions") {
        // Convert portions array to JSON string
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";
      const response = await fetch(`${API_URL}/menu/update/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Menu item updated successfully!");
        console.log("Navigating to /restaurant/menu");
        router.push("/restaurant/menu");// Navigate to /restaurant/menu on success
      } else {
        alert("Failed to update menu item.");
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("An error occurred while updating the menu item.");
    }
  };

  // Render loading state
  if (loading) {
    return <p>Loading menu item...</p>;
  }

  // Render error state
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center text-primary mb-6">
        Update Menu Item
      </h1>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Restaurant ID */}
          <FormField
            control={formMethods.control}
            name="restaurantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly // Make the restaurantId field uneditable
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Item Name */}
          <FormField
            control={formMethods.control}
            name="itemName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={formMethods.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={formMethods.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Availability Status */}
          <FormField
            control={formMethods.control}
            name="availabilityStatus"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 text-primary"
                  />
                </FormControl>
                <FormLabel>Available</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Offer */}
          <FormField
            control={formMethods.control}
            name="offer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter offer percentage"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={formMethods.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <>
                    <label
                      htmlFor="image-upload"
                      className="block cursor-pointer text-primary hover:underline"
                    >
                      Choose Image
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                </FormControl>
                {preview && (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt="Food preview"
                      className="object-cover w-full h-32 rounded-lg"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Portions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Portions</h3>
            {formMethods.watch("portions").map((portion, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <FormField
                  control={formMethods.control}
                  name={`portions.${index}.portionSize`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Portion Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Small" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formMethods.control}
                  name={`portions.${index}.price`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 9.99"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const updatedPortions = formMethods
                      .getValues("portions")
                      .filter((_, i) => i !== index);
                    formMethods.setValue("portions", updatedPortions);
                  }}
                  className="button-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                formMethods.setValue("portions", [
                  ...formMethods.getValues("portions"),
                  { portionSize: "", price: 0 },
                ]);
              }}
              className="w-full button-accent"
            >
              Add Portion
            </Button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full button-primary">
            Update Menu Item
          </Button>
        </form>
      </FormProvider>
      <div className="text-center mt-6 text-muted-foreground text-sm">
        Restaurant Menu Management System &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default UpdateMenuItem;