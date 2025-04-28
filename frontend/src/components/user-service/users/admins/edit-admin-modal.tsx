"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileImageUploader } from "../../profile/profile-image-uploader"

interface EditAdminModalProps {
  open: boolean
  admin: any
  onClose: () => void
  onSubmit: (data: any) => void
}

export function EditAdminModal({ open, admin, onClose, onSubmit }: EditAdminModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    profilePicture: "",
    adminType: "",
  })

  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        contactNumber: admin.contactNumber,
        profilePicture: admin.profilePicture,
        adminType: admin.adminType,
      })
    }
  }, [admin])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileImageUpdate = (imageUrl: string) => {
    setFormData({
      ...formData,
      profilePicture: imageUrl,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>Update administrator information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <ProfileImageUploader currentImage={formData.profilePicture} onImageUpdate={handleProfileImageUpdate} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminType">Admin Type</Label>
              <Select value={formData.adminType} onValueChange={(value) => handleSelectChange("adminType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select admin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Top Level">Top Level</SelectItem>
                  <SelectItem value="2nd Level">2nd Level</SelectItem>
                  <SelectItem value="3rd Level">3rd Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
