"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

export function PendingApprovals() {
  // Sample data
  const pendingItems = [
    {
      id: 1,
      name: "Pizza Corner",
      type: "Restaurant",
      time: "10 minutes ago",
      href: "/admin/users/restaurants",
    },
    {
      id: 2,
      name: "David Brown",
      type: "Driver",
      time: "30 minutes ago",
      href: "/admin/users/drivers",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>Items awaiting your approval</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingItems.length > 0 ? (
          pendingItems.map((item) => (
            <div key={item.id} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} • {item.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="h-7 w-7">
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Approve</span>
                  </Button>
                  <Button size="icon" variant="outline" className="h-7 w-7">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Reject</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No pending approvals</p>
        )}

        {pendingItems.length > 0 && (
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/admin/approvals">View all pending approvals</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
