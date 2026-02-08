// Database types matching Supabase "ai_calls" table (llamadas ai)

export interface AiCall {
  id: string
  call_id: string | null
  nombre: string | null
  apellido: string | null
  telefono: string | null
  email: string | null
  estado: string | null
  created_at: string
  updated_at: string
}

// Dashboard KPI types
export interface DashboardKPIs {
  totalCalls: number
  reservasConfirmadas: number
  cancelaciones: number
  otros: number
}
