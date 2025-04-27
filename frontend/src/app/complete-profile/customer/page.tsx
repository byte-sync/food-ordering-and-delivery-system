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

export default function CustomerProfileCompletion() {
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
    profilePictureUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Since we already have an account from Google auth, we'll update the profile
      // instead of registering a new user
      const userData = {
        id: userId,
        email: email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.phone,
        profilePictureUrl: formData.profilePictureUrl || undefined
      };
      
      await userService.updateUser(userId, userData);
      
      toast.success("Profile completed successfully", {
        description: "You can now continue using our platform.",
      });
      
      // Remove the profile incomplete flag from localStorage
      localStorage.removeItem('profileIncomplete');
      localStorage.removeItem('isNewUser');
      
      // Redirect to customer dashboard
      router.push("/customer");
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast.error("Failed to complete profile", {
        description: error.response?.data?.error || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Complete Your Profile"
        subtitle="Please provide the following information to complete your account setup"
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
                placeholder="john.doe@example.com"
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
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}