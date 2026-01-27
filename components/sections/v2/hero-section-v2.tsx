"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ChevronDown, Sparkles, ChevronLeft, ChevronRight, Trophy, Users, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const games = ["Counter Strike 2", "Call of Duty Mobile", "Gran Turismo", "Roblox"]

// Carousel slides with featured content
const heroSlides = [
  {
    id: 1,
    title: "SOMOS",
    highlight: "galorys",
    subtitle: "Dominando os eSports desde 2020",
    image: "/esports-arena-dark-purple-lights.jpg",
    badge: "TOP 2 Ranking Mundial COD Mobile",
    cta: "Conheça Nossos Times",
    ctaLink: "/times",
  },
  {
    id: 2,
    title: "CONQUISTE",
    highlight: "recompensas",
    subtitle: "Seja um verdadeiro fã e ganhe prêmios exclusivos",
    image: "/gaming-rewards-dark-neon.jpg",
    badge: "Novo Sistema de Recompensas",
    cta: "Área do Fã",
    ctaLink: "/dashboard",
  },
  {
    id: 3,
    title: "ASSISTA",
    highlight: "ao vivo",
    subtitle: "Acompanhe nossas partidas e torça pelo time",
    image: "/esports-tournament-dark-stage.jpg",
    badge: "Partidas Toda Semana",
    cta: "Ver Calendário",
    ctaLink: "/partidas",
  },
]

// 3D floating cards for visual effect
function FloatingCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-40 rounded-xl bg-gradient-to-br from-galorys-purple/20 to-galorys-pink/20 backdrop-blur-sm border border-white/10"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotateY: [0, 10, 0],
            rotateX: [0, 5, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Animated particles with trails
function AnimatedParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -800],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-galorys-purple/60 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
        </motion.div>
      ))}
    </div>
  )
}

// Morphing background shapes
function MorphingShapes() {
  return (
    <>
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-galorys-purple/15 blur-[120px]"
        style={{ top: "5%", left: "-10%" }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-galorys-pink/10 blur-[100px]"
        style={{ bottom: "10%", right: "-5%" }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[80px]"
        style={{ top: "40%", right: "20%" }}
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </>
  )
}

export function HeroSectionV2() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentGame, setCurrentGame] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

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

  useEffect(() => {
    const cleanup = typeText(games[currentGame], () => {
      setCurrentGame((prev) => (prev + 1) % games.length)
    })
    return cleanup
  }, [currentGame, typeText])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-galorys-purple/5 via-transparent to-transparent" />
      <MorphingShapes />
      <AnimatedParticles />
      <FloatingCards />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Carousel Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={heroSlides[currentSlide].image || "/placeholder.svg"}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <motion.div style={{ opacity, scale, y }} className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Animated Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-8 backdrop-blur-sm"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-sm text-muted-foreground">{heroSlides[currentSlide].badge}</span>
            </motion.div>
          </AnimatePresence>

          {/* Logo with enhanced glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mb-6"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 30px rgba(139, 92, 246, 0.4)",
                  "0 0 60px rgba(139, 92, 246, 0.6)",
                  "0 0 30px rgba(139, 92, 246, 0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-galorys-purple to-galorys-pink"
            >
              <span className="text-5xl font-bold text-white">G</span>
            </motion.div>
          </motion.div>

          {/* Animated Title with Carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground uppercase tracking-tight mb-4">
                {heroSlides[currentSlide].title}
              </h1>

              <div className="mb-6">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text-animated">
                  {heroSlides[currentSlide].highlight}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="h-8 mb-10"
          >
            <p className="text-lg md:text-xl text-muted-foreground">
              Dominando{" "}
              <span className="text-foreground font-medium">
                {displayText}
                <span
                  className={`inline-block w-0.5 h-5 bg-galorys-purple ml-1 ${isTyping ? "animate-pulse" : "opacity-0"}`}
                />
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href={heroSlides[currentSlide].ctaLink}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="relative group bg-gradient-to-r from-galorys-purple to-galorys-pink hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_50px_rgba(139,92,246,0.5)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {heroSlides[currentSlide].cta}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-galorys-pink to-galorys-purple"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-muted/50 hover:bg-muted text-foreground px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:border-galorys-purple/50"
              >
                Área do Fã
              </Button>
            </Link>
          </motion.div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border-border bg-muted/50 hover:bg-muted"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-8 h-2 bg-galorys-purple"
                      : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border-border bg-muted/50 hover:bg-muted"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats with animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 md:gap-16"
          >
            {[
              { icon: Trophy, value: "50+", label: "Conquistas" },
              { icon: Users, value: "25+", label: "Atletas" },
              { icon: Gamepad2, value: "5", label: "Modalidades" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50 mb-2 group-hover:bg-galorys-purple/20 transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <stat.icon className="w-5 h-5 text-galorys-purple" />
                </motion.div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      </motion.div>
    </section>
  )
}
