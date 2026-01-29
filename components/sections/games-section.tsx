"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Gamepad2, Users, Eye, Play, Pause, Volume2, VolumeX, 
  ExternalLink, Loader2, ChevronLeft, ChevronRight,
  Instagram, Globe, Heart, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Tipos
interface RobloxGame {
  id: string
  name: string
  playing: number
  visits: number
  favoritedCount?: number
  icon: string | null
  thumbnail: string | null
  url: string
}

interface RobloxData {
  group: {
    id: number
    name: string
    description: string
    memberCount: number
    icon: string | null
    url: string
  }
  games: RobloxGame[]
  totals?: {
    playing: number
    visits: number
    favorites: number
    gamesCount: number
  }
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
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-lg ${color}`}
          style={{
            width: `${15 + Math.random() * 25}px`,
            height: `${15 + Math.random() * 25}px`,
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
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
    <div className="flex items-center justify-center gap-3 mb-10">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onTabChange("roblox")}
        className={`relative px-8 py-4 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 overflow-hidden ${
          activeTab === "roblox"
            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_0_40px_rgba(255,77,77,0.5)]"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-red-500/30"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          ROBLOX
        </span>
        {activeTab === "roblox" && (
          <motion.div
            layoutId="activeTabBg"
            className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onTabChange("gtarp")}
        className={`relative px-8 py-4 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 overflow-hidden ${
          activeTab === "gtarp"
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_40px_rgba(249,115,22,0.5)]"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-orange-500/30"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          GTA RP
        </span>
        {activeTab === "gtarp" && (
          <motion.div
            layoutId="activeTabBg"
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>
    </div>
  )
}

// ========================================
// CONTEÚDO DO ROBLOX - 2 JOGOS
// ========================================
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

  const games = robloxData?.games || []
  const group = robloxData?.group
  const totals = robloxData?.totals

  // Stats com totais
  const stats = [
    { icon: Users, value: group?.memberCount || 0, label: "Membros" },
    { icon: Gamepad2, value: totals?.playing || games.reduce((sum, g) => sum + g.playing, 0), label: "Jogando Agora", live: true },
    { icon: Eye, value: totals?.visits || games.reduce((sum, g) => sum + g.visits, 0), label: "Visitas" },
  ]

  return (
    <div className="glass rounded-3xl overflow-hidden bg-galorys-surface/80 border border-red-500/20 backdrop-blur-xl">
      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 md:p-6 text-center"
          >
            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto mb-2" />
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {stat.live && stat.value > 0 && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  )}
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {formatNumber(stat.value)}
                  </p>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Video */}
      <div className="p-4 md:p-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-galorys-base mb-6 group">
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
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500/90 flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors shadow-lg"
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

        {/* Games Grid - 2 Jogos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {games.slice(0, 2).map((game, index) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 rounded-xl bg-galorys-base/50 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,77,77,0.15)]"
            >
              <div className="flex items-center gap-4">
                {game.icon ? (
                  <img 
                    src={game.icon} 
                    alt={game.name}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-red-500/20"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                    <Gamepad2 className="w-7 h-7 text-red-500/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm md:text-base truncate">{game.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      {formatNumber(game.playing)} jogando
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(game.visits)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <a 
                  href={game.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs shadow-[0_0_15px_rgba(255,77,77,0.3)]"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Jogar
                  </Button>
                </a>
                <a 
                  href={game.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
          
          {/* Placeholder se não tiver jogos */}
          {games.length === 0 && !loading && (
            <>
              <div className="p-4 rounded-xl bg-galorys-base/30 border border-dashed border-red-500/20 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Jogo 1 não configurado</p>
              </div>
              <div className="p-4 rounded-xl bg-galorys-base/30 border border-dashed border-red-500/20 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Jogo 2 não configurado</p>
              </div>
            </>
          )}
          
          {/* Placeholder para segundo jogo se só tiver 1 */}
          {games.length === 1 && (
            <div className="p-4 rounded-xl bg-galorys-base/30 border border-dashed border-red-500/20 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Jogo 2 não configurado</p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/roblox">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,77,77,0.4)]"
            >
              <Zap className="w-5 h-5 mr-2" />
              Ver Página Completa
            </Button>
          </a>
          <a href={group?.url || "#"} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              disabled={!group?.url}
              className="w-full sm:w-auto border-red-500/50 text-red-400 hover:bg-red-500/10 px-8 rounded-xl disabled:opacity-50"
            >
              <Users className="w-5 h-5 mr-2" />
              Comunidade
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

// ========================================
// CONTEÚDO DO GTA RP - 2 SERVIDORES
// ========================================
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
  // Pega os 2 primeiros servidores cadastrados (em vez de códigos hardcoded)
  const kushServer = servers[0]
  const flowServer = servers[1]
  
  // URLs dinâmicas do banco (com fallbacks originais para não quebrar layout)
  const kushConnectUrl = kushServer?.connectUrl || "https://cfx.re/join/r4z8dg"
  const kushInstagram = kushServer?.instagram || "@joguekush"
  const flowConnectUrl = flowServer?.connectUrl || "https://cfx.re/join/3emg7o"
  const flowInstagram = flowServer?.instagram || "@flowrpgg"

  const stats = [
    { icon: Users, value: totalPlayers, label: "Jogadores Online", live: true },
    { icon: Gamepad2, value: kushServer?.players || 0, label: kushServer?.name || "KUSH PVP" },
    { icon: Globe, value: flowServer?.players || 0, label: flowServer?.name || "Flow RP" },
  ]

  return (
    <div className="glass rounded-3xl overflow-hidden bg-galorys-surface/80 border border-orange-500/20 backdrop-blur-xl">
      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 md:p-6 text-center"
          >
            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-orange-500 mx-auto mb-2" />
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {stat.live && stat.value > 0 && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  )}
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {formatNumber(stat.value)}
                  </p>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Video */}
      <div className="p-4 md:p-6">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-galorys-base mb-6 group">
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

        {/* Servers Info - 2 Servidores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* KUSH Server */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-galorys-base/50 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-sm md:text-base">{kushServer?.name || "KUSH PVP"}</h3>
              {kushServer?.online && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              {formatNumber(kushServer?.players || 0)} / {kushServer?.maxPlayers || 128} jogadores
            </p>
            <div className="flex gap-2">
              <a 
                href={kushConnectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs shadow-[0_0_15px_rgba(249,115,22,0.3)]">
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
          </motion.div>

          {/* Flow Server */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-galorys-base/50 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-sm md:text-base">{flowServer?.name || "Flow RP"}</h3>
              {flowServer?.online && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              {formatNumber(flowServer?.players || 0)} / {flowServer?.maxPlayers || 256} jogadores
            </p>
            <div className="flex gap-2">
              <a 
                href={flowConnectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button size="sm" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs shadow-[0_0_15px_rgba(34,197,94,0.3)]">
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
          </motion.div>
        </div>

        {/* CTA Principal */}
        <div className="flex justify-center">
          <a href="/gtarp">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(249,115,22,0.4)]"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Ver Página Completa
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
export function GamesSection() {
  const [activeTab, setActiveTab] = useState<GameTab>("roblox")
  const [robloxData, setRobloxData] = useState<RobloxData | null>(null)
  const [fivemData, setFivemData] = useState<FivemData | null>(null)
  const [loadingRoblox, setLoadingRoblox] = useState(true)
  const [loadingFivem, setLoadingFivem] = useState(true)

  // Buscar dados da API UNIFICADA (mesma do live-counter)
  useEffect(() => {
    async function fetchGamesData() {
      try {
        setLoadingRoblox(true)
        setLoadingFivem(true)
        
        const response = await fetch("/api/games-stats")
        if (!response.ok) throw new Error("Falha ao carregar")
        const data = await response.json()
        
        // Adaptar dados do Roblox
        if (data.roblox) {
          const totalPlaying = data.roblox.games?.reduce((acc: number, g: any) => acc + (g.playing || 0), 0) || 0
          const totalVisits = data.roblox.games?.reduce((acc: number, g: any) => acc + (g.visits || 0), 0) || 0
          const totalFavorites = data.roblox.games?.reduce((acc: number, g: any) => acc + (g.favorites || g.favoritedCount || 0), 0) || 0
          
          setRobloxData({
            group: data.roblox.group ? {
              id: parseInt(data.roblox.group.id) || 0,
              name: data.roblox.group.name || "Galorys",
              description: "",
              memberCount: data.roblox.group.memberCount || 0,
              icon: data.roblox.group.icon,
              url: `https://www.roblox.com/groups/${data.roblox.group.id}`
            } : {
              id: 0,
              name: "Galorys",
              description: "",
              memberCount: 0,
              icon: null,
              url: ""
            },
            games: data.roblox.games || [],
            totals: {
              playing: totalPlaying,
              visits: totalVisits,
              favorites: totalFavorites,
              gamesCount: data.roblox.games?.length || 0
            }
          })
        }
        
        // Adaptar dados do FiveM
        if (data.fivem) {
          setFivemData({
            servers: (data.fivem.servers || []).map((s: any) => ({
              code: s.code,
              name: s.name,
              players: s.players,
              maxPlayers: s.maxPlayers || 0,
              online: s.online || s.players > 0,
              connectUrl: s.url || `https://cfx.re/join/${s.code}`,
              instagram: s.instagram || null,
              videoPath: s.video || null,
              discordInvite: s.discord || null
            })),
            totalPlayers: data.fivem.totalPlayers || 0
          })
        }
      } catch (err) {
        console.error("Erro ao buscar games-stats:", err)
      } finally {
        setLoadingRoblox(false)
        setLoadingFivem(false)
      }
    }
    
    // Buscar imediatamente
    fetchGamesData()
    
    // Atualizar a cada 30 segundos (igual ao live-counter)
    const interval = setInterval(fetchGamesData, 30000)
    return () => clearInterval(interval)
  }, [])

  const accentColor = activeTab === "roblox" ? "rgba(255,77,77,0.1)" : "rgba(249,115,22,0.1)"
  const bgColor = activeTab === "roblox" ? "from-galorys-base via-[#1a0a0a] to-galorys-base" : "from-galorys-base via-[#1a0f05] to-galorys-base"

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgColor} transition-all duration-500`} />
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${accentColor} 0%, transparent 70%)` }}
      />
      <FloatingBlocks color={activeTab === "roblox" ? "bg-red-500/20" : "bg-orange-500/20"} />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.span 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-block px-5 py-2 rounded-full border text-sm font-semibold mb-6 ${
              activeTab === "roblox" 
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-orange-500/10 border-orange-500/30 text-orange-400"
            }`}
          >
            ✨ Nossos Universos
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 tracking-tight">
            JOGUE{" "}
            <span className={activeTab === "roblox" ? "text-red-500" : "text-orange-500"}>
              CONOSCO
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
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
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
              >
                <RobloxContent robloxData={robloxData} loading={loadingRoblox} />
              </motion.div>
            ) : (
              <motion.div
                key="gtarp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
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
