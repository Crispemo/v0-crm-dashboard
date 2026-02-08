import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import type { AiCall } from "@/lib/types"

const supabase = createClient()

interface CallsFilters {
  estado?: string
  search?: string
}

async function fetchCalls(filters: CallsFilters): Promise<AiCall[]> {
  let query = supabase
    .from("ai_calls")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (filters.estado && filters.estado !== "all") {
    query = query.ilike("estado", `%${filters.estado}%`)
  }
  if (filters.search) {
    query = query.or(
      `nombre.ilike.%${filters.search}%,apellido.ilike.%${filters.search}%,telefono.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query
  if (error) {
    console.log("[v0] Error fetching calls:", error.message)
    throw error
  }
  return (data as AiCall[]) || []
}

export function useCalls(filters: CallsFilters) {
  const key = ["calls", JSON.stringify(filters)]
  return useSWR(key, () => fetchCalls(filters), {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  })
}
