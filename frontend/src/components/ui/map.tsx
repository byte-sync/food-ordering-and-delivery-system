"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
// Add type definition for leaflet-routing-machine
declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: L.LatLng[]
      lineOptions?: any
      routeWhileDragging?: boolean
      addWaypoints?: boolean
      draggableWaypoints?: boolean
      fitSelectedRoutes?: boolean
      showAlternatives?: boolean
    }
    class Control {
      constructor(options: RoutingControlOptions)
      addTo(map: L.Map): this
    }
    function control(options: RoutingControlOptions): Control
  }
}
import type { Location } from "@/components/ui/delivery-map"

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
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
  const mapRef = useRef<L.Map | null>(null)
  const routingControlRef = useRef<L.Routing.Control | null>(null)
  const driverMarkerRef = useRef<L.Marker | null>(null)
  const prevPositionRef = useRef<L.LatLng | null>(null)

  // Add a handler to open Google Maps directions.
  const handleGoogleMaps = () => {
    const origin = `${driverLocation.lat},${driverLocation.lng}`
    const destination = `${dropoffLocation.lat},${dropoffLocation.lng}`
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`,
      "_blank"
    )
  }

  useEffect(() => {
    fixLeafletIcon()

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([driverLocation.lat, driverLocation.lng], zoom)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Create custom icons
      const restaurantIcon = L.divIcon({
        html: `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
              </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const customerIcon = L.divIcon({
        html: `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const driverIcon = L.divIcon({
        html: `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bike"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
              </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      // Add markers for restaurant and customer
      L.marker([pickupLocation.lat, pickupLocation.lng], { icon: restaurantIcon })
        .addTo(mapRef.current)
        .bindPopup(pickupLocation.label || "Restaurant")

      L.marker([dropoffLocation.lat, dropoffLocation.lng], { icon: customerIcon })
        .addTo(mapRef.current)
        .bindPopup(dropoffLocation.label || "Customer")

      // Add driver marker
      driverMarkerRef.current = L.marker([driverLocation.lat, driverLocation.lng], { icon: driverIcon })
        .addTo(mapRef.current)
        .bindPopup(driverLocation.label || "Driver")

      prevPositionRef.current = L.latLng(driverLocation.lat, driverLocation.lng)

      // Add routing
      if (showRoute) {
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(pickupLocation.lat, pickupLocation.lng),
            L.latLng(dropoffLocation.lat, dropoffLocation.lng),
          ],
          lineOptions: {
            styles: [{ color: "var(--primary)", opacity: 0.7, weight: 4 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          showAlternatives: false,
        }).addTo(mapRef.current)

        // Instead of removing the routing control element, hide it using CSS
        const routingContainer = document.querySelector(".leaflet-routing-container")
        if (routingContainer) {
          routingContainer.setAttribute("style", "display: none")
        }
      }

      // Fit bounds to include all markers
      const bounds = L.latLngBounds([
        [driverLocation.lat, driverLocation.lng],
        [pickupLocation.lat, pickupLocation.lng],
        [dropoffLocation.lat, dropoffLocation.lng],
      ])
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })

      // Add double-click event on the map to open Google Maps
      mapRef.current.on("dblclick", handleGoogleMaps)
    }

    // Update driver position
    if (mapRef.current && driverMarkerRef.current && prevPositionRef.current) {
      const newPosition = L.latLng(driverLocation.lat, driverLocation.lng)

      if (animate) {
        // Animate marker movement
        const frames = 100
        let frame = 0

        const animateMarker = () => {
          if (frame < frames && prevPositionRef.current) {
            frame++
            const lat =
              prevPositionRef.current.lat +
              (newPosition.lat - prevPositionRef.current.lat) * (frame / frames)
            const lng =
              prevPositionRef.current.lng +
              (newPosition.lng - prevPositionRef.current.lng) * (frame / frames)

            driverMarkerRef.current?.setLatLng([lat, lng])
            requestAnimationFrame(animateMarker)
          } else {
            driverMarkerRef.current?.setLatLng([driverLocation.lat, driverLocation.lng])
            prevPositionRef.current = newPosition
          }
        }

        animateMarker()
      } else {
        driverMarkerRef.current.setLatLng([driverLocation.lat, driverLocation.lng])
        prevPositionRef.current = newPosition
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        routingControlRef.current = null
        driverMarkerRef.current = null
      }
    }
  }, [driverLocation, pickupLocation, dropoffLocation, showRoute, animate, zoom])

  return (
    <>
      <div id="map" className="h-full w-full" />
      <div className="mt-4">
        <button
          onClick={handleGoogleMaps}
          className="bg-primary text-white px-4 py-2 rounded shadow-md"
        >
          Open in Google Maps
        </button>
      </div>
    </>
  )
}
