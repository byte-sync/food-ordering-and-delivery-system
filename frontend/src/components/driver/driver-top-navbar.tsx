"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, User, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface DriverTopNavbarProps {
  onMenuClick: () => void
}

export function DriverTopNavbar({ onMenuClick }: DriverTopNavbarProps) {
  const [notificationCount, setNotificationCount] = useState(2)
  const [isOnline, setIsOnline] = useState(true)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Switch id="online-status" checked={isOnline} onCheckedChange={setIsOnline} />
          <Label htmlFor="online-status" className="text-sm font-medium">
            {isOnline ? "Online" : "Offline"}
          </Label>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/driver/earnings">
            <DollarSign className="mr-2 h-4 w-4" />
            Today: $85.50
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs" variant="destructive">
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setNotificationCount(0)}>
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="flex items-start gap-4 p-4 hover:bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">New delivery request</p>
                  <p className="text-xs text-muted-foreground">Pickup from Burger Palace, 2.5 miles away</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 hover:bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Earnings update</p>
                  <p className="text-xs text-muted-foreground">You earned $25.50 from your last delivery</p>
                  <p className="text-xs text-muted-foreground">30 minutes ago</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Driver"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="sr-only">Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Michael Johnson</p>
                <p className="text-xs text-muted-foreground">michael.j@example.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/driver/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/driver/earnings">My Earnings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/driver/vehicle">Vehicle Information</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/logout">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
