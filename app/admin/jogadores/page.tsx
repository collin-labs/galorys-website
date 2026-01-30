"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Users, Pencil, Trash2, Gamepad2, AlertTriangle, X } from "lucide-react"
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

// Modal de confirmação estilizado
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  confirmVariant: "danger" | "warning" | "success"
  loading?: boolean
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText, confirmVariant, loading }: ConfirmModalProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    success: "bg-green-600 hover:bg-green-700",
  }

  const iconColors = {
    danger: "text-red-500",
    warning: "text-yellow-500",
    success: "text-green-500",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-[#14141b] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full bg-white/5 flex items-center justify-center ${iconColors[confirmVariant]}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-white/10 hover:bg-white/5"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 text-white ${variantStyles[confirmVariant]}`}
          >
            {loading ? "Aguarde..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

const ITEMS_PER_PAGE = 10

export default function JogadoresPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Estado do modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<"toggle" | "delete" | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Buscar jogadores do banco de dados
  useEffect(() => {
    fetchPlayers()
  }, [])

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

  // Abrir modal para toggle de status
  const openToggleModal = (player: Player) => {
    setSelectedPlayer(player)
    setModalAction("toggle")
    setModalOpen(true)
  }

  // Abrir modal para deletar
  const openDeleteModal = (player: Player) => {
    setSelectedPlayer(player)
    setModalAction("delete")
    setModalOpen(true)
  }

  // Confirmar toggle de status
  const handleToggleStatus = async () => {
    if (!selectedPlayer) return
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/players/${selectedPlayer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !selectedPlayer.active })
      })
      
      if (response.ok) {
        // Atualizar lista local
        setPlayers(players.map(p => 
          p.id === selectedPlayer.id 
            ? { ...p, active: !p.active } 
            : p
        ))
        setModalOpen(false)
      } else {
        alert('Erro ao alterar status do jogador')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao alterar status do jogador')
    } finally {
      setActionLoading(false)
    }
  }

  // Confirmar exclusão
  const handleDelete = async () => {
    if (!selectedPlayer) return
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/players/${selectedPlayer.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setPlayers(players.filter((player) => player.id !== selectedPlayer.id))
        setModalOpen(false)
      } else {
        alert('Erro ao excluir jogador')
      }
    } catch (error) {
      console.error('Erro ao excluir jogador:', error)
      alert('Erro ao excluir jogador')
    } finally {
      setActionLoading(false)
    }
  }

  // Fechar modal
  const closeModal = () => {
    setModalOpen(false)
    setSelectedPlayer(null)
    setModalAction(null)
  }

  return (
    <div className="space-y-6">
      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={modalOpen && modalAction === "toggle"}
        onClose={closeModal}
        onConfirm={handleToggleStatus}
        title={selectedPlayer?.active ? "Inativar Jogador" : "Ativar Jogador"}
        message={
          selectedPlayer?.active
            ? `Tem certeza que deseja inativar "${selectedPlayer?.nickname}"? O jogador não aparecerá mais no site público.`
            : `Deseja ativar "${selectedPlayer?.nickname}"? O jogador voltará a aparecer no site público.`
        }
        confirmText={selectedPlayer?.active ? "Sim, Inativar" : "Sim, Ativar"}
        confirmVariant={selectedPlayer?.active ? "warning" : "success"}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={modalOpen && modalAction === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Excluir Jogador"
        message={`Tem certeza que deseja excluir "${selectedPlayer?.nickname}" permanentemente? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Excluir"
        confirmVariant="danger"
        loading={actionLoading}
      />

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
                  {/* Status Badge Clicável */}
                  <button
                    onClick={() => openToggleModal(player)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    title={player.active ? "Clique para inativar" : "Clique para ativar"}
                  >
                    <StatusBadge status={player.active ? "active" : "hidden"} />
                  </button>
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
                      onClick={() => openDeleteModal(player)}
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
