"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Car, UserCheck } from "lucide-react"

export function DashboardStats() {
  // Sample data
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
      title: "Pending Approvals",
      value: "23",
      change: "-5%",
      icon: UserCheck,
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
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
