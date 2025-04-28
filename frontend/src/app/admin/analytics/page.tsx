"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalyticsOverview } from "@/components/user-service/admin/analytics-overview"
import { UserGrowthChart } from "@/components/user-service/admin/user-growth-chart"
import { OrdersChart } from "@/components/user-service/admin/orders-chart"
import { CuisineDistributionChart } from "@/components/user-service/admin/cuisine-distribution-chart"
import { LocationMap } from "@/components/user-service/admin/location-map"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [userType, setUserType] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Analytics</h1>

        <div className="flex flex-wrap gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="restaurants">Restaurants</SelectItem>
              <SelectItem value="drivers">Drivers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnalyticsOverview timeRange={timeRange} userType={userType} />

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="cuisine">Cuisine Distribution</TabsTrigger>
          <TabsTrigger value="location">Location Map</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
              <CardDescription>New user registrations over the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <UserGrowthChart timeRange={timeRange} userType={userType} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
              <CardDescription>Order volume and revenue over the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <OrdersChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cuisine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cuisine Distribution</CardTitle>
              <CardDescription>Distribution of restaurant cuisines on the platform</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CuisineDistributionChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Locations</CardTitle>
              <CardDescription>Map of active users and restaurants</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <LocationMap userType={userType} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
