"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"

interface PointsEntry {
  id: string
  action: string
  date: string
  points: number
  icon: "star" | "heart" | "gift"
}

const historyData: PointsEntry[] = [
  { id: "1", action: "Login diário", date: "Hoje", points: 10, icon: "star" },
  { id: "2", action: "Favoritou time", date: "Ontem", points: 20, icon: "heart" },
  { id: "3", action: "Bônus de boas-vindas", date: "3 dias atrás", points: 100, icon: "gift" },
]

const IconComponent = ({ type }: { type: "star" | "heart" | "gift" }) => {
  const baseClasses = "w-8 h-8 rounded-lg flex items-center justify-center"

  switch (type) {
    case "star":
      return (
        <div className={`${baseClasses} bg-yellow-500/20`}>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>
      )
    case "heart":
      return (
        <div className={`${baseClasses} bg-pink-500/20`}>
          <TrendingUp className="w-4 h-4 text-pink-400" />
        </div>
      )
    case "gift":
      return (
        <div className={`${baseClasses} bg-galorys-purple/20`}>
          <Sparkles className="w-4 h-4 text-galorys-purple" />
        </div>
      )
  }
}

export function PointsHistory() {
  return (
    <div className="rounded-xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-galorys-purple" />
          <h3 className="font-semibold text-foreground">Histórico de Pontos</h3>
        </div>
        <Link href="/dashboard/historico" className="text-sm text-galorys-purple hover:underline">
          Ver tudo
        </Link>
      </div>

      <div className="divide-y divide-border">
        {historyData.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconComponent type={entry.icon} />
              <div>
                <p className="font-medium text-foreground text-sm">{entry.action}</p>
                <p className="text-xs text-muted-foreground">{entry.date}</p>
              </div>
            </div>
            <span className="text-green-400 font-semibold">+{entry.points}</span>
          </motion.div>
        ))}
      </div>

      {/* Tip Box */}
      <div className="m-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-start gap-2">
          <span className="text-yellow-400">💡</span>
          <div className="text-sm">
            <p className="font-medium text-yellow-400">Ganhe mais pontos</p>
            <ul className="text-muted-foreground text-xs mt-1 space-y-0.5">
              <li>• Login diário: +10 pontos</li>
              <li>• Favoritar time: +20 pontos</li>
              <li>• Assistir partida: +30 pontos</li>
              <li>• Compartilhar conquista: +50 pontos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
