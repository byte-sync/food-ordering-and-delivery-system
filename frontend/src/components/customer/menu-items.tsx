"use client"; // Mark this file as a client component
import React, { useState } from "react";
import Link from "next/link"; // Import Link for navigation
import { BsCartPlus } from "react-icons/bs"; // Import the Cart Plus icon
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Portion {
  id: number;
  portionSize: string;
  price: number;
}

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
  portions: Portion[];
}

interface MenuItemsProps {
  menuItems: MenuItem[];
  customerId: string;
  restaurantId: number;
}

const MenuItems = ({ menuItems, customerId, restaurantId }: MenuItemsProps) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [portionSize, setPortionSize] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const resetDialog = () => {
    setSelectedItem(null);
    setQuantity(1);
    setPortionSize("");
  };

  const handleAddToCart = async () => {
    if (!selectedItem || !portionSize) {
      toast({
        title: "Error",
        description: "Please select a portion size",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Find the selected portion details
      const selectedPortion = selectedItem.portions.find(
        (portion) => portion.portionSize === portionSize
      );
      if (!selectedPortion) {
        throw new Error("Invalid portion size");
      }
  
      // Map the portion size to the backend's expected enum format
      let potionSizeEnum;
      if (portionSize.toLowerCase().includes("small")) {
        potionSizeEnum = "Small";
      } else if (portionSize.toLowerCase().includes("medium")) {
        potionSizeEnum = "Medium";
      } else if (portionSize.toLowerCase().includes("large")) {
        potionSizeEnum = "Large";
      } else {
        potionSizeEnum = portionSize; // Use as is if it doesn't match
      }
  
      // Use restaurantId from selectedItem
      const restaurantIdFromItem = selectedItem.restaurantId;
  
      // Prepare the request payload
      const payload = {
        itemId: String(selectedItem.id),
        itemName: selectedItem.itemName,
        quantity,
        potionSize: potionSizeEnum,
        unitPrice: selectedPortion.price,
        image: selectedItem.imageUrl || "/placeholder.svg",
      };
  
      // Call the backend API to add the item to the cart
      await axios.post(`/api/cart/add/${customerId}/${restaurantIdFromItem}`, payload);
  
      toast({
        title: "Success",
        description: `${selectedItem.itemName} (${portionSize}) added to cart!`,
      });
  
      // Ask if user wants to view cart
      const viewCart = window.confirm("Item added to cart. Do you want to view your cart?");
      if (viewCart) {
        router.push(`/cart/${customerId}/${restaurantIdFromItem}`);
      }
  
      resetDialog();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-background shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">
        Menu Items
      </h1>

      {/* Grid Layout for Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg relative block"
          >
            {/* Image Section with Link */}
            {item.imageUrl && (
              <Link
                href={`/customer/restaurant/menuItem/${item.id}`} // Navigate to the menu item details page
                className="block"
              >
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="w-full h-48 object-cover cursor-pointer"
                />
              </Link>
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

            {/* Add to Cart Dialog Trigger */}
            <Dialog
              onOpenChange={(open) => {
                if (open) {
                  setSelectedItem(item);
                } else {
                  resetDialog();
                }
              }}
            >
              <DialogTrigger asChild>
                <button
                  className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition duration-300 cursor-pointer"
                  aria-label={`Add ${item.itemName} to cart`}
                >
                  <BsCartPlus size={20} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Cart</DialogTitle>
                </DialogHeader>
                {selectedItem && (
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden">
                        {selectedItem.imageUrl ? (
                          <img
                            src={selectedItem.imageUrl || "/placeholder.svg"}
                            alt={selectedItem.itemName}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedItem.itemName}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {selectedItem.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Portion Size</label>
                      <Select value={portionSize} onValueChange={setPortionSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedItem.portions.map((portion) => (
                            <SelectItem key={portion.id} value={portion.portionSize}>
                              {portion.portionSize} - ${portion.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="border rounded-l px-2 py-1 hover:bg-gray-100"
                          onClick={decrementQuantity}
                        >
                          -
                        </button>
                        <span className="px-4 font-medium">{quantity}</span>
                        <button
                          type="button"
                          className="border rounded-r px-2 py-1 hover:bg-gray-100"
                          onClick={incrementQuantity}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {portionSize && (
                      <div className="pt-2">
                        <p className="text-sm font-medium">Total Price:</p>
                        <p className="text-lg font-bold">
                          $
                          {(selectedItem.portions.find((p) => p.portionSize === portionSize)?.price || 0).toFixed(
                            2
                          )}
                          {quantity > 1 &&
                            ` × ${quantity} = $${(
                              (selectedItem.portions.find((p) => p.portionSize === portionSize)?.price || 0) *
                              quantity
                            ).toFixed(2)}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-gray-200 text-black rounded">
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    onClick={handleAddToCart}
                    disabled={!portionSize || isLoading}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                  >
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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