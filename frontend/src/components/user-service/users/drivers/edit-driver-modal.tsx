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

interface EditDriverModalProps {
  open: boolean
  driver: any
  onClose: () => void
  onSubmit: (data: any) => void
}

export function EditDriverModal({ open, driver, onClose, onSubmit }: EditDriverModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    profilePicture: "",
    vehicleType: "",
    vehicleNumber: "",
  })

  useEffect(() => {
    if (driver) {
      setFormData({
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        contactNumber: driver.contactNumber,
        profilePicture: driver.profilePicture,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
      })
    }
  }, [driver])

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
          <DialogTitle>Edit Driver</DialogTitle>
          <DialogDescription>Update driver information.</DialogDescription>
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
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleSelectChange("vehicleType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="Bicycle">Bicycle</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                disabled={formData.vehicleType === "Bicycle"}
              />
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
