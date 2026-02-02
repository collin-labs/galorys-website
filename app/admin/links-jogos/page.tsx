"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Gamepad2, Globe, Plus, Save, Loader2, Trash2, Search,
  Instagram, Video, MessageCircle, Eye, EyeOff, Users,
  Upload, Image as ImageIcon, X, Pencil, TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface GameLink {
  id: string
  game: string
  name: string
  serverCode: string
  serverUrl: string | null
  serverIp: string | null
  serverPort: number | null
  instagram: string | null
  videoPath: string | null
  discordInvite: string | null
  thumbnailUrl: string | null
  active: boolean
}

interface LookupData {
  name: string
  playing?: number
  players?: number
  visits?: number
  favorites?: number
  icon?: string | null
  thumbnail?: string | null
  url?: string
}

type Platform = "roblox" | "gtarp"

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toLocaleString("pt-BR")
}

// ========================================
// COMPONENTE DE UPLOAD DE IMAGEM
// ========================================
function ImageUpload({ 
  value, 
  onChange,
  onRemove 
}: { 
  value: string | null
  onChange: (url: string) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (file: File) => {
    if (!file) return
    
    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast({ title: "Apenas imagens são permitidas", variant: "destructive" })
      return
    }
    
    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Imagem muito grande (máx 5MB)", variant: "destructive" })
      return
    }
    
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("/api/admin/game-links/upload", {
        method: "POST",
        body: formData
      })
      
      const data = await response.json()
      
      if (data.error) {
        toast({ title: data.error, variant: "destructive" })
        return
      }
      
      onChange(data.url)
      toast({ title: "✅ Imagem enviada!" })
    } catch (error) {
      toast({ title: "Erro ao enviar imagem", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-purple-500" />
        Imagem de Capa
      </Label>
      
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img 
            src={value} 
            alt="Capa" 
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Trocar
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={onRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${dragOver 
              ? "border-purple-500 bg-purple-500/10" 
              : "border-border hover:border-purple-500/50 hover:bg-muted/50"
            }
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm text-muted-foreground">Enviando...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP até 5MB</p>
            </div>
          )}
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
    </div>
  )
}

// ========================================
// ABAS
// ========================================
function PlatformTabs({ 
  active, 
  onChange,
  robloxCount,
  gtarpCount
}: { 
  active: Platform
  onChange: (p: Platform) => void
  robloxCount: number
  gtarpCount: number
}) {
  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange("roblox")}
        className={`relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold transition-all ${
          active === "roblox"
            ? "text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-red-500/30"
        }`}
      >
        {active === "roblox" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Gamepad2 className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Roblox</span>
        <span className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
          active === "roblox" ? "bg-white/20" : "bg-red-500/10 text-red-400"
        }`}>
          {robloxCount}
        </span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange("gtarp")}
        className={`relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold transition-all ${
          active === "gtarp"
            ? "text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-orange-500/30"
        }`}
      >
        {active === "gtarp" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Globe className="w-5 h-5 relative z-10" />
        <span className="relative z-10">GTA RP</span>
        <span className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
          active === "gtarp" ? "bg-white/20" : "bg-orange-500/10 text-orange-400"
        }`}>
          {gtarpCount}
        </span>
      </motion.button>
    </div>
  )
}

