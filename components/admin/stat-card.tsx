import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string
  iconColor?: string
  className?: string
}

export function StatCard({ icon: Icon, label, value, subtitle, iconColor = "text-primary", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4",
        className,
      )}
    >
      <div
        className={cn(
          "w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0",
          "bg-muted",
        )}
      >
        <Icon className={cn("w-5 h-5 lg:w-6 lg:h-6", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs lg:text-sm text-muted-foreground">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground/70">{subtitle}</p>}
      </div>
      <div className="text-xl lg:text-2xl font-bold text-foreground">{value}</div>
    </div>
  )
}
