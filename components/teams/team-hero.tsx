"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { Team } from "@/lib/data/teams"

interface TeamHeroProps {
  team: Team
  bannerImage?: string
}

// Mapeamento de cores por jogo
const gameColorSchemes: Record<string, { gradient: string; accent: string }> = {
  CS2: { gradient: 'from-orange-400 to-yellow-300', accent: 'text-orange-400' },
  CS2_GALORYNHOS: { gradient: 'from-purple-400 to-pink-300', accent: 'text-purple-400' },
  CODM: { gradient: 'from-green-400 to-emerald-300', accent: 'text-green-400' },
  GRAN_TURISMO: { gradient: 'from-blue-400 to-cyan-300', accent: 'text-blue-400' },
}

export function TeamHero({ team, bannerImage }: TeamHeroProps) {
  const colorScheme = gameColorSchemes[team.game] || gameColorSchemes.CS2

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-500/30" />
          </svg>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-10 right-10 md:right-20 w-20 h-20 md:w-32 md:h-32 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400">
            <path d="M10 10 L90 10 L50 90 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute bottom-10 left-10 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-cyan-400">
            <rect x="5" y="5" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Team Name & Game - DINÂMICO */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${colorScheme.gradient} tracking-wider text-center`}>
            {team.name.toUpperCase()}
          </h2>
          <p className={`text-sm md:text-base ${colorScheme.accent} mt-2 tracking-[0.3em] uppercase`}>
            {team.gameLabel}
          </p>
          <p className="text-xs md:text-sm text-blue-300/60 mt-1 tracking-[0.2em]">galorys</p>
        </motion.div>
      </div>

      {/* Team Photo/Banner */}
      {bannerImage && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <Image
            src={bannerImage}
            alt={team.name}
            width={400}
            height={280}
            className="h-[200px] md:h-[280px] w-auto object-contain"
          />
        </div>
      )}

      {/* Badge do Time (se existir) */}
      {team.badge && (
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
          {team.badge}
        </div>
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </motion.div>
  )
}
