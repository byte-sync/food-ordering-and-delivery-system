"use client"

import { RestaurantTypesTable } from "@/components/admin/restaurant/restaurant-types-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RestaurantTypesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Restaurant Types</h1>
        <p className="text-muted-foreground mt-2">
          Manage restaurant types and their seating capacities
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <RestaurantTypesTable />
        </CardContent>
      </Card>
    </div>
  )
}