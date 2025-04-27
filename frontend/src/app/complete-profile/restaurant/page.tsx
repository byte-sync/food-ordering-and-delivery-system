"use client";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/user-service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RestaurantProfileCompletion() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get data from URL parameters
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userId") || "";
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    contactPerson: "",
    phone: "",
    address: "",
    cuisine: "",
    openingHours: "",
    closingHours: "",
    description: "",
    logoUrl: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.restaurantName || !formData.contactPerson || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Since we already have an account from Google auth, we'll update the profile
      const userData = {
        id: userId,
        email: email,
        restaurantName: formData.restaurantName,
        contactPerson: formData.contactPerson,
        contactNumber: formData.phone,
        address: formData.address,
        cuisine: formData.cuisine,
        openingHours: formData.openingHours,
        closingHours: formData.closingHours,
        description: formData.description,
        logoUrl: formData.logoUrl || undefined
      };
      
      console.log("Updating restaurant profile with:", userData);
      await userService.updateUser(userId, userData);
      
      toast.success("Restaurant profile completed successfully", {
        description: "You can now continue using our platform.",
      });
      
      // Remove the profile incomplete flag from localStorage
      localStorage.removeItem('profileIncomplete');
      localStorage.removeItem('isNewUser');
      
      // Redirect to restaurant dashboard
      router.push("/restaurant");
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast.error("Failed to complete restaurant profile", {
        description: error.response?.data?.error || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Complete Your Restaurant Profile"
        subtitle="Please provide the following information to set up your restaurant account"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="restaurant@example.com"
                value={email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurantName">
                Restaurant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                type="text"
                placeholder="My Restaurant"
                value={formData.restaurantName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">
                Contact Person <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                type="text"
                placeholder="John Doe"
                value={formData.contactPerson}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Input
                id="cuisine"
                name="cuisine"
                type="text"
                placeholder="Italian, Chinese, etc."
                value={formData.cuisine}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Input
                id="openingHours"
                name="openingHours"
                type="text"
                placeholder="9:00 AM"
                value={formData.openingHours}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingHours">Closing Hours</Label>
              <Input
                id="closingHours"
                name="closingHours"
                type="text"
                placeholder="10:00 PM"
                value={formData.closingHours}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Restaurant Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="A brief description of your restaurant"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                type="url"
                placeholder="https://example.com/logo.jpg"
                value={formData.logoUrl}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Restaurant Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}