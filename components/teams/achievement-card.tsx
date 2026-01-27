"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import type { Achievement } from "@/lib/data/teams"

interface AchievementCardProps {
  achievement: Achievement
  index?: number
}

export function AchievementCard({ achievement, index = 0 }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl p-4 md:p-5 border border-border hover:border-galorys-purple/30 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Trophy className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {achievement.badge && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${achievement.badgeColor || "bg-purple-600"}`}
              >
                {achievement.badge}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{achievement.year}</span>
          </div>
          <h4 className="font-semibold text-foreground text-sm md:text-base">{achievement.title}</h4>
          <p className="text-muted-foreground text-xs md:text-sm">{achievement.subtitle}</p>
        </div>
      </div>
    </motion.div>
  )
}
