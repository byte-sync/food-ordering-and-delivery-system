"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ChevronDown, Home, Moon, Settings, Sun, Users, X, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/useMobile"
import Image from "next/image"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ className, open, onClose, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()
  const [usersExpanded, setUsersExpanded] = useState(true)
  const [settingsExpanded, setSettingsExpanded] = useState(true)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const sidebarContent = (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Image src="/logo-dark.svg" alt="FoodAdmin logo" width={120} height={120} className="rounded-full" />
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/admin" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>

          <div className="py-2">
            <button
              onClick={() => setUsersExpanded(!usersExpanded)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                Users
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", usersExpanded ? "rotate-180" : "")} />
            </button>

            {usersExpanded && (
              <div className="ml-4 mt-1 flex flex-col gap-1 pl-4 border-l">
                <Link
                  href="/admin/users/admins"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/admin/users/admins" ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  Admins
                </Link>
                <Link
                  href="/admin/users/restaurants"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/admin/users/restaurants" ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  Restaurants
                </Link>
                <Link
                  href="/admin/users/customers"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/admin/users/customers" ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  Customers
                </Link>
                <Link
                  href="/admin/users/drivers"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/admin/users/drivers" ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  Drivers
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/admin/analytics"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/admin/analytics" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <BarChart3 className="h-5 w-5" />
            Analytics
          </Link>

          <div className="py-2">
            <button
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                Settings
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", settingsExpanded ? "rotate-180" : "")} />
            </button>

            {settingsExpanded && (
              <div className="ml-4 mt-1 flex flex-col gap-1 pl-4 border-l">
                <Link
                  href="/admin/cuisine-types"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/admin/cuisine-types" ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Cuisine Types
                </Link>
              </div>
            )}
          </div>
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return sidebarContent
}
