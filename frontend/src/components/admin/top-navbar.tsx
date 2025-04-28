"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface TopNavbarProps {
  onMenuClick: () => void
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [notificationCount, setNotificationCount] = useState(3)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="ml-auto flex items-center gap-4">
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
                  <p className="text-sm">New restaurant registration</p>
                  <p className="text-xs text-muted-foreground">Pizza Corner has registered and is awaiting approval</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 hover:bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">New driver registration</p>
                  <p className="text-xs text-muted-foreground">David Brown has registered as a driver</p>
                  <p className="text-xs text-muted-foreground">30 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 hover:bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm">System update</p>
                  <p className="text-xs text-muted-foreground">The platform has been updated to version 2.1.0</p>
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
                alt="Admin"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="sr-only">Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/profile?tab=security">Reset Password</Link>
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
