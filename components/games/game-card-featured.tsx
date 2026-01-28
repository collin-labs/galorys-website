"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Play, Users, Eye, Star, ExternalLink, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface GameCardFeaturedProps {
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
    description?: string
  }
  className?: string
  priority?: boolean
}

// Cores por plataforma
const platformConfig = {
  roblox: {
    color: "#FF4D4D",
    glow: "rgba(255, 77, 77, 0.5)",
    gradient: "from-red-600/30 via-red-500/20 to-transparent",
    label: "ROBLOX",
    icon: "🎮"
  },
  fivem: {
    color: "#F97316",
    glow: "rgba(249, 115, 22, 0.5)",
    gradient: "from-orange-600/30 via-orange-500/20 to-transparent",
    label: "GTA RP",
    icon: "🚗"
  }
}

export function GameCardFeatured({ 
  game, 
  className,
  priority = false
}: GameCardFeaturedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Mouse position para efeito 3D
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Springs suaves
  const springConfig = { stiffness: 100, damping: 20 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), springConfig)
  
  const platform = platformConfig[game.platform]
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
        "group relative rounded-3xl overflow-hidden cursor-pointer",
        "transform-gpu perspective-1000",
        "min-h-[400px] md:min-h-[450px]",
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
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {game.thumbnail || game.icon ? (
          <Image
            src={game.thumbnail || game.icon || ""}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
        )}
      </div>
      
      {/* Glassmorphism Overlay */}
      <div 
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-t from-black via-black/60 to-transparent",
          "backdrop-blur-[2px]"
        )}
      />
      
      {/* Animated Gradient Overlay */}
      <motion.div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          platform.gradient,
          "opacity-60 group-hover:opacity-80 transition-opacity duration-700"
        )}
        animate={{
          background: isHovered 
            ? `linear-gradient(135deg, ${platform.glow} 0%, transparent 50%, transparent 100%)`
            : `linear-gradient(135deg, transparent 0%, transparent 50%, transparent 100%)`
        }}
      />
      
      {/* Glow Border */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 60px ${platform.glow}, 0 0 60px ${platform.glow}`
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col p-6 md:p-8">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-4">
          {/* Platform Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div 
              className="px-4 py-2 rounded-xl text-sm font-bold text-white backdrop-blur-md flex items-center gap-2"
              style={{ 
                backgroundColor: `${platform.color}DD`,
                boxShadow: `0 0 30px ${platform.glow}`
              }}
            >
              <span className="text-lg">{platform.icon}</span>
              {platform.label}
            </div>
          </motion.div>
          
          {/* Trending Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/90 backdrop-blur-md text-black text-sm font-bold"
          >
            <TrendingUp className="w-4 h-4" />
            #1 DESTAQUE
          </motion.div>
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Live Players - Large */}
          {playerCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-green-500/90 backdrop-blur-md text-white">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="text-2xl md:text-3xl font-black">
                  {playerCount.toLocaleString()}
                </span>
                <span className="text-sm font-medium opacity-90">jogadores online</span>
              </div>
            </motion.div>
          )}
          
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-black text-white",
              "drop-shadow-lg",
              "group-hover:text-transparent group-hover:bg-clip-text",
              "group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-white/60",
              "transition-all duration-500"
            )}
          >
            {game.name}
          </motion.h2>
          
          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 text-white/70"
          >
            {game.visits !== undefined && (
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">{(game.visits / 1000000).toFixed(1)}M visitas</span>
              </div>
            )}
            {game.favorites !== undefined && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="font-semibold">{(game.favorites / 1000).toFixed(0)}K favoritos</span>
              </div>
            )}
            {game.maxPlayers !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{playerCount}/{game.maxPlayers} slots</span>
              </div>
            )}
          </motion.div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-3",
                "px-8 py-4 rounded-2xl",
                "font-bold text-lg text-white",
                "transition-all duration-300",
                "hover:scale-105 hover:gap-4 active:scale-95"
              )}
              style={{
                backgroundColor: platform.color,
                boxShadow: `0 0 40px ${platform.glow}`
              }}
            >
              <Play className="w-6 h-6 fill-current" />
              {game.platform === "roblox" ? "JOGAR AGORA" : "CONECTAR SERVIDOR"}
              <ExternalLink className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${20 + i * 15}%`,
              bottom: "10%",
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, transparent 50%)",
        }}
        animate={isHovered ? {
          x: ["-100%", "200%"],
        } : {}}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

export default GameCardFeatured
