"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LayoutDashboard, Heart, Gift, Settings, LogOut, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Favoritos", href: "/dashboard/favoritos", icon: Heart },
  { name: "Recompensas", href: "/dashboard/recompensas", icon: Gift },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
]

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

export function DashboardMobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header - Substituindo bg-[#0A0A0F] por bg-card */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center text-white font-bold">
              {userData.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground text-sm">{userData.name}</span>
                {userData.badges.map((badge, i) => (
                  <BadgeIcon key={i} type={badge} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400">{userData.points} pontos</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Substituindo bg-[#0A0A0F] por bg-card */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 top-[120px]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-[120px] bottom-0 w-[280px] bg-card border-r border-border z-50 overflow-y-auto"
            >
              <nav className="p-3 space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.href, item.exact)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all",
                        active
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="p-3 border-t border-border mt-auto">
                <button className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
