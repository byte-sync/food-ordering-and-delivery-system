"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function CustomerMobileNavbar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex h-16 items-center justify-around">
        <Link
          href="/customer"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/customer" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/customer/explore"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/customer/explore" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Search className="h-5 w-5" />
          <span>Explore</span>
        </Link>

        <Link
          href="/customer/orders"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/customer/orders" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Orders</span>
        </Link>

        <Link
          href="/customer/favorites"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/customer/favorites" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Heart className="h-5 w-5" />
          <span>Favorites</span>
        </Link>

        <Link
          href="/customer/profile"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/customer/profile" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  )
}
