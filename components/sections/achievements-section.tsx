"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Trophy, Medal, Target, Crown, ArrowRight, Calendar, Loader2 } from "lucide-react"

// Interface para conquistas do banco
interface AchievementDB {
  id: string
  title: string
  tournament: string
  placement: string
  date: string
  team: {
    id: string
    name: string
    game: string
    slug: string
  }
}

// Mapeamento de placement para ícone e cor
const placementConfig: Record<string, { icon: any, color: string }> = {
  "1º Lugar": { icon: Crown, color: "from-yellow-500 to-amber-500" },
  "2º Lugar": { icon: Trophy, color: "from-gray-400 to-gray-500" },
  "3º Lugar": { icon: Medal, color: "from-amber-600 to-orange-600" },
  "4º Lugar": { icon: Medal, color: "from-blue-500 to-cyan-500" },
  "default": { icon: Target, color: "from-galorys-purple to-galorys-pink" },
}

function getPlacementConfig(placement: string) {
  return placementConfig[placement] || placementConfig["default"]
}

// Dados estáticos como fallback
const fallbackAchievements = [
  {
    id: "1",
    title: "Tetra Campeão Stage 4",
    tournament: "Call of Duty Mobile Championship",
    placement: "1º Lugar",
    date: "2024",
    team: "COD Mobile",
    icon: Crown,
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "2",
    title: "Bicampeão VCB",
    tournament: "Valorant Challengers Brazil",
    placement: "1º Lugar",
    date: "2024",
    team: "Valorant",
    icon: Trophy,
    color: "from-red-500 to-rose-500",
  },
  {
    id: "3",
    title: "4º Lugar Olimpíadas Virtuais",
    tournament: "Gran Turismo - Singapura",
    placement: "4º Lugar",
    date: "2024",
    team: "Gran Turismo",
    icon: Medal,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "4",
    title: "Campeão Brasileiro",
    tournament: "Age of Empires Championship",
    placement: "1º Lugar",
    date: "2024",
    team: "Age of Empires",
    icon: Target,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "5",
    title: "TOP 2 Ranking Mundial",
    tournament: "Call of Duty Mobile Global",
    placement: "2º Lugar",
    date: "2024",
    team: "COD Mobile",
    icon: Crown,
    color: "from-green-500 to-emerald-500",
  },
]

const stats = [
  { label: "Títulos Nacionais", value: 35, suffix: "+" },
  { label: "Títulos Internacionais", value: 15, suffix: "+" },
  { label: "Recordes Mundiais", value: 20, suffix: "+" },
  { label: "Anos de História", value: 5, suffix: "" },
]

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2000,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

// Converter dados do banco para formato da UI
function convertDBToUI(dbAchievements: AchievementDB[]) {
  return dbAchievements.map(a => {
    const config = getPlacementConfig(a.placement)
    return {
      id: a.id,
      title: a.title,
      tournament: a.tournament,
      placement: a.placement,
      date: new Date(a.date).getFullYear().toString(),
      team: a.team.name,
      icon: config.icon,
      color: config.color,
    }
  })
}

export function AchievementsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [achievements, setAchievements] = useState(fallbackAchievements)
  const [loading, setLoading] = useState(true)
  const [statsData, setStatsData] = useState(stats)

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const response = await fetch('/api/admin/achievements?featured=true&limit=5')
        if (response.ok) {
          const data = await response.json()
          if (data.achievements && data.achievements.length > 0) {
            const converted = convertDBToUI(data.achievements)
            setAchievements(converted)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar conquistas:', error)
      } finally {
        setLoading(false)
      }
    }

    async function fetchStats() {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          if (data.stats && data.stats.length > 0) {
            setStatsData(data.stats)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar stats:', error)
      }
    }

    fetchAchievements()
    fetchStats()
  }, [])

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" id="conquistas" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-galorys-surface" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-64 md:w-96 h-64 md:h-96 bg-galorys-purple/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-64 md:w-96 h-64 md:h-96 bg-galorys-pink/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-galorys-pink/10 border border-galorys-pink/20 text-galorys-pink text-sm font-medium mb-4">
            Nosso Legado
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            CONQUISTAS <span className="gradient-text">HISTÓRICAS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Uma trajetória de vitórias que nos consolida como uma das principais organizações de eSports do Brasil.
          </p>
        </motion.div>

        {/* Stats counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-16"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-galorys-purple to-galorys-pink opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" />
              <div className="relative p-4 md:p-6 rounded-2xl glass border border-border text-center hover:border-galorys-purple/30 transition-colors">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1 md:mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline de conquistas */}
        <div className="relative">
          {/* Linha central */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-galorys-purple via-galorys-pink to-cyan-500 hidden md:block" />

          <div className="space-y-6 md:space-y-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col md:gap-8`}
              >
                {/* Card */}
                <div className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="group relative overflow-hidden rounded-xl glass border border-border p-4 md:p-6 hover:border-galorys-purple/30 transition-all">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${achievement.color} mb-3 md:mb-4`}
                    >
                      <achievement.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-base md:text-xl font-bold text-foreground mb-1 md:mb-2 group-hover:text-galorys-purple transition-all">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3">{achievement.tournament}</p>

                    {/* Meta */}
                    <div
                      className={`flex items-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap ${index % 2 === 0 ? "md:justify-end" : ""}`}
                    >
                      <span
                        className={`px-2 py-0.5 md:py-1 rounded-full bg-gradient-to-r ${achievement.color} text-white text-xs font-semibold`}
                      >
                        {achievement.placement}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {achievement.date}
                      </span>
                      <span className="text-muted-foreground">{achievement.team}</span>
                    </div>

                    {/* Hover glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}
                    />
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-galorys-purple border-4 border-background z-10" />

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-10 md:mt-16"
        >
          <Link
            href="/conquistas"
            className="inline-flex items-center gap-2 text-galorys-purple hover:text-foreground transition-colors"
          >
            Ver todas as conquistas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}