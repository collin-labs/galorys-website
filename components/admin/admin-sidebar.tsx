"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Trophy,
  Layers,
  Database,
  UserCog,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Handshake,
  Calendar,
  Link2,
  Crown,
  Star,
  Menu,
  PanelBottom,
  MessageSquare,
  Joystick,
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

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-1.5 px-4 h-16 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-transparent border-2 border-galorys-purple p-0.5 flex items-center justify-center">
          <img
            src="/images/logo/logo_g.png"
            alt="Galorys"
            className="w-4 h-4 object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <img
            src="/images/logo/logo_galorys.png"
            alt="Galorys"
            className="h-4 w-auto"
          />
          <p className="text-[9px] text-galorys-purple font-medium">Admin Panel</p>
        </div>
        <Link href="/" className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
          Site <ExternalLink className="w-2.5 h-2.5" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-9 h-9 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">B</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Bruno</p>
            <p className="text-xs text-orange-500">Administrador</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-1">
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
