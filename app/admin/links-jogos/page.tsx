"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Gamepad2, Save, Loader2, Check, AlertCircle, 
  RefreshCw, Instagram, Globe, Link2, Video
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
  instagram: string | null
  videoPath: string | null
  active: boolean
}

// Card de configuração de cada jogo
function GameLinkCard({ 
  link, 
  onSave,
  saving,
  color,
  icon: Icon
}: { 
  link: GameLink
  onSave: (data: Partial<GameLink>) => void
  saving: boolean
  color: string
  icon: React.ElementType
}) {
  const [formData, setFormData] = useState({
    name: link.name,
    serverCode: link.serverCode,
    instagram: link.instagram || "",
    videoPath: link.videoPath || "",
  })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setFormData({
      name: link.name,
      serverCode: link.serverCode,
      instagram: link.instagram || "",
      videoPath: link.videoPath || "",
    })
    setHasChanges(false)
  }, [link])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave({
      game: link.game,
      ...formData
    })
    setHasChanges(false)
  }

  const gameLabels: Record<string, { title: string; description: string }> = {
    "roblox": {
      title: "🔴 ROBLOX - Jogo 1",
      description: "Primeiro jogo no Roblox (Evolução da Aura)"
    },
    "roblox-2": {
      title: "🔴 ROBLOX - Jogo 2",
      description: "Segundo jogo no Roblox (Escape Tsunami)"
    },
    "gtarp-kush": {
      title: "🟠 GTA RP - KUSH PVP",
      description: "Servidor FiveM KUSH PVP"
    },
    "gtarp-flow": {
      title: "🟢 GTA RP - FLOW RP",
      description: "Servidor FiveM Flow RP"
    }
  }

  const labels = gameLabels[link.game] || { title: link.game, description: "" }
  const isRoblox = link.game.startsWith("roblox")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${color} bg-card overflow-hidden`}
    >
      {/* Header */}
      <div className={`px-6 py-4 border-b ${color} bg-muted/30`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${color.replace('border-', 'bg-').replace('/30', '/20')} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color.replace('border-', 'text-').replace('/30', '')}`} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">{labels.title}</h3>
            <p className="text-xs text-muted-foreground">{labels.description}</p>
          </div>
          {hasChanges && (
            <span className="ml-auto px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
              Alterado
            </span>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor={`${link.game}-name`} className="text-sm font-medium flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Nome do Jogo
            </Label>
            <Input
              id={`${link.game}-name`}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Galorys Tycoon"
              className="bg-muted/50"
            />
          </div>

          {/* Código do Servidor */}
          <div className="space-y-2">
            <Label htmlFor={`${link.game}-code`} className="text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              {isRoblox ? "Game ID (Place ID)" : "Código FiveM"}
            </Label>
            <Input
              id={`${link.game}-code`}
              value={formData.serverCode}
              onChange={(e) => handleChange("serverCode", e.target.value)}
              placeholder={isRoblox ? "Ex: 76149317725679" : "Ex: r4z8dg"}
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              {isRoblox 
                ? "⚡ Este é o Place ID do jogo no Roblox. O botão 'Jogar' usará: roblox.com/games/{ID}"
                : "⚡ Este é o código de acesso ao servidor FiveM. O botão 'Conectar' usará: cfx.re/join/{código}"
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor={`${link.game}-instagram`} className="text-sm font-medium flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              Instagram
            </Label>
            <Input
              id={`${link.game}-instagram`}
              value={formData.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="Ex: @galorysroblox"
              className="bg-muted/50"
            />
          </div>

          {/* Vídeo */}
          <div className="space-y-2">
            <Label htmlFor={`${link.game}-video`} className="text-sm font-medium flex items-center gap-2">
              <Video className="w-4 h-4" />
              Caminho do Vídeo
            </Label>
            <Input
              id={`${link.game}-video`}
              value={formData.videoPath}
              onChange={(e) => handleChange("videoPath", e.target.value)}
              placeholder="Ex: /videos/galorys-video.mp4"
              className="bg-muted/50"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`${color.replace('border-', 'bg-').replace('/30', '')} hover:opacity-90 text-white`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function LinksJogosPage() {
  const [links, setLinks] = useState<GameLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()

  // Buscar links
  const fetchLinks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/game-links")
      const data = await response.json()
      
      if (data.success) {
        setLinks(data.links)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao carregar links",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar com o servidor",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  // Salvar link
  const handleSave = async (data: Partial<GameLink>) => {
    if (!data.game) return

    try {
      setSaving(data.game)
      
      const response = await fetch("/api/game-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        // Invalidar cache das APIs para refletir mudanças imediatamente
        try {
          if (data.game?.startsWith("gtarp")) {
            await fetch("/api/fivem?refresh=true")
          }
          if (data.game?.startsWith("roblox")) {
            await fetch("/api/roblox?refresh=true")
          }
        } catch (cacheError) {
          console.log("Cache refresh attempted")
        }

        toast({
          title: "Sucesso!",
          description: "Link atualizado com sucesso",
        })
        // Atualizar lista local
        setLinks(prev => prev.map(link => 
          link.game === data.game ? { ...link, ...data } : link
        ))
      } else {
        toast({
          title: "Erro",
          description: result.error || "Falha ao salvar",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar com o servidor",
        variant: "destructive"
      })
    } finally {
      setSaving(null)
    }
  }

  // Ordenar links: roblox primeiro, depois roblox-2, depois gtarp
  const sortedLinks = [...links].sort((a, b) => {
    const order: Record<string, number> = { 
      "roblox": 0, 
      "roblox-2": 1, 
      "gtarp-kush": 2, 
      "gtarp-flow": 3 
    }
    return (order[a.game] ?? 99) - (order[b.game] ?? 99)
  })

  const getColor = (game: string) => {
    switch (game) {
      case "roblox": return "border-red-500/30"
      case "roblox-2": return "border-red-400/30"
      case "gtarp-kush": return "border-orange-500/30"
      case "gtarp-flow": return "border-green-500/30"
      default: return "border-border"
    }
  }

  const getIcon = (game: string) => {
    switch (game) {
      case "roblox": return Gamepad2
      case "roblox-2": return Gamepad2
      case "gtarp-kush": return Globe
      case "gtarp-flow": return Globe
      default: return Link2
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            Links dos Jogos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os links de acesso aos jogos Roblox e GTA RP
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchLinks}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Avisos */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <Gamepad2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-red-500">Roblox - 2 Jogos Configurados</p>
            <p className="text-muted-foreground">
              Os IDs dos jogos Roblox são automaticamente buscados na API do Roblox para exibir estatísticas em tempo real.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500">Atenção - GTA RP</p>
            <p className="text-muted-foreground">
              Os links dos jogos de GTA RP mudam periodicamente. Atualize quando necessário para manter o acesso dos jogadores.
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Cards */
        <div className="space-y-6">
          {/* Seção Roblox */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Roblox
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedLinks
                .filter(link => link.game.startsWith("roblox"))
                .map((link) => (
                  <GameLinkCard
                    key={link.id}
                    link={link}
                    onSave={handleSave}
                    saving={saving === link.game}
                    color={getColor(link.game)}
                    icon={getIcon(link.game)}
                  />
                ))}
            </div>
          </div>

          {/* Seção GTA RP */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              GTA RP
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedLinks
                .filter(link => link.game.startsWith("gtarp"))
                .map((link) => (
                  <GameLinkCard
                    key={link.id}
                    link={link}
                    onSave={handleSave}
                    saving={saving === link.game}
                    color={getColor(link.game)}
                    icon={getIcon(link.game)}
                  />
                ))}
            </div>
          </div>

          {sortedLinks.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum link configurado</p>
              <p className="text-sm">Os links serão criados automaticamente ao acessar as APIs</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
