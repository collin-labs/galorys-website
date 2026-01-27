"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  label: string
  className?: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-xl border border-border overflow-hidden", className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                  column.className,
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn("bg-card hover:bg-muted/30 transition-colors", onRowClick && "cursor-pointer")}
            >
              {columns.map((column) => (
                <td key={column.key} className={cn("px-4 py-3 text-foreground", column.className)}>
                  {column.render ? column.render(item) : (item as Record<string, unknown>)[column.key]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
