"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerTopNavbar } from "@/components/customer/customer-top-navbar"
import { CustomerMobileNavbar } from "@/components/customer/customer-mobile-navbar"
import { useMobile } from "@/hooks/useMobile"
import { useRouteProtection } from "@/hooks/useRouteProtection"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Apply route protection to ensure only customers can access
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
      <CustomerSidebar
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
        <CustomerTopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>

        {/* Mobile bottom navigation */}
        {isMobile && <CustomerMobileNavbar />}
      </div>
    </div>
  )
}

// Helper function to conditionally join class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}
