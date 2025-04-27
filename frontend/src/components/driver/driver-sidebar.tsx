"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Navigation, ShoppingBag, DollarSign, Car, Clock, Settings, Moon, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/useMobile"

interface DriverSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
}

export function DriverSidebar({ className, open, onClose, ...props }: DriverSidebarProps) {
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
            href="/driver"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/driver" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/driver/active-deliveries"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/driver/active-deliveries" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Navigation className="h-5 w-5" />
            Active Deliveries
          </Link>

          <Link
            href="/driver/delivery-history"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/driver/delivery-history" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            Delivery History
          </Link>

          <Link
            href="/driver/earnings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/driver/earnings" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <DollarSign className="h-5 w-5" />
            Earnings
          </Link>

          <div className="my-2 h-px bg-border" />

          <Link
            href="/driver/vehicle"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/driver/vehicle" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Car className="h-5 w-5" />
            Vehicle Information
          </Link>

          <Link
            href="/driver/availability"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/driver/availability" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Clock className="h-5 w-5" />
            Availability
          </Link>

          <Link
            href="/driver/profile"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/driver/profile" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Settings className="h-5 w-5" />
            Profile Settings
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
