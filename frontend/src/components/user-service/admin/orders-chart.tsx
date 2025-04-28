"use client"

interface OrdersChartProps {
  timeRange: string
}

export function OrdersChart({ timeRange }: OrdersChartProps) {
  return (
    <div className="h-full w-full">
      {/* In a real app, you would use a chart library like recharts or chart.js */}
      <div className="flex h-full flex-col items-center justify-center">
        <div className="h-[300px] w-full rounded-md bg-muted/50">
          {/* Placeholder for chart */}
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Orders chart for {timeRange} would be displayed here
          </div>
        </div>
      </div>
    </div>
  )
}
