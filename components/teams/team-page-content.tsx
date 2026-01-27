"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Users, ExternalLink, Trophy } from "lucide-react"
import { TeamHero } from "./team-hero"
import { TeamInfo } from "./team-info"
import { PlayerCard } from "./player-card"
import type { Team } from "@/lib/data/teams"
import { getPlayersByTeam } from "@/lib/data/players"

interface TeamPageContentProps {
  team: Team
}

export function TeamPageContent({ team }: TeamPageContentProps) {
  // Buscar jogadores do time
  const players = getPlayersByTeam(team.slug)

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
                Jogadores ({players.length})
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

          {players.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {players.map((player, index) => (
                <PlayerCard key={player.id} player={player} teamSlug={team.slug} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum jogador cadastrado neste time ainda.
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
