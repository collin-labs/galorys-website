"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Gift, Plus, Pencil, Trash2, Eye, EyeOff, Download, ImageIcon, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type RewardType = "digital" | "acesso" | "fisico"

interface Reward {
  id: number
  name: string
  description: string
  type: RewardType
  points: number
  stock: number | null
  image: string
  downloadUrl?: string
  active: boolean
  featured: boolean
}

const initialRewards: Reward[] = [
  {
    id: 1,
    name: "Wallpaper Básico",
    description: "Pack com 3 wallpapers em alta resolução",
    type: "digital",
    points: 200,
    stock: null,
    image: "",
    downloadUrl: "https://drive.google.com/...",
    active: true,
    featured: false,
  },
  {
    id: 2,
    name: "Wallpaper Premium",
    description: "Pack exclusivo com 5 wallpapers premium",
    type: "digital",
    points: 500,
    stock: null,
    image: "",
    downloadUrl: "https://drive.google.com/...",
    active: true,
    featured: true,
  },
  {
    id: 3,
    name: "Pack Wallpapers Completo",
    description: "Todos os wallpapers disponíveis (10+)",
    type: "digital",
    points: 1000,
    stock: null,
    image: "",
    active: true,
    featured: false,
  },
  {
    id: 4,
    name: "Badge Fã Roxo",
    description: "Badge exclusivo que aparece no seu perfil",
    type: "digital",
    points: 1500,
    stock: null,
    image: "",
    active: true,
    featured: false,
  },
  {
    id: 5,
    name: "Badge Fã Estrela",
    description: "Badge premium com animação especial",
    type: "digital",
    points: 2000,
    stock: null,
    image: "",
    active: true,
    featured: true,
  },
  {
    id: 6,
    name: "Acesso Discord VIP",
    description: "Acesso ao canal exclusivo no Discord da Galorys",
    type: "acesso",
    points: 3000,
    stock: null,
    image: "",
    active: true,
    featured: true,
  },
  {
    id: 7,
    name: "Mousepad Galorys",
    description: "Mousepad oficial da Galorys (40x50cm)",
    type: "fisico",
    points: 6000,
    stock: 50,
    image: "",
    active: true,
    featured: false,
  },
  {
    id: 8,
    name: "Camiseta Oficial",
    description: "Camiseta oficial da Galorys (escolha o tamanho)",
    type: "fisico",
    points: 10000,
    stock: 30,
    image: "",
    active: true,
    featured: true,
  },
]

const typeConfig: Record<RewardType, { label: string; color: string; icon: React.ReactNode }> = {
  digital: {
    label: "Digital",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: <Download className="w-3 h-3" />,
  },
  acesso: {
    label: "Acesso",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: <Eye className="w-3 h-3" />,
  },
  fisico: {
    label: "Físico",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Gift className="w-3 h-3" />,
  },
}

export default function RecompensasPage() {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "digital" as RewardType,
    points: 500,
    image: "",
    downloadUrl: "",
    stock: "",
    featured: false,
    active: true,
  })

  const openNewModal = () => {
    setEditingReward(null)
    setFormData({
      name: "",
      description: "",
      type: "digital",
      points: 500,
      image: "",
      downloadUrl: "",
      stock: "",
      featured: false,
      active: true,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (reward: Reward) => {
    setEditingReward(reward)
    setFormData({
      name: reward.name,
      description: reward.description,
      type: reward.type,
      points: reward.points,
      image: reward.image,
      downloadUrl: reward.downloadUrl || "",
      stock: reward.stock?.toString() || "",
      featured: reward.featured,
      active: reward.active,
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingReward) {
      setRewards(
        rewards.map((r) =>
          r.id === editingReward.id
            ? {
                ...r,
                ...formData,
                stock: formData.stock ? Number.parseInt(formData.stock) : null,
              }
            : r,
        ),
      )
    } else {
      const newReward: Reward = {
        id: Math.max(...rewards.map((r) => r.id)) + 1,
        ...formData,
        stock: formData.stock ? Number.parseInt(formData.stock) : null,
      }
      setRewards([...rewards, newReward])
    }
    setIsModalOpen(false)
  }

  const toggleActive = (id: number) => {
    setRewards(rewards.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta recompensa?")) {
      setRewards(rewards.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Recompensas</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Gerencie as recompensas que os fãs podem resgatar</p>
        </div>
        <Button onClick={openNewModal} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Nova Recompensa
        </Button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            {/* Badges no topo */}
            <div className="relative">
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border ${typeConfig[reward.type].color}`}
                >
                  {typeConfig[reward.type].icon}
                  {typeConfig[reward.type].label}
                </span>
                {reward.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    <Star className="w-3 h-3" />
                    Destaque
                  </span>
                )}
              </div>

              {/* Imagem placeholder */}
              <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center">
                {reward.image ? (
                  <Image src={reward.image || "/placeholder.svg"} alt={reward.name} fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-foreground font-semibold">{reward.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">{reward.description}</p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-primary font-bold">{reward.points.toLocaleString()} pts</span>
                {reward.stock !== null && (
                  <span className="text-xs text-muted-foreground">Estoque: {reward.stock}</span>
                )}
                {reward.type !== "fisico" && <span className="text-xs text-muted-foreground">∞ 0</span>}
              </div>
            </div>

            {/* Ações */}
            <div className="border-t border-border p-2 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(reward)}
                className="flex-1 text-muted-foreground hover:text-foreground justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleActive(reward.id)}
                className={`h-8 w-8 ${reward.active ? "text-green-400 hover:text-green-300" : "text-muted-foreground hover:text-foreground"}`}
              >
                {reward.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(reward.id)}
                className="h-8 w-8 text-muted-foreground hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Nova/Editar Recompensa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingReward ? "Editar Recompensa" : "Nova Recompensa"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground">Nome *</Label>
              <Input
                placeholder="Ex: Wallpaper Exclusivo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Descrição</Label>
              <Textarea
                placeholder="Descrição da recompensa..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: RewardType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="digital">Digital (Download)</SelectItem>
                    <SelectItem value="acesso">Acesso</SelectItem>
                    <SelectItem value="fisico">Físico (Entrega)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Custo (pontos) *</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) || 0 })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">URL da Imagem</Label>
              <Input
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Imagem de preview da recompensa</p>
            </div>

            {formData.type === "digital" && (
              <div className="space-y-2">
                <Label className="text-foreground">URL de Download</Label>
                <Input
                  placeholder="https://drive.google.com/..."
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Link do arquivo para download (Google Drive, etc)</p>
              </div>
            )}

            {formData.type === "fisico" && (
              <div className="space-y-2">
                <Label className="text-foreground">Estoque (deixe vazio para ilimitado)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 100"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                />
                <Label htmlFor="featured" className="text-foreground cursor-pointer">
                  Destaque
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
                />
                <Label htmlFor="active" className="text-foreground cursor-pointer">
                  Ativo
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border-border text-foreground hover:bg-muted"
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Gift className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
