"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Gamepad2,
  Trophy,
  ImageIcon,
  MessageSquare,
  Layers,
  Gift,
  ShoppingBag,
  Database,
  UserCog,
  Settings,
  LogOut,
  ExternalLink,
  Handshake,
  FileText,
  Calendar,
  Layout,
  Loader2,
  Joystick,
  Link2,
  Crown,
  Star,
  PanelBottom,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Link2, label: "Links Jogos", href: "/admin/links-jogos" },
  { icon: Joystick, label: "Jogos", href: "/admin/jogos" },
  { icon: Gamepad2, label: "Times", href: "/admin/times" },
  { icon: Crown, label: "Times de Elite", href: "/admin/times-elite" },
  { icon: Users, label: "Jogadores", href: "/admin/jogadores" },
  { icon: Star, label: "Jogadores Destaque", href: "/admin/jogadores-destaque" },
  { icon: Trophy, label: "Conquistas", href: "/admin/conquistas" },
  { icon: Menu, label: "Menu", href: "/admin/menu" },
  { icon: PanelBottom, label: "Rodapé", href: "/admin/rodape" },
  { icon: Layers, label: "Seções", href: "/admin/secoes" },
  { icon: Handshake, label: "Parceiros", href: "/admin/parceiros" },
  { icon: Calendar, label: "Partidas", href: "/admin/partidas" },
  { icon: MessageSquare, label: "Mensagens", href: "/admin/mensagens" },
  { icon: Database, label: "Backup", href: "/admin/backup" },
  { icon: UserCog, label: "Usuários", href: "/admin/usuarios" },
  { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
]

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setLoggingOut(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm">GALORYS</h1>
              <p className="text-[10px] text-galorys-purple">Admin Panel</p>
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border z-50 overflow-y-auto"
            >
              {/* Logo */}
              <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div>
                  <h1 className="font-bold text-foreground text-sm">GALORYS</h1>
                  <p className="text-[10px] text-galorys-purple">Admin Panel</p>
                </div>
                <Link
                  href="/"
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Navigation */}
              <nav className="py-4 px-2">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive =
                      pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                            isActive
                              ? "bg-primary/20 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* User */}
              <div className="border-t border-border p-4 mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-9 h-9 bg-gradient-to-br from-galorys-purple to-galorys-pink">
                    <AvatarFallback className="bg-transparent text-white text-sm">A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">Admin</p>
                    <p className="text-xs text-galorys-purple">Administrador</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors w-full px-1"
                >
                  {loggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>{loggingOut ? 'Saindo...' : 'Sair'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
