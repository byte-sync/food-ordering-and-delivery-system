"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Store, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Add Admin",
      description: "Create a new admin account",
      icon: UserPlus,
      href: "/admin/users/admins",
    },
    {
      title: "Add Restaurant",
      description: "Register a new restaurant",
      icon: Store,
      href: "/admin/users/restaurants",
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <Button key={index} variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href={action.href}>
              <action.icon className="h-4 w-4" />
              {action.title}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
