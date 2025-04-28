"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DriversTable } from "@/components/user-service/users/drivers/drivers-table"
import { DriverDetailsModal } from "@/components/user-service/users/drivers/driver-detials-modal"
import { EditDriverModal } from "@/components/user-service/users/drivers/edit-driver-modal"
import { DeleteUserModal } from "@/components/user-service/users/common/delete-user-modal"
import { userService } from "@/services/user-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

// Define Driver interface for better type safety
interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  profilePicture?: string;
  vehicleType: string;
  vehicleNumber: string;
  documents?: Array<{
    name: string;
    url: string;
  }>;
  status: string;
  location?: { lat: number; lng: number };
}

// Sample data as fallback
const SAMPLE_DRIVERS = [
  {
    id: "1",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.j@example.com",
    contactNumber: "+1 234 567 893",
    profilePicture: "/placeholder.svg?height=40&width=40",
    vehicleType: "Car",
    vehicleNumber: "ABC-1234",
    documents: [
      { name: "Driver's License", url: "#" },
      { name: "Vehicle Registration", url: "#" },
      { name: "Insurance", url: "#" },
    ],
    status: "Active",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.w@example.com",
    contactNumber: "+1 234 567 894",
    profilePicture: "/placeholder.svg?height=40&width=40",
    vehicleType: "Motorcycle",
    vehicleNumber: "XYZ-5678",
    documents: [
      { name: "Driver's License", url: "#" },
      { name: "Vehicle Registration", url: "#" },
      { name: "Insurance", url: "#" },
    ],
    status: "Active",
  },
  {
    id: "3",
    firstName: "David",
    lastName: "Brown",
    email: "david.b@example.com",
    contactNumber: "+1 234 567 895",
    profilePicture: "/placeholder.svg?height=40&width=40",
    vehicleType: "Bicycle",
    vehicleNumber: "N/A",
    documents: [
      { name: "ID Card", url: "#" },
      { name: "Proof of Address", url: "#" },
    ],
    status: "Pending",
  },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch drivers on component mount
  useEffect(() => {
    async function fetchDrivers() {
      try {
        setIsLoading(true)
        setError(null)
        const driverData = await userService.getDrivers()
        
        // Transform API data to match the component's expected structure
        const formattedDrivers: Driver[] = driverData.map(driver => ({
          id: driver.id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email,
          contactNumber: driver.phone || "N/A",
          profilePicture: driver.profileImage || "/placeholder.svg?height=40&width=40",
          vehicleType: (driver as any).vehicleType?.type || "N/A",
          vehicleNumber: (driver as any).vehicleNumber || "N/A",
          documents: (driver as any).vehicleDocuments || [],
          status: (driver as any).status || "Active",
          location: (driver as any).location || null
        }))
        
        setDrivers(formattedDrivers)
      } catch (err) {
        console.error("Error fetching drivers:", err)
        setError("Failed to load driver data. Using sample data instead.")
        // Use sample data as fallback
        setDrivers(SAMPLE_DRIVERS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && driver.status === "Active"
    if (activeTab === "pending") return matchesSearch && driver.status === "Pending"

    return matchesSearch
  })

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver)
    setDetailsModalOpen(true)
  }

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver)
    setEditModalOpen(true)
  }
  
  const handleDelete = (driver: Driver) => {
    setSelectedDriver(driver)
    setDeleteModalOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!selectedDriver) return
    
    try {
      // Call the API to delete the driver
      await userService.deleteUser(selectedDriver.id, 'DRIVER');
      
      // Remove from local state
      setDrivers(drivers.filter((driver) => driver.id !== selectedDriver.id));
      toast.success("Driver deleted successfully");
    } catch (error: any) {
      console.error("Error deleting driver:", error);
      toast.error(error.response?.data?.message || "Failed to delete driver");
    } finally {
      setDeleteModalOpen(false);
    }
  }

  const handleApprove = async (id: string) => {
    try {
      // Here you would call an API to update the driver status
      // await userService.updateDriverStatus(id, 'Active');
      
      // For now, just update the local state
      setDrivers(drivers.map((driver) => (driver.id === id ? { ...driver, status: "Active" } : driver)))
    } catch (err) {
      console.error("Error approving driver:", err)
      setError("Failed to approve driver. Please try again.")
    }
  }

  const handleReject = async (id: string) => {
    try {
      // Here you would call an API to update the driver status
      // await userService.updateDriverStatus(id, 'Rejected');
      
      // For now, just update the local state
      setDrivers(drivers.map((driver) => (driver.id === id ? { ...driver, status: "Rejected" } : driver)))
    } catch (err) {
      console.error("Error rejecting driver:", err)
      setError("Failed to reject driver. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Drivers Management</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search drivers..."
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

      <DriversTable
        drivers={filteredDrivers}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />

      {selectedDriver && (
        <>
          <DriverDetailsModal
            open={detailsModalOpen}
            driver={selectedDriver}
            onClose={() => setDetailsModalOpen(false)}
          />

          <EditDriverModal
            open={editModalOpen}
            driver={selectedDriver}
            onClose={() => setEditModalOpen(false)}
            onSubmit={(data) => {
              setDrivers(drivers.map((driver) => (driver.id === selectedDriver.id ? { ...driver, ...data } : driver)))
              setEditModalOpen(false)
            }}
          />
          
          <DeleteUserModal
            open={deleteModalOpen}
            userType="driver"
            userName={`${selectedDriver.firstName} ${selectedDriver.lastName}`}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  )
}
