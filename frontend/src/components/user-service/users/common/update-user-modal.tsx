"use client"

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
import { MapPin } from "lucide-react"
import { Modal } from "@/components/auth/modal"
import { MapSelector } from "@/components/ui/map-selector"
import { ProfileImageUploader } from "@/components/user-service/profile/profile-image-uploader"

interface UpdateUserModalProps {
  open: boolean
  userType: 'admin' | 'restaurant' | 'driver' | 'customer'
  userData: {
    id: string
    firstName: string
    lastName: string
    email: string
    contactNumber: string
    profilePicture?: string
    location?: {
      address: string
      lat: number
      lng: number
    }
  }
  onClose: () => void
  onSubmit: (updatedData: any) => void
}

export function UpdateUserModal({ 
  open, 
  userType, 
  userData,
  onClose, 
  onSubmit 
}: UpdateUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    profilePicture: "",
    location: {
      address: "",
      lat: 0,
      lng: 0
    }
  })
  
  const [showMap, setShowMap] = useState(false)
  const [locationConfirmed, setLocationConfirmed] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data from props when the modal opens
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        contactNumber: userData.contactNumber || "",
        profilePicture: userData.profilePicture || "/placeholder.svg",
        location: userData.location || {
          address: "",
          lat: 0,
          lng: 0
        }
      })

      // Consider location confirmed if there's already location data
      if (userData.location && userData.location.address) {
        setLocationConfirmed(true)
      }
    }
  }, [userData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }

  const handleProfileImageUpdate = (imageUrl: string) => {
    setFormData({
      ...formData,
      profilePicture: imageUrl,
    })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required"
    }

    // Only validate location if user type is restaurant, driver or customer
    if (userType !== 'admin' && !locationConfirmed) {
      newErrors.location = "Location must be selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      onSubmit(formData)
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLocationConfirm = (selectedLocation: {lat: number; lng: number; address: string}) => {
    setFormData({
      ...formData,
      location: {
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      }
    })
    setLocationConfirmed(true)
    setShowMap(false)
    
    // Clear location error if it exists
    if (errors.location) {
      setErrors({
        ...errors,
        location: ""
      })
    }
  }

  const getUserTypeTitle = () => {
    switch(userType) {
      case 'admin': return 'Admin';
      case 'restaurant': return 'Restaurant';
      case 'driver': return 'Driver';
      case 'customer': return 'Customer';
      default: return 'User';
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update {getUserTypeTitle()} Details</DialogTitle>
            <DialogDescription>
              Edit the information for {formData.firstName} {formData.lastName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center space-y-4">
                <ProfileImageUploader 
                  currentImage={formData.profilePicture} 
                  onImageUpdate={handleProfileImageUpdate} 
                />
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
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                    required 
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
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
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className={errors.contactNumber ? "border-red-500" : ""}
                />
                {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber}</p>}
              </div>

              {userType !== 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Select your location"
                      className={`pl-10 ${errors.location ? "border-red-500" : ""} ${
                        locationConfirmed ? "border-green-500" : ""
                      }`}
                      value={formData.location?.address || ""}
                      readOnly
                      onClick={() => setShowMap(true)}
                    />
                  </div>
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={() => setShowMap(true)}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {locationConfirmed ? "Change Location" : "Select on Map"}
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Details"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Modal 
        isOpen={showMap} 
        onClose={() => setShowMap(false)} 
        title="Select Location"
      >
        <div className="space-y-4">
          <MapSelector 
            height="350px" 
            onConfirmLocation={handleLocationConfirm} 
          />
        </div>
      </Modal>
    </>
  )
}