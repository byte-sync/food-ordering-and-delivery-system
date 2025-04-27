"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DriverTopNavbar } from "@/components/driver/driver-top-navbar"
import { DriverMobileNavbar } from "@/components/driver/driver-mobile-navbar"
import { useMobile } from "@/hooks/useMobile"
import { DriverSidebar } from "@/components/driver/driver-sidebar"
import { useRouteProtection } from "@/hooks/useRouteProtection"

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Apply route protection to ensure only drivers can access
  useRouteProtection();
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()
  const pathname = usePathname()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile when closed */}
      <DriverSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      />

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DriverTopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>

        {/* Mobile bottom navigation */}
        {isMobile && <DriverMobileNavbar />}
      </div>
    </div>
  )
}

// Helper function to conditionally join class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}
