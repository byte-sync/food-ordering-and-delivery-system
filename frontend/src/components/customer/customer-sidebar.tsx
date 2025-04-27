"use client"

import Image from "next/image"
import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, Heart, MapPin, CreditCard, Settings, Moon, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/useMobile"

interface CustomerSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
}

export function CustomerSidebar({ className, open, onClose, ...props }: CustomerSidebarProps) {
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
            href="/customer"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/customer" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/customer/explore"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/customer/explore" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Search className="h-5 w-5" />
            Explore
          </Link>

          <Link
            href="/customer/orders"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/customer/orders" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            My Orders
          </Link>

          <Link
            href="/customer/favorites"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/customer/favorites" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <Heart className="h-5 w-5" />
            Favorites
          </Link>

          <div className="my-2 h-px bg-border" />

          <Link
            href="/customer/addresses"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/customer/addresses" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <MapPin className="h-5 w-5" />
            My Addresses
          </Link>

          <Link
            href="/customer/payment"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/customer/payment" ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </Link>

          <Link
            href="/customer/profile"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/customer/profile" ? "bg-accent text-accent-foreground" : "transparent",
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
