"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Users, Gamepad2, Trophy, Star, Twitter, Instagram, Twitch, Youtube, Loader2 } from "lucide-react"

// Interfaces para os dados do banco
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
  team: {
    id: string
    name: string
    slug: string
    game: string
  }
}

interface TeamWithPlayers {
  id: string
  name: string
  slug: string
  game: string
  players: Player[]
}

// Função para gerar avatar placeholder
const getPlayerAvatar = (nickname: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=9B30FF&color=fff&size=256`
}

// Ícones dos jogos
const gameIcons: Record<string, string> = {
  'GRAN_TURISMO': '🏎️',
  'CODM': '🎯',
  'CS2_GALORYNHOS': '💜',
  'CS2': '🎮',
}

export function JogadoresContent() {
  const [teams, setTeams] = useState<TeamWithPlayers[]>([])
  const [loading, setLoading] = useState(true)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalTeams: 0,
    totalAchievements: 0,
  })

  const handleImgError = (playerId: string) => {
    setImgErrors(prev => ({ ...prev, [playerId]: true }))
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar todos os jogadores ativos com seus times
        const playersRes = await fetch('/api/admin/players')
        const playersData = await playersRes.json()
        
        // Filtrar apenas jogadores ativos
        const activePlayers = (playersData.players || []).filter((p: Player) => p.active)
        
        // Agrupar jogadores por time
        const teamsMap = new Map<string, TeamWithPlayers>()
        
        activePlayers.forEach((player: Player) => {
          const teamId = player.team.id
          if (!teamsMap.has(teamId)) {
            teamsMap.set(teamId, {
              id: player.team.id,
              name: player.team.name,
              slug: player.team.slug,
              game: player.team.game,
              players: []
            })
          }
          teamsMap.get(teamId)!.players.push(player)
        })
        
        // Converter para array e ordenar
        const teamsArray = Array.from(teamsMap.values())
        
        setTeams(teamsArray)
        setStats({
          totalPlayers: activePlayers.length,
          totalTeams: teamsArray.length,
          totalAchievements: 15, // Poderia buscar de outra API
        })
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statsDisplay = [
    { icon: Users, value: stats.totalPlayers.toString(), label: "Atletas Ativos" },
    { icon: Gamepad2, value: stats.totalTeams.toString(), label: "Modalidades" },
    { icon: Trophy, value: stats.totalAchievements.toString(), label: "Conquistas" },
    { icon: Star, value: "TOP 2", label: "Ranking Mundial COD" },
  ]

  if (loading) {
    return (
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Carregando jogadores...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-galorys-purple/10 border border-galorys-purple/20 text-galorys-purple text-sm font-medium mb-4">
            Nossos Atletas
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            CONHEÇA NOSSOS <span className="gradient-text">JOGADORES</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Os atletas que representam a Galorys nos principais cenários competitivos do mundo.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {statsDisplay.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-4 md:p-6 border border-border text-center"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-galorys-purple" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Teams & Players */}
        {teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum jogador ativo encontrado.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {teams.map((team, teamIndex) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: teamIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">
                    {gameIcons[team.game] || '🎮'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{team.name}</h2>
                  <span className="text-muted-foreground text-sm">| {team.players.length} Jogadores</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                  {team.players.map((player, playerIndex) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: playerIndex * 0.05 }}
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
