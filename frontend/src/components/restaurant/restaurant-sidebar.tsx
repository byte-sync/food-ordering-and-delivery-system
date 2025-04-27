"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Utensils, ShoppingBag, Clock, MapPin, BarChart3, Settings, Moon, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/useMobile"

interface RestaurantSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
}

export function RestaurantSidebar({ className, open, onClose, ...props }: RestaurantSidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const sidebarContent = (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      <div className="flex h-16 items-center border-b px-4">
      <Link href="/restaurant" className="flex items-center gap-2 font-semibold">
          <Image src="/logo-dark.svg" alt="NomNom-logo" width={120} height={120} className="rounded-full" />
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
            href="/restaurant"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/restaurant" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/restaurant/menu"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/restaurant/menu" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Utensils className="h-5 w-5" />
            Menu Management
          </Link>

          <Link
            href="/restaurant/orders"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/restaurant/orders" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            Orders
          </Link>

          <Link
            href="/restaurant/hours"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/restaurant/hours" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Clock className="h-5 w-5" />
            Business Hours
          </Link>

          <Link
            href="/restaurant/delivery-zones"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/restaurant/delivery-zones" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <MapPin className="h-5 w-5" />
            Delivery Zones
          </Link>

          <Link
            href="/restaurant/analytics"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/restaurant/analytics" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <BarChart3 className="h-5 w-5" />
            Analytics
          </Link>

          <div className="my-2 h-px bg-border" />

          <Link
            href="/restaurant/profile"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/restaurant/profile" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Settings className="h-5 w-5" />
            Restaurant Profile
          </Link>
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
