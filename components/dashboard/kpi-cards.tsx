"use client"

import {
  Phone,
  CalendarCheck,
  XCircle,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardKPIs } from "@/lib/types"

interface KPICardsProps {
  data?: DashboardKPIs
  isLoading: boolean
}

const kpiConfig = [
  {
    key: "totalCalls" as const,
    label: "Total Llamadas",
    icon: Phone,
    format: (v: number) => v.toString(),
    color: "hsl(var(--primary))",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    key: "reservasConfirmadas" as const,
    label: "Reservas Confirmadas",
    icon: CalendarCheck,
    format: (v: number) => v.toString(),
    color: "hsl(var(--success))",
    bgColor: "bg-success/10",
    textColor: "text-success",
  },
  {
    key: "cancelaciones" as const,
    label: "Cancelaciones",
    icon: XCircle,
    format: (v: number) => v.toString(),
    color: "hsl(var(--destructive))",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
  },
  {
    key: "otros" as const,
    label: "Otros Estados",
    icon: MoreHorizontal,
    format: (v: number) => v.toString(),
    color: "hsl(var(--warning))",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
  },
]

export function KPICards({ data, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-5">
              <Skeleton className="h-3 w-20 mb-4" />
              <Skeleton className="h-8 w-14 mb-2" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiConfig.map((kpi) => {
        const value = data ? data[kpi.key] : 0
        return (
          <Card
            key={kpi.key}
            className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ backgroundColor: kpi.color }}
            />
            <CardContent className="p-5 pl-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </span>
                <div className={`p-1.5 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`w-3.5 h-3.5 ${kpi.textColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {kpi.format(value)}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
