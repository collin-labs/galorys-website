"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Heart, Gift, Settings, LogOut, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Favoritos",
    href: "/dashboard/favoritos",
    icon: Heart,
  },
  {
    name: "Recompensas",
    href: "/dashboard/recompensas",
    icon: Gift,
  },
  {
    name: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
]

// Mock user data
const userData = {
  name: "Bruno",
  points: 100,
  badges: ["purple", "star"] as const,
  avatar: "B",
}

const BadgeIcon = ({ type }: { type: "purple" | "star" }) => {
  if (type === "purple") {
    return (
      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-purple-300" />
      </div>
    )
  }
  return <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
}

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 lg:top-20 w-[260px] h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] bg-card border-r border-border flex-col z-40">
      {/* User Profile Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center text-white font-bold text-lg">
              {userData.avatar}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground truncate">{userData.name}</span>
              {userData.badges.map((badge, i) => (
                <BadgeIcon key={i} type={badge} />
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">{userData.points} pontos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="px-4 py-3 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">GALORYS</span>
            <span className="text-xs text-primary">Área do Fã</span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group",
                active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="font-medium">{item.name}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}
