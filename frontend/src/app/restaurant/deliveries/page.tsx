"use client"

import { useState, useEffect } from "react"
import { DeliveryCard } from "@/components/ui/delivery-card"
import { DeliveryTimeline } from "@/components/ui/delivery-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import type { DeliveryStatus } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"
import type { DeliveryStatus } from "@/components/ui/status-badge"
import { DeliveryMap } from "@/components/ui/delivery-map"

// Sample data
const SAMPLE_DELIVERIES = [
  {
    id: "del-001",
    status: "ACCEPTED" as DeliveryStatus,
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
    },
  },
  {
    id: "del-002",
    status: "PENDING" as DeliveryStatus,
    orderId: "ORD-5678",
    restaurant: {
      name: "Burger Palace",
      address: "123 Main St, New York, NY",
      phone: "555-123-4567",
      location: { lat: 40.7128, lng: -74.006 },
    },
    customer: {
      name: "Emily Davis",
      address: "321 5th Ave, New York, NY",
      phone: "555-444-5555",
      location: { lat: 40.7448, lng: -73.9867 },
    },
    driverLocation: { lat: 40.7128, lng: -74.006 },
    estimatedTime: "10 min",
    distance: "1.8 mi",
    amount: "9.25",
    items: [
      { name: "Veggie Burger", quantity: 1 },
      { name: "Onion Rings", quantity: 1 },
      { name: "Milkshake", quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  },
  {
    id: "del-003",
    status: "IN_PROGRESS" as DeliveryStatus,
    orderId: "ORD-9012",
    restaurant: {
      name: "Burger Palace",
      address: "123 Main St, New York, NY",
      phone: "555-123-4567",
      location: { lat: 40.7128, lng: -74.006 },
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
    driverLocation: { lat: 40.722, lng: -74.003 },
    estimatedTime: "5 min",
    distance: "1.2 mi",
    amount: "10.75",
    items: [
      { name: "Double Cheeseburger", quantity: 1 },
      { name: "Chicken Nuggets", quantity: 1 },
      { name: "Fries", quantity: 1 },
      { name: "Soda", quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      acceptedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      pickedUpAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  },
  {
    id: "del-004",
    status: "DELIVERED" as DeliveryStatus,
    orderId: "ORD-3456",
    restaurant: {
      name: "Burger Palace",
      address: "123 Main St, New York, NY",
      phone: "555-123-4567",
      location: { lat: 40.7128, lng: -74.006 },
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
      { name: "Bacon Burger", quantity: 1 },
      { name: "Sweet Potato Fries", quantity: 1 },
      { name: "Chocolate Shake", quantity: 1 },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    timestamps: {
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      acceptedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      pickedUpAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      deliveredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  },
]

export default function RestaurantDeliveriesPage() {
  const [deliveries, setDeliveries] = useState(SAMPLE_DELIVERIES)
  const [activeDelivery, setActiveDelivery] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleHandToDriver = (id: string) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "IN_PROGRESS" as DeliveryStatus } : delivery,
      ),
    )
  }

  const handleViewDetails = (id: string) => {
    setActiveDelivery(id)
  }

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <h1 className="text-2xl font-bold tracking-tight">Deliveries</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by order ID or customer..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
                className="h-[300px]"
              />

              <DeliveryTimeline status={activeDeliveryData.status} timestamps={activeDeliveryData.timestamps} />

              <div className="flex flex-wrap gap-2">
                {activeDeliveryData.status === "ACCEPTED" && (
                  <Button className="flex-1" onClick={() => handleHandToDriver(activeDeliveryData.id)}>
                    Hand to Driver
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
                viewType="restaurant"
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
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
                        viewType="restaurant"
                        onViewDetails={handleViewDetails}
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
                        viewType="restaurant"
                        onViewDetails={handleViewDetails}
                        onPickup={handleHandToDriver}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              {filteredDeliveries.filter((d) => ["DELIVERED", "CANCELLED"].includes(d.status)).length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border">
                  <p className="text-muted-foreground">No completed deliveries</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDeliveries
                    .filter((d) => ["DELIVERED", "CANCELLED"].includes(d.status))
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
                        viewType="restaurant"
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  )
}
