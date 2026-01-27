"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  iconColor?: string
  className?: string
}

export function StatCard({ icon: Icon, value, label, iconColor = "text-galorys-purple", className }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border p-4 lg:p-5",
        "hover:border-galorys-purple/50 hover:shadow-lg hover:shadow-galorys-purple/10 transition-all",
        className,
      )}
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-galorys-purple/5 rounded-full blur-2xl" />

      <Icon className={cn("w-5 h-5 lg:w-6 lg:h-6 mb-3", iconColor)} />
      <div className="text-2xl lg:text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}
