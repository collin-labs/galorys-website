"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  onClick?: () => void
  iconBgColor?: string
  iconColor?: string
  className?: string
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  iconBgColor = "bg-primary/20",
  iconColor = "text-primary",
  className,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all text-left",
        className,
      )}
    >
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", iconBgColor)}>
        <Icon className={cn("w-4 h-4", iconColor)} />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </button>
  )
}
