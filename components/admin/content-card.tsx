import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ContentCardProps {
  icon: LucideIcon
  label: string
  count: number
  href: string
  iconBgColor?: string
  iconColor?: string
  className?: string
}

export function ContentCard({
  icon: Icon,
  label,
  count,
  href,
  iconBgColor = "bg-primary/20",
  iconColor = "text-primary",
  className,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "bg-card border border-border rounded-xl p-3 lg:p-4 hover:border-primary/50 transition-all group",
        className,
      )}
    >
      <div
        className={cn("w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center mb-2 lg:mb-3", iconBgColor)}
      >
        <Icon className={cn("w-4 h-4 lg:w-5 lg:h-5", iconColor)} />
      </div>
      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">{label}</h3>
      <p className="text-xs lg:text-sm text-muted-foreground">{count} itens</p>
    </Link>
  )
}
