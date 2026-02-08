"use client"

import React from "react"
import { RefreshCw, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  description?: string
  onRefresh?: () => void
  isRefreshing?: boolean
  children?: React.ReactNode
}

export function Header({
  title,
  description,
  onRefresh,
  isRefreshing,
  children,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between bg-card px-6 py-5 border-b border-border/60">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          <Circle className="w-2 h-2 fill-success text-success" />
          Conectado
        </div>
        {children}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-lg bg-transparent"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5 mr-1.5", isRefreshing && "animate-spin")}
            />
            Actualizar
          </Button>
        )}
      </div>
    </div>
  )
}
