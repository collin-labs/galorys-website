"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import Link from "next/link"

interface Achievement {
  id: string
  title: string
  year: string
  description: string
  icon: string
}

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Marco Histórico de Inclusão",
    year: "2023",
    description:
      "Criação da primeira equipe profissional de Counter-Strike 2 formada exclusivamente por atletas com nanismo no cenário competitivo brasileiro...",
    icon: "🏆",
  },
  {
    id: "2",
    title: "Representação no Gran Turismo",
    year: "2022",
    description:
      "Didico (Adriano Carrazza) representa a Galorys no automobilismo virtual desde 2022, competindo em eventos de Gran Turismo.",
    icon: "🎮",
  },
  {
    id: "3",
    title: "Equipe Competitiva de COD Mobile",
    year: "2023",
    description:
      "Formação de equipe competitiva de Call of Duty Mobile com jogadores experientes no cenário nacional desde 2023.",
    icon: "🎯",
  },
]

export function RecentAchievements() {
  return (
    <div className="rounded-xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-foreground">Conquistas Recentes</h3>
        </div>
        <Link href="/conquistas" className="text-sm text-galorys-purple hover:underline">
          Ver todos
        </Link>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-muted/30 border border-border hover:border-galorys-purple/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{achievement.icon}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{achievement.year}</span>
            </div>
            <h4 className="font-semibold text-foreground text-sm mb-1">{achievement.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-3">{achievement.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
