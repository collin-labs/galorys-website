"use client"

import { cn } from "@/lib/utils"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

export type SortDirection = "asc" | "desc" | null

interface SortableHeaderProps {
  label: string
  field: string
  currentSort: string | null
  currentDirection: SortDirection
  onSort: (field: string) => void
  className?: string
  align?: "left" | "center" | "right"
}

export function SortableHeader({
  label,
  field,
  currentSort,
  currentDirection,
  onSort,
  className,
  align = "left"
}: SortableHeaderProps) {
  const isActive = currentSort === field
  
  const handleClick = () => {
    onSort(field)
  }

  const alignClass = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right"
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group w-full",
        alignClass[align],
        className
      )}
    >
      <span>{label}</span>
      <span className={cn(
        "transition-opacity",
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
      )}>
        {isActive ? (
          currentDirection === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5" />
        )}
      </span>
    </button>
  )
}

// Hook para gerenciar estado de ordenação
export function useSortable<T>(items: T[], defaultField?: string, defaultDirection: SortDirection = null) {
  const [sortField, setSortField] = React.useState<string | null>(defaultField || null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(defaultDirection)

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Ciclo: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedItems = React.useMemo(() => {
    if (!sortField || !sortDirection) return items

    return [...items].sort((a, b) => {
      const aValue = (a as any)[sortField]
      const bValue = (b as any)[sortField]

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortDirection === "asc" ? 1 : -1
      if (bValue == null) return sortDirection === "asc" ? -1 : 1

      // String comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue, "pt-BR")
          : bValue.localeCompare(aValue, "pt-BR")
      }

      // Number comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      // Boolean comparison
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sortDirection === "asc" 
          ? (aValue === bValue ? 0 : aValue ? -1 : 1)
          : (aValue === bValue ? 0 : aValue ? 1 : -1)
      }

      // Date comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      return 0
    })
  }, [items, sortField, sortDirection])

  return {
    sortedItems,
    sortField,
    sortDirection,
    handleSort,
    resetSort: () => {
      setSortField(null)
      setSortDirection(null)
    }
  }
}

import * as React from "react"
