"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { 
  Gamepad2, Users, Eye, Play, ExternalLink, Loader2, 
  TrendingUp, ArrowRight, Heart, Crown, Target, ChevronLeft, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface RobloxGame {
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
  genre?: string
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
  totals: {
    playing: number
    visits: number
    favorites: number
    gamesCount: number
  }
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

// ========================================
// COMPONENTES DE EFEITO PREMIUM
// ========================================

// Efeito de partículas flutuantes
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(255, ${100 + Math.random() * 100}, ${100 + Math.random() * 100}, ${0.3 + Math.random() * 0.4})`,
            boxShadow: `0 0 ${10 + Math.random() * 20}px rgba(255, 77, 77, 0.5)`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 200],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

// Grid de fundo animado
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,77,77,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,77,77,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,77,77,0.15) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Spotlight que segue o mouse
function Spotlight() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-50 hidden lg:block"
      style={{
        background: `radial-gradient(800px circle at ${springX}px ${springY}px, rgba(255,77,77,0.06), transparent 40%)`,
      }}
    />
  )
}

// Card de estatística com glow
function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  color = "red",
  delay = 0,
  live = false 
}: { 
  icon: React.ElementType
  value: number
  label: string
  color?: string
  delay?: number
  live?: boolean
}) {
  const colors = {
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-6 
        bg-gradient-to-br ${colors[color as keyof typeof colors]}
        border backdrop-blur-xl
        transition-all duration-300
        hover:shadow-[0_0_40px_rgba(255,77,77,0.2)]
      `}
    >
      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
          {live && (
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          )}
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors[color as keyof typeof colors].split(' ').pop()}`} />
        </div>
        <motion.p 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {formatNumber(value)}
        </motion.p>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </motion.div>
  )
}

// ============================================
// MOBILE GAMES CAROUSEL (< lg = 1024px)
// Carrossel premium para jogos Roblox
// ============================================

function MobileGamesCarousel({ games }: { games: RobloxGame[] }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      
      const cardWidth = clientWidth * 0.88
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(Math.min(newIndex, games.length - 1))
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.88
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.88
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => carousel.removeEventListener('scroll', checkScroll)
    }
  }, [games.length])

  return (
    <div className="relative -mx-4 px-4">
      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex-shrink-0 w-[88%] sm:w-[80%] snap-center"
          >
            <MobileGameCard game={game} index={index} />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            canScrollLeft
              ? 'bg-red-500/20 text-red-500 active:bg-red-500 active:text-white'
              : 'bg-muted/20 text-muted-foreground/30 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Dots */}
        <div className="flex items-center gap-2">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-red-500 w-6'
                  : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            canScrollRight
              ? 'bg-red-500/20 text-red-500 active:bg-red-500 active:text-white'
              : 'bg-muted/20 text-muted-foreground/30 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// MOBILE GAME CARD - Card compacto para carrossel
// ============================================

function MobileGameCard({ game, index }: { game: RobloxGame; index: number }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-galorys-surface/90 to-galorys-surface/50 border border-red-500/20 backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_10px_40px_rgba(255,77,77,0.2)]">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {game.thumbnail ? (
          <img 
            src={game.thumbnail} 
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
            <Gamepad2 className="w-16 h-16 text-red-500/50" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-galorys-base via-galorys-base/50 to-transparent" />
        
        {/* Play button */}
        <a 
          href={game.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(255,77,77,0.5)] transition-transform duration-300 group-hover:scale-110">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
        </a>

        {/* Live badge */}
        {game.playing > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {formatNumber(game.playing)} ONLINE
          </div>
        )}

        {/* Genre badge */}
        {game.genre && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-purple-500/80 backdrop-blur-sm text-white text-xs font-medium">
            {game.genre}
          </div>
        )}

        {/* Icon */}
        {game.icon && (
          <div className="absolute -bottom-6 left-4">
            <div className="absolute inset-0 bg-red-500/50 rounded-xl blur-xl" />
            <img 
              src={game.icon} 
              alt={game.name}
              className="relative w-14 h-14 rounded-xl border-4 border-galorys-surface shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
          {game.name}
        </h3>
        {game.description && (
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
            {game.description}
          </p>
        )}
        
        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-red-400" />
            <span>{formatNumber(game.visits)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>{formatNumber(game.favoritedCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Até {game.maxPlayers}</span>
          </div>
        </div>

        {/* CTA */}
        <a href={game.url} target="_blank" rel="noopener noreferrer" className="block">
          <Button 
            className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-[0_4px_20px_rgba(255,77,77,0.4)] transition-all duration-300"
          >
            <Play className="w-4 h-4 mr-2" />
            Jogar Agora
          </Button>
        </a>
      </div>
    </div>
  )
}

// Card de jogo premium - ALTURA UNIFORME
function GameCard({ 
  game, 
  index 
}: { 
  game: RobloxGame
  index: number 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, type: "spring", stiffness: 80 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
    >
      <div className={`
        relative overflow-hidden rounded-2xl sm:rounded-3xl h-full
        bg-gradient-to-br from-galorys-surface/90 to-galorys-surface/50
        border border-red-500/20 backdrop-blur-xl
        transition-all duration-500
        hover:border-red-500/50
        hover:shadow-[0_20px_80px_rgba(255,77,77,0.3)]
        flex flex-col
      `}>
        {/* Thumbnail com overlay - ALTURA FIXA */}
        <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
          {game.thumbnail ? (
            <motion.img 
              src={game.thumbnail} 
              alt={game.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
              <Gamepad2 className="w-16 h-16 sm:w-20 sm:h-20 text-red-500/50" />
            </div>
          )}
          
          {/* Gradiente overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-galorys-base via-galorys-base/50 to-transparent" />
          
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
          />

          {/* Play button center */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <a href={game.url} target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: isHovered 
                    ? "0 0 60px rgba(255,77,77,0.8), 0 0 100px rgba(255,77,77,0.4)" 
                    : "0 0 30px rgba(255,77,77,0.5)"
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center cursor-pointer"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1" />
              </motion.div>
            </a>
          </motion.div>

          {/* Live badge */}
          {game.playing > 0 && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(34,197,94,0.5)]"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
              {formatNumber(game.playing)} ONLINE
            </motion.div>
          )}

          {/* Genre badge */}
          {game.genre && (
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-500/80 backdrop-blur-sm text-white text-xs font-medium"
            >
              {game.genre}
            </motion.div>
          )}

          {/* Ícone do jogo - posicionado sobre a transição */}
          {game.icon && (
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="absolute -bottom-8 sm:-bottom-10 left-4 sm:left-6"
            >
              <div className="absolute inset-0 bg-red-500/50 rounded-xl sm:rounded-2xl blur-xl" />
              <img 
                src={game.icon} 
                alt={game.name}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-4 border-galorys-surface shadow-2xl"
              />
            </motion.div>
          )}
        </div>

        {/* Game Info - flex-grow para ocupar espaço restante */}
        <div className="p-4 sm:p-6 flex-grow flex flex-col">
          {/* Espaço para o ícone */}
          <div className="h-6 sm:h-8" />
          
          {/* Info */}
          <div className="flex-grow">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 line-clamp-1">
              {game.name}
            </h3>
            {game.description && (
              <p className="text-muted-foreground mb-4 line-clamp-2 text-xs sm:text-sm">
                {game.description}
              </p>
            )}
            
            {/* Stats grid - SEM DATA */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                <span>{formatNumber(game.visits)} visitas</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 flex-shrink-0" />
                <span>{formatNumber(game.favoritedCount)} favoritos</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <span>Até {game.maxPlayers} jogadores</span>
              </div>
            </div>
          </div>

          {/* CTAs - BOTÕES ESTILIZADOS E RESPONSIVOS */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
            <a href={game.url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button 
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-[0_4px_20px_rgba(255,77,77,0.4)] hover:shadow-[0_8px_30px_rgba(255,77,77,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Jogar Agora</span>
              </Button>
            </a>
            <a href={game.url} target="_blank" rel="noopener noreferrer" className="sm:flex-none">
              <Button 
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-12 px-4 sm:px-5 border-2 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 font-semibold rounded-xl backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="ml-2 text-sm sm:text-base">Ver no Roblox</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Card da comunidade - LAYOUT CORRIGIDO
function CommunityCard({ group }: { group: RobloxData['group'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
    >
      {/* Header da seção */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Nossa Comunidade</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Faça parte da família Galorys</p>
        </div>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-galorys-surface/90 to-galorys-surface/50 border border-purple-500/20 backdrop-blur-xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Group Icon */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="relative flex-shrink-0"
            >
              <div className="absolute inset-0 bg-purple-500/30 rounded-2xl sm:rounded-3xl blur-xl" />
              {group.icon ? (
                <img 
                  src={group.icon} 
                  alt={group.name}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl border-4 border-purple-500/30 shadow-2xl"
                />
              ) : (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center border-4 border-purple-500/30">
                  <span className="text-4xl sm:text-5xl font-bold text-white">G</span>
                </div>
              )}
            </motion.div>
            
            {/* Info */}
            <div className="flex-1 text-center sm:text-left w-full">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">{group.name}</h3>
              {group.description && (
                <p className="text-muted-foreground mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base max-w-xl mx-auto sm:mx-0">{group.description}</p>
              )}
              
              {/* Member count */}
              <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4 sm:mb-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{formatNumber(group.memberCount)}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Membros</p>
                </div>
                <div className="w-px h-10 sm:h-12 bg-purple-500/30" />
                <div className="flex items-center gap-2 text-purple-400">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium">Crescendo</span>
                </div>
              </div>

              {/* Botão - em bloco separado */}
              <div className="block">
                <a href={group.url} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button 
                    className="h-11 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 sm:px-8 font-semibold rounded-xl shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-sm sm:text-base">Entrar na Comunidade</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export function RobloxPageContent() {
  const [robloxData, setRobloxData] = useState<RobloxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRobloxData() {
      try {
        setLoading(true)
        // Usar API unificada (mesma do live-counter)
        const response = await fetch("/api/games-stats")
        if (!response.ok) throw new Error("Falha ao carregar")
        const data = await response.json()
        
        // Adaptar dados para o formato esperado
        if (data.roblox) {
          const games = data.roblox.games || []
          const totalPlaying = games.reduce((acc: number, g: any) => acc + (g.playing || 0), 0)
          const totalVisits = games.reduce((acc: number, g: any) => acc + (g.visits || 0), 0)
          const totalFavorites = games.reduce((acc: number, g: any) => acc + (g.favorites || g.favoritedCount || 0), 0)
          
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
            games: games.map((g: any) => ({
              ...g,
              universeId: parseInt(g.universeId) || 0,
              favoritedCount: g.favorites || g.favoritedCount || 0,
              maxPlayers: g.maxPlayers || 0,
              created: g.created || "",
              updated: g.updated || ""
            })),
            totals: {
              playing: totalPlaying,
              visits: totalVisits,
              favorites: totalFavorites,
              gamesCount: games.length
            },
            fetchedAt: data.fetchedAt || new Date().toISOString()
          })
        }
      } catch (err) {
        setError("Não foi possível carregar os dados do Roblox")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    // Buscar imediatamente
    fetchRobloxData()
    
    // Atualizar a cada 30 segundos (igual ao live-counter)
    const interval = setInterval(fetchRobloxData, 30000)
    return () => clearInterval(interval)
  }, [])

  const group = robloxData?.group
  const games = robloxData?.games || []
  const totals = robloxData?.totals

  return (
    <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24 relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-galorys-base via-[#0f0505] to-galorys-base" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,77,77,0.2)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
      
      <AnimatedGrid />
      <FloatingParticles />
      <Spotlight />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header - SEM BADGE "Experiência Roblox Premium" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative inline-block mb-6 sm:mb-8"
          >
            <div className="absolute inset-0 bg-red-500/50 rounded-2xl sm:rounded-3xl blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_0_60px_rgba(255,77,77,0.5)] sm:shadow-[0_0_80px_rgba(255,77,77,0.5)]">
              <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 tracking-tight"
          >
            <span className="text-foreground">GALORYS NO </span>
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              ROBLOX
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4"
          >
            Explore o universo Galorys dentro do Roblox. Jogue nossos games exclusivos, 
            acompanhe estatísticas em tempo real e faça parte da nossa comunidade épica!
          </motion.p>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 sm:py-32"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
              <Loader2 className="relative w-12 h-12 sm:w-16 sm:h-16 animate-spin text-red-500" />
            </div>
            <p className="mt-4 sm:mt-6 text-muted-foreground animate-pulse text-sm sm:text-base">Carregando dados do Roblox...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 border border-red-500/30 mb-4 sm:mb-6">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Stats Overview */}
            {totals && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-10 sm:mb-16">
                <StatCard 
                  icon={Users} 
                  value={group?.memberCount || 0} 
                  label="Membros" 
                  color="purple"
                  delay={0.1}
                />
                <StatCard 
                  icon={Gamepad2} 
                  value={totals.playing} 
                  label="Jogando Agora" 
                  color="green"
                  delay={0.2}
                  live
                />
                <StatCard 
                  icon={Eye} 
                  value={totals.visits} 
                  label="Visitas Totais" 
                  color="red"
                  delay={0.3}
                />
                <StatCard 
                  icon={Heart} 
                  value={totals.favorites} 
                  label="Favoritos" 
                  color="pink"
                  delay={0.4}
                />
              </div>
            )}

            {/* Games Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-10 sm:mb-16"
            >
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Nossos Jogos</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">{games.length} jogos disponíveis</p>
                </div>
              </div>
              
              {/* ========================================
                  MOBILE/TABLET: Carrossel (< lg = 1024px)
                  ======================================== */}
              <div className="lg:hidden">
                <MobileGamesCarousel games={games} />
              </div>

              {/* ========================================
                  DESKTOP: Grid Original (>= lg = 1024px)
                  100% IGUAL AO ORIGINAL
                  ======================================== */}
              <div className="hidden lg:grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {games.map((game, index) => (
                  <GameCard key={game.id} game={game} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Community Card */}
            {group && (
              <div className="mb-10 sm:mb-16">
                <CommunityCard group={group} />
              </div>
            )}

            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-10 sm:mb-16"
            >
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Vídeo Promocional</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Conheça o universo Galorys</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-galorys-surface/90 to-galorys-surface/50 backdrop-blur-xl">
                <div className="relative aspect-video">
                  <video
                    src="/videos/galorys-video.mp4"
                    className="w-full h-full object-cover"
                    controls
                    poster="/images/marketing/galorys-roblox.png"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-galorys-base/30 to-transparent" />
                </div>
              </div>
            </motion.div>

            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 group text-sm sm:text-base"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Voltar para Home
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

// Fallback para RefreshCw
function RefreshCw(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  )
}
