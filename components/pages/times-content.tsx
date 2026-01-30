"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { PageHeader } from "@/components/ui/page-header"
import { Users, Trophy, Calendar, ArrowRight, Loader2 } from "lucide-react"

interface Team {
  id: string
  name: string
  slug: string
  game: string
  description: string | null
  active: boolean
  foundedYear: string | null
  badge: string | null
  _count: {
    players: number
    achievements: number
  }
}

// Cores por jogo
const teamColors: Record<string, string> = {
  'GRAN_TURISMO': "from-blue-500 to-cyan-500",
  'CODM': "from-orange-500 to-red-500",
  'CS2_GALORYNHOS': "from-galorys-purple to-galorys-pink",
  'CS2': "from-yellow-500 to-orange-500",
}

export function TimesContent() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('/api/admin/teams')
        const data = await res.json()
        // Filtrar apenas times ativos
        const activeTeams = (data.teams || []).filter((t: Team) => t.active)
        setTeams(activeTeams)
      } catch (error) {
        console.error('Erro ao buscar times:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  if (loading) {
    return (
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Carregando times...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <PageHeader
          badge="Nossas Equipes"
          title="TIMES DE"
          highlightedText="ELITE"
          description="A Galorys possui times profissionais competindo em múltiplas modalidades, desde FPS até simuladores de corrida. Conheça cada uma de nossas equipes e seus atletas."
        />

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum time ativo encontrado.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="glass rounded-2xl p-6 md:p-8 border border-border hover:border-galorys-purple/50 transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{team.name}</h3>
                    {team.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-galorys-pink/20 text-galorys-pink border border-galorys-pink/30">
                        {team.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">
                    {team.description || `Time de ${team.name} da Galorys eSports.`}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass rounded-xl p-4 text-center border border-border">
                      <Users className="w-5 h-5 mx-auto mb-2 text-galorys-purple" />
                      <p className="text-xl font-bold text-foreground">{team._count?.players || 0}</p>
                      <p className="text-xs text-muted-foreground">Jogadores</p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center border border-border">
                      <Trophy className="w-5 h-5 mx-auto mb-2 text-galorys-pink" />
                      <p className="text-xl font-bold text-foreground">{team._count?.achievements || 0}</p>
                      <p className="text-xs text-muted-foreground">Conquistas</p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center border border-border">
                      <Calendar className="w-5 h-5 mx-auto mb-2 text-galorys-purple" />
                      <p className="text-xl font-bold text-foreground">{team.foundedYear || '2024'}</p>
                      <p className="text-xs text-muted-foreground">Desde</p>
                    </div>
                  </div>

                  <Link
                    href={`/times/${team.slug}`}
                    className="flex items-center justify-between text-muted-foreground hover:text-galorys-purple transition-colors group/link"
                  >
                    <span className="text-sm">Ver time completo</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
