"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { GameCard, GameCardProps } from "./game-card"
import { CarouselSkeleton } from "./game-card-skeleton"

export interface GameCarouselProps {
  title: string
  games: GameCardProps["game"][]
  icon?: React.ReactNode
  accentColor?: string
  showViewAll?: boolean
  viewAllHref?: string
  loading?: boolean
  cardSize?: "sm" | "md" | "lg"
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

// Cores de plataforma para o ícone
const platformIcons: Record<string, { emoji: string; color: string }> = {
  roblox: { emoji: "🎮", color: "#FF4D4D" },
  fivem: { emoji: "🚗", color: "#F97316" },
  gtarp: { emoji: "🚗", color: "#F97316" },
}

export function GameCarousel({
  title,
  games,
  icon,
  accentColor,
  showViewAll = true,
  viewAllHref,
  loading = false,
  cardSize = "md",
  autoPlay = false,
  autoPlayInterval = 5000,
  className,
}: GameCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    loop: false,
  })
  
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  // Detectar plataforma pelo título ou primeiro jogo
  const platform = title.toLowerCase().includes("roblox") 
    ? "roblox" 
    : title.toLowerCase().includes("gta") || title.toLowerCase().includes("fivem")
      ? "fivem"
      : games[0]?.platform || "roblox"
  
  const platformStyle = platformIcons[platform] || platformIcons.roblox
  const finalAccentColor = accentColor || platformStyle.color

  // Callbacks do Embla
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || !emblaApi) return
    
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }, autoPlayInterval)
    
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, emblaApi])

  // Se não tem jogos e não está carregando
  if (!loading && games.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("relative group/carousel", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          {icon || (
            <span 
              className="text-2xl md:text-3xl"
              style={{ filter: `drop-shadow(0 0 10px ${finalAccentColor}50)` }}
            >
              {platformStyle.emoji}
            </span>
          )}
          <h2 
            className="text-xl md:text-2xl font-bold text-foreground"
            style={{
              textShadow: `0 0 30px ${finalAccentColor}30`
            }}
          >
            {title}
          </h2>
          
          {/* Game Count Badge */}
          <span 
            className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: `${finalAccentColor}CC` }}
          >
            {games.length} {games.length === 1 ? "jogo" : "jogos"}
          </span>
        </div>
        
        {/* View All + Navigation */}
        <div className="flex items-center gap-2">
          {showViewAll && viewAllHref && (
            <Link
              href={viewAllHref}
              className={cn(
                "hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl",
                "text-sm font-medium transition-all duration-300",
                "bg-white/5 hover:bg-white/10",
                "border border-white/10 hover:border-white/20",
                "group"
              )}
            >
              Ver todos
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex gap-1">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={cn(
                "p-2 rounded-xl transition-all duration-300",
                "bg-white/5 hover:bg-white/10",
                "border border-white/10 hover:border-white/20",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95"
              )}
              style={{
                boxShadow: canScrollPrev ? `0 0 20px ${finalAccentColor}20` : "none"
              }}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={cn(
                "p-2 rounded-xl transition-all duration-300",
                "bg-white/5 hover:bg-white/10",
                "border border-white/10 hover:border-white/20",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95"
              )}
              style={{
                boxShadow: canScrollNext ? `0 0 20px ${finalAccentColor}20` : "none"
              }}
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading ? (
        <CarouselSkeleton count={5} />
      ) : (
        <>
          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              <AnimatePresence>
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex-shrink-0",
                      cardSize === "sm" && "w-48 md:w-56",
                      cardSize === "md" && "w-56 md:w-64 lg:w-72",
                      cardSize === "lg" && "w-72 md:w-80 lg:w-96"
                    )}
                  >
                    <GameCard 
                      game={game} 
                      size={cardSize}
                      showPlatform={false}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Gradient Edges (visual feedback para scroll) */}
          <div 
            className={cn(
              "absolute left-0 top-[60px] bottom-0 w-8 pointer-events-none",
              "bg-gradient-to-r from-background to-transparent",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
              !canScrollPrev && "hidden"
            )}
          />
          <div 
            className={cn(
              "absolute right-0 top-[60px] bottom-0 w-8 pointer-events-none",
              "bg-gradient-to-l from-background to-transparent",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
              !canScrollNext && "hidden"
            )}
          />
          
          {/* Progress Dots (for mobile) */}
          {games.length > 3 && (
            <div className="flex justify-center gap-1.5 mt-4 md:hidden">
              {games.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    idx === selectedIndex 
                      ? "w-6" 
                      : "bg-white/20 hover:bg-white/40"
                  )}
                  style={{
                    backgroundColor: idx === selectedIndex ? finalAccentColor : undefined
                  }}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Decorative Glow */}
      <div 
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-1/2 h-32 pointer-events-none opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(ellipse, ${finalAccentColor}40 0%, transparent 70%)`
        }}
      />
    </motion.div>
  )
}

export default GameCarousel
