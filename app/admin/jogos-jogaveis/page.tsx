"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Gamepad2, Plus, Search, Filter, Loader2, 
  Star, StarOff, Eye, EyeOff, Pencil, Trash2,
  GripVertical, ExternalLink, Instagram, MessageCircle,
  Video, RefreshCw, Check, X, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Tipos
interface PlayableGame {
  id: string
  name: string
  slug: string
  platform: "roblox" | "fivem"
  externalId: string
  universeId?: string
  gameUrl?: string
  instagram?: string
  discordInvite?: string
  videoPath?: string
  featured: boolean
  active: boolean
  order: number
  categoryId?: string
  category?: {
    id: string
    name: string
    slug: string
    color?: string
  }
}

interface GameCategory {
  id: string
  name: string
  slug: string
  icon?: string
  color?: string
}

interface LookupData {
  found: boolean
  platform: string
  data: {
    name: string
    playing?: number
    visits?: number
    favorites?: number
    players?: number
    maxPlayers?: number
    thumbnail?: string
    url: string
  }
}

// Cores por plataforma
const platformColors = {
  roblox: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-500",
    glow: "hover:shadow-red-500/20",
    badge: "bg-red-500"
  },
  fivem: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-500",
    glow: "hover:shadow-orange-500/20",
    badge: "bg-orange-500"
  }
}

