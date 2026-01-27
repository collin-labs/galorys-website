"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Users, Gamepad2, Trophy, Star, Twitter, Instagram, Twitch, Youtube } from "lucide-react"
import { getAllPlayers, getPlayersByTeam, getPlayerAvatar } from "@/lib/data/players"
import { teams } from "@/lib/data/teams"

const stats = [
  { icon: Users, value: "18", label: "Atletas Ativos" },
  { icon: Gamepad2, value: "4", label: "Modalidades" },
  { icon: Trophy, value: "15", label: "Conquistas" },
  { icon: Star, value: "TOP 2", label: "Ranking Mundial COD" },
]

export function JogadoresContent() {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const handleImgError = (playerId: string) => {
    setImgErrors(prev => ({ ...prev, [playerId]: true }))
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
          {stats.map((stat, index) => (
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
        <div className="space-y-12">
          {teams.map((team, teamIndex) => {
            const teamPlayers = getPlayersByTeam(team.slug)
            
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: teamIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">
                    {team.game === 'GRAN_TURISMO' && '🏎️'}
                    {team.game === 'CODM' && '🎯'}
                    {team.game === 'CS2_GALORYNHOS' && '💜'}
                    {team.game === 'CS2' && '🎮'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{team.name}</h2>
                  <span className="text-muted-foreground text-sm">| {teamPlayers.length} Jogadores</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                  {teamPlayers.map((player, playerIndex) => (
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
                              src={imgErrors[player.id] ? getPlayerAvatar(player.nickname) : player.photo}
                              alt={player.nickname}
                              fill
                              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                              onError={() => handleImgError(player.id)}
                            />
                            {/* Captain badge */}
                            {player.role.toLowerCase().includes('capitão') && (
                              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                <Star className="w-4 h-4 text-white fill-white" />
                              </div>
                            )}
                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            {/* Info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="font-bold text-white">{player.nickname}</h3>
                              <p className="text-white/70 text-sm truncate">{player.realName}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-galorys-purple/20 text-galorys-purple mb-3">
                              {player.role}
                            </span>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {player.socials?.twitter && (
                                <a
                                  href={player.socials.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-[#1DA1F2] transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Twitter className="w-4 h-4" />
                                </a>
                              )}
                              {player.socials?.instagram && (
                                <a
                                  href={player.socials.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-[#E4405F] transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Instagram className="w-4 h-4" />
                                </a>
                              )}
                              {player.socials?.twitch && (
                                <a
                                  href={player.socials.twitch}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-[#9146FF] transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Twitch className="w-4 h-4" />
                                </a>
                              )}
                              {player.socials?.youtube && (
                                <a
                                  href={player.socials.youtube}
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
