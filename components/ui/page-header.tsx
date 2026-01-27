"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  badge?: string
  title: string
  highlightedText: string
  description?: string
  variant?: "default" | "roblox"
}

export function PageHeader({ badge, title, highlightedText, description, variant = "default" }: PageHeaderProps) {
  const gradientClass = variant === "roblox" ? "gradient-text-roblox" : "gradient-text"
  const badgeClass =
    variant === "roblox"
      ? "bg-roblox-red/10 text-roblox-red border-roblox-red/20"
      : "bg-galorys-purple/10 text-galorys-purple border-galorys-purple/20"

  return (
    <div className="text-center mb-12 md:mb-16">
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border mb-4 ${badgeClass}`}
        >
          {badge}
        </motion.span>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
      >
        {title} <span className={gradientClass}>{highlightedText}</span>
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
