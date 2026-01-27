"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react"

const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Tooltip simples com ícone de ajuda
interface InfoTooltipProps {
  content: string
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function InfoTooltip({ content, side = "top", className }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full text-muted-foreground hover:text-foreground transition-colors",
              className
            )}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

// Label com tooltip integrado
interface LabelWithTooltipProps {
  children: React.ReactNode
  tooltip?: string
  required?: boolean
  htmlFor?: string
  className?: string
}

export function LabelWithTooltip({ 
  children, 
  tooltip, 
  required, 
  htmlFor,
  className 
}: LabelWithTooltipProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <label 
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {tooltip && <InfoTooltip content={tooltip} />}
    </div>
  )
}

// Export components
export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent }
