"use client"

import { useState, useEffect } from "react"
// import {  } from "@/components/admin/admin-layout"
import { DeliveryCard } from "@/components/ui/delivery-card"
// import { DeliveryMap } from "@/components/ui/delivery-map"
import { DeliveryTimeline } from "@/components/ui/delivery-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DeliveryStatus } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Filter, Calendar, ChevronDown, MapPin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeliveryMap } from "@/components/ui/delivery-map"

// Sample data
const SAMPLE_DELIVERIES = [
  {
    id: "del-001",
    status: "IN_PROGRESS" as DeliveryStatus,
    orderId: "ORD-1234",
    restaurant: {
      name: "Burger Palace",
      address: "123 Main St, New York, NY",
      phone: "555-123-4567",
      location: { lat: 40.7128, lng: -74.006 },
    },
    customer: {
      name: "John Smith",
      address: "456 Park Ave, New York, NY",
      phone: "555-987-6543",
      location: { lat: 40.7282, lng: -73.9942 },
    },
    driver: {
      name: "Michael Johnson",
      phone: "555-555-5555",
      vehicle: "Honda Civic (ABC-1234)",
    },
    driverLocation: { lat: 40.72, lng: -74.0 },
    estimatedTime: "15 min",
    distance: "2.3 mi",
    amount: "8.50",
    items: [
      { name: "Cheeseburger", quantity: 2 },
      { name: "Fries", quantity: 1 },
      { name: "Soda", quantity: 2 },
    ],
    createdAt: new Date().toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      acceptedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      pickedUpAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  },
  {
    id: "del-002",
    status: "PENDING" as DeliveryStatus,
    orderId: "ORD-5678",
    restaurant: {
      name: "Pizza Express",
      address: "789 Broadway, New York, NY",
      phone: "555-222-3333",
      location: { lat: 40.7309, lng: -73.9872 },
    },
    customer: {
      name: "Emily Davis",
      address: "321 5th Ave, New York, NY",
      phone: "555-444-5555",
      location: { lat: 40.7448, lng: -73.9867 },
    },
    driverLocation: { lat: 40.7309, lng: -73.9872 },
    estimatedTime: "10 min",
    distance: "1.8 mi",
    amount: "9.25",
    items: [
      { name: "Large Pepperoni Pizza", quantity: 1 },
      { name: "Garlic Knots", quantity: 1 },
      { name: "2L Soda", quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  },
  {
    id: "del-003",
    status: "ACCEPTED" as DeliveryStatus,
    orderId: "ORD-9012",
    restaurant: {
      name: "Sushi Delight",
      address: "567 West St, New York, NY",
      phone: "555-333-4444",
      location: { lat: 40.7352, lng: -74.0086 },
    },
    customer: {
      name: "Sarah Johnson",
      address: "890 Hudson St, New York, NY",
      phone: "555-777-8888",
      location: { lat: 40.7303, lng: -74.0054 },
    },
    driver: {
      name: "David Brown",
      phone: "555-666-7777",
      vehicle: "Toyota Prius (XYZ-5678)",
    },
    driverLocation: { lat: 40.7352, lng: -74.0086 },
    estimatedTime: "20 min",
    distance: "2.5 mi",
    amount: "10.75",
    items: [
      { name: "California Roll", quantity: 2 },
      { name: "Spicy Tuna Roll", quantity: 1 },
      { name: "Miso Soup", quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      acceptedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  },
  {
    id: "del-004",
    status: "DELIVERED" as DeliveryStatus,
    orderId: "ORD-3456",
    restaurant: {
      name: "Thai Spice",
      address: "234 Canal St, New York, NY",
      phone: "555-555-6666",
      location: { lat: 40.7177, lng: -74.0007 },
    },
    customer: {
      name: "Robert Wilson",
      address: "567 Madison Ave, New York, NY",
      phone: "555-222-3333",
      location: { lat: 40.7623, lng: -73.9718 },
    },
    driver: {
      name: "Jennifer Lee",
      phone: "555-888-9999",
      vehicle: "Honda Accord (DEF-5678)",
    },
    driverLocation: { lat: 40.7623, lng: -73.9718 },
    estimatedTime: "0 min",
    distance: "3.5 mi",
    amount: "12.50",
    items: [
      { name: "Pad Thai", quantity: 1 },
      { name: "Green Curry", quantity: 1 },
      { name: "Spring Rolls", quantity: 2 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      acceptedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      pickedUpAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      deliveredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  },
  {
    id: "del-005",
    status: "CANCELLED" as DeliveryStatus,
    orderId: "ORD-7890",
    restaurant: {
      name: "Mexican Grill",
      address: "345 Broadway, New York, NY",
      phone: "555-777-8888",
      location: { lat: 40.7291, lng: -73.9965 },
    },
    customer: {
      name: "Michael Brown",
      address: "678 Wall St, New York, NY",
      phone: "555-333-4444",
      location: { lat: 40.7074, lng: -74.0113 },
    },
    driver: {
      name: "Alex Rodriguez",
      phone: "555-999-0000",
      vehicle: "Ford Focus (GHI-9012)",
    },
    driverLocation: { lat: 40.7291, lng: -73.9965 },
    estimatedTime: "0 min",
    distance: "2.8 mi",
    amount: "15.75",
    items: [
      { name: "Burrito Bowl", quantity: 1 },
      { name: "Chips & Guacamole", quantity: 1 },
      { name: "Horchata", quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      acceptedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      cancelledAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
  },
]

// Sample data for analytics
const ANALYTICS_DATA = {
  totalDeliveries: 125,
  activeDeliveries: 18,
  completedToday: 42,
  cancelledToday: 3,
  averageDeliveryTime: "28 min",
}

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState(SAMPLE_DELIVERIES)
  const [activeDelivery, setActiveDelivery] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "ALL">("ALL")
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleViewDetails = (id: string) => {
    setActiveDelivery(id)
  }

  const handleCancelDelivery = (id: string) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "CANCELLED" as DeliveryStatus } : delivery,
      ),
    )
  }

  const handleReassignDriver = (id: string) => {
    // In a real app, this would open a modal to select a new driver
    alert("Reassign driver functionality would be implemented here")
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (delivery.driver?.name.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "ALL" || delivery.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const activeDeliveryData = deliveries.find((delivery) => delivery.id === activeDelivery)

  if (loading) {
    return (
      <>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading deliveries...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold tracking-tight">Delivery Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
              <MapPin className="mr-2 h-4 w-4" />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ANALYTICS_DATA.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ANALYTICS_DATA.activeDeliveries}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ANALYTICS_DATA.completedToday}</div>
              <p className="text-xs text-green-500">+5 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ANALYTICS_DATA.averageDeliveryTime}</div>
              <p className="text-xs text-green-500">-3 min from last week</p>
            </CardContent>
          </Card>
        </div>

        {showMap && (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Real-Time Delivery Map</CardTitle>
              <CardDescription>View all active deliveries on the map</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px]">
                <DeliveryMap
                  driverLocation={{
                    lat: 40.72,
                    lng: -74.0,
                    label: "Driver 1",
                    icon: "driver",
                  }}
                  pickupLocation={{
                    lat: 40.7128,
                    lng: -74.006,
                    label: "Restaurant",
                    icon: "restaurant",
                  }}
                  dropoffLocation={{
                    lat: 40.7282,
                    lng: -73.9942,
                    label: "Customer",
                    icon: "customer",
                  }}
                  className="h-full"
                  zoom={12}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeDelivery && activeDeliveryData ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <DeliveryMap
                driverLocation={{
                  lat: activeDeliveryData.driverLocation.lat,
                  lng: activeDeliveryData.driverLocation.lng,
                  label: activeDeliveryData.driver?.name || "Driver",
                  icon: "driver",
                }}
                pickupLocation={{
                  lat: activeDeliveryData.restaurant.location.lat,
                  lng: activeDeliveryData.restaurant.location.lng,
                  label: activeDeliveryData.restaurant.name,
                  icon: "restaurant",
                }}
                dropoffLocation={{
                  lat: activeDeliveryData.customer.location.lat,
                  lng: activeDeliveryData.customer.location.lng,
                  label: activeDeliveryData.customer.name,
                  icon: "customer",
                }}
                className="h-[400px]"
              />

              <DeliveryTimeline status={activeDeliveryData.status} timestamps={activeDeliveryData.timestamps} />

              <div className="flex flex-wrap gap-2">
                {activeDeliveryData.status === "PENDING" && (
                  <Button className="flex-1" onClick={() => handleReassignDriver(activeDeliveryData.id)}>
                    Reassign Driver
                  </Button>
                )}

                {["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(activeDeliveryData.status) && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleCancelDelivery(activeDeliveryData.id)}
                  >
                    Cancel Delivery
                  </Button>
                )}

                <Button variant="outline" className="flex-1" onClick={() => setActiveDelivery(null)}>
                  Back to List
                </Button>
              </div>
            </div>

            <div>
              <DeliveryCard
                id={activeDeliveryData.id}
                status={activeDeliveryData.status}
                orderId={activeDeliveryData.orderId}
                restaurant={activeDeliveryData.restaurant}
                customer={activeDeliveryData.customer}
                driver={activeDeliveryData.driver}
                estimatedTime={activeDeliveryData.estimatedTime}
                distance={activeDeliveryData.distance}
                amount={activeDeliveryData.amount}
                createdAt={activeDeliveryData.createdAt}
                viewType="admin"
                className="mb-4"
              />

              <div className="rounded-lg border">
                <div className="border-b p-4">
                  <h3 className="font-medium">Order Details</h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {activeDeliveryData.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${(Number.parseFloat(activeDeliveryData.amount) - 5).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>$3.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>$1.50</span>
                    </div>
                    <div className="mt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${activeDeliveryData.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by order ID, restaurant, customer, or driver..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeliveryStatus | "ALL")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Restaurant</DropdownMenuItem>
                    <DropdownMenuItem>Driver</DropdownMenuItem>
                    <DropdownMenuItem>Date Range</DropdownMenuItem>
                    <DropdownMenuItem>Delivery Time</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4 space-y-4">
                {filteredDeliveries.length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">No deliveries found</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDeliveries.map((delivery) => (
                      <DeliveryCard
                        key={delivery.id}
                        id={delivery.id}
                        status={delivery.status}
                        orderId={delivery.orderId}
                        restaurant={delivery.restaurant}
                        customer={delivery.customer}
                        driver={delivery.driver}
                        estimatedTime={delivery.estimatedTime}
                        distance={delivery.distance}
                        amount={delivery.amount}
                        createdAt={delivery.createdAt}
                        viewType="admin"
                        onViewDetails={handleViewDetails}
                        onCancel={handleCancelDelivery}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="pending" className="mt-4 space-y-4">
                {filteredDeliveries.filter((d) => d.status === "PENDING").length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">No pending deliveries</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDeliveries
                      .filter((d) => d.status === "PENDING")
                      .map((delivery) => (
                        <DeliveryCard
                          key={delivery.id}
                          id={delivery.id}
                          status={delivery.status}
                          orderId={delivery.orderId}
                          restaurant={delivery.restaurant}
                          customer={delivery.customer}
                          driver={delivery.driver}
                          estimatedTime={delivery.estimatedTime}
                          distance={delivery.distance}
                          amount={delivery.amount}
                          createdAt={delivery.createdAt}
                          viewType="admin"
                          onViewDetails={handleViewDetails}
                          onCancel={handleCancelDelivery}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="active" className="mt-4 space-y-4">
                {filteredDeliveries.filter((d) => ["ACCEPTED", "IN_PROGRESS"].includes(d.status)).length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">No active deliveries</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDeliveries
                      .filter((d) => ["ACCEPTED", "IN_PROGRESS"].includes(d.status))
                      .map((delivery) => (
                        <DeliveryCard
                          key={delivery.id}
                          id={delivery.id}
                          status={delivery.status}
                          orderId={delivery.orderId}
                          restaurant={delivery.restaurant}
                          customer={delivery.customer}
                          driver={delivery.driver}
                          estimatedTime={delivery.estimatedTime}
                          distance={delivery.distance}
                          amount={delivery.amount}
                          createdAt={delivery.createdAt}
                          viewType="admin"
                          onViewDetails={handleViewDetails}
                          onCancel={handleCancelDelivery}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed" className="mt-4 space-y-4">
                {filteredDeliveries.filter((d) => d.status === "DELIVERED").length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">No completed deliveries</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDeliveries
                      .filter((d) => d.status === "DELIVERED")
                      .map((delivery) => (
                        <DeliveryCard
                          key={delivery.id}
                          id={delivery.id}
                          status={delivery.status}
                          orderId={delivery.orderId}
                          restaurant={delivery.restaurant}
                          customer={delivery.customer}
                          driver={delivery.driver}
                          estimatedTime={delivery.estimatedTime}
                          distance={delivery.distance}
                          amount={delivery.amount}
                          createdAt={delivery.createdAt}
                          viewType="admin"
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="cancelled" className="mt-4 space-y-4">
                {filteredDeliveries.filter((d) => d.status === "CANCELLED").length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">No cancelled deliveries</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDeliveries
                      .filter((d) => d.status === "CANCELLED")
                      .map((delivery) => (
                        <DeliveryCard
                          key={delivery.id}
                          id={delivery.id}
                          status={delivery.status}
                          orderId={delivery.orderId}
                          restaurant={delivery.restaurant}
                          customer={delivery.customer}
                          driver={delivery.driver}
                          estimatedTime={delivery.estimatedTime}
                          distance={delivery.distance}
                          amount={delivery.amount}
                          createdAt={delivery.createdAt}
                          viewType="admin"
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </>
  )
}
