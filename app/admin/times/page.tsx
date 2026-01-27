"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Gamepad2, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/admin/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pagination } from "@/components/admin/pagination"
import { SkeletonTable } from "@/components/admin/skeleton"
import { SortableHeader, SortDirection } from "@/components/admin/sortable-header"

// Interface para os dados do time
interface Team {
  id: string
  name: string
  slug: string
  game: string
  active: boolean
  _count: {
    players: number
    achievements: number
  }
}

const ITEMS_PER_PAGE = 10

export default function TimesPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Buscar times do banco de dados
  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch('/api/admin/teams')
        const data = await response.json()
        setTeams(data.teams || [])
      } catch (error) {
        console.error('Erro ao buscar times:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) || team.game.toLowerCase().includes(search.toLowerCase()),
  )

  // Ordenação
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (!sortField || !sortDirection) return 0
    
    let aValue: any = a[sortField as keyof Team]
    let bValue: any = b[sortField as keyof Team]
    
    // Campos especiais (_count)
    if (sortField === "players") {
      aValue = a._count.players
      bValue = b._count.players
    } else if (sortField === "achievements") {
      aValue = a._count.achievements
      bValue = b._count.achievements
    }
    
    if (aValue == null) return 1
    if (bValue == null) return -1
    
    if (typeof aValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue, "pt-BR")
        : bValue.localeCompare(aValue, "pt-BR")
    }
    
    if (typeof aValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
    
    if (typeof aValue === "boolean") {
      return sortDirection === "asc" 
        ? (aValue === bValue ? 0 : aValue ? -1 : 1)
        : (aValue === bValue ? 0 : aValue ? 1 : -1)
    }
    
    return 0
  })

  // Reset página quando busca muda
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Paginação
  const totalPages = Math.ceil(sortedTeams.length / ITEMS_PER_PAGE)
  const paginatedTeams = sortedTeams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este time?")) {
      try {
        const response = await fetch(`/api/admin/teams/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setTeams(teams.filter((team) => team.id !== id))
        }
      } catch (error) {
        console.error('Erro ao excluir time:', error)
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
            <Gamepad2 className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerenciar Times</h1>
              <p className="text-sm text-muted-foreground">{teams.length} times cadastrados</p>
            </div>
          </div>
        </div>
        <Link href="/admin/times/novo">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> Novo Time
          </Button>
        </Link>
      </div>

      {/* Search - Using theme-aware colors */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar times..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
      /* Table - Using theme-aware colors */
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3">
                <SortableHeader 
                  label="Time" 
                  field="name" 
                  currentSort={sortField} 
                  currentDirection={sortDirection} 
                  onSort={handleSort} 
                />
              </th>
              <th className="px-4 py-3">
                <SortableHeader 
                  label="Jogo" 
                  field="game" 
                  currentSort={sortField} 
                  currentDirection={sortDirection} 
                  onSort={handleSort} 
                />
              </th>
              <th className="px-4 py-3">
                <SortableHeader 
                  label="Jogadores" 
                  field="players" 
                  currentSort={sortField} 
                  currentDirection={sortDirection} 
                  onSort={handleSort}
                  align="center"
                />
              </th>
              <th className="px-4 py-3">
                <SortableHeader 
                  label="Conquistas" 
                  field="achievements" 
                  currentSort={sortField} 
                  currentDirection={sortDirection} 
                  onSort={handleSort}
                  align="center"
                />
              </th>
              <th className="px-4 py-3">
                <SortableHeader 
                  label="Status" 
                  field="active" 
                  currentSort={sortField} 
                  currentDirection={sortDirection} 
                  onSort={handleSort} 
                />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedTeams.map((team) => (
              <tr key={team.id} className="bg-card hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-muted">
                      <AvatarFallback className="bg-muted text-foreground text-xs">
                        {team.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{team.name}</p>
                      <p className="text-xs text-muted-foreground">/{team.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{team.game}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
                    {team._count.players}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                    {team._count.achievements}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={team.active ? "active" : "hidden"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/times/${team.id}/editar`}>
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
                      onClick={() => handleDelete(team.id)}
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
      {sortedTeams.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedTeams.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
      )}
    </div>
  )
}
