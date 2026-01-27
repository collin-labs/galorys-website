"use client"

import { motion } from "framer-motion"
import { Star, Heart, Gift, Trophy } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { PointsHistory } from "@/components/dashboard/points-history"
import { FeaturedTeams } from "@/components/dashboard/featured-teams"
import { RecentAchievements } from "@/components/dashboard/recent-achievements"
import { MatchesBanner } from "@/components/dashboard/matches-banner"

// Mock user data
const userData = {
  name: "Bruno",
  points: 100,
  favoriteTeams: 0,
  rewards: 0,
  level: 1,
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Olá, {userData.name}! <span className="inline-block animate-bounce-slow">👋</span>
        </h1>
        <p className="text-muted-foreground">Bem-vindo de volta à sua Área do Fã. Confira as novidades!</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        <StatCard icon={Star} value={userData.points} label="Pontos Totais" iconColor="text-yellow-400" />
        <StatCard icon={Heart} value={userData.favoriteTeams} label="Times Favoritos" iconColor="text-pink-400" />
        <StatCard icon={Gift} value={userData.rewards} label="Recompensas" iconColor="text-galorys-purple" />
        <StatCard icon={Trophy} value={userData.level} label="Nível" iconColor="text-green-400" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            icon={Heart}
            title="Favoritar Times"
            description="Acompanhe seus times favoritos"
            href="/dashboard/favoritos"
            iconBgColor="bg-pink-500/20"
            iconColor="text-pink-400"
          />
          <QuickActionCard
            icon={Gift}
            title="Ver Recompensas"
            description="Troque pontos por prêmios"
            href="/dashboard/recompensas"
            iconBgColor="bg-galorys-purple/20"
            iconColor="text-galorys-purple"
          />
          <QuickActionCard
            icon={Star}
            title="Assistir Partidas"
            description="Ao vivo e replays"
            href="/partidas"
            iconBgColor="bg-yellow-500/20"
            iconColor="text-yellow-400"
          />
        </div>
      </motion.div>

      {/* Points History & Featured Teams */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
      >
        <PointsHistory />
        <FeaturedTeams />
      </motion.div>

      {/* Recent Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <RecentAchievements />
      </motion.div>

      {/* Matches Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <MatchesBanner />
      </motion.div>
    </div>
  )
}
