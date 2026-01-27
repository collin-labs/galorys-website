"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bell, Star, Users, Search, ChevronRight, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Team {
  id: string
  name: string
  game: string
  players: number
  color: string
  initial: string
  isInclusion?: boolean
}

const allTeams: Team[] = [
  { id: "1", name: "Counter-Strike 2", game: "Counter-Strike 2", players: 5, color: "bg-orange-500", initial: "CS" },
  {
    id: "2",
    name: "CS2 Galorynhos",
    game: "Counter-Strike 2",
    players: 6,
    color: "bg-purple-500",
    initial: "G",
    isInclusion: true,
  },
  {
    id: "3",
    name: "Call of Duty Mobile",
    game: "Call of Duty Mobile",
    players: 6,
    color: "bg-green-500",
    initial: "CD",
  },
  { id: "4", name: "Gran Turismo", game: "Gran Turismo 7", players: 1, color: "bg-red-500", initial: "GT" },
]

const stats = [
  { icon: Heart, value: 0, label: "Favoritos", color: "text-pink-400" },
  { icon: Bell, value: 0, label: "Notificações", color: "text-muted-foreground" },
  { icon: Star, value: 0, label: "Pontos Ganhos", color: "text-yellow-400" },
  { icon: Users, value: 4, label: "Times Disponíveis", color: "text-galorys-purple" },
]

export function FavoritosContent() {
  const [search, setSearch] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredTeams = allTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) || team.game.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleFavorite = (teamId: string) => {
    setFavorites((prev) => (prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Seus Times Favoritos</h1>
        <p className="text-muted-foreground">
          Acompanhe seus times preferidos e receba notificações de partidas e novidades.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border p-4 hover:border-galorys-purple/50 transition-all"
          >
            <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Teams List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="font-semibold text-foreground">Todos os Times</h2>
          </div>
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar time..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-border"
            />
          </div>
        </div>

        {/* Teams */}
        <div className="divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {filteredTeams.map((team, index) => {
              const isFavorite = favorites.includes(team.id)
              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg",
                        team.color,
                      )}
                    >
                      {team.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{team.name}</p>
                        {team.isInclusion && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">INCLUSÃO</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {team.game} • {team.players} jogadores
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(team.id)}
                      className={cn(
                        "rounded-full transition-all",
                        isFavorite
                          ? "text-pink-400 bg-pink-400/10 hover:bg-pink-400/20"
                          : "text-muted-foreground hover:text-pink-400 hover:bg-pink-400/10",
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-muted-foreground hover:text-foreground"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Points Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-4 lg:p-6"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400 shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-400">Ganhe +20 pontos</h3>
            <p className="text-sm text-muted-foreground">
              Cada time que você favoritar adiciona 20 pontos à sua conta!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
