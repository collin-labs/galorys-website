"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Trophy, Award, Medal, Target, Calendar, Gamepad2 } from "lucide-react"

const stats = [
  { icon: Trophy, value: "15", label: "Conquistas Totais" },
  { icon: Award, value: "6", label: "Títulos (1º Lugar)" },
  { icon: Medal, value: "2º", label: "Ranking Mundial COD" },
  { icon: Target, value: "1+", label: "Recordes Mundiais GT" },
]

const achievements = [
  {
    id: 1,
    icon: "🏆",
    badge: { text: "1º", color: "bg-yellow-500/20 text-yellow-500" },
    title: "15x Campeão Brasileiro",
    description: "Quinze títulos brasileiros de Gran Turismo",
    tournament: "Campeonato Brasileiro Gran Turismo",
    game: "Gran Turismo",
    year: 2024,
  },
  {
    id: 2,
    icon: "🏆",
    badge: { text: "1º", color: "bg-yellow-500/20 text-yellow-500" },
    title: "15x Campeão Brasileiro GT",
    description: "Quinze títulos brasileiros de Gran Turismo",
    tournament: "Campeonato Brasileiro Gran Turismo",
    game: "Gran Turismo",
    year: 2024,
  },
  {
    id: 3,
    icon: "🥈",
    badge: { text: "2º", color: "bg-gray-400/20 text-gray-400" },
    title: "TOP 2 Ranking Mundial",
    description: "Segunda posição no ranking mundial de Call of Duty Mobile",
    tournament: "Ranking Mundial COD Mobile",
    game: "Call of Duty Mobile",
    year: 2024,
  },
  {
    id: 4,
    icon: "✅",
    badge: { text: "Classificado", color: "bg-green-500/20 text-green-500" },
    title: "Classificado Gamers Club",
    description: "Classificação para divisões de acesso do Gamers Club",
    tournament: "Gamers Club Liga",
    game: "Counter Strike 2",
    year: 2024,
  },
  {
    id: 5,
    icon: "🏆",
    badge: { text: "1º", color: "bg-yellow-500/20 text-yellow-500" },
    title: "Campeão BR Series 2024",
    description: "Campeão da BR Series de COD Mobile",
    tournament: "BR Series COD Mobile",
    game: "Call of Duty Mobile",
    year: 2024,
  },
  {
    id: 6,
    icon: "🥉",
    badge: { text: "TOP 4", color: "bg-orange-500/20 text-orange-500" },
    title: "4º Lugar Olimpíadas Virtuais",
    description: "Quarto lugar nas Olimpíadas Virtuais de Gran Turismo",
    tournament: "Olimpíadas Virtuais",
    game: "Gran Turismo",
    year: 2024,
  },
  {
    id: 7,
    icon: "🏆",
    badge: { text: "TOP 8", color: "bg-orange-500/20 text-orange-500" },
    title: "TOP 8 Eliminatórias",
    description: "Top 8 nas eliminatórias regionais",
    tournament: "Eliminatórias Regionais CS2",
    game: "Counter Strike 2",
    year: 2024,
  },
  {
    id: 8,
    icon: "🥈",
    badge: { text: "2º", color: "bg-gray-400/20 text-gray-400" },
    title: "Vice-campeão LBFF",
    description: "Vice-campeão da Liga Brasileira Free Fire",
    tournament: "LBFF 2024",
    game: "Call of Duty Mobile",
    year: 2024,
  },
  {
    id: 9,
    icon: "🥉",
    badge: { text: "TOP 4", color: "bg-orange-500/20 text-orange-500" },
    title: "TOP 4 VCT Americas",
    description: "Quarto lugar no VCT Americas",
    tournament: "VCT Americas",
    game: "Valorant",
    year: 2024,
  },
  {
    id: 10,
    icon: "⭐",
    badge: { text: "Recorde", color: "bg-yellow-500/20 text-yellow-500" },
    title: "20+ Recordes Mundiais",
    description: "Mais de 20 recordes mundiais estabelecidos",
    tournament: "Gran Turismo World Records",
    game: "Gran Turismo",
    year: 2024,
  },
  {
    id: 11,
    icon: "🥈",
    badge: { text: "2º", color: "bg-gray-400/20 text-gray-400" },
    title: "Vice-campeão NAC",
    description: "Vice-campeão do North America Championship",
    tournament: "NAC AoE",
    game: "Age of Empires",
    year: 2024,
  },
  {
    id: 12,
    icon: "🏆",
    badge: { text: "1º", color: "bg-yellow-500/20 text-yellow-500" },
    title: "Campeão VCT Challengers",
    description: "Campeão do VCT Challengers Brasil",
    tournament: "VCT Challengers Brasil",
    game: "Valorant",
    year: 2024,
  },
  {
    id: 13,
    icon: "🏆",
    badge: { text: "1º", color: "bg-yellow-500/20 text-yellow-500" },
    title: "Campeão Red Bull Wololo",
    description: "Campeão do torneio Red Bull Wololo Brasil",
    tournament: "Red Bull Wololo Brasil",
    game: "Age of Empires",
    year: 2024,
  },
  {
    id: 14,
    icon: "🏆",
    badge: { text: "1º", color: "bg-yellow-500/20 text-yellow-500" },
    title: "Campeão Torneio Inclusivo",
    description: "Campeão do primeiro torneio inclusivo de CS2",
    tournament: "Torneio Inclusivo CS2",
    game: "CS2 Galorynhos",
    year: 2024,
  },
  {
    id: 15,
    icon: "💜",
    badge: { text: "Marco Histórico", color: "bg-galorys-purple/20 text-galorys-purple" },
    title: "Marco de Inclusão nos eSports",
    description: "Primeira equipe de CS2 formada por atletas com nanismo",
    tournament: "Cenário Competitivo Brasileiro",
    game: "CS2 Galorynhos",
    year: 2023,
  },
]

export function ConquistasContent() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <PageHeader
          badge="Nosso Legado"
          title="LEGADO DE"
          highlightedText="CONQUISTAS"
          description="Uma trajetória marcada por vitórias, recordes e momentos históricos no cenário competitivo de eSports. Cada título representa dedicação, trabalho em equipe e busca pela excelência."
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} index={index} />
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-6 border border-border hover:border-galorys-purple/50 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-galorys-purple/20 flex items-center justify-center text-2xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${achievement.badge.color} mb-2`}
                  >
                    {achievement.badge.text}
                  </span>
                  <h3 className="font-bold text-foreground">{achievement.title}</h3>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-4">{achievement.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3" />
                  <span>{achievement.game}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{achievement.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
