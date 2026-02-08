"use client"

import { useState } from "react"
import useSWR from "swr"
import { Search, Phone, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

interface CustomerSummary {
  nombre: string
  telefono: string
  email: string | null
  totalLlamadas: number
  ultimaLlamada: string
  estados: string[]
}

async function fetchCustomerSummary(search?: string): Promise<CustomerSummary[]> {
  let query = supabase
    .from("ai_calls")
    .select("nombre, apellido, telefono, email, estado, created_at")
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,apellido.ilike.%${search}%,telefono.ilike.%${search}%,email.ilike.%${search}%`
    )
  }

  const { data, error } = await query
  if (error) throw error

  // Group by phone (apellido field holds the phone in most cases)
  const grouped: Record<string, CustomerSummary> = {}
  for (const row of data || []) {
    const phone = row.apellido || row.telefono || "desconocido"
    if (!grouped[phone]) {
      grouped[phone] = {
        nombre: row.nombre || "Desconocido",
        telefono: phone,
        email: row.email,
        totalLlamadas: 0,
        ultimaLlamada: row.created_at,
        estados: [],
      }
    }
    grouped[phone].totalLlamadas++
    if (row.estado && !grouped[phone].estados.includes(row.estado)) {
      grouped[phone].estados.push(row.estado)
    }
    if (!row.email && grouped[phone].email === null) {
      grouped[phone].email = row.email
    }
  }

  return Object.values(grouped).sort((a, b) => b.totalLlamadas - a.totalLlamadas)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function CustomersPage() {
  const [search, setSearch] = useState("")
  const { data: customers, isLoading, mutate } = useSWR(
    ["customers", search],
    () => fetchCustomerSummary(search || undefined),
    { refreshInterval: 30000, revalidateOnFocus: true }
  )

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Clientes"
        description="Clientes agrupados por telefono desde llamadas IA"
        onRefresh={() => mutate()}
        isRefreshing={isLoading}
      />
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, telefono o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : !customers || customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Users className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No se encontraron clientes</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Cliente</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Llamadas</TableHead>
                    <TableHead>Estados</TableHead>
                    <TableHead className="pr-6">Ultima Llamada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.telefono}>
                      <TableCell className="pl-6">
                        <p className="text-sm font-medium text-foreground">
                          {customer.nombre}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {customer.telefono}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.email || "--"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{customer.totalLlamadas}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.estados.map((estado) => (
                            <Badge key={estado} variant="outline" className="text-xs">
                              {estado}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-sm text-muted-foreground">
                        {formatDate(customer.ultimaLlamada)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
