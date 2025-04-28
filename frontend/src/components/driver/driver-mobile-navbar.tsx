"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Navigation, ShoppingBag, DollarSign, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function DriverMobileNavbar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex h-16 items-center justify-around">
        <Link
          href="/driver"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/driver" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/driver/active-deliveries"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/driver/active-deliveries" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Navigation className="h-5 w-5" />
          <span>Active</span>
        </Link>

        <Link
          href="/driver/delivery-history"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/driver/delivery-history" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <ShoppingBag className="h-5 w-5" />
          <span>History</span>
        </Link>

        <Link
          href="/driver/earnings"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/driver/earnings" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <DollarSign className="h-5 w-5" />
          <span>Earnings</span>
        </Link>

        <Link
          href="/driver/profile"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/driver/profile" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  )
}
