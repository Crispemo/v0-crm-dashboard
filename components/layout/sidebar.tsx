"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Phone,
  Users,
  BarChart3,
  Settings,
  Utensils,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Llamadas", href: "/calls", icon: Phone },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Configuracion", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-[260px] min-h-screen bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sidebar-primary shadow-lg shadow-sidebar-primary/25">
          <Utensils className="w-4.5 h-4.5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">
            CRM Restaurante
          </h1>
          <p className="text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-widest">
            Panel de Control
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6">
        <p className="px-3 mb-3 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
          Menu
        </p>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px]", isActive && "drop-shadow-sm")} />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 mx-3 mb-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-3.5 h-3.5 text-sidebar-primary" />
          <p className="text-[11px] font-semibold text-white/80">
            Sistema Activo
          </p>
        </div>
        <p className="text-[10px] text-sidebar-foreground/40">
          Los datos se actualizan automaticamente
        </p>
      </div>
    </aside>
  )
}
