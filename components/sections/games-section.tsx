"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Gamepad2, Users, Eye, Play, Pause, Volume2, VolumeX, 
  ExternalLink, Loader2, ChevronLeft, ChevronRight,
  Instagram, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Tipos
interface RobloxData {
  group: {
    id: number
    name: string
    description: string
    memberCount: number
    icon: string | null
    url: string
  }
  games: Array<{
    id: string
    name: string
    playing: number
    visits: number
    icon: string | null
    thumbnail: string | null
    url: string
  }>
}

interface FivemData {
  servers: Array<{
    code: string
    name: string
    players: number
    maxPlayers: number
    online: boolean
    connectUrl: string
    instagram?: string | null
    videoPath?: string | null
    discordInvite?: string | null
  }>
  totalPlayers: number
}

type GameTab = "roblox" | "gtarp"

// Formatador de números
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toLocaleString("pt-BR")
}

// Floating blocks animation
function FloatingBlocks({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-8 h-8 rounded-lg ${color}`}
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Componente de Tab
function GameTabs({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: GameTab
  onTabChange: (tab: GameTab) => void 
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <button
        onClick={() => onTabChange("roblox")}
        className={`relative px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
          activeTab === "roblox"
            ? "bg-roblox-red text-white shadow-[0_0_30px_rgba(255,77,77,0.4)]"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <span className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 md:w-5 md:h-5" />
          ROBLOX
        </span>
        {activeTab === "roblox" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-xl bg-roblox-red -z-10"
          />
        )}
      </button>
      
      <button
        onClick={() => onTabChange("gtarp")}
        className={`relative px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
          activeTab === "gtarp"
            ? "bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 md:w-5 md:h-5" />
          GTA RP
        </span>
        {activeTab === "gtarp" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-xl bg-orange-500 -z-10"
          />
        )}
      </button>
    </div>
  )
}

// Conteúdo do Roblox
function RobloxContent({ 
  robloxData, 
  loading 
}: { 
  robloxData: RobloxData | null
  loading: boolean 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const game = robloxData?.games[0]
  const group = robloxData?.group

  const stats = [
    { icon: Users, value: group?.memberCount || 0, label: "Membros" },
    { icon: Gamepad2, value: game?.playing || 0, label: "Jogando Agora", live: true },
    { icon: Eye, value: game?.visits || 0, label: "Visitas" },
  ]

  return (
    <div className="glass rounded-3xl overflow-hidden bg-galorys-surface/80 border border-roblox-red/20 backdrop-blur-lg">
      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {stats.map((stat, index) => (
          <div key={stat.label} className="p-4 md:p-6 text-center">
            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-roblox-red mx-auto mb-2" />
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {stat.live && stat.value > 0 && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {formatNumber(stat.value)}
                  </p>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Video */}
      <div className="p-4 md:p-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-galorys-base mb-4 group">
          <video
            ref={videoRef}
            src="/videos/galorys-video.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-galorys-base/60 via-transparent to-transparent pointer-events-none" />

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-roblox-red/90 flex items-center justify-center cursor-pointer hover:bg-roblox-red transition-colors shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors shadow-lg"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Game Info */}
        {game && (
          <div className="mb-4 p-3 md:p-4 rounded-xl bg-galorys-base/50 border border-border">
            <div className="flex items-center gap-3 md:gap-4">
              {game.icon && (
                <img 
                  src={game.icon} 
                  alt={game.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm md:text-base truncate">{game.name}</h3>
                <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {formatNumber(game.playing)} jogando
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={game?.url || "#"} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              disabled={!game?.url}
              className="w-full sm:w-auto bg-roblox-red hover:bg-roblox-red/90 text-white px-6 md:px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,77,77,0.4)] disabled:opacity-50"
            >
              <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Jogar Agora
            </Button>
          </a>
          <a href={group?.url || "#"} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              disabled={!group?.url}
              className="w-full sm:w-auto border-roblox-red/50 text-roblox-red hover:bg-roblox-red/10 px-6 md:px-8 rounded-xl disabled:opacity-50"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Comunidade
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

// Conteúdo do GTA RP
function GtaRpContent({ 
  fivemData, 
  loading 
}: { 
  fivemData: FivemData | null
  loading: boolean 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const totalPlayers = fivemData?.totalPlayers || 0
  const servers = fivemData?.servers || []
  const kushServer = servers.find(s => s.code === "r4z8dg" || s.name?.includes("KUSH"))
  const flowServer = servers.find(s => s.code === "3emg7o" || s.name?.includes("Flow"))
  
  // URLs dinâmicas do banco
  const kushConnectUrl = kushServer?.connectUrl || "https://cfx.re/join/r4z8dg"
  const kushInstagram = kushServer?.instagram || "@joguekush"
  const flowConnectUrl = flowServer?.connectUrl || "https://cfx.re/join/3emg7o"
  const flowInstagram = flowServer?.instagram || "@flowrpgg"

  const stats = [
    { icon: Users, value: totalPlayers, label: "Jogadores Online", live: true },
    { icon: Gamepad2, value: kushServer?.players || 0, label: "KUSH PVP" },
    { icon: Globe, value: flowServer?.players || 0, label: "Flow RP" },
  ]

  return (
    <div className="glass rounded-3xl overflow-hidden bg-galorys-surface/80 border border-orange-500/20 backdrop-blur-lg">
      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {stats.map((stat, index) => (
          <div key={stat.label} className="p-4 md:p-6 text-center">
            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mx-auto mb-2" />
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {stat.live && stat.value > 0 && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {formatNumber(stat.value)}
                  </p>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Video */}
      <div className="p-4 md:p-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-galorys-base mb-4 group">
          <video
            ref={videoRef}
            src="/videos/video-flow.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-galorys-base/60 via-transparent to-transparent pointer-events-none" />

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500/90 flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors shadow-lg"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Servers Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* KUSH Server */}
          <div className="p-3 md:p-4 rounded-xl bg-galorys-base/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-foreground text-sm md:text-base">{kushServer?.name || "KUSH PVP"}</h3>
              {kushServer?.online && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              {formatNumber(kushServer?.players || 0)} / {kushServer?.maxPlayers || 128} jogadores
            </p>
            <div className="flex gap-2">
              <a 
                href={kushConnectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs">
                  <Play className="w-3 h-3 mr-1" />
                  Conectar
                </Button>
              </a>
              <a 
                href={`https://instagram.com/${kushInstagram.replace("@", "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-500 hover:bg-pink-500/10">
                  <Instagram className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>

          {/* Flow Server */}
          <div className="p-3 md:p-4 rounded-xl bg-galorys-base/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-foreground text-sm md:text-base">{flowServer?.name || "Flow RP"}</h3>
              {flowServer?.online && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              {formatNumber(flowServer?.players || 0)} / {flowServer?.maxPlayers || 256} jogadores
            </p>
            <div className="flex gap-2">
              <a 
                href={flowConnectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs">
                  <Play className="w-3 h-3 mr-1" />
                  Conectar
                </Button>
              </a>
              <a 
                href={`https://instagram.com/${flowInstagram.replace("@", "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-500 hover:bg-pink-500/10">
                  <Instagram className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <div className="flex justify-center">
          <a href="/gtarp">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(249,115,22,0.4)]"
            >
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Ver Página Completa
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

// Componente Principal
export function GamesSection() {
  const [activeTab, setActiveTab] = useState<GameTab>("roblox")
  const [robloxData, setRobloxData] = useState<RobloxData | null>(null)
  const [fivemData, setFivemData] = useState<FivemData | null>(null)
  const [loadingRoblox, setLoadingRoblox] = useState(true)
  const [loadingFivem, setLoadingFivem] = useState(true)

  // Buscar dados de todos os jogos da API unificada
  useEffect(() => {
    async function fetchGamesData() {
      try {
        setLoadingRoblox(true)
        setLoadingFivem(true)
        const response = await fetch("/api/games-stats")
        if (!response.ok) throw new Error("Falha ao carregar")
        const data = await response.json()
        
        // Adaptar dados do Roblox
        setRobloxData({
          group: data.roblox?.group ? {
            id: parseInt(data.roblox.group.id) || 0,
            name: data.roblox.group.name || "Galorys",
            description: "",
            memberCount: data.roblox.group.memberCount || 0,
            icon: data.roblox.group.icon,
            url: `https://www.roblox.com/groups/${data.roblox.group.id}`
          } : null,
          games: data.roblox?.games || []
        })
        
        // Adaptar dados do FiveM
        setFivemData({
          servers: (data.fivem?.servers || []).map((s: any) => ({
            code: s.code,
            game: s.game,
            name: s.name,
            players: s.players,
            maxPlayers: s.maxPlayers || 0,
            online: s.online || s.players > 0,
            hostname: s.hostname || s.name,
            connectUrl: s.url || `https://cfx.re/join/${s.code}`,
            instagram: s.instagram || null,
            videoPath: s.video || null,
            discordInvite: s.discord || null
          })),
          totalPlayers: data.fivem?.totalPlayers || 0
        })
      } catch (err) {
        console.error("Erro ao buscar jogos:", err)
      } finally {
        setLoadingRoblox(false)
        setLoadingFivem(false)
      }
    }
    
    fetchGamesData()
    
    // Atualizar a cada 30 segundos (mesmo intervalo do contador do topo)
    const interval = setInterval(fetchGamesData, 30000)
    return () => clearInterval(interval)
  }, [])

  const accentColor = activeTab === "roblox" ? "rgba(255,77,77,0.1)" : "rgba(249,115,22,0.1)"
  const bgColor = activeTab === "roblox" ? "from-galorys-base via-[#1a0a0a] to-galorys-base" : "from-galorys-base via-[#1a0f05] to-galorys-base"

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgColor}`} />
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${accentColor} 0%, transparent 70%)` }}
      />
      <FloatingBlocks color={activeTab === "roblox" ? "bg-roblox-red/20" : "bg-orange-500/20"} />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className={`inline-block px-4 py-1.5 rounded-full border text-sm font-medium mb-4 ${
            activeTab === "roblox" 
              ? "bg-roblox-red/10 border-roblox-red/20 text-roblox-red"
              : "bg-orange-500/10 border-orange-500/20 text-orange-500"
          }`}>
            Nossos Universos
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 md:mb-4">
            JOGUE <span className={activeTab === "roblox" ? "text-roblox-red" : "text-orange-500"}>CONOSCO</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Explore nossas comunidades em múltiplas plataformas. Conecte-se com outros jogadores e viva experiências únicas.
          </p>
        </motion.div>

        {/* Tabs */}
        <GameTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {activeTab === "roblox" ? (
              <motion.div
                key="roblox"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <RobloxContent robloxData={robloxData} loading={loadingRoblox} />
              </motion.div>
            ) : (
              <motion.div
                key="gtarp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GtaRpContent fivemData={fivemData} loading={loadingFivem} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}