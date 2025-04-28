"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { userService, CuisineType } from "@/services/user-service"
import { toast } from "sonner"

export default function CuisineTypesPage() {
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newCuisineName, setNewCuisineName] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | null>(null)

  // Fetch cuisine types on component mount
  useEffect(() => {
    fetchCuisineTypes()
  }, [])

  async function fetchCuisineTypes() {
    try {
      setIsLoading(true)
      setError(null)
      const data = await userService.getCuisineTypes()
      setCuisineTypes(data)
    } catch (err) {
      console.error("Error fetching cuisine types:", err)
      setError("Failed to load cuisine types data.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCuisine = async () => {
    if (!newCuisineName.trim()) {
      toast.error("Cuisine name cannot be empty")
      return
    }

    try {
      const newCuisine = await userService.createCuisineType({ name: newCuisineName })
      setCuisineTypes([...cuisineTypes, newCuisine])
      toast.success("Cuisine type added successfully")
      setIsAddDialogOpen(false)
      setNewCuisineName("")
    } catch (error) {
      console.error("Error adding cuisine type:", error)
      toast.error("Failed to add cuisine type")
    }
  }

  const handleEditCuisine = async () => {
    if (!selectedCuisine || !newCuisineName.trim()) {
      toast.error("Cuisine name cannot be empty")
      return
    }

    try {
      const updatedCuisine = await userService.updateCuisineType({
        id: selectedCuisine.id,
        name: newCuisineName
      })
      setCuisineTypes(cuisineTypes.map(cuisine => 
        cuisine.id === updatedCuisine.id ? updatedCuisine : cuisine
      ))
      toast.success("Cuisine type updated successfully")
      setIsEditDialogOpen(false)
      setNewCuisineName("")
      setSelectedCuisine(null)
    } catch (error) {
      console.error("Error updating cuisine type:", error)
      toast.error("Failed to update cuisine type")
    }
  }

  const handleDeleteCuisine = async () => {
    if (!selectedCuisine) return

    try {
      await userService.deleteCuisineType(selectedCuisine.id)
      setCuisineTypes(cuisineTypes.filter(cuisine => cuisine.id !== selectedCuisine.id))
      toast.success("Cuisine type deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedCuisine(null)
    } catch (error) {
      console.error("Error deleting cuisine type:", error)
      toast.error("Failed to delete cuisine type")
    }
  }

  const filteredCuisineTypes = cuisineTypes.filter(cuisine =>
    cuisine.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Cuisine Types Management</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search cuisine types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Cuisine Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cuisine Types</CardTitle>
          <CardDescription>
            Manage the cuisine types available for restaurants in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredCuisineTypes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCuisineTypes.map((cuisine) => (
                  <TableRow key={cuisine.id}>
                    <TableCell className="font-medium">{cuisine.name}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCuisine(cuisine)
                          setNewCuisineName(cuisine.name)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => {
                          setSelectedCuisine(cuisine)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {searchQuery
                ? "No cuisine types found matching your search."
                : "No cuisine types added yet."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Cuisine Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cuisine Type</DialogTitle>
            <DialogDescription>
              Create a new cuisine type for restaurants to choose from.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cuisine Name</Label>
              <Input
                id="name"
                placeholder="e.g. Italian, Thai, Mexican"
                value={newCuisineName}
                onChange={(e) => setNewCuisineName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              setNewCuisineName("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddCuisine}>Add Cuisine</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Cuisine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cuisine Type</DialogTitle>
            <DialogDescription>
              Update the cuisine type name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Cuisine Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Italian, Thai, Mexican"
                value={newCuisineName}
                onChange={(e) => setNewCuisineName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setNewCuisineName("")
              setSelectedCuisine(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditCuisine}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the cuisine type "{selectedCuisine?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false)
              setSelectedCuisine(null)
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCuisine}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}