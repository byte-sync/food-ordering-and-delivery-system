"use client"

import { VehicleTypesTable } from "@/components/admin/vehicle/vehicle-types-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VehicleTypesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Vehicle Types</h1>
        <p className="text-muted-foreground mt-2">
          Manage vehicle types and their cargo capacities
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <VehicleTypesTable />
        </CardContent>
      </Card>
    </div>
  )
}