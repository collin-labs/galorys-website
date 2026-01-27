import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "active" | "inactive" | "hidden" | "pending"
  className?: string
}

const statusConfig = {
  active: {
    label: "Ativo",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  inactive: {
    label: "Inativo",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  hidden: {
    label: "Oculto",
    className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  pending: {
    label: "Pendente",
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border",
        config.className,
        className,
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}
