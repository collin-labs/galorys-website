"use client"

import { motion } from "framer-motion"
import { Users, Trophy, Calendar } from "lucide-react"
import type { Team } from "@/lib/data/teams"

interface TeamInfoProps {
  team: Team
  playersCount?: number
}

export function TeamInfo({ team, playersCount = 0 }: TeamInfoProps) {
  const achievementsCount = team.achievements?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 md:p-8 border border-border"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{team.name}</h1>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">{team.description}</p>

      {/* Badge se existir */}
      {team.badge && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-galorys-purple/20 text-galorys-purple text-sm font-medium">
            💜 {team.badge}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground font-medium">{playersCount} jogadores</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
          <Trophy className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground font-medium">{achievementsCount} conquistas</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            Desde <span className="font-bold">{team.stats?.since || '2022'}</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
