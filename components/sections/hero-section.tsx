"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const defaultGames = ["Counter Strike 2", "Call of Duty Mobile", "Gran Turismo", "Roblox"]

const defaultStats = [
  { value: "50+", label: "Conquistas" },
  { value: "25+", label: "Atletas" },
  { value: "5", label: "Modalidades" },
]

// Particle component for the background effect
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-galorys-purple/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -1000],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Gradient orbs floating in the background
function GradientOrbs() {
  return (
    <>
      <motion.div
        className="absolute w-64 md:w-96 h-64 md:h-96 rounded-full bg-galorys-purple/20 blur-3xl"
        style={{ top: "10%", left: "10%" }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-52 md:w-80 h-52 md:h-80 rounded-full bg-galorys-pink/15 blur-3xl"
        style={{ bottom: "20%", right: "10%" }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </>
  )
}

// Grid lines with perspective
function GridLines() {
  return (
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        transform: "perspective(500px) rotateX(60deg)",
        transformOrigin: "center top",
        maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
      }}
    />
  )
}

export function HeroSection() {
  const [currentGame, setCurrentGame] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [games, setGames] = useState(defaultGames)
  const [badge, setBadge] = useState("TOP 2 Ranking Mundial COD Mobile")
  const [stats, setStats] = useState(defaultStats)

  const typeText = useCallback((text: string, onComplete: () => void) => {
    let index = 0
    setDisplayText("")
    setIsTyping(true)

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        setTimeout(onComplete, 2000)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [])

  // Buscar configurações dinâmicas do hero
  useEffect(() => {
    async function fetchHeroConfig() {
      try {
        const response = await fetch('/api/hero-config')
        if (response.ok) {
          const data = await response.json()
          if (data.games && data.games.length > 0) {
            setGames(data.games)
          }
          if (data.badge) {
            setBadge(data.badge)
          }
          if (data.stats && data.stats.length > 0) {
            setStats(data.stats)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar hero config:', error)
      }
    }
    fetchHeroConfig()
  }, [])

  useEffect(() => {
    const cleanup = typeText(games[currentGame], () => {
      setCurrentGame((prev) => (prev + 1) % games.length)
    })
    return cleanup
  }, [currentGame, typeText])

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden noise-overlay">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-galorys-purple/10 via-transparent to-transparent" />
      <GradientOrbs />
      <Particles />
      <GridLines />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-28 md:pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-muted/50 border border-border mb-6 md:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs md:text-sm text-muted-foreground">{badge}</span>
          </motion.div>

          {/* Logo with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mb-4 md:mb-6 flex justify-center"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl bg-transparent border-2 border-galorys-purple p-2">
              <img 
                src="/images/logo/logo_g.png" 
                alt="Galorys" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground uppercase tracking-tight mb-3 md:mb-4"
          >
            SOMOS
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4 md:mb-6 flex justify-center"
          >
            <img
              src="/images/logo/logo_galorys.png"
              alt="Galorys"
              className="h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto"
            />
          </motion.div>

          {/* Typing Effect Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="h-7 md:h-8 mb-8 md:mb-10"
          >
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
              Dominando{" "}
              <span className="text-foreground font-medium">
                {displayText}
                <span
                  className={`inline-block w-0.5 h-4 md:h-5 bg-galorys-purple ml-1 ${isTyping ? "animate-pulse" : "opacity-0"}`}
                />
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            <Link href="/times" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="relative group w-full sm:w-auto bg-gradient-to-r from-galorys-purple to-galorys-pink hover:opacity-90 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(139,92,246,0.4)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  Conheça Nossos Times
                </span>
                <div className="absolute inset-0 animate-shimmer" />
              </Button>
            </Link>
            <Link href="/sobre" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border bg-muted/50 hover:bg-muted text-foreground px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:border-galorys-purple/50"
              >
                Sobre a Galorys
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 md:gap-8 lg:gap-16 mt-12 md:mt-16"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.p
                  className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator - Posicionado de forma relativa para evitar sobreposição */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 md:mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}