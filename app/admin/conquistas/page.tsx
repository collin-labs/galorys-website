"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Trophy, Pencil, Trash2, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/admin/status-badge"
import { cn } from "@/lib/utils"

// Placement badges
const placementStyles: Record<string, string> = {
  "1º": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "2º": "bg-gray-400/20 text-gray-300 border-gray-400/30",
  "TOP 4": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "TOP 8": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Classificado: "bg-green-500/20 text-green-400 border-green-500/30",
  Recorde: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Marco Histórico": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "1º Lugar": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "2º Lugar": "bg-gray-400/20 text-gray-300 border-gray-400/30",
  "3º Lugar": "bg-orange-500/20 text-orange-400 border-orange-500/30",
}

// Interface para os dados da conquista
interface Achievement {
  id: string
  title: string
  description: string | null
  placement: string
  tournament: string
  date: string
  featured: boolean
  active: boolean
  team: {
    id: string
    name: string
    game: string
  }
}

export default function ConquistasPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Buscar conquistas do banco de dados
  useEffect(() => {
    async function fetchAchievements() {
      try {
        const response = await fetch('/api/admin/achievements')
        const data = await response.json()
        setAchievements(data.achievements || [])
      } catch (error) {
        console.error('Erro ao buscar conquistas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(search.toLowerCase()) ||
      achievement.team.name.toLowerCase().includes(search.toLowerCase()) ||
      (achievement.description && achievement.description.toLowerCase().includes(search.toLowerCase())),
  )

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conquista?")) {
      try {
        const response = await fetch(`/api/admin/achievements/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setAchievements(achievements.filter((a) => a.id !== id))
        }
      } catch (error) {
        console.error('Erro ao excluir conquista:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerenciar Conquistas</h1>
              <p className="text-sm text-muted-foreground">{achievements.length} conquistas cadastradas</p>
            </div>
          </div>
        </div>
        <Link href="/admin/conquistas/novo">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> Nova Conquista
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar conquistas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
      /* Table */
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Conquista</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Colocação</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAchievements.map((achievement) => (
              <tr key={achievement.id} className="bg-card hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{achievement.title}</p>
                        {achievement.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{achievement.description || achievement.tournament}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{achievement.team.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border",
                      placementStyles[achievement.placement] || "bg-gray-500/20 text-gray-400 border-gray-500/30",
                    )}
                  >
                    {achievement.placement}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(achievement.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={achievement.active ? "active" : "hidden"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/conquistas/${achievement.id}/editar`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(achievement.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}
