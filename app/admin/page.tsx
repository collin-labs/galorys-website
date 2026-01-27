"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Gamepad2,
  Users,
  Trophy,
  Mail,
  TrendingUp,
  MonitorPlay,
  Handshake,
  ArrowLeft,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"
import { ContentCard } from "@/components/admin/content-card"
import { BackupStatusWidget } from "@/components/admin/backup-status-widget"

// Interface para os dados da API
interface DashboardStats {
  users: number
  teams: number
  teamsActive: number
  players: number
  playersActive: number
  achievements: number
  achievementsActive: number
  matches: number
  partners: number
  news: number
  banners: number
  wallpapers: number
  newsletter: number
  contacts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Buscar estatísticas da API
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Valores padrão enquanto carrega
  const data = stats || {
    users: 0,
    teams: 0,
    teamsActive: 0,
    players: 0,
    playersActive: 0,
    achievements: 0,
    achievementsActive: 0,
    matches: 0,
    partners: 0,
    news: 0,
    banners: 0,
    wallpapers: 0,
    newsletter: 0,
    contacts: 0,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-transparent border-2 border-galorys-purple p-1 flex items-center justify-center">
            <img src="/images/logo/logo_g.png" alt="Galorys" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Galorys eSports</p>
          </div>
        </div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar ao site
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard 
          icon={Gamepad2} 
          label="Times Ativos" 
          value={loading ? "..." : data.teamsActive} 
          subtitle={loading ? "" : `de ${data.teams} total`} 
          iconColor="text-blue-400" 
        />
        <StatCard 
          icon={Users} 
          label="Jogadores Ativos" 
          value={loading ? "..." : data.playersActive} 
          iconColor="text-purple-400" 
        />
        <StatCard 
          icon={Trophy} 
          label="Conquistas" 
          value={loading ? "..." : data.achievementsActive} 
          iconColor="text-yellow-400" 
        />
        <StatCard 
          icon={Mail} 
          label="Newsletter" 
          value={loading ? "..." : data.newsletter} 
          iconColor="text-pink-400" 
        />
      </div>

      {/* Content Management - 6 Cards em Grid Bonito */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" /> Gerenciar Conteúdo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ContentCard
            icon={Gamepad2}
            label="Times"
            count={loading ? 0 : data.teams}
            href="/admin/times"
            iconBgColor="bg-orange-500/20"
            iconColor="text-orange-400"
          />
          <ContentCard
            icon={Users}
            label="Jogadores"
            count={loading ? 0 : data.players}
            href="/admin/jogadores"
            iconBgColor="bg-purple-500/20"
            iconColor="text-purple-400"
          />
          <ContentCard
            icon={Trophy}
            label="Conquistas"
            count={loading ? 0 : data.achievements}
            href="/admin/conquistas"
            iconBgColor="bg-green-500/20"
            iconColor="text-green-400"
          />
          <ContentCard
            icon={MonitorPlay}
            label="Partidas"
            count={loading ? 0 : data.matches}
            href="/admin/partidas"
            iconBgColor="bg-blue-500/20"
            iconColor="text-blue-400"
          />
          <ContentCard
            icon={Handshake}
            label="Parceiros"
            count={loading ? 0 : data.partners}
            href="/admin/parceiros"
            iconBgColor="bg-cyan-500/20"
            iconColor="text-cyan-400"
          />
          <ContentCard
            icon={ImageIcon}
            label="Wallpapers"
            count={loading ? 0 : data.wallpapers}
            href="/admin/wallpapers"
            iconBgColor="bg-indigo-500/20"
            iconColor="text-indigo-400"
          />
        </div>
      </div>

      {/* Resumo e Backup - Layout lado a lado em desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resumo Geral - Card Robusto */}
        <div className="bg-gradient-to-br from-card to-card/80 border border-border rounded-2xl overflow-hidden shadow-lg">
          {/* Header com gradiente */}
          <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-r from-pink-500/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Resumo Geral</h3>
                  <p className="text-xs text-muted-foreground">Visão rápida do sistema</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-5 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background/50 rounded-xl p-3 border border-border/50 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{loading ? "..." : data.contacts}</p>
                <p className="text-xs text-muted-foreground">Contatos</p>
              </div>
              <div className="bg-background/50 rounded-xl p-3 border border-border/50 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{loading ? "..." : data.newsletter}</p>
                <p className="text-xs text-muted-foreground">Newsletter</p>
              </div>
              <div className="bg-background/50 rounded-xl p-3 border border-border/50 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-lg font-bold text-foreground">{loading ? "..." : data.users}</p>
                <p className="text-xs text-muted-foreground">Usuários</p>
              </div>
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between py-3 px-4 bg-background/30 rounded-xl border border-border/30">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-foreground">{loading ? "..." : data.teams} times</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-foreground">{loading ? "..." : data.players} jogadores</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-foreground">{loading ? "..." : data.achievements} conquistas</span>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-xs text-green-400 font-medium">
                  {loading ? "..." : data.teamsActive} times ativos
                </span>
              </div>
              <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <span className="text-xs text-blue-400 font-medium">
                  {loading ? "..." : data.news} notícias
                </span>
              </div>
              <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <span className="text-xs text-purple-400 font-medium">
                  {loading ? "..." : data.partners} parceiros
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Status */}
        <BackupStatusWidget />
      </div>
    </div>
  )
}
