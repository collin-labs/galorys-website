"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Play, Users, Eye, Star, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface GameCardProps {
  game: {
    id: string
    name: string
    slug?: string
    platform: "roblox" | "fivem"
    playing?: number
    players?: number
    maxPlayers?: number
    visits?: number
    favorites?: number
    thumbnail?: string | null
    icon?: string | null
    url: string
    featured?: boolean
  }
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "featured" | "minimal"
  showStats?: boolean
  showPlatform?: boolean
  className?: string
}

// Cores por plataforma
const platformConfig = {
  roblox: {
    color: "#FF4D4D",
    glow: "rgba(255, 77, 77, 0.4)",
    gradient: "from-red-500/20 via-red-600/10 to-transparent",
    label: "ROBLOX",
    icon: "🎮"
  },
  fivem: {
    color: "#F97316",
    glow: "rgba(249, 115, 22, 0.4)",
    gradient: "from-orange-500/20 via-orange-600/10 to-transparent",
    label: "GTA RP",
    icon: "🚗"
  }
}

// Tamanhos
const sizeConfig = {
  sm: { 
    card: "h-48", 
    image: "h-28",
    title: "text-sm",
    padding: "p-3"
  },
  md: { 
    card: "h-64", 
    image: "h-40",
    title: "text-base",
    padding: "p-4"
  },
  lg: { 
    card: "h-80", 
    image: "h-52",
    title: "text-lg",
    padding: "p-5"
  },
  xl: { 
    card: "h-96", 
    image: "h-64",
    title: "text-xl",
    padding: "p-6"
  }
}

export function GameCard({ 
  game, 
  size = "md", 
  variant = "default",
  showStats = true,
  showPlatform = true,
  className 
}: GameCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Mouse position para efeito 3D
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Springs suaves
  const springConfig = { stiffness: 150, damping: 15 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig)
  
  const platform = platformConfig[game.platform]
  const sizeStyles = sizeConfig[size]
  const playerCount = game.playing ?? game.players ?? 0
  
  // Handler do mouse para efeito 3D
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        "transform-gpu perspective-1000",
        sizeStyles.card,
        className
      )}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glassmorphism Background */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl",
          "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
          "backdrop-blur-xl",
          "border border-white/[0.08]",
          "transition-all duration-500"
        )}
        style={{
          boxShadow: isHovered 
            ? `0 0 40px ${platform.glow}, 0 25px 50px -12px rgba(0, 0, 0, 0.5)` 
            : "0 10px 40px -10px rgba(0, 0, 0, 0.3)"
        }}
      />
      
      {/* Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t",
        platform.gradient,
        "opacity-60 group-hover:opacity-80 transition-opacity duration-500"
      )} />
      
      {/* Glow Effect on Hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${platform.glow} 0%, transparent 70%)`
        }}
      />
      
      {/* Image Container */}
      <div className={cn(
        "relative w-full overflow-hidden",
        sizeStyles.image
      )}>
        {game.thumbnail || game.icon ? (
          <Image
            src={game.thumbnail || game.icon || ""}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-4xl">{platform.icon}</span>
          </div>
        )}
        
        {/* Dark Overlay for Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Platform Badge */}
        {showPlatform && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 left-3"
          >
            <div 
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-md"
              style={{ 
                backgroundColor: `${platform.color}CC`,
                boxShadow: `0 0 20px ${platform.glow}`
              }}
            >
              {platform.icon} {platform.label}
            </div>
          </motion.div>
        )}
        
        {/* Featured Badge */}
        {game.featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3"
          >
            <div className="px-2 py-1 rounded-lg text-xs font-bold bg-yellow-500 text-black flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              DESTAQUE
            </div>
          </motion.div>
        )}
        
        {/* Live Players Badge */}
        {playerCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-3 left-3"
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/90 backdrop-blur-md text-white text-sm font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {playerCount.toLocaleString()}
              <Users className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Content */}
      <div className={cn(
        "relative z-10 flex flex-col justify-between",
        sizeStyles.padding,
        "flex-1"
      )}>
        {/* Title */}
        <h3 className={cn(
          "font-bold text-white line-clamp-2 mb-2",
          sizeStyles.title,
          "group-hover:text-transparent group-hover:bg-clip-text",
          "group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70",
          "transition-all duration-300"
        )}>
          {game.name}
        </h3>
        
        {/* Stats */}
        {showStats && (game.visits !== undefined || game.favorites !== undefined) && (
          <div className="flex items-center gap-4 text-xs text-white/60">
            {game.visits !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {(game.visits / 1000000).toFixed(1)}M
              </span>
            )}
            {game.favorites !== undefined && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {(game.favorites / 1000).toFixed(0)}K
              </span>
            )}
            {game.maxPlayers !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {playerCount}/{game.maxPlayers}
              </span>
            )}
          </div>
        )}
        
        {/* Play Button - Appears on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="mt-auto pt-3"
        >
          <Link
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 w-full",
              "py-2.5 px-4 rounded-xl",
              "font-bold text-sm text-white",
              "transition-all duration-300",
              "hover:scale-105 active:scale-95"
            )}
            style={{
              backgroundColor: platform.color,
              boxShadow: `0 0 30px ${platform.glow}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Play className="w-4 h-4 fill-current" />
            {game.platform === "roblox" ? "JOGAR" : "CONECTAR"}
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)",
        }}
        animate={isHovered ? {
          x: ["-100%", "200%"],
        } : {}}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

export default GameCard