// ========================================
// CARD DE JOGO
// ========================================
function GameCard({ 
  link, 
  platform,
  liveData,
  onEdit,
  onDelete,
  onToggleActive
}: { 
  link: GameLink
  platform: Platform
  liveData?: { playing?: number; players?: number; visits?: number; thumbnail?: string; icon?: string }
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}) {
  const isRoblox = platform === "roblox"
  const playing = liveData?.playing || liveData?.players || 0
  
  // Thumbnail: usa a do banco, ou do lookup, ou placeholder
  const thumbnail = link.thumbnailUrl || liveData?.thumbnail
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        link.active 
          ? isRoblox 
            ? "border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            : "border-orange-500/30 hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
          : "border-border opacity-60"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={link.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            isRoblox ? "bg-gradient-to-br from-red-500/20 to-red-600/10" : "bg-gradient-to-br from-orange-500/20 to-orange-600/10"
          }`}>
            {isRoblox ? (
              <Gamepad2 className="w-16 h-16 text-red-500/30" />
            ) : (
              <Globe className="w-16 h-16 text-orange-500/30" />
            )}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Live badge */}
        {link.active && playing > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {formatNumber(playing)} online
          </div>
        )}
        
        {/* Status */}
        <button
          onClick={onToggleActive}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-all ${
            link.active 
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
              : "bg-black/50 text-muted-foreground hover:bg-black/70"
          }`}
        >
          {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        
        {/* Icon */}
        {liveData?.icon && (
          <div className="absolute bottom-3 left-3">
            <img 
              src={liveData.icon} 
              alt=""
              className={`w-12 h-12 rounded-xl border-2 shadow-lg ${
                isRoblox ? "border-red-500/50" : "border-orange-500/50"
              }`}
            />
          </div>
        )}
        
        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3 pl-16">
          <h3 className="font-bold text-white text-lg truncate drop-shadow-lg">{link.name}</h3>
          <p className="text-white/70 text-xs font-mono">{link.serverCode}</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 bg-card">
        {/* Stats */}
        {liveData && (
          <div className="flex gap-4 mb-4 text-sm">
            {liveData.visits !== undefined && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>{formatNumber(liveData.visits)}</span>
              </div>
            )}
            {(liveData.playing !== undefined || liveData.players !== undefined) && (
              <div className="flex items-center gap-1.5 text-green-500">
                <Users className="w-4 h-4" />
                <span>{formatNumber(liveData.playing || liveData.players || 0)}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Links */}
        <div className="flex flex-wrap gap-2 mb-4">
          {link.instagram && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-500/10 text-pink-400 text-xs">
              <Instagram className="w-3 h-3" />
              {link.instagram}
            </span>
          )}
          {link.discordInvite && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#5865F2]/10 text-[#5865F2] text-xs">
              <MessageCircle className="w-3 h-3" />
              {link.discordInvite}
            </span>
          )}
          {link.videoPath && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs">
              <Video className="w-3 h-3" />
              Vídeo
            </span>
          )}
          {link.thumbnailUrl && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs">
              <ImageIcon className="w-3 h-3" />
              Capa
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-500 hover:bg-red-500/10 hover:border-red-500/50"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// ========================================
// MODAL DE EDIÇÃO
// ========================================
function GameModal({
  isOpen,
  onClose,
  link,
  platform,
  onSave
}: {
  isOpen: boolean
  onClose: () => void
  link: GameLink | null
  platform: Platform
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    game: "",
    name: "",
    serverCode: "",
    serverUrl: "",
    serverIp: "",
    serverPort: "",
    instagram: "",
    videoPath: "",
    discordInvite: "",
    thumbnailUrl: ""
  })
  const [lookupData, setLookupData] = useState<LookupData | null>(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  const isRoblox = platform === "roblox"
  
  useEffect(() => {
    if (link) {
      setFormData({
        game: link.game,
        name: link.name,
        serverCode: link.serverCode,
        serverUrl: link.serverUrl || "",
        serverIp: link.serverIp || "",
        serverPort: link.serverPort?.toString() || "",
        instagram: link.instagram || "",
        videoPath: link.videoPath || "",
        discordInvite: link.discordInvite || "",
        thumbnailUrl: link.thumbnailUrl || ""
      })
      setLookupData(null)
    } else {
      const count = Date.now()
      setFormData({
        game: platform === "roblox" ? `roblox-${count}` : `gtarp-${count}`,
        name: "",
        serverCode: "",
        serverUrl: "",
        serverIp: "",
        serverPort: "",
        instagram: "",
        videoPath: "",
        discordInvite: "",
        thumbnailUrl: ""
      })
      setLookupData(null)
    }
  }, [link, platform, isOpen])
  
  const handleLookup = async () => {
    if (!formData.serverCode) {
      toast({ title: "Digite o ID primeiro", variant: "destructive" })
      return
    }
    
    setLookupLoading(true)
    setLookupData(null)
    
    try {
      const response = await fetch("/api/admin/game-links/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: isRoblox ? "roblox" : "fivem",
          externalId: formData.serverCode
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        toast({ title: data.error, variant: "destructive" })
        return
      }
      
      setLookupData(data)
      setFormData(prev => ({
        ...prev,
        name: data.name || prev.name,
        serverUrl: data.url || prev.serverUrl,
        thumbnailUrl: data.thumbnail || prev.thumbnailUrl
      }))
      
      toast({ title: "✅ Jogo encontrado!" })
    } catch (error) {
      toast({ title: "Erro ao buscar dados", variant: "destructive" })
    } finally {
      setLookupLoading(false)
    }
  }
  
  const handleSave = async () => {
    if (!formData.name || !formData.serverCode) {
      toast({ title: "Nome e ID são obrigatórios", variant: "destructive" })
      return
    }
    
    setSaving(true)
    try {
      // Converter serverPort para número antes de enviar
      const dataToSave = {
        ...formData,
        serverPort: formData.serverPort ? parseInt(formData.serverPort) : null
      }
      await onSave(dataToSave)
      onClose()
    } finally {
      setSaving(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-card rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex-shrink-0 bg-gradient-to-r ${
          isRoblox 
            ? "from-red-500/10 via-red-500/5 to-transparent" 
            : "from-orange-500/10 via-orange-500/5 to-transparent"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                isRoblox ? "from-red-500 to-red-600" : "from-orange-500 to-orange-600"
              }`}>
                {isRoblox ? <Gamepad2 className="w-5 h-5 text-white" /> : <Globe className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-lg font-bold">{link ? "Editar Jogo" : "Novo Jogo"}</h2>
                <p className="text-sm text-muted-foreground">{isRoblox ? "Roblox" : "GTA RP (FiveM)"}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Preview do Lookup */}
          {lookupData?.thumbnail && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden border border-green-500/30"
            >
              <div className="relative aspect-video">
                <img src={lookupData.thumbnail} alt={lookupData.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg">{lookupData.name}</h3>
                  <div className="flex gap-4 mt-2 text-white/80 text-sm">
                    {lookupData.playing !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatNumber(lookupData.playing)} jogando
                      </span>
                    )}
                    {lookupData.visits !== undefined && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {formatNumber(lookupData.visits)} visitas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* ID + Lookup */}
          <div className="space-y-2">
            <Label>{isRoblox ? "Universe ID do Jogo" : "Código do Servidor FiveM"}</Label>
            <div className="flex gap-2">
              <Input
                value={formData.serverCode}
                onChange={(e) => setFormData(prev => ({ ...prev, serverCode: e.target.value }))}
                placeholder={isRoblox ? "Ex: 4793377607" : "Ex: r4z8dg"}
                className="font-mono text-lg"
              />
              <Button 
                onClick={handleLookup}
                disabled={lookupLoading}
                className={isRoblox ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"}
              >
                {lookupLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Digite o ID e clique em buscar para preencher automaticamente</p>
          </div>
          
          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome do Jogo</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={isRoblox ? "Ex: Aura Evolution" : "Ex: KUSH PVP"}
              className="text-lg"
            />
          </div>
          
          {/* Upload de Imagem */}
          <ImageUpload
            value={formData.thumbnailUrl || null}
            onChange={(url) => setFormData(prev => ({ ...prev, thumbnailUrl: url }))}
            onRemove={() => setFormData(prev => ({ ...prev, thumbnailUrl: "" }))}
          />
          
          {/* Grid de campos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </Label>
              <Input
                value={formData.instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="@usuario"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                Discord
              </Label>
              <Input
                value={formData.discordInvite}
                onChange={(e) => setFormData(prev => ({ ...prev, discordInvite: e.target.value }))}
                placeholder="Código do convite"
              />
            </div>
            
            {/* Campos de IP e Porta - apenas para GTA RP */}
            {!isRoblox && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    IP do Servidor
                  </Label>
                  <Input
                    value={formData.serverIp}
                    onChange={(e) => setFormData(prev => ({ ...prev, serverIp: e.target.value }))}
                    placeholder="Ex: 45.40.99.228"
                    className="font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    Porta
                  </Label>
                  <Input
                    type="number"
                    value={formData.serverPort}
                    onChange={(e) => setFormData(prev => ({ ...prev, serverPort: e.target.value }))}
                    placeholder="Ex: 30120"
                    className="font-mono"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-500" />
                Vídeo Promocional
              </Label>
              <Input
                value={formData.videoPath}
                onChange={(e) => setFormData(prev => ({ ...prev, videoPath: e.target.value }))}
                placeholder="/videos/meu-video.mp4"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className={isRoblox 
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            }
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ========================================
// PÁGINA PRINCIPAL
// ========================================
export default function LinksJogosPage() {
  const [links, setLinks] = useState<GameLink[]>([])
  const [liveStats, setLiveStats] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [platform, setPlatform] = useState<Platform>("roblox")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<GameLink | null>(null)
  const { toast } = useToast()
  
  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/admin/game-links")
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      }
    } catch (error) {
      toast({ title: "Erro ao carregar jogos", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }
  
  const fetchLiveStats = async () => {
    try {
      const response = await fetch("/api/games-stats")
      if (response.ok) {
        const data = await response.json()
        const stats: Record<string, any> = {}
        
        data.roblox?.games?.forEach((game: any) => {
          const link = links.find(l => l.serverCode === game.universeId)
          if (link) {
            stats[link.id] = { playing: game.playing, visits: game.visits, thumbnail: game.thumbnail, icon: game.icon }
          }
        })
        
        data.fivem?.servers?.forEach((server: any) => {
          const link = links.find(l => l.serverCode === server.code)
          if (link) {
            stats[link.id] = { players: server.players, maxPlayers: server.maxPlayers }
          }
        })
        
        setLiveStats(stats)
      }
    } catch (error) {
      console.error("Erro ao buscar stats:", error)
    }
  }
  
  useEffect(() => { fetchLinks() }, [])
  
  useEffect(() => {
    if (links.length > 0) {
      fetchLiveStats()
      const interval = setInterval(fetchLiveStats, 30000)
      return () => clearInterval(interval)
    }
  }, [links])
  
  const robloxLinks = links.filter(l => l.game.startsWith("roblox") && l.game !== "roblox-group")
  const gtarpLinks = links.filter(l => l.game.startsWith("gtarp"))
  const currentLinks = platform === "roblox" ? robloxLinks : gtarpLinks
  
  const handleAdd = () => { setEditingLink(null); setModalOpen(true) }
  const handleEdit = (link: GameLink) => { setEditingLink(link); setModalOpen(true) }
  
  const handleSave = async (data: any) => {
    try {
      if (editingLink) {
        const response = await fetch(`/api/admin/game-links/${editingLink.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error()
        toast({ title: "✅ Jogo atualizado!" })
      } else {
        const response = await fetch("/api/admin/game-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error)
        }
        toast({ title: "✅ Jogo adicionado!" })
      }
      fetchLinks()
    } catch (error: any) {
      toast({ title: error.message || "Erro ao salvar", variant: "destructive" })
    }
  }
  
  const handleDelete = async (link: GameLink) => {
    if (!confirm(`Excluir "${link.name}"?`)) return
    try {
      await fetch(`/api/admin/game-links/${link.id}`, { method: "DELETE" })
      toast({ title: "Jogo excluído!" })
      fetchLinks()
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" })
    }
  }
  
  const handleToggleActive = async (link: GameLink) => {
    try {
      await fetch(`/api/admin/game-links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !link.active })
      })
      toast({ title: link.active ? "Jogo desativado" : "Jogo ativado" })
      fetchLinks()
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" })
    }
  }
  
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Links dos Jogos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os jogos Roblox e servidores GTA RP</p>
        </div>
        
        <Button 
          onClick={handleAdd}
          size="lg"
          className={`shadow-lg ${
            platform === "roblox"
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          }`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Jogo
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <PlatformTabs 
          active={platform} 
          onChange={setPlatform}
          robloxCount={robloxLinks.length}
          gtarpCount={gtarpLinks.length}
        />
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {currentLinks.length === 0 ? (
              <div className="text-center py-20">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  platform === "roblox" ? "bg-red-500/10" : "bg-orange-500/10"
                }`}>
                  {platform === "roblox" ? <Gamepad2 className="w-10 h-10 text-red-500" /> : <Globe className="w-10 h-10 text-orange-500" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum jogo cadastrado</h3>
                <p className="text-muted-foreground mb-6">Clique em "Adicionar Jogo" para começar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentLinks.map((link) => (
                  <GameCard
                    key={link.id}
                    link={link}
                    platform={platform}
                    liveData={liveStats[link.id]}
                    onEdit={() => handleEdit(link)}
                    onDelete={() => handleDelete(link)}
                    onToggleActive={() => handleToggleActive(link)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      
      <GameModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        link={editingLink}
        platform={platform}
        onSave={handleSave}
      />
    </div>
  )
}