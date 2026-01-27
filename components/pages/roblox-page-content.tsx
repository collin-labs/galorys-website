"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Gamepad2, Users, Eye, Play, ExternalLink, Loader2, 
  Trophy, Calendar, Star, TrendingUp, ArrowRight,
  Heart, Clock, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"

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
    universeId: number
    name: string
    description: string
    playing: number
    visits: number
    maxPlayers: number
    created: string
    updated: string
    favoritedCount: number
    icon: string | null
    thumbnail: string | null
    url: string
  }>
  fetchedAt: string
}

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

// Formatador de data
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}

// Floating blocks animation
function FloatingBlocks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg bg-roblox-red/10"
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

export function RobloxPageContent() {
  const [robloxData, setRobloxData] = useState<RobloxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRobloxData() {
      try {
        setLoading(true)
        const response = await fetch("/api/games-stats")
        if (!response.ok) throw new Error("Falha ao carregar")
        const data = await response.json()
        // Adaptar para o formato esperado pelo componente
        setRobloxData({
          group: data.roblox?.group ? {
            id: parseInt(data.roblox.group.id) || 0,
            name: data.roblox.group.name || "Galorys",
            description: "",
            memberCount: data.roblox.group.memberCount || 0,
            owner: null,
            icon: data.roblox.group.icon,
            url: `https://www.roblox.com/groups/${data.roblox.group.id}`
          } : null,
          games: data.roblox?.games || [],
          fetchedAt: data.fetchedAt
        })
      } catch (err) {
        setError("Não foi possível carregar os dados do Roblox")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRobloxData()
    
    // Atualizar a cada 30 segundos (mesmo intervalo do contador do topo)
    const interval = setInterval(fetchRobloxData, 30000)
    return () => clearInterval(interval)
  }, [])

  const group = robloxData?.group
  const game = robloxData?.games[0]

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-galorys-base via-[#150505] to-galorys-base" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,77,77,0.15)_0%,transparent_50%)]" />
      <FloatingBlocks />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-roblox-red to-red-600 mb-6 shadow-[0_0_60px_rgba(255,77,77,0.4)]"
          >
            <Gamepad2 className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            GALORYS NO <span className="text-roblox-red">ROBLOX</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore o universo Galorys dentro do Roblox. Jogue nossos games exclusivos e faça parte da nossa comunidade!
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-roblox-red" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="glass rounded-2xl p-6 border border-roblox-red/20 text-center">
                <Users className="w-8 h-8 text-roblox-red mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{formatNumber(group?.memberCount || 0)}</p>
                <p className="text-sm text-muted-foreground">Membros</p>
              </div>
              <div className="glass rounded-2xl p-6 border border-roblox-red/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <Gamepad2 className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">{formatNumber(game?.playing || 0)}</p>
                <p className="text-sm text-muted-foreground">Jogando Agora</p>
              </div>
              <div className="glass rounded-2xl p-6 border border-roblox-red/20 text-center">
                <Eye className="w-8 h-8 text-roblox-red mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{formatNumber(game?.visits || 0)}</p>
                <p className="text-sm text-muted-foreground">Visitas Totais</p>
              </div>
              <div className="glass rounded-2xl p-6 border border-roblox-red/20 text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{formatNumber(game?.favoritedCount || 0)}</p>
                <p className="text-sm text-muted-foreground">Favoritos</p>
              </div>
            </motion.div>

            {/* Game Card */}
            {game && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-roblox-red" />
                  Nosso Game
                </h2>
                
                <div className="glass rounded-3xl overflow-hidden border border-roblox-red/20">
                  {/* Game Thumbnail */}
                  <div className="relative aspect-video md:aspect-[21/9]">
                    {game.thumbnail ? (
                      <img 
                        src={game.thumbnail} 
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-roblox-red/20 to-red-900/20 flex items-center justify-center">
                        <Gamepad2 className="w-20 h-20 text-roblox-red/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-galorys-base via-galorys-base/50 to-transparent" />
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a href={game.url} target="_blank" rel="noopener noreferrer">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-24 h-24 rounded-full bg-roblox-red flex items-center justify-center cursor-pointer shadow-[0_0_60px_rgba(255,77,77,0.5)] hover:shadow-[0_0_80px_rgba(255,77,77,0.7)] transition-shadow"
                        >
                          <Play className="w-12 h-12 text-white ml-2" />
                        </motion.div>
                      </a>
                    </div>

                    {/* Live badge */}
                    {game.playing > 0 && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/90 text-white text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        {formatNumber(game.playing)} ONLINE
                      </div>
                    )}
                  </div>

                  {/* Game Info */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Icon */}
                      {game.icon && (
                        <img 
                          src={game.icon} 
                          alt={game.name}
                          className="w-24 h-24 rounded-2xl border-2 border-roblox-red/30 -mt-16 md:-mt-20 relative z-10 shadow-2xl"
                        />
                      )}
                      
                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{game.name}</h3>
                        {game.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">{game.description}</p>
                        )}
                        
                        {/* Meta info */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Até {game.maxPlayers} jogadores
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Criado em {formatDate(game.created)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Atualizado {formatDate(game.updated)}
                          </span>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-wrap gap-4">
                          <a href={game.url} target="_blank" rel="noopener noreferrer">
                            <Button 
                              size="lg"
                              className="bg-roblox-red hover:bg-roblox-red/90 text-white px-8"
                            >
                              <Play className="w-5 h-5 mr-2" />
                              Jogar Agora
                            </Button>
                          </a>
                          <a href={game.url} target="_blank" rel="noopener noreferrer">
                            <Button 
                              size="lg"
                              variant="outline"
                              className="border-roblox-red/50 text-roblox-red hover:bg-roblox-red/10"
                            >
                              <ExternalLink className="w-5 h-5 mr-2" />
                              Ver no Roblox
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Community Card */}
            {group && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-roblox-red" />
                  Nossa Comunidade
                </h2>
                
                <div className="glass rounded-3xl p-6 md:p-8 border border-roblox-red/20">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Group Icon */}
                    {group.icon ? (
                      <img 
                        src={group.icon} 
                        alt={group.name}
                        className="w-32 h-32 rounded-2xl border-2 border-roblox-red/30"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-roblox-red to-red-600 flex items-center justify-center">
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

                      <a href={group.url} target="_blank" rel="noopener noreferrer">
                        <Button 
                          size="lg"
                          className="bg-roblox-red hover:bg-roblox-red/90 text-white px-8"
                        >
                          <Users className="w-5 h-5 mr-2" />
                          Entrar na Comunidade
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Play className="w-6 h-6 text-roblox-red" />
                Vídeo Promocional
              </h2>
              
              <div className="glass rounded-3xl overflow-hidden border border-roblox-red/20">
                <div className="relative aspect-video">
                  <video
                    src="/videos/galorys-video.mp4"
                    className="w-full h-full object-cover"
                    controls
                    poster="/images/marketing/galorys-roblox.png"
                  />
                </div>
              </div>
            </motion.div>

            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Voltar para Home
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}