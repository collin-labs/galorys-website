"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Gamepad2, Users, Eye, Play, Pause, Volume2, VolumeX, ExternalLink, Loader2 } from "lucide-react"
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
    name: string
    playing: number
    visits: number
    icon: string | null
    thumbnail: string | null
    url: string
  }>
}

// Floating Roblox-style blocks
function FloatingBlocks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-lg bg-roblox-red/20"
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

export function RobloxSection() {
  const ref = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [robloxData, setRobloxData] = useState<RobloxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar dados do Roblox
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
          games: data.roblox?.games || []
        })
      } catch (err) {
        setError("Não foi possível carregar os dados")
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

  // Dados para exibição (reais ou fallback)
  const stats = [
    { 
      icon: Users, 
      value: robloxData?.group.memberCount || 0, 
      label: "Membros" 
    },
    { 
      icon: Gamepad2, 
      value: robloxData?.games[0]?.playing || 0, 
      label: "Jogando Agora",
      live: true
    },
    { 
      icon: Eye, 
      value: robloxData?.games[0]?.visits || 0, 
      label: "Visitas" 
    },
  ]

  const game = robloxData?.games[0]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-galorys-base via-[#1a0a0a] to-galorys-base" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,77,77,0.1)_0%,transparent_70%)]" />
      <FloatingBlocks />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-roblox-red/10 border border-roblox-red/20 text-roblox-red text-sm font-medium mb-4">
            Experiência Roblox
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            GALORYS NO <span className="text-roblox-red">ROBLOX</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entre no universo Galorys dentro do Roblox. Explore nossa comunidade, jogue nossos games e conecte-se com outros fãs.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-galorys-surface/80 border border-roblox-red/20 backdrop-blur-lg">
            {/* Stats - Dados Reais */}
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6 md:p-8 text-center"
                >
                  <stat.icon className="w-6 h-6 text-roblox-red mx-auto mb-2" />
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        {stat.live && stat.value > 0 && (
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                        <p className="text-2xl md:text-3xl font-bold text-foreground">
                          {formatNumber(stat.value)}
                        </p>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Video Preview */}
            <div className="p-6 md:p-8">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-galorys-base mb-6 group">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  src="/videos/galorys-video.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-galorys-base/60 via-transparent to-transparent pointer-events-none" />

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-roblox-red/90 flex items-center justify-center cursor-pointer hover:bg-roblox-red transition-colors shadow-lg"
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
                    className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors shadow-lg"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Center Play Button */}
                {!isPlaying && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-roblox-red flex items-center justify-center cursor-pointer hover:bg-roblox-red/90 transition-colors shadow-[0_0_40px_rgba(255,77,77,0.5)]"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Game Info */}
              {game && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-galorys-base/50 border border-border"
                >
                  <div className="flex items-center gap-4">
                    {game.icon && (
                      <img 
                        src={game.icon} 
                        alt={game.name}
                        className="w-16 h-16 rounded-xl"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{game.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          {formatNumber(game.playing)} jogando
                        </span>
                        <span>{formatNumber(game.visits)} visitas</span>
                      </div>
                    </div>
                    <a 
                      href={game.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={game?.url || "https://www.roblox.com/games/76149317725679"} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-roblox-red hover:bg-roblox-red/90 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,77,77,0.4)]"
                  >
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Jogar Agora
                  </Button>
                </a>
                <a href={robloxData?.group.url || "https://www.roblox.com/communities/313210721/Galorys"} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-roblox-red/50 text-roblox-red hover:bg-roblox-red/10 px-8 py-6 text-lg rounded-xl"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Entrar na Comunidade
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
