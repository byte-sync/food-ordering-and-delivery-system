"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ProfileImageUploader } from "@/components/shared/profile-image-uploader"
import { ResetPasswordModal } from "@/components/user-service/profile/reset-password"

// Sample restaurant data
const RESTAURANT_DATA = {
  id: "1",
  name: "Burger Palace",
  email: "manager@burgerpalace.com",
  contactNumber: "+1 234 567 890",
  address: "123 Main St, New York, NY",
  description: "Serving the best burgers in town since 2010.",
  profilePicture: "/placeholder.svg?height=120&width=120",
}

export default function RestaurantProfilePage() {
  const [restaurant, setRestaurant] = useState(RESTAURANT_DATA)
  const [formData, setFormData] = useState({
    name: restaurant.name,
    email: restaurant.email,
    contactNumber: restaurant.contactNumber,
    address: restaurant.address,
    description: restaurant.description,
  })
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setRestaurant({
      ...restaurant,
      ...formData,
    })
    // In a real app, you would save this to the backend
  }

  const handleProfileImageUpdate = (imageUrl: string) => {
    setRestaurant({
      ...restaurant,
      profilePicture: imageUrl,
    })
    // In a real app, you would save this to the backend
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Restaurant Profile</h1>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Basic Information</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Update your restaurant's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <ProfileImageUploader
                  currentImage={restaurant.profilePicture}
                  onImageUpdate={handleProfileImageUpdate}
                />
                <div>
                  <h3 className="text-lg font-medium">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground">Restaurant Partner since 2020</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Manage your restaurant's business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your business hours in the{" "}
                  <a href="/restaurant/hours" className="text-primary">
                    Hours
                  </a>{" "}
                  section
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Delivery Zones</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your delivery zones in the{" "}
                  <a href="/restaurant/delivery-zones" className="text-primary">
                    Delivery Zones
                  </a>{" "}
                  section
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Last updated: 1 month ago</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setResetPasswordModalOpen(true)}>Reset Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <ResetPasswordModal
        open={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
        onSubmit={(data) => {
          // In a real app, you would handle password reset here
          setResetPasswordModalOpen(false)
        }}
      />
    </div>
  )
}
