"use client"

import { Phone, List } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { AiCall } from "@/lib/types"

interface RecentCallsTableProps {
  calls?: AiCall[]
  isLoading: boolean
}

function getEstadoBadge(estado: string | null) {
  if (!estado) return { label: "Sin estado", variant: "outline" as const }
  const lower = estado.toLowerCase()
  if (lower.includes("reserva confirmada"))
    return { label: estado, variant: "default" as const }
  if (lower.includes("cancel"))
    return { label: estado, variant: "destructive" as const }
  return { label: estado, variant: "secondary" as const }
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function RecentCallsTable({ calls, isLoading }: RecentCallsTableProps) {
  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Llamadas Recientes</CardTitle>
          <CardDescription>Ultimas 10 llamadas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <List className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Llamadas Recientes</CardTitle>
            <CardDescription>Ultimas 10 llamadas registradas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!calls || calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
            <List className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay llamadas registradas</p>
            <p className="text-xs mt-1">Las llamadas apareceran aqui automaticamente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {calls.map((call) => {
              const badge = getEstadoBadge(call.estado)
              const displayPhone = call.apellido || call.telefono || "--"
              return (
                <div
                  key={call.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-card border border-border">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {call.nombre || "Desconocido"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {displayPhone}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatTime(call.created_at)}
                    </p>
                  </div>
                  <Badge variant={badge.variant} className="text-xs shrink-0">
                    {badge.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
