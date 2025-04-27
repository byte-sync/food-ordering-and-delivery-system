"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { CustomersTable } from "@/components/user-service/users/customers/customers-table"
import { CustomerDetailsModal } from "@/components/user-service/users/customers/customer-detials-modal"
import { DeleteUserModal } from "@/components/user-service/users/common/delete-user-modal"
import { userService } from "@/services/user-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"

// Define Customer interface for better type safety
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  profilePicture?: string;
  location?: { lat: number; lng: number };
  joinDate: string;
  ordersCount: number;
}

// Sample data as fallback
const SAMPLE_CUSTOMERS = [
  {
    id: "1",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.d@example.com",
    contactNumber: "+1 234 567 896",
    profilePicture: "/placeholder.svg?height=40&width=40",
    location: { lat: 40.7128, lng: -74.006 },
    joinDate: "2023-01-15",
    ordersCount: 24,
  },
  {
    id: "2",
    firstName: "James",
    lastName: "Wilson",
    email: "james.w@example.com",
    contactNumber: "+1 234 567 897",
    profilePicture: "/placeholder.svg?height=40&width=40",
    location: { lat: 40.7328, lng: -73.996 },
    joinDate: "2023-02-20",
    ordersCount: 18,
  },
  {
    id: "3",
    firstName: "Olivia",
    lastName: "Martinez",
    email: "olivia.m@example.com",
    contactNumber: "+1 234 567 898",
    profilePicture: "/placeholder.svg?height=40&width=40",
    location: { lat: 40.7428, lng: -74.016 },
    joinDate: "2023-03-10",
    ordersCount: 32,
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch customers on component mount
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true)
        setError(null)
        const customerData = await userService.getCustomers()
        
        // Format date to YYYY-MM-DD
        const formatDate = (dateString?: string) => {
          if (!dateString) return "N/A"
          try {
            const date = new Date(dateString)
            return date.toISOString().split('T')[0]
          } catch (err) {
            return "N/A"
          }
        }
        
        // Transform API data to match the component's expected structure
        const formattedCustomers: Customer[] = customerData.map(customer => ({
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          contactNumber: customer.phone || "N/A",
          profilePicture: customer.profileImage || "/placeholder.svg?height=40&width=40",
          location: (customer as any).location || null,
          joinDate: formatDate((customer as any).createdAt || (customer as any).registrationDate),
          ordersCount: (customer as any).ordersCount || 0
        }))
        
        setCustomers(formattedCustomers)
      } catch (err) {
        console.error("Error fetching customers:", err)
        setError("Failed to load customer data. Using sample data instead.")
        // Use sample data as fallback
        setCustomers(SAMPLE_CUSTOMERS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactNumber.includes(searchQuery),
  )

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDetailsModalOpen(true)
  }
  
  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDeleteModalOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!selectedCustomer) return
    
    try {
      // Call the API to delete the customer
      await userService.deleteUser(selectedCustomer.id, 'CUSTOMER');
      
      // Remove from local state
      setCustomers(customers.filter((customer) => customer.id !== selectedCustomer.id));
      toast.success("Customer deleted successfully");
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    } finally {
      setDeleteModalOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Customers Management</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <CustomersTable 
        customers={filteredCustomers} 
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />

      {selectedCustomer && (
        <>
          <CustomerDetailsModal
            open={detailsModalOpen}
            customer={selectedCustomer}
            onClose={() => setDetailsModalOpen(false)}
          />
          
          <DeleteUserModal
            open={deleteModalOpen}
            userType="customer"
            userName={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  )
}
