"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Database, Globe } from "lucide-react"

export default function SettingsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "No configurado"

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Configuracion"
        description="Estado del sistema y conexiones"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-3xl">
        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4" />
              Conexion a Base de Datos
            </CardTitle>
            <CardDescription>Estado de la conexion con Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado</span>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                Conectado
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">URL</span>
              <span className="text-sm font-mono text-foreground">
                {supabaseUrl.replace("https://", "").split(".")[0]}...
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tabla</span>
              <span className="text-sm text-foreground">
                ai_calls
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Integraciones
            </CardTitle>
            <CardDescription>
              Servicios conectados al sistema CRM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Supabase</p>
                  <p className="text-xs text-muted-foreground">
                    Base de datos en tiempo real
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="w-3 h-3" />
                Activo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Flujo de Datos</CardTitle>
            <CardDescription>
              Como fluye la informacion en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <Badge variant="secondary" className="text-xs">
                Llamada AI
              </Badge>
              <span className="text-muted-foreground">{"-->"}</span>
              <Badge variant="secondary" className="text-xs">
                Supabase DB
              </Badge>
              <span className="text-muted-foreground">{"-->"}</span>
              <Badge className="text-xs">Este Panel</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Los datos se actualizan automaticamente cada 15-60 segundos
              dependiendo de la seccion.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
