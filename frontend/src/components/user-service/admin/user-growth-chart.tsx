"use client"

import { useEffect, useState } from "react"

interface UserGrowthChartProps {
  timeRange: string
  userType: string
}

export function UserGrowthChart({ timeRange, userType }: UserGrowthChartProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeRange, userType])

  return (
    <div className="flex h-full w-full items-center justify-center">
      {loading ? (
        <div className="text-muted-foreground">Loading chart data...</div>
      ) : (
        <div className="h-full w-full">
          {/* In a real app, you would use a chart library like recharts or chart.js */}
          <div className="flex h-full flex-col items-center justify-center">
            <div className="text-muted-foreground">
              User Growth Chart for {userType} over {timeRange}
            </div>
            <div className="mt-4 h-[300px] w-full rounded-md bg-muted/50">
              {/* Placeholder for chart */}
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Chart visualization would be displayed here
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
