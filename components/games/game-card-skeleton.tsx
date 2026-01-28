"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GameCardSkeletonProps {
  size?: "sm" | "md" | "lg" | "xl" | "featured"
  className?: string
}

// Tamanhos
const sizeConfig = {
  sm: "h-48",
  md: "h-64",
  lg: "h-80",
  xl: "h-96",
  featured: "min-h-[400px] md:min-h-[450px]"
}

export function GameCardSkeleton({ 
  size = "md", 
  className 
}: GameCardSkeletonProps) {
  const isFeatured = size === "featured"
  
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-white/[0.05] to-white/[0.02]",
        "border border-white/[0.05]",
        sizeConfig[size],
        isFeatured && "rounded-3xl",
        className
      )}
    >
      {/* Shimmer Background */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      {/* Image Skeleton */}
      <div className={cn(
        "relative w-full bg-white/5",
        isFeatured ? "h-full" : size === "sm" ? "h-28" : size === "lg" ? "h-52" : "h-40"
      )}>
        {/* Platform Badge Skeleton */}
        <div className={cn(
          "absolute top-3 left-3",
          "w-20 h-6 rounded-lg bg-white/10"
        )} />
        
        {/* Players Badge Skeleton */}
        <div className={cn(
          "absolute bottom-3 left-3",
          "w-16 h-7 rounded-lg bg-green-500/20"
        )} />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      {/* Content Skeleton */}
      <div className={cn(
        "p-4 space-y-3",
        isFeatured && "absolute bottom-0 left-0 right-0 p-6 md:p-8"
      )}>
        {/* Title Skeleton */}
        <div className={cn(
          "h-5 bg-white/10 rounded-lg",
          isFeatured ? "w-3/4 h-8" : "w-4/5"
        )}>
          <motion.div
            className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Stats Skeleton */}
        <div className="flex gap-4">
          <div className="h-4 w-16 bg-white/5 rounded" />
          <div className="h-4 w-16 bg-white/5 rounded" />
        </div>
        
        {/* Button Skeleton (featured only) */}
        {isFeatured && (
          <div className="h-12 w-48 bg-white/10 rounded-2xl mt-4" />
        )}
      </div>
      
      {/* Animated Pulse */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

// Grid de skeletons
export function GameCardSkeletonGrid({ 
  count = 6,
  size = "md" 
}: { 
  count?: number
  size?: "sm" | "md" | "lg"
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <GameCardSkeleton key={i} size={size} />
      ))}
    </div>
  )
}

// Skeleton para Bento Grid
export function BentoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Featured Large */}
      <div className="md:col-span-2 md:row-span-2">
        <GameCardSkeleton size="featured" className="h-full" />
      </div>
      
      {/* Smaller cards */}
      <GameCardSkeleton size="md" />
      <GameCardSkeleton size="md" />
      <GameCardSkeleton size="md" className="hidden lg:block" />
      <GameCardSkeleton size="md" className="hidden lg:block" />
    </div>
  )
}

// Skeleton para Carousel
export function CarouselSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-64">
          <GameCardSkeleton size="md" />
        </div>
      ))}
    </div>
  )
}

export default GameCardSkeleton
