"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  iconBgColor?: string
  iconColor?: string
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  iconBgColor = "bg-galorys-pink/20",
  iconColor = "text-galorys-pink",
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm border border-border p-5",
          "hover:border-galorys-purple/50 hover:shadow-lg hover:shadow-galorys-purple/10 transition-all",
          "cursor-pointer group",
        )}
      >
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-galorys-purple transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>

        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-galorys-purple/5 to-galorys-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </Link>
  )
}
