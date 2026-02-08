"use client"

import { useState } from "react"
import { Phone, Search, X } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useCalls } from "@/lib/hooks/use-calls-data"
import type { AiCall } from "@/lib/types"

function getEstadoBadge(estado: string | null) {
  if (!estado) return { label: "Sin estado", variant: "outline" as const }
  const lower = estado.toLowerCase()
  if (lower.includes("reserva confirmada"))
    return { label: estado, variant: "default" as const }
  if (lower.includes("cancel"))
    return { label: estado, variant: "destructive" as const }
  return { label: estado, variant: "secondary" as const }
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function CallsPage() {
  const [search, setSearch] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")

  const {
    data: calls,
    isLoading,
    mutate,
  } = useCalls({
    search: search || undefined,
    estado: estadoFilter !== "all" ? estadoFilter : undefined,
  })

  const hasActiveFilters = search !== "" || estadoFilter !== "all"

  function clearFilters() {
    setSearch("")
    setEstadoFilter("all")
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Llamadas"
        description="Historial completo de llamadas IA"
        onRefresh={() => mutate()}
        isRefreshing={isLoading}
      />
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, telefono o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="reserva confirmada">Reserva confirmada</SelectItem>
                  <SelectItem value="cancel">Cancelacion</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calls Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !calls || calls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Phone className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No se encontraron llamadas</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Nombre</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="pr-6">Call ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call: AiCall) => {
                    const badge = getEstadoBadge(call.estado)
                    const displayPhone = call.apellido || call.telefono || "--"
                    return (
                      <TableRow key={call.id}>
                        <TableCell className="pl-6">
                          <p className="text-sm font-medium text-foreground">
                            {call.nombre || "Desconocido"}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {displayPhone}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {call.email || "--"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(call.created_at)}
                        </TableCell>
                        <TableCell className="pr-6 text-sm text-muted-foreground font-mono text-xs">
                          {call.call_id ? call.call_id.slice(0, 12) + "..." : "--"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
