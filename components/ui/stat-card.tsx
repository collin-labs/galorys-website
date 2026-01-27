"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  index?: number
  variant?: "default" | "roblox"
}

export function StatCard({ icon: Icon, value, label, index = 0, variant = "default" }: StatCardProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const numericValue = typeof value === "string" ? Number.parseInt(value.replace(/\D/g, "")) || 0 : value
  const suffix = typeof value === "string" ? value.replace(/[0-9]/g, "") : ""

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const increment = numericValue / (duration / 16)

          const timer = setInterval(() => {
            start += increment
            if (start >= numericValue) {
              setCount(numericValue)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [numericValue, hasAnimated])

  const iconColor = variant === "roblox" ? "text-roblox-red" : "text-galorys-purple"
  const borderHover = variant === "roblox" ? "hover:border-roblox-red/50" : "hover:border-galorys-purple/50"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-center border border-border ${borderHover} transition-all`}
    >
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mx-auto mb-1.5 sm:mb-2 md:mb-3 ${iconColor}`} />
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
        {count}
        {suffix}
      </p>
      <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">{label}</p>
    </motion.div>
  )
}
