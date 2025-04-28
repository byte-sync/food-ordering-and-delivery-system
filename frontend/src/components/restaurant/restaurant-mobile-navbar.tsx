"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Utensils, ShoppingBag, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function RestaurantMobileNavbar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex h-16 items-center justify-around">
        <Link
          href="/restaurant"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/restaurant" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/restaurant/menu"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/restaurant/menu" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Utensils className="h-5 w-5" />
          <span>Menu</span>
        </Link>

        <Link
          href="/restaurant/orders"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/restaurant/orders" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Orders</span>
        </Link>

        <Link
          href="/restaurant/analytics"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/restaurant/analytics" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Analytics</span>
        </Link>

        <Link
          href="/restaurant/profile"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/restaurant/profile" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  )
}