// Card de jogo
function GameCard({ 
  game, 
  onEdit, 
  onDelete, 
  onToggleFeatured, 
  onToggleActive 
}: { 
  game: PlayableGame
  onEdit: () => void
  onDelete: () => void
  onToggleFeatured: () => void
  onToggleActive: () => void
}) {
  const colors = platformColors[game.platform] || platformColors.roblox

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`
        relative rounded-xl border ${colors.border} ${colors.bg}
        p-4 transition-all duration-300
        hover:shadow-lg ${colors.glow}
        ${!game.active ? 'opacity-50' : ''}
      `}
    >
      {/* Badge de destaque */}
      {game.featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            DESTAQUE
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <Gamepad2 className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-foreground line-clamp-1">{game.name}</h3>
            <p className={`text-xs ${colors.text} uppercase font-medium`}>
              {game.platform === "roblox" ? "🎮 Roblox" : "🚗 FiveM"}
            </p>
          </div>
        </div>
        
        {/* Drag handle */}
        <button className="cursor-grab text-muted-foreground hover:text-foreground p-1">
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
            {game.externalId}
          </span>
        </div>
        
        {/* Redes sociais */}
        <div className="flex items-center gap-2">
          {game.instagram && (
            <span className="text-pink-500 text-xs flex items-center gap-1">
              <Instagram className="w-3 h-3" />
              {game.instagram}
            </span>
          )}
          {game.discordInvite && (
            <span className="text-indigo-500 text-xs flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              Discord
            </span>
          )}
          {game.videoPath && (
            <span className="text-blue-500 text-xs flex items-center gap-1">
              <Video className="w-3 h-3" />
              Vídeo
            </span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFeatured}
          className={game.featured ? "text-yellow-500" : "text-muted-foreground"}
        >
          {game.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleActive}
          className={game.active ? "text-green-500" : "text-muted-foreground"}
        >
          {game.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        
        <div className="flex-1" />
        
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}

// Modal de criação/edição
function GameModal({
  open,
  onOpenChange,
  game,
  categories,
  onSave
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  game?: PlayableGame | null
  categories: GameCategory[]
  onSave: (data: any) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupData, setLookupData] = useState<LookupData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    platform: "roblox" as "roblox" | "fivem",
    externalId: "",
    instagram: "",
    discordInvite: "",
    videoPath: "",
    featured: false,
    active: true,
    categoryId: ""
  })

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        platform: game.platform,
        externalId: game.externalId,
        instagram: game.instagram || "",
        discordInvite: game.discordInvite || "",
        videoPath: game.videoPath || "",
        featured: game.featured,
        active: game.active,
        categoryId: game.categoryId || ""
      })
    } else {
      setFormData({
        name: "",
        platform: "roblox",
        externalId: "",
        instagram: "",
        discordInvite: "",
        videoPath: "",
        featured: false,
        active: true,
        categoryId: ""
      })
    }
    setLookupData(null)
  }, [game, open])

  // Buscar info do jogo ao colar ID
  const handleLookup = async () => {
    if (!formData.externalId) return
    
    setLookupLoading(true)
    setLookupData(null)
    
    try {
      const response = await fetch("/api/admin/playable-games/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: formData.platform,
          externalId: formData.externalId
        })
      })
      
      const data = await response.json()
      
      if (data.found) {
        setLookupData(data)
        // Auto-preencher nome se vazio
        if (!formData.name) {
          setFormData(prev => ({ ...prev, name: data.data.name }))
        }
      }
    } catch (error) {
      console.error("Erro ao buscar jogo:", error)
    } finally {
      setLookupLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSave({
        ...formData,
        ...(game && { id: game.id })
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            {game ? "Editar Jogo" : "Novo Jogo"}
          </DialogTitle>
          <DialogDescription>
            {game ? "Atualize as informações do jogo" : "Adicione um novo jogo ao catálogo"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plataforma */}
          <div className="space-y-2">
            <Label>Plataforma</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, platform: "roblox" }))}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all
                  ${formData.platform === "roblox" 
                    ? "border-red-500 bg-red-500/10" 
                    : "border-border hover:border-red-500/50"}
                `}
              >
                <div className="text-2xl mb-1">🎮</div>
                <div className="font-bold">Roblox</div>
                <div className="text-xs text-muted-foreground">Place ID</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, platform: "fivem" }))}
                className={`
                  flex-1 p-4 rounded-xl border-2 transition-all
                  ${formData.platform === "fivem" 
                    ? "border-orange-500 bg-orange-500/10" 
                    : "border-border hover:border-orange-500/50"}
                `}
              >
                <div className="text-2xl mb-1">🚗</div>
                <div className="font-bold">GTA RP (FiveM)</div>
                <div className="text-xs text-muted-foreground">Server Code</div>
              </button>
            </div>
          </div>

          {/* ID Externo + Busca */}
          <div className="space-y-2">
            <Label>
              {formData.platform === "roblox" ? "Place ID do Roblox" : "Código do Servidor FiveM"}
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder={formData.platform === "roblox" ? "76149317725679" : "r4z8dg"}
                value={formData.externalId}
                onChange={(e) => setFormData(prev => ({ ...prev, externalId: e.target.value }))}
                className="font-mono"
              />
              <Button 
                variant="outline" 
                onClick={handleLookup}
                disabled={lookupLoading || !formData.externalId}
              >
                {lookupLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Cole o ID e clique em buscar para preencher automaticamente
            </p>
          </div>

          {/* Preview do Lookup */}
          <AnimatePresence>
            {lookupData && lookupData.found && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-green-500/30 bg-green-500/10 p-4"
              >
                <div className="flex items-center gap-2 text-green-500 mb-3">
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Jogo encontrado!</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{lookupData.data.name}</p>
                  </div>
                  {lookupData.data.playing !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Jogando agora:</span>
                      <p className="font-medium text-green-500">{lookupData.data.playing.toLocaleString()}</p>
                    </div>
                  )}
                  {lookupData.data.players !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Jogadores:</span>
                      <p className="font-medium text-green-500">
                        {lookupData.data.players}/{lookupData.data.maxPlayers}
                      </p>
                    </div>
                  )}
                  {lookupData.data.visits !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Visitas:</span>
                      <p className="font-medium">{lookupData.data.visits.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome do Jogo</Label>
            <Input
              placeholder="Evolução da Aura"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={formData.categoryId || "none"}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                categoryId: value === "none" ? "" : value 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Redes sociais */}
          <div className="space-y-4">
            <Label className="text-base">Redes Sociais (opcional)</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  Instagram
                </Label>
                <Input
                  placeholder="@galorysroblox"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-indigo-500" />
                  Discord (código)
                </Label>
                <Input
                  placeholder="galorys"
                  value={formData.discordInvite}
                  onChange={(e) => setFormData(prev => ({ ...prev, discordInvite: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-500" />
                Vídeo (caminho)
              </Label>
              <Input
                placeholder="/videos/video-kush.mp4"
                value={formData.videoPath}
                onChange={(e) => setFormData(prev => ({ ...prev, videoPath: e.target.value }))}
              />
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base">Configurações</Label>
            
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-primary text-primary focus:ring-primary"
                />
                <span className="text-sm flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Destaque na Home
                </span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="rounded border-primary text-primary focus:ring-primary"
                />
                <span className="text-sm flex items-center gap-1">
                  <Eye className="w-4 h-4 text-green-500" />
                  Ativo no site
                </span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.name || !formData.externalId}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {game ? "Salvar Alterações" : "Criar Jogo"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Página principal
export default function PlayableGamesPage() {
  const [games, setGames] = useState<PlayableGame[]>([])
  const [categories, setCategories] = useState<GameCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")
  const [filterFeatured, setFilterFeatured] = useState<string>("all")
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<PlayableGame | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState<PlayableGame | null>(null)
  
  const { toast } = useToast()

  // Carregar dados
  const loadGames = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/playable-games")
      const data = await response.json()
      setGames(data.games || [])
      setCategories(data.categories || [])
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os jogos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGames()
  }, [])

  // Filtrar jogos
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase()) ||
                         game.externalId.includes(search)
    const matchesPlatform = filterPlatform === "all" || game.platform === filterPlatform
    const matchesFeatured = filterFeatured === "all" || 
                           (filterFeatured === "featured" && game.featured) ||
                           (filterFeatured === "normal" && !game.featured)
    
    return matchesSearch && matchesPlatform && matchesFeatured
  })

  // Separar destaques
  const featuredGames = filteredGames.filter(g => g.featured)
  const normalGames = filteredGames.filter(g => !g.featured)

  // Handlers
  const handleSave = async (data: any) => {
    try {
      const isEdit = !!data.id
      const url = isEdit 
        ? `/api/admin/playable-games/${data.id}` 
        : "/api/admin/playable-games"
      
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar")
      }

      toast({
        title: "Sucesso!",
        description: isEdit ? "Jogo atualizado" : "Jogo criado"
      })

      loadGames()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar",
        variant: "destructive"
      })
      throw error
    }
  }

  const handleDelete = async () => {
    if (!gameToDelete) return
    
    try {
      const response = await fetch(`/api/admin/playable-games/${gameToDelete.id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Erro ao excluir")

      toast({
        title: "Jogo excluído",
        description: `${gameToDelete.name} foi removido`
      })

      setDeleteDialogOpen(false)
      setGameToDelete(null)
      loadGames()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o jogo",
        variant: "destructive"
      })
    }
  }

  const handleToggleFeatured = async (game: PlayableGame) => {
    try {
      await fetch(`/api/admin/playable-games/${game.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !game.featured })
      })
      loadGames()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar",
        variant: "destructive"
      })
    }
  }

  const handleToggleActive = async (game: PlayableGame) => {
    try {
      await fetch(`/api/admin/playable-games/${game.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !game.active })
      })
      loadGames()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-primary" />
            Jogos Jogáveis
          </h1>
          <p className="text-muted-foreground">
            Gerencie os jogos Roblox e servidores FiveM
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadGames}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => { setEditingGame(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Jogo
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="roblox">🎮 Roblox</SelectItem>
            <SelectItem value="fivem">🚗 FiveM</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterFeatured} onValueChange={setFilterFeatured}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Destaque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="featured">⭐ Destaques</SelectItem>
            <SelectItem value="normal">Normais</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold">{games.length}</div>
          <div className="text-sm text-muted-foreground">Total de jogos</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-red-500">
            {games.filter(g => g.platform === "roblox").length}
          </div>
          <div className="text-sm text-muted-foreground">Roblox</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-orange-500">
            {games.filter(g => g.platform === "fivem").length}
          </div>
          <div className="text-sm text-muted-foreground">FiveM</div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-500">
            {games.filter(g => g.featured).length}
          </div>
          <div className="text-sm text-muted-foreground">Destaques</div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Lista de jogos */}
      {!loading && (
        <div className="space-y-8">
          {/* Destaques */}
          {featuredGames.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Destaques ({featuredGames.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {featuredGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onEdit={() => { setEditingGame(game); setModalOpen(true); }}
                      onDelete={() => { setGameToDelete(game); setDeleteDialogOpen(true); }}
                      onToggleFeatured={() => handleToggleFeatured(game)}
                      onToggleActive={() => handleToggleActive(game)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Outros jogos */}
          {normalGames.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                Outros Jogos ({normalGames.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {normalGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onEdit={() => { setEditingGame(game); setModalOpen(true); }}
                      onDelete={() => { setGameToDelete(game); setDeleteDialogOpen(true); }}
                      onToggleFeatured={() => handleToggleFeatured(game)}
                      onToggleActive={() => handleToggleActive(game)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Estado vazio */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum jogo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {search || filterPlatform !== "all" || filterFeatured !== "all"
                  ? "Tente ajustar os filtros"
                  : "Comece adicionando seu primeiro jogo"}
              </p>
              <Button onClick={() => { setEditingGame(null); setModalOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Jogo
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal de criação/edição */}
      <GameModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        game={editingGame}
        categories={categories}
        onSave={handleSave}
      />

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Excluir jogo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{gameToDelete?.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
