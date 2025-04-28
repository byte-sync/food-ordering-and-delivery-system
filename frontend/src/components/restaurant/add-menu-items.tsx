"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Plus, Upload } from "lucide-react";

// Define the schema for form validation using Zod
const addMenuSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  itemName: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  availabilityStatus: z.boolean(),
  offer: z.number().min(0, "Offer must be non-negative"),
  image: z.instanceof(File).optional(),
  portions: z.array(
    z.object({
      portionSize: z.string().min(1, "Portion size is required"),
      price: z.number().min(0, "Price must be non-negative"),
    })
  ),
});

// Infer the type from the schema
type AddMenuFormValues = z.infer<typeof addMenuSchema>;

// Define the Category interface
interface Category {
  id: number;
  name: string;
}

const AddMenuForm = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [portionFields, setPortionFields] = useState<
    { portionSize: string; price: number }[]
  >([{ portionSize: "", price: 0 }]);

  // Initialize form with react-hook-form and Zod validation
  const formMethods = useForm<AddMenuFormValues>({
    resolver: zodResolver(addMenuSchema),
    defaultValues: {
      restaurantId: "",
      itemName: "",
      description: "",
      category: "",
      availabilityStatus: true,
      offer: 0,
      image: undefined,
      portions: [{ portionSize: "", price: 0 }],
    },
  });

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost/api/menu-service/categories");
        if (response.status === 200) {
          setCategories(response.data); // Set the fetched categories
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      formMethods.setValue("image", files[0]); // Update form state with the selected file
      setPreview(URL.createObjectURL(files[0])); // Update preview
    }
  };

  // Handle form submission
  const onSubmit = async (values: AddMenuFormValues) => {
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
      const API_URL = "http://localhost/api/menu-service";
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Menu item added successfully!");
        router.push("/restaurant/menu");
      } else {
        alert("Failed to add menu item.");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("An error occurred while adding the menu item.");
    }
  };

  // Add a portion field
  const addPortionField = () => {
    setPortionFields([...portionFields, { portionSize: "", price: 0 }]);
  };

  // Remove a portion field
  const removePortionField = (index: number) => {
    const updatedFields = portionFields.filter((_, i) => i !== index);
    setPortionFields(updatedFields);
    formMethods.setValue(
      "portions",
      updatedFields.map((field) => ({
        portionSize: field.portionSize,
        price: field.price,
      }))
    );
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-muted rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Add Menu Item
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Restaurant ID */}
              <FormField
                control={formMethods.control}
                name="restaurantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Restaurant ID</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="border border-input focus:ring-ring" 
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
                    <FormLabel className="font-medium">Item Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="border border-input focus:ring-ring" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={formMethods.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <FormField
                control={formMethods.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border border-input focus:ring-ring">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                    <FormLabel className="font-medium">Offer (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter offer percentage"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="border border-input focus:ring-ring"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Availability Status */}
            <FormField
              control={formMethods.control}
              name="availabilityStatus"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 rounded-md p-3 bg-muted">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-medium cursor-pointer">Available on menu</FormLabel>
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
                  <FormLabel className="font-medium">Food Image</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-input rounded-lg p-4 text-center">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <Upload className="h-8 w-8 text-accent" />
                        <span className="text-foreground font-medium">Choose Image</span>
                        <span className="text-sm text-muted-foreground">Upload a high-quality image of your dish</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </FormControl>
                  {preview && (
                    <div className="mt-3">
                      <img
                        src={preview}
                        alt="Food preview"
                        className="object-cover w-full h-48 rounded-lg shadow"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Portions */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Portions & Pricing</h3>
              {portionFields.map((portion, index) => (
                <div key={index} className="flex space-x-3 mb-3 bg-card p-3 rounded-md shadow-sm">
                  <FormField
                    control={formMethods.control}
                    name={`portions.${index}.portionSize`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="font-medium">Portion Size</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Small" 
                            {...field} 
                            className="border border-input focus:ring-ring" 
                          />
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
                        <FormLabel className="font-medium">Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 9.99"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="border border-input focus:ring-ring"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end pb-2">
                    <Button
                      type="button"
                      onClick={() => removePortionField(index)}
                      className="button-destructive h-10 w-10 p-0 rounded-md"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={addPortionField}
                className="button-accent w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Portion
              </Button>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="button-primary w-full py-6">
              Add Menu Item
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default AddMenuForm;