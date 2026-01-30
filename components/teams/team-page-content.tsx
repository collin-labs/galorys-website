"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, ExternalLink, Trophy, Loader2, Star, Twitter, Instagram, Twitch, Youtube } from "lucide-react"
import { TeamHero } from "./team-hero"
import { TeamInfo } from "./team-info"

// Interface do jogador do banco
interface Player {
  id: string
  nickname: string
  realName: string | null
  slug: string
  photo: string | null
  role: string | null
  active: boolean
  twitter: string | null
  instagram: string | null
  twitch: string | null
  youtube: string | null
}

interface Team {
  id?: string
  slug: string
  name: string
  game: string
  description?: string
  longDescription?: string
  logo?: string
  banner?: string
  achievements?: string[]
}

interface TeamPageContentProps {
  team: Team
}

// Função para gerar avatar placeholder
const getPlayerAvatar = (nickname: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=9B30FF&color=fff&size=256`
}

export function TeamPageContent({ team }: TeamPageContentProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const handleImgError = (playerId: string) => {
    setImgErrors(prev => ({ ...prev, [playerId]: true }))
  }

  // Buscar jogadores do banco de dados
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/admin/players')
        const data = await res.json()
        
        // Filtrar jogadores ATIVOS deste time
        const teamPlayers = (data.players || []).filter((p: Player & { team: { slug: string } }) => 
          p.team.slug === team.slug && p.active === true
        )
        
        setPlayers(teamPlayers)
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlayers()
  }, [team.slug])

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href="/times"
            className="inline-flex items-center gap-2 text-galorys-purple hover:text-galorys-pink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">VOLTAR</span>
          </Link>
        </motion.div>

        {/* Hero Banner */}
        <TeamHero team={team} />

        {/* Team Info Card */}
        <div className="mt-8 mb-12">
          <TeamInfo team={team} playersCount={players.length} />
        </div>

        {/* Players Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-galorys-purple" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Jogadores ({loading ? '...' : players.length})
              </h2>
            </div>
            <Link
              href="/jogadores"
              className="text-sm text-galorys-pink hover:text-galorys-purple transition-colors flex items-center gap-1"
            >
              Ver todos
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando jogadores...</span>
            </div>
          ) : players.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={`/times/${team.slug}/jogador/${player.id}`}>
                    <div className="glass rounded-2xl overflow-hidden border border-border hover:border-galorys-purple/50 transition-all">
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-galorys-purple/20 to-galorys-pink/20">
                        {/* Background */}
                        <Image
                          src="/images/base/base-imagem-galorys.png"
                          alt="Background"
                          fill
                          className="object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        {/* Player photo */}
                        <Image
                          src={imgErrors[player.id] || !player.photo ? getPlayerAvatar(player.nickname) : player.photo}
                          alt={player.nickname}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          onError={() => handleImgError(player.id)}
                        />
                        {/* Captain badge */}
                        {player.role?.toLowerCase().includes('capitão') && (
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                            <Star className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        {/* Info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-bold text-white">{player.nickname}</h3>
                          <p className="text-white/70 text-sm truncate">{player.realName || '-'}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-galorys-purple/20 text-galorys-purple mb-3">
                          {player.role || 'Player'}
                        </span>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {player.twitter && (
                            <a
                              href={player.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-[#1DA1F2] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {player.instagram && (
                            <a
                              href={player.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-[#E4405F] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {player.twitch && (
                            <a
                              href={player.twitch}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-[#9146FF] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Twitch className="w-4 h-4" />
                            </a>
                          )}
                          {player.youtube && (
                            <a
                              href={player.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-[#FF0000] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Youtube className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum jogador ativo neste time.
            </div>
          )}
        </motion.div>

        {/* Achievements Section */}
        {team.achievements && team.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-galorys-purple" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Conquistas ({team.achievements.length})
                </h2>
              </div>
            </div>

            <div className="grid gap-4">
              {team.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl glass border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏆</span>
                    <span className="text-foreground">{achievement}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Description */}
        {team.longDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Sobre o Time</h2>
            <div className="prose prose-invert max-w-none">
              {team.longDescription.split('\n').map((paragraph, i) => (
                <p key={i} className="text-muted-foreground mb-4">{paragraph}</p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
