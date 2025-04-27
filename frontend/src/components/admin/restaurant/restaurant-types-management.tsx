"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { userService } from "@/services/user-service"
import { toast } from "sonner"

// Interface for restaurant type
interface RestaurantType {
  id: string
  type: string
  capacity: number
}

export function RestaurantTypesManagement() {
  const [restaurantTypes, setRestaurantTypes] = useState<RestaurantType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<RestaurantType | null>(null)
  const [newTypeName, setNewTypeName] = useState("")
  const [newCapacity, setNewCapacity] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Fetch restaurant types on component mount
  useEffect(() => {
    fetchRestaurantTypes()
  }, [])

  const fetchRestaurantTypes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const types = await userService.getRestaurantTypes()
      setRestaurantTypes(types)
    } catch (err) {
      console.error("Error fetching restaurant types:", err)
      setError("Failed to load restaurant types. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddType = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const newType: Omit<RestaurantType, "id"> = {
        type: newTypeName,
        capacity: parseInt(newCapacity, 10)
      }
      
      const addedType = await userService.createRestaurantType(newType)
      setRestaurantTypes([...restaurantTypes, addedType])
      toast.success("Restaurant type added successfully")
      resetForm()
      setIsAddModalOpen(false)
    } catch (err) {
      console.error("Error adding restaurant type:", err)
      toast.error("Failed to add restaurant type. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditType = async () => {
    if (!validateForm() || !selectedType) return
    
    setIsLoading(true)
    try {
      const updatedType: RestaurantType = {
        id: selectedType.id,
        type: newTypeName,
        capacity: parseInt(newCapacity, 10)
      }
      
      await userService.updateRestaurantType(updatedType)
      setRestaurantTypes(
        restaurantTypes.map(type => type.id === selectedType.id ? updatedType : type)
      )
      toast.success("Restaurant type updated successfully")
      resetForm()
      setIsEditModalOpen(false)
    } catch (err) {
      console.error("Error updating restaurant type:", err)
      toast.error("Failed to update restaurant type. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteType = async () => {
    if (!selectedType) return
    
    setIsLoading(true)
    try {
      await userService.deleteRestaurantType(selectedType.id)
      setRestaurantTypes(
        restaurantTypes.filter(type => type.id !== selectedType.id)
      )
      toast.success("Restaurant type deleted successfully")
      setIsDeleteModalOpen(false)
    } catch (err) {
      console.error("Error deleting restaurant type:", err)
      toast.error("Failed to delete restaurant type. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    setError(null)
    
    if (!newTypeName.trim()) {
      setError("Type name is required")
      isValid = false
    }
    
    if (!newCapacity || isNaN(parseInt(newCapacity, 10)) || parseInt(newCapacity, 10) <= 0) {
      setError("Capacity must be a positive number")
      isValid = false
    }
    
    return isValid
  }

  const resetForm = () => {
    setNewTypeName("")
    setNewCapacity("")
    setError(null)
  }

  const openEditModal = (type: RestaurantType) => {
    setSelectedType(type)
    setNewTypeName(type.type)
    setNewCapacity(type.capacity.toString())
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (type: RestaurantType) => {
    setSelectedType(type)
    setIsDeleteModalOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Restaurant Types</CardTitle>
          <CardDescription>Manage restaurant types and capacities</CardDescription>
        </div>
        <Button onClick={() => {
          resetForm()
          setIsAddModalOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Type
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {!isLoading && restaurantTypes.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No restaurant types found. Add your first one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurantTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.type}</TableCell>
                  <TableCell>{type.capacity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(type)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteModal(type)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Restaurant Type Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Restaurant Type</DialogTitle>
            <DialogDescription>
              Create a new restaurant type with capacity information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="type-name">Type Name</Label>
              <Input
                id="type-name"
                placeholder="e.g., Fast Food, Fine Dining"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 50"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddType} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Restaurant Type Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Restaurant Type</DialogTitle>
            <DialogDescription>
              Update the restaurant type's information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-type-name">Type Name</Label>
              <Input
                id="edit-type-name"
                placeholder="e.g., Fast Food, Fine Dining"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                placeholder="e.g., 50"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleEditType} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Restaurant Type Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Restaurant Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the restaurant type "{selectedType?.type}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteType} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}