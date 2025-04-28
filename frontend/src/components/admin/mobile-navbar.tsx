"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavbar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex h-16 items-center justify-around">
        <Link
          href="/admin"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/admin" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/users/admins"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname.includes("/admin/users") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Users className="h-5 w-5" />
          <span>Users</span>
        </Link>

        <Link
          href="/admin/analytics"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
            pathname === "/admin/analytics" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Analytics</span>
        </Link>
      </nav>
    </div>
  )
}
