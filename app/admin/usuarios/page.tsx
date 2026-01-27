"use client"

import { useState, useEffect } from "react"
import { UserCog, Search, Star, Ban, Shield, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/admin/status-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface User {
  id: string
  name: string | null
  email: string | null
  points: number
  role: string
  banned: boolean
  createdAt: string
  image: string | null
}

interface Stats {
  total: number
  admins: number
  banned: number
}

const filters = ["Todos", "Admins", "Usuários", "Banidos"]

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, admins: 0, banned: 0 })
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal de pontos
  const [pointsModal, setPointsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [pointsToAdd, setPointsToAdd] = useState("")
  const [pointsReason, setPointsReason] = useState("")

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setStats(data.stats || { total: 0, admins: 0, banned: 0 })
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUsers()
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
      (user.email?.toLowerCase() || '').includes(search.toLowerCase())
    if (activeFilter === "Todos") return matchesSearch
    if (activeFilter === "Admins") return matchesSearch && user.role === "ADMIN"
    if (activeFilter === "Usuários") return matchesSearch && user.role === "USER"
    if (activeFilter === "Banidos") return matchesSearch && user.banned === true
    return matchesSearch
  })

  const handleToggleAdmin = async (user: User) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    const action = newRole === 'ADMIN' ? 'promover a Admin' : 'remover de Admin'
    
    if (!confirm(`Deseja ${action} o usuário ${user.name || user.email}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        toast.success(`Usuário ${newRole === 'ADMIN' ? 'promovido a Admin' : 'removido de Admin'}`)
        fetchUsers()
      } else {
        throw new Error('Erro ao atualizar')
      }
    } catch (error) {
      toast.error('Erro ao atualizar usuário')
    }
  }

  const handleToggleBan = async (user: User) => {
    const action = user.banned ? 'desbanir' : 'banir'
    
    if (!confirm(`Deseja ${action} o usuário ${user.name || user.email}?`)) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned: !user.banned })
      })

      if (response.ok) {
        toast.success(`Usuário ${user.banned ? 'desbanido' : 'banido'} com sucesso`)
        fetchUsers()
      } else {
        throw new Error('Erro ao atualizar')
      }
    } catch (error) {
      toast.error('Erro ao atualizar usuário')
    }
  }

  const openPointsModal = (user: User) => {
    setSelectedUser(user)
    setPointsToAdd("")
    setPointsReason("")
    setPointsModal(true)
  }

  const handleAddPoints = async () => {
    if (!selectedUser || !pointsToAdd) return

    const points = parseInt(pointsToAdd)
    if (isNaN(points)) {
      toast.error('Digite um número válido')
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          addPoints: points,
          reason: pointsReason || 'Pontos adicionados pelo admin'
        })
      })

      if (response.ok) {
        toast.success(`${points > 0 ? '+' : ''}${points} pontos adicionados`)
        setPointsModal(false)
        fetchUsers()
      } else {
        throw new Error('Erro ao adicionar pontos')
      }
    } catch (error) {
      toast.error('Erro ao adicionar pontos')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <UserCog className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Usuários</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{stats.total} usuários cadastrados</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-border text-foreground"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats - Using theme-aware colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <UserCog className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Ban className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.banned}</p>
            <p className="text-sm text-muted-foreground">Banidos</p>
          </div>
        </div>
      </div>

      {/* Search and Filters - Using theme-aware colors */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter ? "bg-primary" : "border-border text-muted-foreground hover:text-foreground"
              }
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Table - Using theme-aware colors */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <UserCog className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Usuário</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Pontos</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Cadastro</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-500/20 text-purple-400">
                          {(user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground font-medium">{user.name || 'Sem nome'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{user.email || '-'}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-yellow-400 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4" /> {user.points}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={user.banned ? "inactive" : "active"} />
                  </td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openPointsModal(user)}
                        className="p-1.5 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition-colors"
                        title="Dar pontos"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleAdmin(user)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.role === 'ADMIN' 
                            ? 'hover:bg-purple-500/20 text-purple-400' 
                            : 'hover:bg-gray-500/20 text-gray-400'
                        }`}
                        title={user.role === 'ADMIN' ? 'Remover admin' : 'Tornar admin'}
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleBan(user)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.banned 
                            ? 'hover:bg-green-500/20 text-green-400' 
                            : 'hover:bg-red-500/20 text-red-400'
                        }`}
                        title={user.banned ? 'Desbanir' : 'Banir'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Pontos */}
      <Dialog open={pointsModal} onOpenChange={setPointsModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Adicionar Pontos
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Usuário</p>
                <p className="text-foreground font-medium">{selectedUser.name || selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">Pontos atuais: {selectedUser.points}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points" className="text-foreground">Quantidade de Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="Ex: 100 ou -50"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground">Use números negativos para remover pontos</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-foreground">Motivo (opcional)</Label>
                <Input
                  id="reason"
                  placeholder="Ex: Bônus de participação"
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPointsModal(false)}
                  className="flex-1 border-border text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddPoints}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={!pointsToAdd}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
