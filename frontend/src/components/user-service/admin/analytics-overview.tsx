"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Car, ShoppingBag } from "lucide-react"

interface AnalyticsOverviewProps {
  timeRange: string
  userType: string
}

export function AnalyticsOverview({ timeRange, userType }: AnalyticsOverviewProps) {
  // Sample data - in a real app, this would be fetched based on timeRange and userType
  const stats = [
    {
      title: "Total Customers",
      value: "12,345",
      change: "+12%",
      icon: Users,
    },
    {
      title: "Total Restaurants",
      value: "567",
      change: "+8%",
      icon: Store,
    },
    {
      title: "Total Drivers",
      value: "890",
      change: "+15%",
      icon: Car,
    },
    {
      title: "Total Orders",
      value: "45,678",
      change: "+23%",
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {stat.change} from previous period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
