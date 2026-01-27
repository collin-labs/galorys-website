"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Users, Trophy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const teams = [
  {
    id: "gran-turismo",
    name: "Gran Turismo",
    game: "Gran Turismo 7",
    description: "Velocidade e precisão nas pistas virtuais. Nossos pilotos dominam cada curva.",
    players: 3,
    achievements: 12,
    ranking: "Top 10 BR",
    image: "/gran-turismo-racing-game-dark-background.jpg",
    logo: "/gran-turismo-logo.jpg",
    color: "from-blue-500 to-blue-600",
    bgGlow: "bg-blue-500/20",
  },
  {
    id: "cod-mobile",
    name: "Call of Duty Mobile",
    game: "COD Mobile",
    description: "Elite tática mobile dominando o cenário mundial. Precisão e trabalho em equipe.",
    players: 6,
    achievements: 25,
    ranking: "Top 2 Mundial",
    image: "/call-of-duty-mobile-game-dark-soldiers.jpg",
    logo: "/call-of-duty-mobile-logo.png",
    color: "from-orange-500 to-red-600",
    bgGlow: "bg-orange-500/20",
  },
  {
    id: "cs2-galorynhos",
    name: "CS2 Galorynhos",
    game: "Counter Strike 2",
    description: "As novas promessas do cenário competitivo. O futuro dos eSports brasileiros.",
    players: 5,
    achievements: 8,
    ranking: "Rising Stars",
    image: "/counter-strike-2-game-dark-tactical.jpg",
    logo: "/counter-strike-2-logo-purple.jpg",
    color: "from-purple-500 to-pink-600",
    bgGlow: "bg-purple-500/20",
  },
  {
    id: "cs2",
    name: "Counter Strike 2",
    game: "Counter Strike 2",
    description: "Time principal dominando as competições. Experiência e estratégia incomparáveis.",
    players: 5,
    achievements: 15,
    ranking: "Top 5 BR",
    image: "/counter-strike-2-game-dark-neon.jpg",
    logo: "/counter-strike-2-logo.png",
    color: "from-yellow-500 to-orange-600",
    bgGlow: "bg-yellow-500/20",
  },
]

export function TeamsSectionV2() {
  const [activeTeam, setActiveTeam] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Auto-rotate teams
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveTeam((prev) => (prev + 1) % teams.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const nextTeam = () => {
    setIsAutoPlaying(false)
    setActiveTeam((prev) => (prev + 1) % teams.length)
  }

  const prevTeam = () => {
    setIsAutoPlaying(false)
    setActiveTeam((prev) => (prev - 1 + teams.length) % teams.length)
  }

  const currentTeam = teams[activeTeam]

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Dynamic background based on active team */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTeam}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${currentTeam.bgGlow} blur-[150px] opacity-30`}
          style={{ transform: "translateY(-30%)" }}
        />
      </AnimatePresence>

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-galorys-purple/10 border border-galorys-purple/20 text-galorys-purple text-sm font-medium mb-4">
            Nossas Modalidades
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            TIMES DE <span className="gradient-text">ELITE</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça nossos times profissionais que competem nas principais competições de eSports do mundo
          </p>
        </motion.div>

        {/* Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          {/* Featured Team Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Link href={`/times/${currentTeam.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden"
                >
                  {/* Image */}
                  <img
                    src={currentTeam.image || "/placeholder.svg"}
                    alt={currentTeam.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${currentTeam.color} opacity-60 mix-blend-multiply`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <motion.div
                      className="w-20 h-20 rounded-2xl bg-muted/30 backdrop-blur-md flex items-center justify-center mb-4 overflow-hidden"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <img
                        src={currentTeam.logo || "/placeholder.svg"}
                        alt={`${currentTeam.name} logo`}
                        className="w-14 h-14 object-contain"
                      />
                    </motion.div>

                    <span
                      className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${currentTeam.color} text-white text-xs font-medium w-fit mb-2`}
                    >
                      {currentTeam.ranking}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentTeam.name}</h3>
                    <p className="text-white/80 mb-4 max-w-md">{currentTeam.description}</p>

                    <div className="flex items-center gap-2 text-white font-medium group-hover:text-galorys-purple transition-colors">
                      <span>Ver Time</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/30 transition-colors" />
                </motion.div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Team Stats & Selection */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTeam}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { icon: Users, value: currentTeam.players, label: "Jogadores" },
                  { icon: Trophy, value: currentTeam.achievements, label: "Conquistas" },
                  { icon: Star, value: currentTeam.ranking, label: "Ranking" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl bg-card border border-border text-center"
                  >
                    <stat.icon className="w-5 h-5 text-galorys-purple mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Team Selector */}
            <div className="space-y-3">
              {teams.map((team, index) => (
                <motion.button
                  key={team.id}
                  onClick={() => {
                    setActiveTeam(index)
                    setIsAutoPlaying(false)
                  }}
                  whileHover={{ x: 8 }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    index === activeTeam
                      ? "bg-galorys-purple/20 border border-galorys-purple/30"
                      : "bg-card border border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden">
                    <img src={team.logo || "/placeholder.svg"} alt="" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${index === activeTeam ? "text-galorys-purple" : "text-foreground"}`}>
                      {team.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{team.game}</p>
                  </div>
                  {index === activeTeam && (
                    <motion.div layoutId="team-indicator" className="w-2 h-8 rounded-full bg-galorys-purple" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTeam}
                  className="w-10 h-10 rounded-full bg-transparent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTeam}
                  className="w-10 h-10 rounded-full bg-transparent"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <Link href="/times">
                <Button variant="outline" className="rounded-full bg-transparent">
                  Ver Todos os Times
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
