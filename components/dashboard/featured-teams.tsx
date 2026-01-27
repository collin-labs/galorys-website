"use client"

import { motion } from "framer-motion"
import { Users, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Team {
  id: string
  name: string
  game: string
  color: string
  initial: string
  titles: number
}

const teams: Team[] = [
  { id: "1", name: "Counter-Strike 2", game: "CS2", color: "bg-orange-500", initial: "CS", titles: 0 },
  { id: "2", name: "CS2 Galorynhos", game: "CS2", color: "bg-purple-500", initial: "G", titles: 0 },
  { id: "3", name: "Call of Duty Mobile", game: "CODM", color: "bg-green-500", initial: "CD", titles: 0 },
  { id: "4", name: "Gran Turismo", game: "GT7", color: "bg-red-500", initial: "GT", titles: 0 },
]

export function FeaturedTeams() {
  return (
    <div className="rounded-xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-galorys-pink" />
          <h3 className="font-semibold text-foreground">Times em Destaque</h3>
        </div>
        <Link href="/times" className="text-sm text-galorys-pink hover:underline">
          Ver todos
        </Link>
      </div>

      <div className="divide-y divide-border">
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${team.color} flex items-center justify-center text-white font-bold text-sm`}
              >
                {team.initial}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{team.name}</p>
                <p className="text-xs text-muted-foreground">{team.titles} títulos</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-galorys-purple group-hover:translate-x-1 transition-all" />
          </motion.div>
        ))}
      </div>

      <div className="p-4">
        <Link href="/dashboard/favoritos">
          <Button className="w-full bg-gradient-to-r from-galorys-pink to-galorys-purple hover:opacity-90">
            <span>♥</span>
            <span className="ml-2">Gerenciar Favoritos</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
