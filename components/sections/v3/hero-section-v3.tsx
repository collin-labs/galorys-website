"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown, Sparkles, Play, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const games = ["Counter Strike 2", "Call of Duty Mobile", "Gran Turismo", "Roblox"]

export function HeroSectionV3() {
  const [currentGame, setCurrentGame] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 150])

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <motion.div style={{ scale }} className="w-full h-full">
          {/* Fallback image while video loads */}
          <img
            src="/esports-arena-dark-purple-lights.jpg"
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Video element - uses a placeholder URL */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
            poster="/esports-arena-dark-purple-lights.jpg"
          >
            {/* Replace with actual video URL - for demo, using image as poster */}
            <source src="/videos/esports-background.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

        {/* Animated scan lines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
          }}
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Animated light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-1 h-[200%] bg-gradient-to-b from-transparent via-galorys-purple/20 to-transparent"
          style={{ left: "20%", top: "-50%" }}
          animate={{ x: [0, 200, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute w-1 h-[200%] bg-gradient-to-b from-transparent via-galorys-pink/20 to-transparent"
          style={{ left: "60%", top: "-50%" }}
          animate={{ x: [0, -200, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: 2 }}
        />
      </div>

      {/* Content */}
      <motion.div style={{ opacity, y }} className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/30 border border-white/10 mb-10 backdrop-blur-md"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-sm text-white/80 font-medium">TOP 2 Ranking Mundial COD Mobile</span>
          </motion.div>

          {/* Logo with cinematic reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 1, duration: 1, type: "spring" }}
            className="mb-8"
          >
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-galorys-purple to-galorys-pink shadow-[0_0_60px_rgba(139,92,246,0.5)]">
              <span className="text-6xl font-bold text-white">G</span>

              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </motion.div>

          {/* Main Title with cinematic effect */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <motion.h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white uppercase tracking-tighter mb-4"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8, type: "spring" }}
              style={{
                textShadow: "0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)",
              }}
            >
              SOMOS
            </motion.h1>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
              className="mb-8"
            >
              <span
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold gradient-text-animated"
                style={{
                  textShadow: "0 0 60px rgba(236, 72, 153, 0.5)",
                }}
              >
                galorys
              </span>
            </motion.div>
          </motion.div>

          {/* Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="h-10 mb-12"
          >
            <p className="text-xl md:text-2xl text-white/70">
              Dominando{" "}
              <span className="text-white font-medium">
                {displayText}
                <span
                  className={`inline-block w-0.5 h-6 bg-galorys-purple ml-1 ${isTyping ? "animate-pulse" : "opacity-0"}`}
                />
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons with cinematic hover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/times">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="relative group bg-gradient-to-r from-galorys-purple to-galorys-pink text-white px-10 py-7 text-lg rounded-2xl overflow-hidden transition-all duration-500 shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Conheça Nossos Times
                  </span>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </Link>

            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-10 py-7 text-lg rounded-2xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Área do Fã
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="flex items-center justify-center gap-12 md:gap-20 mt-16"
          >
            {[
              { value: "50+", label: "Conquistas" },
              { value: "25+", label: "Atletas" },
              { value: "5", label: "Modalidades" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.3 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Video Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-24 right-8 z-20"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="w-12 h-12 rounded-full border-white/20 bg-black/30 backdrop-blur-sm hover:bg-white/10"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center gap-3 text-white/50 cursor-pointer hover:text-white/80 transition-colors"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
