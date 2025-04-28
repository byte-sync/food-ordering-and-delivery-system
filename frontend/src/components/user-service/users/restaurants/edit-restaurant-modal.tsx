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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

interface EditRestaurantModalProps {
  open: boolean
  restaurant: any
  onClose: () => void
  onSubmit: (data: any) => void
}

export function EditRestaurantModal({ open, restaurant, onClose, onSubmit }: EditRestaurantModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    licenseNumber: "",
    type: "",
    cuisines: [] as string[],
  })

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        address: restaurant.address,
        licenseNumber: restaurant.licenseNumber,
        type: restaurant.type,
        cuisines: restaurant.cuisines,
      })
    }
  }, [restaurant])

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

  const handleCuisineToggle = (cuisine: string) => {
    setFormData((prev) => {
      const cuisines = prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine]

      return { ...prev, cuisines }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Sample cuisine options
  const cuisineOptions = [
    "American",
    "Italian",
    "Japanese",
    "Chinese",
    "Mexican",
    "Indian",
    "Thai",
    "Mediterranean",
    "French",
    "Korean",
    "Vietnamese",
    "Greek",
    "Spanish",
    "Middle Eastern",
    "Burgers",
    "Pizza",
    "Sushi",
    "Vegetarian",
    "Vegan",
    "Seafood",
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Restaurant</DialogTitle>
          <DialogDescription>Update restaurant information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="cuisines">Cuisines</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Restaurant Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select restaurant type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fast Food">Fast Food</SelectItem>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Cafe">Cafe</SelectItem>
                    <SelectItem value="Food Truck">Food Truck</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="cuisines" className="pt-4">
              <div className="space-y-4">
                <Label>Cuisines</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cuisine-${cuisine}`}
                        checked={formData.cuisines.includes(cuisine)}
                        onCheckedChange={() => handleCuisineToggle(cuisine)}
                      />
                      <Label htmlFor={`cuisine-${cuisine}`} className="text-sm font-normal">
                        {cuisine}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
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
