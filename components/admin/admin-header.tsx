"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, LogOut, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const breadcrumbMap: Record<string, string> = {
  admin: "Painel Administrativo",
  times: "Times",
  jogadores: "Jogadores",
  conquistas: "Conquistas",
  banners: "Banners",
  secoes: "Seções",
  parceiros: "Parceiros",
  partidas: "Partidas",
  backup: "Backup",
  usuarios: "Usuários",
  configuracoes: "Configurações",
  "links-jogos": "Links dos Jogos",
  novo: "Novo",
  editar: "Editar",
}

export function AdminHeader() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

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
    }
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-sm border-b border-border hidden lg:block">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Galorys */}
        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-transparent border-2 border-galorys-purple p-0.5 flex items-center justify-center">
            <img src="/images/logo/logo_g.png" alt="Galorys" className="w-4 h-4 object-contain" />
          </div>
          <img src="/images/logo/logo_galorys.png" alt="Galorys" className="h-5 w-auto" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>
          <Link href="/times" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Times
          </Link>
          <Link href="/jogadores" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Jogadores
          </Link>
          <Link href="/conquistas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Conquistas
          </Link>
          <Link href="/wallpapers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Wallpapers
          </Link>
          <Link href="/roblox" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Roblox
          </Link>
          <Link href="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sobre
          </Link>
          <Link href="/contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

export function AdminBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <div className="flex items-center gap-2 text-sm">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const isLast = index === segments.length - 1
        const label = breadcrumbMap[segment] || segment

        return (
          <div key={segment} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
