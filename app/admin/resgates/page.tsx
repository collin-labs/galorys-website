"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Gift, RefreshCw, ChevronDown, Eye, Check, Truck, Package, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type RedemptionStatus = "pendente" | "processando" | "enviado" | "entregue"
type RewardType = "digital" | "acesso" | "fisico" | "featured"

interface Redemption {
  id: string
  status: RedemptionStatus
  redeemedAt: string
  processedAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  addressStreet: string | null
  addressCity: string | null
  addressState: string | null
  addressZip: string | null
  trackingCode: string | null
  notes: string | null
  user: {
    id: string
    name: string | null
    email: string | null
  }
  reward: {
    id: string
    name: string
    type: string
    image: string | null
    downloadUrl: string | null
  }
}

interface Stats {
  total: number
  pendente: number
  processando: number
  enviado: number
  entregue: number
}

const statusConfig: Record<RedemptionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: <Clock className="w-3 h-3" />,
  },
  processando: {
    label: "Processando",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <RefreshCw className="w-3 h-3" />,
  },
  enviado: {
    label: "Enviado",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Truck className="w-3 h-3" />,
  },
  entregue: {
    label: "Entregue",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: <Check className="w-3 h-3" />,
  },
}

const typeConfig: Record<string, { label: string; color: string }> = {
  digital: { label: "Digital", color: "text-green-400" },
  acesso: { label: "Acesso", color: "text-yellow-400" },
  fisico: { label: "Físico", color: "text-purple-400" },
  featured: { label: "Destaque", color: "text-pink-400" },
}

