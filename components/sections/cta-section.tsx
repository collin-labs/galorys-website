"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2, ArrowRight, Zap, Globe, Users, Sparkles, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mapeamento de ícones por nome
const iconMap: Record<string, React.ElementType> = {
  Gamepad2,
  Globe,
  Zap,
  Users,
  Sparkles,
}

// Valores padrão (fallback)
const defaultGames = [
  {
    title: "ROBLOX",
    subtitle: "Galorys Tycoon & Games",
    href: "/roblox",
    gradient: "bg-gradient-to-br from-red-500 to-rose-600",
    icon: "Gamepad2"
  },
  {
    title: "GTA RP",
    subtitle: "FiveM KUSH & FLOW",
    href: "/gtarp",
    gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
    icon: "Globe"
  }
]

const defaultFeatures = [
  { text: "Servidores 24/7", color: "text-yellow-500", icon: "Zap" },
  { text: "Comunidade Ativa", color: "text-green-500", icon: "Users" },
  { text: "100% Gratuito", color: "text-galorys-purple", icon: "Sparkles" }
]

// Partículas de fundo animadas
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-foreground/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Card de jogo com efeito hover premium
function GameCard({ 
  title, 
  subtitle, 
  href, 
  gradient, 
  shadowColor, 
  icon,
  delay 
}: { 
  title: string
  subtitle: string
  href: string
  gradient: string
  shadowColor?: string
  icon: string | React.ElementType
  delay: number
}) {
  // Resolver ícone: se for string, buscar do map; se for componente, usar diretamente
  const Icon = typeof icon === 'string' ? (iconMap[icon] || Gamepad2) : icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="w-full sm:w-auto flex-1 sm:max-w-sm"
    >
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className={`relative group overflow-hidden rounded-2xl ${gradient} p-[2px]`}
        >
          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 ${gradient} blur-xl opacity-50`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Card content */}
          <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border">
            {/* Icon */}
            <motion.div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${gradient} flex items-center justify-center mb-5`}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </motion.div>
            
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
            
            {/* CTA */}
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center gap-2 text-foreground font-semibold"
                whileHover={{ x: 5 }}
              >
                <Play className="w-5 h-5" />
                <span>Jogar Agora</span>
              </motion.div>
              <motion.div
                className={`w-10 h-10 rounded-full ${gradient} flex items-center justify-center`}
                whileHover={{ scale: 1.1 }}
              >
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-foreground/5 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-foreground/5 to-transparent rounded-tr-full" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function CtaSection() {
  const [badge, setBadge] = useState("Servidores Exclusivos")
  const [title, setTitle] = useState("JOGUE COM A")
  const [titleHighlight, setTitleHighlight] = useState("GALORYS")
  const [subtitle, setSubtitle] = useState("Entre nos nossos servidores oficiais e faça parte da maior comunidade gaming do Brasil")
  const [games, setGames] = useState(defaultGames)
  const [features, setFeatures] = useState(defaultFeatures)

  useEffect(() => {
    async function fetchCtaConfig() {
      try {
        const response = await fetch('/api/cta-config')
        if (response.ok) {
          const data = await response.json()
          if (data.badge) setBadge(data.badge)
          if (data.title) setTitle(data.title)
          if (data.titleHighlight) setTitleHighlight(data.titleHighlight)
          if (data.subtitle) setSubtitle(data.subtitle)
          if (data.games && data.games.length > 0) setGames(data.games)
          if (data.features && data.features.length > 0) setFeatures(data.features)
        }
      } catch (error) {
        console.error('Erro ao buscar cta config:', error)
      }
    }
    fetchCtaConfig()
  }, [])

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-galorys-purple/10 via-transparent to-galorys-pink/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.15)_0%,transparent_50%)]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128,128,128,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128,128,128,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Animated orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-galorys-purple/20 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-galorys-pink/20 blur-[100px]"
      />
      
      <FloatingParticles />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-galorys-purple/20 to-galorys-pink/20 border border-galorys-purple/30 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-galorys-purple" />
            </motion.div>
            <span className="text-sm font-medium text-muted-foreground">{badge}</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight">
            {title}{" "}
            <span className="relative">
              <span className="gradient-text">{titleHighlight}</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-galorys-purple to-galorys-pink rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Game Cards */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
          {games.map((game, index) => (
            <GameCard
              key={game.title}
              title={game.title}
              subtitle={game.subtitle}
              href={game.href}
              gradient={game.gradient}
              icon={game.icon}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {features.map((item, index) => {
            const FeatureIcon = iconMap[item.icon] || Sparkles
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/50 border border-border"
              >
                <FeatureIcon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-medium text-muted-foreground">{item.text}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-galorys-purple/50 to-transparent" />
    </section>
  )
}