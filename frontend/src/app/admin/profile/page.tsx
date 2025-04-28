"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileImageUploader } from "@/components/user-service/profile/profile-image-uploader"
import { ResetPasswordModal } from "@/components/user-service/profile/reset-password"

// Sample admin data
const ADMIN_DATA = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  contactNumber: "+1 234 567 890",
  profilePicture: "/placeholder.svg?height=120&width=120",
  adminType: "Top Level",
}

export default function ProfilePage() {
  const [admin, setAdmin] = useState(ADMIN_DATA)
  const [formData, setFormData] = useState({
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    contactNumber: admin.contactNumber,
  })
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setAdmin({
      ...admin,
      ...formData,
    })
    // In a real app, you would save this to the backend
  }

  const handleProfileImageUpdate = (imageUrl: string) => {
    setAdmin({
      ...admin,
      profilePicture: imageUrl,
    })
    // In a real app, you would save this to the backend
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Profile</h1>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <ProfileImageUploader currentImage={admin.profilePicture} onImageUpdate={handleProfileImageUpdate} />
                <div>
                  <h3 className="text-lg font-medium">
                    {admin.firstName} {admin.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{admin.adminType} Admin</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </div>
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

                <Button type="submit">Save Changes</Button>
              </form>
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
                <p className="text-sm text-muted-foreground">Last updated: 3 months ago</p>
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
