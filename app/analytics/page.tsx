"use client"

import useSWR from "swr"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
  "hsl(var(--muted-foreground))",
]

async function fetchAnalytics() {
  const { data: calls } = await supabase
    .from("ai_calls")
    .select("estado, created_at, nombre")

  const allCalls = calls || []

  // Estado distribution
  const estadoCounts: Record<string, number> = {}
  const hourCounts: Record<number, number> = {}
  const dailyCounts: Record<string, number> = {}

  for (const call of allCalls) {
    // Estado
    const estado = call.estado || "Sin estado"
    estadoCounts[estado] = (estadoCounts[estado] || 0) + 1

    // Hour distribution
    if (call.created_at) {
      const hour = new Date(call.created_at).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    }

    // Daily for last 30 days
    if (call.created_at) {
      const day = call.created_at.split("T")[0]
      dailyCounts[day] = (dailyCounts[day] || 0) + 1
    }
  }

  const estadoData = Object.entries(estadoCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  const hourData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    llamadas: hourCounts[i] || 0,
  }))

  // Last 14 days trend
  const dailyData: Array<{ date: string; llamadas: number }> = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    dailyData.push({
      date: d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
      llamadas: dailyCounts[key] || 0,
    })
  }

  return {
    estadoData,
    hourData,
    dailyData,
    totalCalls: allCalls.length,
  }
}

export default function AnalyticsPage() {
  const { data, isLoading, mutate } = useSWR("analytics", fetchAnalytics, {
    refreshInterval: 60000,
  })

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Analytics"
        description="Estadisticas detalladas de las llamadas IA"
        onRefresh={() => mutate()}
        isRefreshing={isLoading}
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[250px] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !data || data.totalCalls === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-sm">
                No hay datos suficientes para mostrar analiticas
              </p>
              <p className="text-xs mt-1">
                Los graficos apareceran cuando se registren llamadas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Distribucion por Estado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.estadoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {data.estadoData.map((_entry, index) => (
                        <Cell
                          key={`estado-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tendencia Ultimos 14 Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.dailyData} barCategoryGap="20%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      interval={1}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="llamadas"
                      name="Llamadas"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hour Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">
                  Llamadas por Hora del Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.hourData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      interval={2}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="llamadas"
                      name="Llamadas"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
