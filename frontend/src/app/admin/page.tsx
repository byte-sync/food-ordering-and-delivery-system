import { DashboardStats } from "@/components/user-service/dashboard/dashboard-stats";
import { PendingApprovals } from "@/components/user-service/dashboard/pending-approvals";
import { QuickActions } from "@/components/user-service/dashboard/quick-action";
import { RecentActivity } from "@/components/user-service/dashboard/recent-activity";
import { DataFetchTest } from "@/components/shared/data-fetch-test";


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <PendingApprovals />
        </div>
      </div>
      
      {/* API Data Fetch Test */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">API Integration Test</h2>
        <DataFetchTest />
      </div>
    </div>
  )
}
