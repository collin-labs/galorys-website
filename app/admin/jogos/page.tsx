"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, Gamepad2, Plus, Trash2, Pencil, Loader2, 
  Eye, EyeOff, Search, Upload, X, Sparkles, ChevronUp, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { SkeletonCardGrid } from "@/components/admin/skeleton"

interface Game {
  id: string
  name: string
  slug: string
  shortName: string | null
  icon: string | null
  color: string | null
  order: number
  active: boolean
  _count?: {
    teams: number
  }
}

// Jogos padrão para seed
const DEFAULT_GAMES = [
  { name: "Counter-Strike 2", slug: "cs2", shortName: "CS2", color: "#f59e0b" },
  { name: "League of Legends", slug: "lol", shortName: "LoL", color: "#0891b2" },
  { name: "VALORANT", slug: "valorant", shortName: "VAL", color: "#ef4444" },
  { name: "Fortnite", slug: "fortnite", shortName: "FN", color: "#8b5cf6" },
  { name: "Free Fire", slug: "freefire", shortName: "FF", color: "#f97316" },
  { name: "PUBG Mobile", slug: "pubg", shortName: "PUBG", color: "#eab308" },
  { name: "Rainbow Six Siege", slug: "r6", shortName: "R6", color: "#3b82f6" },
  { name: "Rocket League", slug: "rocket-league", shortName: "RL", color: "#06b6d4" },
  { name: "FIFA / EA FC", slug: "fifa", shortName: "FIFA", color: "#22c55e" },
  { name: "Gran Turismo", slug: "gt", shortName: "GT", color: "#6366f1" },
  { name: "Apex Legends", slug: "apex", shortName: "APEX", color: "#dc2626" },
  { name: "Call of Duty", slug: "cod", shortName: "CoD", color: "#059669" },
]

