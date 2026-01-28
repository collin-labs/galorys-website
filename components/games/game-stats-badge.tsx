"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface GameStatsBadgeProps {
  count: number
  previousCount?: number
  showTrend?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal" | "detailed"
  pulsing?: boolean
  className?: string
}

export function GameStatsBadge({
  count,
  previousCount,
  showTrend = false,
  size = "md",
  variant = "default",
  pulsing = true,
  className
}: GameStatsBadgeProps) {
  // Calcular trend
  const trend = previousCount !== undefined 
    ? count - previousCount 
    : 0
  const trendPercentage = previousCount && previousCount > 0
    ? ((trend / previousCount) * 100).toFixed(1)
    : "0"

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor = trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-gray-400"

  // Tamanhos
  const sizeStyles = {
    sm: {
      padding: "px-2 py-1",
      text: "text-sm",
      icon: "w-3 h-3",
      dot: "h-1.5 w-1.5"
    },
    md: {
      padding: "px-3 py-1.5",
      text: "text-base",
      icon: "w-4 h-4",
      dot: "h-2 w-2"
    },
    lg: {
      padding: "px-4 py-2",
      text: "text-lg",
      icon: "w-5 h-5",
      dot: "h-2.5 w-2.5"
    }
  }

  const styles = sizeStyles[size]

  // Variante minimal
  if (variant === "minimal") {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5",
        "text-green-400 font-medium",
        styles.text,
        className
      )}>
        {pulsing && (
          <span className="relative flex">
            <span className={cn(
              "animate-ping absolute inline-flex rounded-full bg-green-400 opacity-75",
              styles.dot
            )} />
            <span className={cn(
              "relative inline-flex rounded-full bg-green-500",
              styles.dot
            )} />
          </span>
        )}
        <span>{count.toLocaleString()}</span>
        <Users className={styles.icon} />
      </div>
    )
  }

  // Variante detailed
  if (variant === "detailed") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-3",
          "bg-gradient-to-r from-green-500/20 to-emerald-500/10",
          "backdrop-blur-md rounded-2xl",
          "border border-green-500/30",
          styles.padding,
          className
        )}
      >
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          {pulsing && (
            <span className="relative flex">
              <span className={cn(
                "animate-ping absolute inline-flex rounded-full bg-green-400 opacity-75",
                styles.dot
              )} />
              <span className={cn(
                "relative inline-flex rounded-full bg-green-500",
                styles.dot
              )} />
            </span>
          )}
          <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
            AO VIVO
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-green-500/30" />

        {/* Count */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-black text-white",
            size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"
          )}>
            {count.toLocaleString()}
          </span>
          <Users className={cn(styles.icon, "text-green-400")} />
        </div>

        {/* Trend */}
        {showTrend && trend !== 0 && (
          <>
            <div className="w-px h-4 bg-green-500/30" />
            <div className={cn("flex items-center gap-1", trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {trend > 0 ? "+" : ""}{trendPercentage}%
              </span>
            </div>
          </>
        )}
      </motion.div>
    )
  }

  // Variante default
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex items-center gap-2",
        "bg-green-500/90 backdrop-blur-md",
        "text-white font-bold rounded-xl",
        styles.padding,
        className
      )}
      style={{
        boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)"
      }}
    >
      {/* Pulsing Dot */}
      {pulsing && (
        <span className="relative flex">
          <span className={cn(
            "animate-ping absolute inline-flex rounded-full bg-white opacity-75",
            styles.dot
          )} />
          <span className={cn(
            "relative inline-flex rounded-full bg-white",
            styles.dot
          )} />
        </span>
      )}

      {/* Count */}
      <span className={styles.text}>
        {count.toLocaleString()}
      </span>

      {/* Icon */}
      <Users className={styles.icon} />

      {/* Trend Arrow */}
      {showTrend && trend !== 0 && (
        <TrendIcon className={cn("w-3.5 h-3.5", trendColor)} />
      )}
    </motion.div>
  )
}

// Badge para total geral (ex: topo do site)
export function TotalPlayersBadge({
  total,
  breakdown,
  className
}: {
  total: number
  breakdown?: { roblox: number; fivem: number }
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex flex-col items-center gap-1",
        className
      )}
    >
      {/* Main Badge */}
      <div className={cn(
        "flex items-center gap-3 px-6 py-3",
        "bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20",
        "backdrop-blur-xl rounded-2xl",
        "border border-white/10"
      )}>
        {/* Live Dot */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>

        {/* Total */}
        <div className="text-center">
          <span className="text-3xl font-black text-white">
            {total.toLocaleString()}
          </span>
          <span className="ml-2 text-sm text-white/70">jogadores online</span>
        </div>
      </div>

      {/* Breakdown (optional) */}
      {breakdown && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Roblox: {breakdown.roblox.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            FiveM: {breakdown.fivem.toLocaleString()}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default GameStatsBadge
