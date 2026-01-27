"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Plus, Search, Pencil, Trash2, Loader2, Radio, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Match {
  id: string
  team: string
  teamSlug: string
  teamGame: string
  opponent: string
  opponentLogo: string | null
  tournament: string
  date: string
  status: "live" | "upcoming" | "finished"
  streamUrl: string | null
  result: string | null
}

// Formatar data
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-BR", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function PartidasPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  // Buscar partidas da API
  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/matches?limit=50")
      const data = await response.json()
      
      if (data.success) {
        setMatches(data.matches)
      }
    } catch (error) {
      console.error("Erro ao buscar partidas:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar partidas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  // Deletar partida
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta partida?")) return

    try {
      const response = await fetch(`/api/matches?id=${id}`, {
        method: "DELETE"
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Partida removida com sucesso"
        })
        fetchMatches()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao remover partida",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar com o servidor",
        variant: "destructive"
      })
    }
  }

  const filteredMatches = matches.filter((match) => 
    match.opponent.toLowerCase().includes(search.toLowerCase()) ||
    match.team.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Gerenciar Partidas</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{matches.length} partidas cadastradas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchMatches}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Link href="/admin/partidas/novo">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-1" /> Nova Partida
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por time ou adversário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Table */
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Partida</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Data</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma partida encontrada.</p>
                    <p className="text-sm mt-1">Clique em "Nova Partida" para adicionar.</p>
                  </td>
                </tr>
              ) : (
                filteredMatches.map((match) => (
                  <tr key={match.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-foreground font-medium">Galorys vs {match.opponent}</span>
                        <p className="text-xs text-muted-foreground">{match.tournament}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{match.team}</td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">{formatDate(match.date)}</td>
                    <td className="py-4 px-4">
                      {match.status === "live" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
                          <Radio className="w-3 h-3 animate-pulse" />
                          AO VIVO
                        </span>
                      ) : match.status === "upcoming" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-medium">
                          EM BREVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          FINALIZADO
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/partidas/${match.id}/editar`}
                          className="p-1.5 rounded-lg hover:bg-muted text-primary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(match.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
