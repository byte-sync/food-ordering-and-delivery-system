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

export default function DriverProfileCompletion() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get data from URL parameters
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userId") || "";
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    drivingLicense: "",
    vehicleType: "",
    vehicleNumber: "",
    address: "",
    profilePictureUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || 
        !formData.drivingLicense || !formData.vehicleType || !formData.vehicleNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Since we already have an account from Google auth, we'll update the profile
      const userData = {
        id: userId,
        email: email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.phone,
        drivingLicense: formData.drivingLicense,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        address: formData.address,
        profilePictureUrl: formData.profilePictureUrl || undefined
      };
      
      console.log("Updating driver profile with:", userData);
      await userService.updateUser(userId, userData);
      
      toast.success("Driver profile completed successfully", {
        description: "You can now continue using our platform.",
      });
      
      // Remove the profile incomplete flag from localStorage
      localStorage.removeItem('profileIncomplete');
      localStorage.removeItem('isNewUser');
      
      // Redirect to driver dashboard
      router.push("/driver");
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast.error("Failed to complete driver profile", {
        description: error.response?.data?.error || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Complete Your Driver Profile"
        subtitle="Please provide the following information to set up your driver account"
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
                placeholder="driver@example.com"
                value={email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
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
              <Label htmlFor="drivingLicense">
                Driving License Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="drivingLicense"
                name="drivingLicense"
                type="text"
                placeholder="DL12345678"
                value={formData.drivingLicense}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">
                Vehicle Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="vehicleType"
                name="vehicleType"
                type="text"
                placeholder="Car, Motorcycle, Bicycle"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">
                Vehicle Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                type="text"
                placeholder="ABC123"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
              <Input
                id="profilePictureUrl"
                name="profilePictureUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.profilePictureUrl}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Driver Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}