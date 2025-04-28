"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  // Sample data
  const activities = [
    {
      id: 1,
      user: {
        name: "Pizza Corner",
        image: "/placeholder.svg?height=32&width=32",
        initials: "PC",
      },
      action: "registered as a new restaurant",
      time: "10 minutes ago",
    },
    {
      id: 2,
      user: {
        name: "David Brown",
        image: "/placeholder.svg?height=32&width=32",
        initials: "DB",
      },
      action: "registered as a new driver",
      time: "30 minutes ago",
    },
    {
      id: 3,
      user: {
        name: "Jane Smith",
        image: "/placeholder.svg?height=32&width=32",
        initials: "JS",
      },
      action: "approved Burger Palace restaurant",
      time: "1 hour ago",
    },
    {
      id: 4,
      user: {
        name: "Emily Davis",
        image: "/placeholder.svg?height=32&width=32",
        initials: "ED",
      },
      action: "placed an order at Sushi Express",
      time: "2 hours ago",
    },
    {
      id: 5,
      user: {
        name: "Michael Johnson",
        image: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      action: "completed a delivery",
      time: "3 hours ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest activities across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={activity.user.image || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
