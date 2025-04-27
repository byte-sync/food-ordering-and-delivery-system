import { CheckCircle2, Circle, Clock, MapPin, Package, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { DeliveryStatus } from "./status-badge"

interface DeliveryTimelineProps {
  status: DeliveryStatus
  timestamps: {
    createdAt: string
    acceptedAt?: string
    pickedUpAt?: string
    deliveredAt?: string
    cancelledAt?: string
  }
  className?: string
}

export function DeliveryTimeline({ status, timestamps, className }: DeliveryTimelineProps) {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return ""
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isCompleted = (stepStatus: DeliveryStatus) => {
    const statusOrder = ["PENDING", "ACCEPTED", "IN_PROGRESS", "DELIVERED"]
    const currentIndex = statusOrder.indexOf(status)
    const stepIndex = statusOrder.indexOf(stepStatus)

    if (status === "CANCELLED") {
      return false
    }

    return stepIndex <= currentIndex
  }

  const isCancelled = status === "CANCELLED"

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative flex flex-col space-y-4 pb-4">
        {/* Vertical line */}
        <div className="absolute left-3.5 top-0 h-full w-px bg-border" />

        {/* Order placed */}
        <div className="relative flex items-center gap-3">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background",
              isCompleted("PENDING")
                ? "border-primary text-primary"
                : "border-muted-foreground/30 text-muted-foreground/30",
            )}
          >
            <Package className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Order Placed</span>
            <span className="text-xs text-muted-foreground">{formatTime(timestamps.createdAt)}</span>
          </div>
        </div>

        {/* Driver accepted */}
        <div className="relative flex items-center gap-3">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background",
              isCompleted("ACCEPTED")
                ? "border-primary text-primary"
                : "border-muted-foreground/30 text-muted-foreground/30",
            )}
          >
            {isCompleted("ACCEPTED") ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : isCancelled ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{isCancelled ? "Order Cancelled" : "Driver Accepted"}</span>
            <span className="text-xs text-muted-foreground">
              {isCancelled ? formatTime(timestamps.cancelledAt) : formatTime(timestamps.acceptedAt)}
            </span>
          </div>
        </div>

        {/* Picked up */}
        {!isCancelled && (
          <div className="relative flex items-center gap-3">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background",
                isCompleted("IN_PROGRESS")
                  ? "border-primary text-primary"
                  : "border-muted-foreground/30 text-muted-foreground/30",
              )}
            >
              {isCompleted("IN_PROGRESS") ? <MapPin className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Picked Up</span>
              <span className="text-xs text-muted-foreground">{formatTime(timestamps.pickedUpAt)}</span>
            </div>
          </div>
        )}

        {/* Delivered */}
        {!isCancelled && (
          <div className="relative flex items-center gap-3">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background",
                isCompleted("DELIVERED")
                  ? "border-primary text-primary"
                  : "border-muted-foreground/30 text-muted-foreground/30",
              )}
            >
              {isCompleted("DELIVERED") ? <Clock className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Delivered</span>
              <span className="text-xs text-muted-foreground">{formatTime(timestamps.deliveredAt)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
