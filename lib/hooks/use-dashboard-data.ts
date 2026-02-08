import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import type { AiCall, DashboardKPIs } from "@/lib/types"

const supabase = createClient()

async function fetchDashboardKPIs(): Promise<DashboardKPIs> {
  const { data, error } = await supabase
    .from("ai_calls")
    .select("estado")

  if (error) {
    console.log("[v0] Error fetching KPIs:", error.message)
    throw error
  }

  const allCalls = data || []
  const reservas = allCalls.filter(
    (c) => c.estado?.toLowerCase().includes("reserva confirmada")
  ).length
  const cancelaciones = allCalls.filter(
    (c) =>
      c.estado?.toLowerCase().includes("cancel") ||
      c.estado?.toLowerCase().includes("cancelada")
  ).length
  const otros = allCalls.length - reservas - cancelaciones

  return {
    totalCalls: allCalls.length,
    reservasConfirmadas: reservas,
    cancelaciones,
    otros,
  }
}

async function fetchRecentCalls(): Promise<AiCall[]> {
  const { data, error } = await supabase
    .from("ai_calls")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.log("[v0] Error fetching recent calls:", error.message)
    throw error
  }
  return (data as AiCall[]) || []
}

async function fetchDailyStats(): Promise<
  Array<{ date: string; calls: number }>
> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data, error } = await supabase
    .from("ai_calls")
    .select("created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.log("[v0] Error fetching daily stats:", error.message)
    throw error
  }

  const grouped: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    grouped[key] = 0
  }

  for (const call of data || []) {
    const key = call.created_at.split("T")[0]
    if (grouped[key] !== undefined) {
      grouped[key]++
    }
  }

  return Object.entries(grouped).map(([date, calls]) => ({
    date,
    calls,
  }))
}

export function useDashboardKPIs() {
  return useSWR("dashboard-kpis", fetchDashboardKPIs, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })
}

export function useRecentCalls() {
  return useSWR("recent-calls", fetchRecentCalls, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  })
}

export function useDailyStats() {
  return useSWR("daily-stats", fetchDailyStats, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  })
}
