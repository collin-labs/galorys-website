"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ExternalLink, Radio, Gamepad2, Car, Smartphone, Target, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Interface para partida
interface Match {
  id: string
  team: string
  teamSlug: string
  teamGame: string
  teamLogo: string | null
  opponent: string
  opponentLogo: string | null
  tournament: string
  date: string
  status: "live" | "upcoming" | "finished"
  streamUrl: string | null
}

// Ícones por modalidade
const gameIcons: Record<string, { icon: typeof Gamepad2; color: string; bg: string }> = {
  "COD Mobile": { icon: Smartphone, color: "text-green-500", bg: "bg-green-500/20" },
  "Counter Strike 2": { icon: Target, color: "text-orange-500", bg: "bg-orange-500/20" },
  "Gran Turismo": { icon: Car, color: "text-blue-500", bg: "bg-blue-500/20" },
  "CS2 Galorynhos": { icon: Gamepad2, color: "text-purple-500", bg: "bg-purple-500/20" },
}

// Formatar data
function formatMatchDate(dateStr: string): { date: string; time: string } {
  const date = new Date(dateStr)
  return {
    date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  }
}

export function MatchesSection() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true)
        const response = await fetch("/api/matches?upcoming=true&limit=5")
        const data = await response.json()
        
        if (data.success) {
          setMatches(data.matches)
        }
      } catch (error) {
        console.error("Erro ao buscar partidas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  // Se não houver partidas e não estiver carregando, não renderiza a seção
  if (!loading && matches.length === 0) {
    return null
  }

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-galorys-surface/30 to-transparent" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            PRÓXIMAS <span className="gradient-text">PARTIDAS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Acompanhe os próximos jogos dos nossos times e não perca nenhuma ação
          </p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-galorys-purple" />
          </div>
        ) : (
          <>
            {/* Matches List */}
            <div className="max-w-4xl mx-auto space-y-4">
              {matches.map((match, index) => {
                const gameConfig = gameIcons[match.team] || {
                  icon: Gamepad2,
                  color: "text-galorys-purple",
                  bg: "bg-galorys-purple/20",
                }
                const GameIcon = gameConfig.icon
                const { date, time } = formatMatchDate(match.date)

                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01, x: 4 }}
                      className={`group relative rounded-2xl overflow-hidden glass border transition-all duration-300 ${
                        match.status === "live"
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-border hover:border-galorys-purple/30"
                      }`}
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                          {/* Top row - Status and Teams */}
                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Status Badge */}
                            {match.status === "live" ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                                <Radio className="w-3 h-3 mr-1" />
                                AO VIVO
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-border text-muted-foreground">
                                EM BREVE
                              </Badge>
                            )}

                            {/* Team Icons */}
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${gameConfig.bg} flex items-center justify-center`}
                              >
                                <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-md bg-white p-0.5 md:p-1">
                                  <Image src="/images/logo/logo_g.png" alt="Galorys" fill className="object-contain" />
                                </div>
                              </div>

                              <span className="text-muted-foreground text-xs md:text-sm font-bold">VS</span>

                              <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted/50 flex items-center justify-center`}
                              >
                                {match.opponentLogo ? (
                                  <Image src={match.opponentLogo} alt={match.opponent} width={24} height={24} className="object-contain" />
                                ) : (
                                  <GameIcon className={`w-5 h-5 md:w-6 md:h-6 ${gameConfig.color}`} />
                                )}
                              </div>
                            </div>

                            {/* Teams & Tournament */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm md:text-base truncate">
                                Galorys vs {match.opponent}
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">{match.tournament}</p>
                            </div>
                          </div>

                          {/* Bottom row - Date, Time and Button */}
                          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50 md:border-0 md:pt-0">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="flex items-center gap-1.5 md:gap-2 text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="text-xs md:text-sm">{date}</span>
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="text-xs md:text-sm">{time}</span>
                              </div>
                            </div>

                            {/* Watch Button */}
                            {match.streamUrl && (
                              <a href={match.streamUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                  size="sm"
                                  className={`${
                                    match.status === "live"
                                      ? "bg-green-500 hover:bg-green-600"
                                      : "bg-galorys-purple hover:bg-galorys-purple/80"
                                  } text-white text-xs md:text-sm`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                                  <span className="hidden sm:inline">{match.status === "live" ? "Assistir" : "Lembrar"}</span>
                                  <span className="sm:hidden">{match.status === "live" ? "Ver" : "+"}</span>
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>

            {/* View All Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <Button variant="outline" className="border-border bg-muted/50 hover:bg-muted">
                Ver Calendário Completo
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