export default function ResgatesPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pendente: 0, processando: 0, enviado: 0, entregue: 0 })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [trackingCode, setTrackingCode] = useState("")

  const fetchRedemptions = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (typeFilter !== 'all') params.set('type', typeFilter)
      
      const response = await fetch(`/api/admin/redemptions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRedemptions(data.redemptions || [])
        setStats(data.stats || { total: 0, pendente: 0, processando: 0, enviado: 0, entregue: 0 })
      }
    } catch (error) {
      console.error('Erro ao buscar resgates:', error)
      toast.error('Erro ao carregar resgates')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRedemptions()
  }, [statusFilter, typeFilter])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchRedemptions()
  }

  const updateStatus = async (id: string, newStatus: RedemptionStatus, extraData?: any) => {
    try {
      const response = await fetch(`/api/admin/redemptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, ...extraData })
      })

      if (response.ok) {
        toast.success(`Status atualizado para ${statusConfig[newStatus].label}`)
        fetchRedemptions()
        setIsDetailsOpen(false)
      } else {
        throw new Error('Erro ao atualizar')
      }
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Deseja cancelar este resgate? Os pontos serão devolvidos ao usuário.')) return

    try {
      const response = await fetch(`/api/admin/redemptions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Resgate cancelado e pontos devolvidos')
        fetchRedemptions()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao cancelar')
      }
    } catch (error) {
      toast.error('Erro ao cancelar resgate')
    }
  }

  const openDetails = (redemption: Redemption) => {
    setSelectedRedemption(redemption)
    setTrackingCode(redemption.trackingCode || "")
    setIsDetailsOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isPhysical = (type: string) => type === 'fisico' || type === 'featured'

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
            <Gift className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Resgates</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os resgates de recompensas dos fãs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.pendente}</p>
          <p className="text-xs text-muted-foreground">Pendentes</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.processando}</p>
          <p className="text-xs text-muted-foreground">Processando</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.enviado}</p>
          <p className="text-xs text-muted-foreground">Enviados</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.entregue}</p>
          <p className="text-xs text-muted-foreground">Entregues</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border text-foreground bg-card">
              {statusFilter === "all" ? "Todos os status" : statusConfig[statusFilter as RedemptionStatus]?.label}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card border-border">
            <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-foreground">
              Todos os status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pendente")} className="text-foreground">
              Pendente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("processando")} className="text-foreground">
              Processando
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("enviado")} className="text-foreground">
              Enviado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("entregue")} className="text-foreground">
              Entregue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border text-foreground bg-card">
              {typeFilter === "all" ? "Todos os tipos" : typeConfig[typeFilter]?.label || typeFilter}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card border-border">
            <DropdownMenuItem onClick={() => setTypeFilter("all")} className="text-foreground">
              Todos os tipos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("digital")} className="text-foreground">
              Digital
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("acesso")} className="text-foreground">
              Acesso
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("fisico")} className="text-foreground">
              Físico
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("featured")} className="text-foreground">
              Destaque
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          className="border-border text-foreground bg-card"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {redemptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Gift className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nenhum resgate encontrado</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Recompensa</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Usuário</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Data</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((redemption) => (
                <tr key={redemption.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4 text-foreground font-medium">{redemption.reward.name}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-foreground">{redemption.user.name || 'Sem nome'}</p>
                      <p className="text-xs text-muted-foreground">{redemption.user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={typeConfig[redemption.reward.type]?.color || 'text-gray-400'}>
                      {typeConfig[redemption.reward.type]?.label || redemption.reward.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusConfig[redemption.status as RedemptionStatus]?.color || ''}`}
                    >
                      {statusConfig[redemption.status as RedemptionStatus]?.icon}
                      {statusConfig[redemption.status as RedemptionStatus]?.label || redemption.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{formatDate(redemption.redeemedAt)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {isPhysical(redemption.reward.type) && (
                        <button
                          onClick={() => openDetails(redemption)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="Ver dados de entrega"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {redemption.status === "pendente" && (
                        <>
                          <button
                            onClick={() => updateStatus(redemption.id, "processando")}
                            className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                            title="Processar"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(redemption.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {redemption.status === "processando" && isPhysical(redemption.reward.type) && (
                        <>
                          <button
                            onClick={() => openDetails(redemption)}
                            className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"
                            title="Marcar como enviado"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(redemption.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {redemption.status === "processando" && !isPhysical(redemption.reward.type) && (
                        <button
                          onClick={() => updateStatus(redemption.id, "entregue")}
                          className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                          title="Marcar como entregue"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      {redemption.status === "enviado" && (
                        <button
                          onClick={() => updateStatus(redemption.id, "entregue")}
                          className="p-1.5 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                          title="Marcar como entregue"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalhes (para produtos físicos) */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Package className="w-5 h-5" />
              Dados de Entrega
            </DialogTitle>
          </DialogHeader>

          {selectedRedemption && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Destinatário</p>
                <p className="text-foreground font-medium">{selectedRedemption.user.name || 'Sem nome'}</p>
                <p className="text-sm text-muted-foreground">{selectedRedemption.user.email}</p>
              </div>

              {selectedRedemption.addressStreet && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-foreground">{selectedRedemption.addressStreet}</p>
                    <p className="text-foreground">
                      {selectedRedemption.addressCity}, {selectedRedemption.addressState}
                    </p>
                    <p className="text-foreground">{selectedRedemption.addressZip}</p>
                  </div>
                </div>
              )}

              {!selectedRedemption.addressStreet && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm">⚠️ Endereço de entrega não informado</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Produto</p>
                <p className="text-foreground font-medium">{selectedRedemption.reward.name}</p>
              </div>

              {selectedRedemption.status === "processando" && (
                <div className="space-y-2">
                  <Label htmlFor="tracking" className="text-foreground">Código de Rastreamento</Label>
                  <Input
                    id="tracking"
                    placeholder="Ex: BR123456789XX"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
              )}

              {selectedRedemption.trackingCode && selectedRedemption.status !== "processando" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Código de Rastreamento</p>
                  <p className="text-foreground font-mono bg-muted px-3 py-2 rounded">{selectedRedemption.trackingCode}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                  className="flex-1 border-border text-foreground"
                >
                  Fechar
                </Button>
                {selectedRedemption.status === "processando" && (
                  <Button
                    onClick={() => updateStatus(selectedRedemption.id, "enviado", { trackingCode })}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Marcar Enviado
                  </Button>
                )}
                {selectedRedemption.status === "enviado" && (
                  <Button
                    onClick={() => updateStatus(selectedRedemption.id, "entregue")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Marcar Entregue
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
