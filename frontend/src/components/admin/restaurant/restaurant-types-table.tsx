"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { userService, RestaurantType } from "@/services/user-service"
import { toast } from "sonner"

interface RestaurantTypesTableProps {
  className?: string
}

export function RestaurantTypesTable({ className }: RestaurantTypesTableProps) {
  const [restaurantTypes, setRestaurantTypes] = useState<RestaurantType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [typeName, setTypeName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [selectedType, setSelectedType] = useState<RestaurantType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setError("Failed to load restaurant types")
      toast.error("Failed to load restaurant types")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTypeName("")
    setCapacity("")
    setError(null)
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (type: RestaurantType) => {
    resetForm()
    setSelectedType(type)
    setTypeName(type.type)
    setCapacity(type.capacity.toString())
    setIsEditModalOpen(true)
  }
  
  const handleOpenDeleteModal = (type: RestaurantType) => {
    setSelectedType(type)
    setIsDeleteModalOpen(true)
  }

  const validateForm = (): boolean => {
    setError(null)
    
    if (!typeName.trim()) {
      setError("Type name is required")
      return false
    }
    
    if (!capacity || isNaN(parseInt(capacity, 10)) || parseInt(capacity, 10) <= 0) {
      setError("Capacity must be a positive number")
      return false
    }
    
    return true
  }

  const handleAddType = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      const newType = {
        type: typeName.trim(),
        capacity: parseInt(capacity, 10)
      }
      
      const addedType = await userService.createRestaurantType(newType)
      setRestaurantTypes([...restaurantTypes, addedType])
      toast.success("Restaurant type added successfully")
      setIsAddModalOpen(false)
    } catch (err: any) {
      console.error("Error adding restaurant type:", err)
      setError(err.message || "Failed to add restaurant type")
      toast.error("Failed to add restaurant type")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateType = async () => {
    if (!validateForm() || !selectedType) return
    
    setIsSubmitting(true)
    try {
      const updatedType: RestaurantType = {
        id: selectedType.id,
        type: typeName.trim(),
        capacity: parseInt(capacity, 10)
      }
      
      await userService.updateRestaurantType(updatedType)
      setRestaurantTypes(
        restaurantTypes.map(type => type.id === selectedType.id ? updatedType : type)
      )
      toast.success("Restaurant type updated successfully")
      setIsEditModalOpen(false)
    } catch (err: any) {
      console.error("Error updating restaurant type:", err)
      setError(err.message || "Failed to update restaurant type")
      toast.error("Failed to update restaurant type")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteType = async () => {
    if (!selectedType) return
    
    setIsSubmitting(true)
    try {
      await userService.deleteRestaurantType(selectedType.id)
      setRestaurantTypes(restaurantTypes.filter(type => type.id !== selectedType.id))
      toast.success("Restaurant type deleted successfully")
      setIsDeleteModalOpen(false)
    } catch (err: any) {
      console.error("Error deleting restaurant type:", err)
      toast.error("Failed to delete restaurant type")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Restaurant Types</h3>
        <Button onClick={handleOpenAddModal} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New Type
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : restaurantTypes.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No restaurant types found.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Name</TableHead>
                <TableHead>Seating Capacity</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurantTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.type}</TableCell>
                  <TableCell>{type.capacity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditModal(type)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleOpenDeleteModal(type)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Restaurant Type Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Restaurant Type</DialogTitle>
            <DialogDescription>
              Create a new restaurant type with capacity information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Type Name</Label>
              <Input
                id="name"
                placeholder="e.g. Fine Dining, Fast Food"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Seating Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g. 50"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddType} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Restaurant Type Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Restaurant Type</DialogTitle>
            <DialogDescription>
              Update the restaurant type details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Type Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Fine Dining, Fast Food"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-capacity">Seating Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                placeholder="e.g. 50"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateType} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Restaurant Type Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Restaurant Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this restaurant type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedType && (
              <div className="flex flex-col gap-1 border rounded-md p-3 bg-muted/50">
                <div className="flex gap-2">
                  <span className="font-medium">Type:</span>
                  <span>{selectedType.type}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium">Capacity:</span>
                  <span>{selectedType.capacity}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteType} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}