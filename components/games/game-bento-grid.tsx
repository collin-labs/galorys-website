"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GameCard, GameCardProps } from "./game-card"
import { GameCardFeatured } from "./game-card-featured"
import { BentoGridSkeleton } from "./game-card-skeleton"

export interface BentoGridProps {
  games: GameCardProps["game"][]
  maxItems?: number
  loading?: boolean
  className?: string
}

export function BentoGrid({ 
  games, 
  maxItems = 6,
  loading = false,
  className 
}: BentoGridProps) {
  // Limitar quantidade de jogos
  const displayGames = games.slice(0, maxItems)
  
  // Separar o primeiro (destaque) dos demais
  const [featured, ...others] = displayGames

  if (loading) {
    return <BentoGridSkeleton />
  }

  if (displayGames.length === 0) {
    return null
  }

  // Layout adaptativo baseado na quantidade de jogos
  const getGridLayout = () => {
    switch (displayGames.length) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-1 md:grid-cols-2"
      case 3:
        return "grid-cols-1 md:grid-cols-3"
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
  }

  // Para 5+ jogos: Layout Bento com featured grande
  if (displayGames.length >= 5) {
    return (
      <div className={cn(
        "grid gap-4",
        "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
        className
      )}>
        {/* Featured - Ocupa 2 colunas e 2 linhas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 md:row-span-2"
        >
          <GameCardFeatured game={featured} priority />
        </motion.div>
        
        {/* Outros jogos */}
        {others.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
          >
            <GameCard 
              game={game} 
              size="md"
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    )
  }

  // Para 4 jogos: Grid 2x2
  if (displayGames.length === 4) {
    return (
      <div className={cn(
        "grid gap-4",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}>
        {displayGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
          >
            <GameCard 
              game={game} 
              size={index === 0 ? "lg" : "md"}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    )
  }

  // Para 3 jogos: 1 featured grande + 2 menores empilhados
  if (displayGames.length === 3) {
    return (
      <div className={cn(
        "grid gap-4",
        "grid-cols-1 md:grid-cols-3",
        className
      )}>
        {/* Featured - Ocupa 2 colunas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 md:row-span-2"
        >
          <GameCardFeatured game={featured} priority />
        </motion.div>
        
        {/* 2 jogos empilhados */}
        <div className="flex flex-col gap-4">
          {others.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.4 }}
              className="flex-1"
            >
              <GameCard 
                game={game} 
                size="md"
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Para 2 jogos: Lado a lado iguais
  if (displayGames.length === 2) {
    return (
      <div className={cn(
        "grid gap-4",
        "grid-cols-1 md:grid-cols-2",
        className
      )}>
        {displayGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * index, duration: 0.4 }}
          >
            <GameCard 
              game={game} 
              size="lg"
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    )
  }

  // Para 1 jogo: Card featured centralizado
  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GameCardFeatured game={featured} priority />
      </motion.div>
    </div>
  )
}

// Versão alternativa: Bento Grid Assimétrico (estilo Apple)
export function BentoGridAsymmetric({ 
  games, 
  maxItems = 6,
  loading = false,
  className 
}: BentoGridProps) {
  const displayGames = games.slice(0, maxItems)

  if (loading) {
    return <BentoGridSkeleton />
  }

  if (displayGames.length === 0) {
    return null
  }

  return (
    <div className={cn(
      "grid gap-4",
      "grid-cols-6 grid-rows-4",
      "h-[600px] md:h-[700px]",
      className
    )}>
      {displayGames.map((game, index) => {
        // Layout assimétrico
        const layouts = [
          "col-span-6 md:col-span-4 row-span-2", // Grande esquerda
          "col-span-3 md:col-span-2 row-span-1", // Pequeno direita top
          "col-span-3 md:col-span-2 row-span-1", // Pequeno direita bottom
          "col-span-6 md:col-span-2 row-span-2", // Médio esquerda
          "col-span-3 md:col-span-2 row-span-2", // Médio centro
          "col-span-3 md:col-span-2 row-span-2", // Médio direita
        ]

        return (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 * index, duration: 0.4 }}
            className={cn(
              layouts[index] || "col-span-2 row-span-1",
              "min-h-[150px]"
            )}
          >
            {index === 0 ? (
              <GameCardFeatured game={game} className="h-full" priority />
            ) : (
              <GameCard 
                game={game} 
                size={index < 3 ? "md" : "sm"}
                className="h-full"
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default BentoGrid
