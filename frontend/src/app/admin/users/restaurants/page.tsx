"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantsTable } from "@/components/user-service/users/restaurants/restaurant-table"
import { RestaurantDetailsModal } from "@/components/user-service/users/restaurants/restaurant-details-modal"
import { EditRestaurantModal } from "@/components/user-service/users/restaurants/edit-restaurant-modal"
import { DeleteUserModal } from "@/components/user-service/users/common/delete-user-modal"
import { userService } from "@/services/user-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

// Define Restaurant interface for better type safety
interface Restaurant {
  id: string
  name: string
  address: string
  licenseNumber: string
  type: string
  cuisines?: string[]
  status: string
  documents?: Array<{
    name: string
    url: string
  }>
  openingTimes?: Array<{
    day: string
    open: string
    close: string
  }>
  location?: { lat: number; lng: number }
}

// Sample data as fallback
const SAMPLE_RESTAURANTS = [
  {
    id: "1",
    name: "Burger Palace",
    address: "123 Main St, New York, NY",
    licenseNumber: "LIC-12345",
    type: "Fast Food",
    cuisines: ["American", "Burgers"],
    status: "Active",
    documents: [
      { name: "Business License", url: "#" },
      { name: "Food Safety Certificate", url: "#" },
    ],
    openingTimes: [
      { day: "Monday", open: "09:00", close: "22:00" },
      { day: "Tuesday", open: "09:00", close: "22:00" },
      { day: "Wednesday", open: "09:00", close: "22:00" },
      { day: "Thursday", open: "09:00", close: "22:00" },
      { day: "Friday", open: "09:00", close: "23:00" },
      { day: "Saturday", open: "10:00", close: "23:00" },
      { day: "Sunday", open: "10:00", close: "22:00" },
    ],
    location: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "2",
    name: "Sushi Express",
    address: "456 Broadway, New York, NY",
    licenseNumber: "LIC-67890",
    type: "Restaurant",
    cuisines: ["Japanese", "Sushi"],
    status: "Active",
    documents: [
      { name: "Business License", url: "#" },
      { name: "Food Safety Certificate", url: "#" },
    ],
    openingTimes: [
      { day: "Monday", open: "11:00", close: "22:00" },
      { day: "Tuesday", open: "11:00", close: "22:00" },
      { day: "Wednesday", open: "11:00", close: "22:00" },
      { day: "Thursday", open: "11:00", close: "22:00" },
      { day: "Friday", open: "11:00", close: "23:00" },
      { day: "Saturday", open: "12:00", close: "23:00" },
      { day: "Sunday", open: "12:00", close: "22:00" },
    ],
    location: { lat: 40.7228, lng: -73.998 },
  },
  {
    id: "3",
    name: "Pizza Corner",
    address: "789 5th Ave, New York, NY",
    licenseNumber: "LIC-24680",
    type: "Restaurant",
    cuisines: ["Italian", "Pizza"],
    status: "Pending",
    documents: [
      { name: "Business License", url: "#" },
      { name: "Food Safety Certificate", url: "#" },
    ],
    openingTimes: [
      { day: "Monday", open: "10:00", close: "23:00" },
      { day: "Tuesday", open: "10:00", close: "23:00" },
      { day: "Wednesday", open: "10:00", close: "23:00" },
      { day: "Thursday", open: "10:00", close: "23:00" },
      { day: "Friday", open: "10:00", close: "00:00" },
      { day: "Saturday", open: "11:00", close: "00:00" },
      { day: "Sunday", open: "11:00", close: "23:00" },
    ],
    location: { lat: 40.7648, lng: -73.977 },
  },
]

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch restaurants on component mount
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setIsLoading(true)
        setError(null)
        const restaurantData = await userService.getRestaurants()

        // Transform API data to match the component's expected structure
        const formattedRestaurants: Restaurant[] = restaurantData.map((restaurant) => ({
          id: restaurant.id,
          name: (restaurant as any).restaurantName || `${restaurant.firstName} ${restaurant.lastName}'s Restaurant`,
          address: (restaurant as any).restaurantAddress || "Address not available",
          licenseNumber: (restaurant as any).restaurantLicenseNumber || "License not available",
          type: (restaurant as any).restaurantType?.type || "Standard",
          cuisines: (restaurant as any).cuisineTypes?.map((cuisine: any) => cuisine.name) || [],
          status: (restaurant as any).status || "Active",
          documents: (restaurant as any).restaurantDocuments || [],
          openingTimes: (restaurant as any).openingTime?.map((time: any) => ({
            day: time.day,
            open: time.openingTime,
            close: time.closingTime,
          })) || [],
          location: (restaurant as any).location || null,
        }))

        setRestaurants(formattedRestaurants)
      } catch (err) {
        console.error("Error fetching restaurants:", err)
        setError("Failed to load restaurant data. Using sample data instead.")
        // Use sample data as fallback
        setRestaurants(SAMPLE_RESTAURANTS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && restaurant.status === "Active"
    if (activeTab === "pending") return matchesSearch && restaurant.status === "Pending"

    return matchesSearch
  })

  const handleViewDetails = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setDetailsModalOpen(true)
  }

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setEditModalOpen(true)
  }
  
  const handleDelete = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setDeleteModalOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!selectedRestaurant) return
    
    try {
      // Call the API to delete the restaurant
      await userService.deleteUser(selectedRestaurant.id, 'RESTAURANT');
      
      // Remove from local state
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== selectedRestaurant.id));
      toast.success("Restaurant deleted successfully");
    } catch (error: any) {
      console.error("Error deleting restaurant:", error);
      toast.error(error.response?.data?.message || "Failed to delete restaurant");
    } finally {
      setDeleteModalOpen(false);
    }
  }

  const handleApprove = async (id: string) => {
    try {
      // Here you would call an API to update the restaurant status
      // await userService.updateRestaurantStatus(id, 'Active');

      // For now, just update the local state
      setRestaurants(
        restaurants.map((restaurant) => (restaurant.id === id ? { ...restaurant, status: "Active" } : restaurant)),
      )
    } catch (err) {
      console.error("Error approving restaurant:", err)
      setError("Failed to approve restaurant. Please try again.")
    }
  }

  const handleReject = async (id: string) => {
    try {
      // Here you would call an API to update the restaurant status
      // await userService.updateRestaurantStatus(id, 'Rejected');

      // For now, just update the local state
      setRestaurants(
        restaurants.map((restaurant) => (restaurant.id === id ? { ...restaurant, status: "Rejected" } : restaurant)),
      )
    } catch (err) {
      console.error("Error rejecting restaurant:", err)
      setError("Failed to reject restaurant. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Restaurants Management</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <RestaurantsTable
        restaurants={filteredRestaurants}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />

      {selectedRestaurant && (
        <>
          <RestaurantDetailsModal
            open={detailsModalOpen}
            restaurant={selectedRestaurant}
            onClose={() => setDetailsModalOpen(false)}
          />

          <EditRestaurantModal
            open={editModalOpen}
            restaurant={selectedRestaurant}
            onClose={() => setEditModalOpen(false)}
            onSubmit={(data) => {
              setRestaurants(
                restaurants.map((restaurant) =>
                  restaurant.id === selectedRestaurant.id ? { ...restaurant, ...data } : restaurant,
                ),
              )
              setEditModalOpen(false)
            }}
          />
          
          <DeleteUserModal
            open={deleteModalOpen}
            userType="restaurant"
            userName={selectedRestaurant.name}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  )
}
