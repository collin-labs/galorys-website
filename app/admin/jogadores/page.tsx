"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Users, Pencil, Trash2, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/admin/status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pagination } from "@/components/admin/pagination"
import { SkeletonTable } from "@/components/admin/skeleton"

// Interface para os dados do jogador
interface Player {
  id: string
  nickname: string
  realName: string | null
  slug: string
  photo: string | null
  role: string | null
  active: boolean
  team: {
    id: string
    name: string
    game: string
  }
}

const ITEMS_PER_PAGE = 10

export default function JogadoresPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Buscar jogadores do banco de dados
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch('/api/admin/players')
        const data = await response.json()
        setPlayers(data.players || [])
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlayers()
  }, [])

  const filteredPlayers = players.filter(
    (player) =>
      player.nickname.toLowerCase().includes(search.toLowerCase()) ||
      (player.realName && player.realName.toLowerCase().includes(search.toLowerCase())) ||
      player.team.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Reset página quando busca muda
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Paginação
  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE)
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este jogador?")) {
      try {
        const response = await fetch(`/api/admin/players/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setPlayers(players.filter((player) => player.id !== id))
        }
      } catch (error) {
        console.error('Erro ao excluir jogador:', error)
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
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerenciar Jogadores</h1>
              <p className="text-sm text-muted-foreground">{players.length} jogadores cadastrados</p>
            </div>
          </div>
        </div>
        <Link href="/admin/jogadores/novo">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> Novo Jogador
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jogadores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
      <>
      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Jogador</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Função</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedPlayers.map((player) => (
              <tr key={player.id} className="bg-card hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={player.photo || "/placeholder.svg"} alt={player.nickname} />
                      <AvatarFallback className="bg-muted text-foreground text-xs">
                        {player.nickname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{player.nickname}</p>
                      <p className="text-xs text-muted-foreground">{player.realName || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-400">{player.team.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{player.role || '-'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={player.active ? "active" : "hidden"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/jogadores/${player.id}/editar`}>
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
                      onClick={() => handleDelete(player.id)}
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

      {/* Paginação */}
      {filteredPlayers.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPlayers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
      </>
      )}
    </div>
  )
}
