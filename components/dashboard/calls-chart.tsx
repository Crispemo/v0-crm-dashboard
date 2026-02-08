"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"

interface CallsChartProps {
  data?: Array<{ date: string; calls: number; completed: number }>
  isLoading: boolean
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" })
}

export function CallsChart({ data, isLoading }: CallsChartProps) {
  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Llamadas - Ultimos 7 dias</CardTitle>
          <CardDescription>Volumen de llamadas diarias</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const chartData = (data || []).map((d, index) => ({
    ...d,
    index,
    dateFormatted: formatDate(d.date),
    noCompletadas: d.calls - d.completed,
  }))

  const hasData = chartData.some((d) => d.calls > 0)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Llamadas - Ultimos 7 dias</CardTitle>
            <CardDescription>Volumen de llamadas diarias</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
            <BarChart3 className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">Sin datos disponibles</p>
            <p className="text-xs mt-1">Las llamadas apareceran aqui cuando se registren</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barCategoryGap="25%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="dateFormatted"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Bar
                dataKey="completed"
                name="Completadas"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry) => (
                  <Cell key={`completed-${entry.index}`} />
                ))}
              </Bar>
              <Bar
                dataKey="noCompletadas"
                name="No completadas"
                fill="hsl(var(--muted-foreground))"
                opacity={0.3}
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry) => (
                  <Cell key={`failed-${entry.index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
