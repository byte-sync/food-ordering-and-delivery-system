"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

export interface Location {
  lat: number
  lng: number
  label?: string
  icon?: "driver" | "restaurant" | "customer"
}

interface MapProps {
  driverLocation: Location
  pickupLocation: Location
  dropoffLocation: Location
  showRoute?: boolean
  animate?: boolean
  zoom?: number
}

export default function Map({
  driverLocation,
  pickupLocation,
  dropoffLocation,
  showRoute = true,
  animate = true,
  zoom = 14,
}: MapProps) {
  // Your map implementation here
  return (
    <div>
      {/* Map implementation */}
    </div>
  )
}

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/30">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

interface DeliveryMapProps {
  driverLocation: Location
  pickupLocation: Location
  dropoffLocation: Location
  className?: string
  showRoute?: boolean
  animate?: boolean
  zoom?: number
}

export function DeliveryMap({
  driverLocation,
  pickupLocation,
  dropoffLocation,
  className,
  showRoute = true,
  animate = true,
  zoom = 14,
}: DeliveryMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={cn("h-[300px] w-full rounded-lg bg-muted/30", className)}>
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("h-[300px] w-full overflow-hidden rounded-lg border", className)}>
      <MapWithNoSSR
        driverLocation={driverLocation}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        showRoute={showRoute}
        animate={animate}
        zoom={zoom}
      />
    </div>
  )
}