export default function JogosPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const iconInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortName: "",
    icon: "",
    color: "#6366f1",
    active: true,
  })

  // Buscar jogos
  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/admin/games")
      const data = await response.json()
      if (data.success) {
        setGames(data.games || [])
      }
    } catch (error) {
      console.error("Erro ao buscar jogos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Gerar slug automaticamente
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Upload de ícone
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingIcon(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'games')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        setFormData({ ...formData, icon: data.path })
      } else {
        alert(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingIcon(false)
    }
  }

  const removeIcon = () => {
    setFormData({ ...formData, icon: "" })
    if (iconInputRef.current) iconInputRef.current.value = ""
  }

  // Filtrar jogos
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase()) ||
    game.slug.toLowerCase().includes(search.toLowerCase())
  )

  // Seed de jogos padrão
  const seedDefaultGames = async () => {
    if (!confirm("Isso vai adicionar os jogos padrão. Continuar?")) return
    
    setSeeding(true)
    try {
      for (let i = 0; i < DEFAULT_GAMES.length; i++) {
        const game = DEFAULT_GAMES[i]
        // Verificar se já existe
        const exists = games.find(g => g.slug === game.slug)
        if (!exists) {
          await fetch("/api/admin/games", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...game,
              icon: null,
              order: games.length + i,
              active: true,
            }),
          })
        }
      }
      await fetchGames()
    } catch (error) {
      console.error("Erro ao criar jogos:", error)
      alert("Erro ao criar jogos padrão")
    } finally {
      setSeeding(false)
    }
  }

  // Abrir modal para criar
  const openCreateModal = () => {
    setEditingGame(null)
    setFormData({
      name: "",
      slug: "",
      shortName: "",
      icon: "",
      color: "#6366f1",
      active: true,
    })
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const openEditModal = (game: Game) => {
    setEditingGame(game)
    setFormData({
      name: game.name,
      slug: game.slug,
      shortName: game.shortName || "",
      icon: game.icon || "",
      color: game.color || "#6366f1",
      active: game.active,
    })
    setIsModalOpen(true)
  }

  // Salvar (criar ou editar)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert("Nome e Slug são obrigatórios")
      return
    }

    setSaving(true)
    try {
      if (editingGame) {
        const response = await fetch("/api/admin/games", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingGame.id,
            name: formData.name,
            slug: formData.slug,
            shortName: formData.shortName || null,
            icon: formData.icon || null,
            color: formData.color || null,
            active: formData.active,
          }),
        })
        const data = await response.json()
        if (!data.success) {
          alert(data.error || "Erro ao atualizar")
          return
        }
      } else {
        const response = await fetch("/api/admin/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            shortName: formData.shortName || null,
            icon: formData.icon || null,
            color: formData.color || null,
            order: games.length,
            active: formData.active,
          }),
        })
        const data = await response.json()
        if (!data.success) {
          alert(data.error || "Erro ao criar")
          return
        }
      }
      await fetchGames()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao salvar jogo")
    } finally {
      setSaving(false)
    }
  }

  // Excluir
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Tem certeza que deseja excluir este jogo?")) return

    try {
      const response = await fetch(`/api/admin/games?id=${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        await fetchGames()
      } else {
        alert(data.error || "Erro ao excluir")
      }
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  // Toggle ativo/inativo
  const toggleActive = async (game: Game, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: game.id, active: !game.active }),
      })
      await fetchGames()
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  // Mover ordem
  const moveGame = async (game: Game, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation()
    const currentIndex = games.findIndex(g => g.id === game.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= games.length) return

    const otherGame = games[newIndex]
    
    await Promise.all([
      fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: game.id, order: newIndex }),
      }),
      fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: otherGame.id, order: currentIndex }),
      }),
    ])

    await fetchGames()
  }

  const activeCount = games.filter((g) => g.active).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 bg-muted rounded animate-pulse" />
            <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        <SkeletonCardGrid count={8} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Jogos / Modalidades</h1>
                <p className="text-sm text-muted-foreground">
                  {activeCount} ativos de {games.length} jogos
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {games.length === 0 && (
            <Button 
              onClick={seedDefaultGames} 
              variant="outline"
              disabled={seeding}
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              {seeding ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Criar Jogos Padrão</>
              )}
            </Button>
          )}
          <Button onClick={openCreateModal} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-1" /> Novo Jogo
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm text-blue-200">
          <strong>💡 Dica:</strong> Jogos cadastrados aqui aparecem automaticamente nos formulários de Times, 
          Conquistas e outras áreas do sistema.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jogos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Grid de Cards */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Nenhum jogo cadastrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            Clique em "Criar Jogos Padrão" para começar rapidamente
          </p>
          <Button 
            onClick={seedDefaultGames} 
            disabled={seeding}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {seeding ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Criar Jogos Padrão</>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              onClick={() => openEditModal(game)}
              className={`group relative bg-card border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                game.active 
                  ? "border-border hover:border-primary/50" 
                  : "border-border/50 opacity-60 hover:opacity-80"
              }`}
              style={{
                boxShadow: game.active ? `0 4px 20px ${game.color}15` : 'none'
              }}
            >
              {/* Gradient overlay on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${game.color}10 0%, transparent 50%)`
                }}
              />

              {/* Ordem (canto superior esquerdo) */}
              <div className="absolute top-2 left-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => moveGame(game, 'up', e)}
                  disabled={index === 0}
                  className="w-5 h-5 rounded bg-muted/80 flex items-center justify-center hover:bg-muted disabled:opacity-30"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => moveGame(game, 'down', e)}
                  disabled={index === filteredGames.length - 1}
                  className="w-5 h-5 rounded bg-muted/80 flex items-center justify-center hover:bg-muted disabled:opacity-30"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Ações (canto superior direito) */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => toggleActive(game, e)}
                  className="w-7 h-7 rounded-lg bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
                  title={game.active ? "Ocultar" : "Mostrar"}
                >
                  {game.active ? (
                    <Eye className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={(e) => handleDelete(game.id, e)}
                  className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="relative flex flex-col items-center text-center pt-2">
                {/* Ícone / Avatar */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ 
                    backgroundColor: `${game.color}20`,
                    boxShadow: `0 4px 12px ${game.color}30`
                  }}
                >
                  {game.icon ? (
                    <Image 
                      src={game.icon} 
                      alt={game.name} 
                      width={40} 
                      height={40} 
                      className="object-contain"
                    />
                  ) : (
                    <Gamepad2 
                      className="w-8 h-8" 
                      style={{ color: game.color || '#6366f1' }}
                    />
                  )}
                </div>

                {/* Nome */}
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{game.name}</h3>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {game.shortName && (
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ 
                        backgroundColor: `${game.color}20`,
                        color: game.color || '#6366f1'
                      }}
                    >
                      {game.shortName}
                    </span>
                  )}
                  {!game.active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                      Oculto
                    </span>
                  )}
                </div>

                {/* Slug */}
                <p className="text-xs text-muted-foreground">/{game.slug}</p>

                {/* Barra de cor */}
                <div 
                  className="absolute bottom-0 left-4 right-4 h-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: game.color || '#6366f1' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criar/Editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                <Gamepad2 className="w-4 h-4" style={{ color: formData.color }} />
              </div>
              {editingGame ? "Editar Jogo" : "Novo Jogo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Upload de Ícone */}
            <div className="flex items-start gap-4">
              <div 
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative transition-colors"
                style={{ backgroundColor: `${formData.color}10` }}
              >
                {formData.icon ? (
                  <>
                    <Image src={formData.icon} alt="Ícone" fill className="object-contain p-2" />
                    <button
                      type="button"
                      onClick={removeIcon}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Gamepad2 className="w-8 h-8" style={{ color: formData.color }} />
                )}
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-foreground">Ícone do Jogo</Label>
                <input ref={iconInputRef} type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => iconInputRef.current?.click()}
                  disabled={uploadingIcon}
                  className="w-full mt-2 border-border"
                  size="sm"
                >
                  {uploadingIcon ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Upload Ícone</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">PNG ou SVG. 128x128px ideal.</p>
              </div>
            </div>

            {/* Nome */}
            <div>
              <Label className="text-sm font-medium text-foreground">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value
                  setFormData({
                    ...formData,
                    name,
                    slug: editingGame ? formData.slug : generateSlug(name),
                  })
                }}
                placeholder="Ex: Counter-Strike 2"
                className="mt-1 bg-background border-border"
              />
            </div>

            {/* Slug e Nome Curto */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="cs2"
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Sigla</Label>
                <Input
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  placeholder="CS2"
                  className="mt-1 bg-background border-border"
                />
              </div>
            </div>

            {/* Cor */}
            <div>
              <Label className="text-sm font-medium text-foreground">Cor do Tema</Label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#6366f1"
                  className="flex-1 bg-background border-border font-mono"
                />
                {/* Preview */}
                <div 
                  className="w-10 h-10 rounded-lg"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>

            {/* Ativo */}
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
              />
              <Label htmlFor="active" className="text-foreground cursor-pointer">
                Jogo ativo (visível no sistema)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              style={{ backgroundColor: formData.color }}
              className="hover:opacity-90"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
              ) : editingGame ? (
                "Salvar"
              ) : (
                "Criar Jogo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
