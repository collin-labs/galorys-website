"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Trophy, Calendar, Loader2 } from "lucide-react"
import { teams as fallbackTeamsData } from "@/lib/data/teams"

// Interface para dados do banco
interface TeamDB {
  id: string
  name: string
  slug: string
  shortName: string | null
  game: string
  gameLabel: string | null
  description: string | null
  logo: string | null
  banner: string | null
  color: string | null
  bgColor: string | null
  textColor: string | null
  badge: string | null
  playersCount: number
  titlesCount: number
  foundedYear: string | null
  active: boolean
}

interface EliteTeamDB {
  id: string
  teamId: string
  order: number
  team: TeamDB
}

// Tipo unificado para renderização
interface TeamUI {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  banner: string
  color: string
  badge: string | null
  stats: {
    players: number
    titles: number
    since: string
  }
}

// Converter dados do banco para o formato da UI
function convertDBtoUI(dbTeams: EliteTeamDB[]): TeamUI[] {
  return dbTeams.map(et => ({
    id: et.team.id,
    name: et.team.name,
    slug: et.team.slug,
    description: et.team.description || '',
    logo: et.team.logo || '/images/teams/default.png',
    banner: et.team.banner || '/images/teams/fundo-geral.webp',
    color: et.team.color || 'from-galorys-purple to-galorys-pink',
    badge: et.team.badge,
    stats: {
      players: et.team.playersCount || 0,
      titles: et.team.titlesCount || 0,
      since: et.team.foundedYear || '2024',
    }
  }))
}

// Converter fallback estático para formato UI
function convertFallbackToUI(teams: typeof fallbackTeamsData): TeamUI[] {
  return teams.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    logo: t.logo,
    banner: t.banner,
    color: t.color,
    badge: t.badge || null,
    stats: t.stats,
  }))
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export function TeamsSection() {
  const [teams, setTeams] = useState<TeamUI[]>(convertFallbackToUI(fallbackTeamsData))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEliteTeams() {
      try {
        const response = await fetch('/api/admin/elite-teams')
        if (response.ok) {
          const data = await response.json()
          if (data.eliteTeams && data.eliteTeams.length > 0) {
            // Ordenar e converter dados do banco
            const sortedTeams = data.eliteTeams.sort((a: EliteTeamDB, b: EliteTeamDB) => a.order - b.order)
            const uiTeams = convertDBtoUI(sortedTeams)
            
            if (uiTeams.length > 0) {
              setTeams(uiTeams)
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar times de elite:', error)
        // Fallback: usar dados estáticos (já definido no useState inicial)
      } finally {
        setLoading(false)
      }
    }
    fetchEliteTeams()
  }, [])

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-galorys-surface/30 to-background" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
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

        {/* Teams Grid - Responsivo */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
        >
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-galorys-purple" />
            </div>
          ) : (
            teams.map((team) => (
            <motion.div key={team.id} variants={itemVariants}>
              <Link href={`/times/${team.slug}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative h-72 sm:h-80 md:h-96 lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl"
                >
                  {/* Background Image (fundo-geral.webp) */}
                  <div className="absolute inset-0">
                    <Image
                      src={team.banner}
                      alt={`Background ${team.name}`}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay escuro com gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/90" />
                    {/* Overlay colorido do time */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${team.color} opacity-15`} />
                  </div>

                  {/* Logo do Jogo - No TOPO */}
                  <div className="absolute top-6 sm:top-8 left-0 right-0 flex justify-center">
                    <motion.div
                      initial={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60"
                    >
                      <Image
                        src={team.logo}
                        alt={team.name}
                        fill
                        className="object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover:drop-shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-500"
                      />
                    </motion.div>
                  </div>

                  {/* Badge do time (se existir) */}
                  {team.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-galorys-purple to-galorys-pink text-white text-xs font-bold shadow-lg z-10">
                      {team.badge}
                    </div>
                  )}

                  {/* Content Overlay - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                    {/* Description */}
                    <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {team.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 text-white/80 text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{team.stats.players} jogadores</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/80 text-xs sm:text-sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Desde {team.stats.since}</span>
                      </div>
                      {team.stats.titles > 0 && (
                        <div className="flex items-center gap-1.5 text-yellow-400 text-xs sm:text-sm">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{team.stats.titles} títulos</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-white font-medium text-sm sm:text-base group-hover:text-galorys-purple transition-colors">
                      <span>Conhecer Time</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-t ${team.color} opacity-10`} />
                    <div className="absolute inset-0 border-2 border-galorys-purple/50 rounded-2xl" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))
          )}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link
            href="/times"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-galorys-purple to-galorys-pink text-white font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity shadow-lg"
          >
            <span>Ver Todos os Times</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}