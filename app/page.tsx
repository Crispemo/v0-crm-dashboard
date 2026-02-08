"use client"

import { Header } from "@/components/layout/header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { CallsChart } from "@/components/dashboard/calls-chart"
import { RecentCallsTable } from "@/components/dashboard/recent-calls-table"
import {
  useDashboardKPIs,
  useRecentCalls,
  useDailyStats,
} from "@/lib/hooks/use-dashboard-data"

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading, mutate: mutateKpis } = useDashboardKPIs()
  const { data: recentCalls, isLoading: callsLoading, mutate: mutateCalls } = useRecentCalls()
  const { data: dailyStats, isLoading: statsLoading, mutate: mutateStats } = useDailyStats()

  const isRefreshing = kpisLoading || callsLoading || statsLoading

  function handleRefresh() {
    mutateKpis()
    mutateCalls()
    mutateStats()
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Dashboard"
        description="Resumen de actividad de llamadas y reservas"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <KPICards data={kpis} isLoading={kpisLoading} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CallsChart data={dailyStats} isLoading={statsLoading} />
            <RecentCallsTable calls={recentCalls} isLoading={callsLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}
