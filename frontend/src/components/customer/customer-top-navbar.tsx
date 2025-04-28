"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface CustomerTopNavbarProps {
  onMenuClick: () => void
}

export function CustomerTopNavbar({ onMenuClick }: CustomerTopNavbarProps) {
  const [notificationCount, setNotificationCount] = useState(2)
  const [cartItemCount, setCartItemCount] = useState(3)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="ml-auto flex items-center gap-4">
        <Link href="/customer/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs" variant="default">
                {cartItemCount}
              </Badge>
            )}
            <span className="sr-only">Shopping Cart</span>
          </Button>
        </Link>

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
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Your order has been delivered</p>
                  <p className="text-xs text-muted-foreground">Order #12345 from Burger Palace has been delivered</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 hover:bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Special offer</p>
                  <p className="text-xs text-muted-foreground">Get 20% off your next order with code FOOD20</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
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
                alt="Customer"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="sr-only">Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">Emily Davis</p>
                <p className="text-xs text-muted-foreground">emily.d@example.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/customer/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/customer/orders">My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/customer/addresses">My Addresses</Link>
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
