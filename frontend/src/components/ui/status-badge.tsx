import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type DeliveryStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED"

interface StatusBadgeProps {
  status: DeliveryStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-500/20 dark:border-yellow-500/10"
      case "ACCEPTED":
        return "bg-blue-500/20 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/10"
      case "IN_PROGRESS":
        return "bg-purple-500/20 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/10"
      case "DELIVERED":
        return "bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-400 border-green-500/20 dark:border-green-500/10"
      case "CANCELLED":
        return "bg-red-500/20 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-500/20 dark:border-red-500/10"
      default:
        return "bg-gray-500/20 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/10"
    }
  }

  return (
    <Badge variant="outline" className={cn("font-medium border", getVariant(), className)}>
      {status.replace("_", " ")}
    </Badge>
  )
}
