"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Gamepad2, Users, Eye, Star, Search, Filter, Loader2,
  Play, Pause, Volume2, VolumeX, ExternalLink, ArrowRight,
  Calendar, Clock, Heart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  GameCard, 
  GameCardFeatured, 
  GameCardSkeleton,
  GameStatsBadge
} from "@/components/games"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============================================
// INTERFACES
// ============================================

interface RobloxGame {
  id: string
  universeId: string
  name: string
  description?: string
  playing: number
  visits: number
  maxPlayers?: number
  created?: string
  updated?: string
  favorites: number
  favoritedCount?: number
  icon: string | null
  thumbnail: string | null
  url: string
  featured?: boolean
  order?: number
}

interface RobloxGroup {
  id: string
  name: string
  description?: string
  memberCount: number
  icon: string | null
}

interface GamesStatsResponse {
  totalPlayers: number
  roblox: {
    group: RobloxGroup | null
    games: RobloxGame[]
    totalPlayers: number
  }
}

type SortOption = "players" | "visits" | "favorites" | "name"

// ============================================
// UTILS
// ============================================

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toLocaleString("pt-BR")
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}

// ============================================
// FLOATING BLOCKS ANIMATION
// ============================================

function FloatingBlocks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg bg-red-500/10"
          style={{
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// STATS OVERVIEW COMPONENT
// ============================================

function StatsOverview({ 
  group, 
  games, 
  loading 
}: { 
  group: RobloxGroup | null
  games: RobloxGame[]
  loading: boolean 
}) {
  const totalPlaying = games.reduce((acc, g) => acc + (g.playing || 0), 0)
  const totalVisits = games.reduce((acc, g) => acc + (g.visits || 0), 0)

  const stats = [
    { icon: Users, value: group?.memberCount || 0, label: "Membros", color: "text-red-500" },
    { icon: Gamepad2, value: totalPlaying, label: "Jogando Agora", live: true, color: "text-green-500" },
    { icon: Eye, value: totalVisits, label: "Visitas Totais", color: "text-red-500" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-3 gap-4 mb-12"
    >
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className={cn(
            "relative rounded-2xl p-6 text-center",
            "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
            "backdrop-blur-xl border border-white/[0.08]",
            "hover:border-red-500/30 transition-all duration-300"
          )}
        >
          <stat.icon className={cn("w-8 h-8 mx-auto mb-3", stat.color)} />
          <div className="flex items-center justify-center gap-2">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                {stat.live && stat.value > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {formatNumber(stat.value)}
                </p>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  )
}

// ============================================
// COMMUNITY SECTION COMPONENT
// ============================================

function CommunitySection({ group }: { group: RobloxGroup | null }) {
  if (!group) return null

  const groupUrl = `https://www.roblox.com/groups/${group.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Users className="w-6 h-6 text-red-500" />
        Nossa Comunidade
      </h2>
      
      <div className={cn(
        "rounded-3xl p-6 md:p-8",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl border border-red-500/20",
        "hover:border-red-500/40 transition-all duration-300"
      )}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Group Icon */}
          {group.icon ? (
            <img 
              src={group.icon} 
              alt={group.name}
              className="w-32 h-32 rounded-2xl border-2 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
            />
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <span className="text-4xl font-bold text-white">G</span>
            </div>
          )}
          
          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-2">{group.name}</h3>
            {group.description && (
              <p className="text-muted-foreground mb-4 max-w-xl">{group.description}</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{formatNumber(group.memberCount)}</p>
                <p className="text-sm text-muted-foreground">Membros</p>
              </div>
            </div>

            <a href={groupUrl} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white px-8 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all"
              >
                <Users className="w-5 h-5 mr-2" />
                Entrar na Comunidade
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// VIDEO SECTION COMPONENT
// ============================================

function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Play className="w-6 h-6 text-red-500" />
        Vídeo Promocional
      </h2>
      
      <div className={cn(
        "rounded-3xl overflow-hidden",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl border border-red-500/20",
        "hover:border-red-500/40 transition-all duration-300",
        "group"
      )}>
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src="/videos/galorys-video.mp4"
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            poster="/images/marketing/galorys-roblox.png"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Video Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-red-500/90 flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors shadow-lg backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors shadow-lg"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>

          {/* Center Play Button when not playing */}
          {!isPlaying && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shadow-[0_0_40px_rgba(239,68,68,0.5)]"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// GAMES LIST COMPONENT (Layout Adaptativo)
// ============================================

function GamesList({ 
  games, 
  loading,
  search,
  sortBy
}: { 
  games: RobloxGame[]
  loading: boolean
  search: string
  sortBy: SortOption
}) {
  // Filtrar e ordenar
  const filteredGames = games
    .filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "players": return (b.playing || 0) - (a.playing || 0)
        case "visits": return (b.visits || 0) - (a.visits || 0)
        case "favorites": return (b.favorites || b.favoritedCount || 0) - (a.favorites || a.favoritedCount || 0)
        case "name": return a.name.localeCompare(b.name)
        default: return 0
      }
    })

  // Layout baseado na quantidade
  const getLayout = () => {
    const count = filteredGames.length
    if (count === 0) return "empty"
    if (count === 1) return "single"
    if (count === 2) return "dual"
    if (count === 3) return "trio"
    return "grid"
  }

  const layout = getLayout()

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <GameCardSkeleton key={i} size="lg" />
        ))}
      </div>
    )
  }

  // Empty state
  if (layout === "empty") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 mb-12"
      >
        <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhum jogo encontrado</h3>
        <p className="text-muted-foreground">
          {search ? "Tente uma busca diferente" : "Não há jogos disponíveis no momento"}
        </p>
      </motion.div>
    )
  }

  // Single Game - Centralizado
  if (layout === "single") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto mb-12"
      >
        <GameCardFeatured game={{ ...filteredGames[0], platform: "roblox" }} priority />
      </motion.div>
    )
  }

  // Two Games - Lado a Lado
  if (layout === "dual") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
        {filteredGames.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GameCard game={{ ...game, platform: "roblox" }} size="xl" className="h-full" />
          </motion.div>
        ))}
      </div>
    )
  }

  // Three Games - Featured + 2 menores
  if (layout === "trio") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 md:row-span-2"
        >
          <GameCardFeatured game={{ ...filteredGames[0], platform: "roblox" }} priority />
        </motion.div>
        <div className="flex flex-col gap-6">
          {filteredGames.slice(1).map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex-1"
            >
              <GameCard game={{ ...game, platform: "roblox" }} size="lg" className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Grid - 4+ Games
  return (
    <div className="space-y-8 mb-12">
      {/* Featured (primeiro) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <GameCardFeatured game={{ ...filteredGames[0], platform: "roblox" }} priority />
      </motion.div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.slice(1).map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <GameCard game={{ ...game, platform: "roblox" }} size="md" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function RobloxPagePremium() {
  const [data, setData] = useState<GamesStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("players")

  // Buscar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/games-stats")
        if (!response.ok) throw new Error("Erro ao carregar dados")
        const json = await response.json()
        setData(json)
      } catch (err) {
        console.error("Erro:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Preparar jogos
  const games: RobloxGame[] = data?.roblox?.games?.map(g => ({
    ...g,
    platform: "roblox" as const
  })) || []

  const group = data?.roblox?.group || null

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        </div>
        <FloatingBlocks />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-6 shadow-[0_0_60px_rgba(239,68,68,0.4)]"
            >
              <Gamepad2 className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-foreground">GALORYS NO </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                ROBLOX
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-6">
              Explore o universo Galorys dentro do Roblox. Jogue nossos games exclusivos e faça parte da nossa comunidade!
            </p>

            {/* Group Info */}
            {group && (
              <p className="text-muted-foreground mb-6">
                Grupo <strong className="text-foreground">{group.name}</strong>
                {" • "}
                <span className="text-red-500">{formatNumber(group.memberCount)}</span> membros
              </p>
            )}
          </motion.div>

          {/* Stats Overview */}
          <StatsOverview group={group} games={games} loading={loading} />

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar jogos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card/50 border-white/10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px] bg-card/50 border-white/10">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="players">Mais Jogados</SelectItem>
                <SelectItem value="visits">Mais Visitas</SelectItem>
                <SelectItem value="favorites">Mais Favoritos</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Games List (Layout Adaptativo) */}
          <GamesList 
            games={games} 
            loading={loading}
            search={search}
            sortBy={sortBy}
          />

          {/* Community Section */}
          <CommunitySection group={group} />

          {/* Video Section */}
          <VideoSection />

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Voltar para Home
            </Link>
          </motion.div>
        </div>

        {/* Bottom Glow */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent)"
          }}
        />
      </section>
    </div>
  )
}

export default RobloxPagePremium
