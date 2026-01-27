"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Trophy, Gamepad2, Users, Calendar, Sparkles, Crown } from "lucide-react"

// ============================================
// PARTÍCULAS ROXAS/ROSAS (Identidade Galorys)
// ============================================
function GalorysParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: Math.random() > 0.5 
              ? 'rgba(139, 92, 246, 0.8)'   // galorys-purple
              : 'rgba(236, 72, 153, 0.8)',  // galorys-pink
            boxShadow: Math.random() > 0.5
              ? '0 0 10px rgba(139, 92, 246, 0.6)'
              : '0 0 10px rgba(236, 72, 153, 0.6)',
          }}
          animate={{
            y: [0, -600],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// BLOCOS ROBLOX FLUTUANTES (Vermelho Roblox + Galorys)
// ============================================
function FloatingRobloxBlocks() {
  const blocks = [
    { size: 50, color: "bg-red-500", shadow: "shadow-red-500/30", x: "8%", y: "20%", delay: 0 },
    { size: 40, color: "bg-galorys-purple", shadow: "shadow-galorys-purple/30", x: "88%", y: "15%", delay: 0.5 },
    { size: 45, color: "bg-red-600", shadow: "shadow-red-600/30", x: "80%", y: "70%", delay: 1 },
    { size: 35, color: "bg-galorys-pink", shadow: "shadow-galorys-pink/30", x: "12%", y: "75%", delay: 1.5 },
    { size: 30, color: "bg-galorys-purple-dark", shadow: "shadow-galorys-purple/30", x: "92%", y: "45%", delay: 2 },
    { size: 38, color: "bg-red-500", shadow: "shadow-red-500/30", x: "5%", y: "50%", delay: 2.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-lg ${block.color} shadow-2xl ${block.shadow}`}
          style={{
            width: block.size,
            height: block.size,
            left: block.x,
            top: block.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1],
            rotateX: [0, 15, -15, 0],
            rotateY: [0, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: block.delay,
            ease: "easeInOut",
          }}
        >
          {/* Face do bloco estilo Roblox */}
          <div className="absolute inset-1.5 rounded bg-black/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// AURORA GALORYS (Roxo/Rosa)
// ============================================
function GalorysAurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora principal */}
      <motion.div
        className="absolute w-[200%] h-[600px] -top-40 -left-1/2"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)
          `,
        }}
        animate={{
          x: [0, 100, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Spotlight central */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px]"
        style={{
          background: `
            radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 60%)
          `,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// ============================================
// SELO 3D ROTATIVO (Cores Galorys)
// ============================================
function RotatingBadge3D() {
  return (
    <motion.div
      className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
      initial={{ opacity: 0, scale: 0, rotateY: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.5, type: "spring" }}
    >
      {/* Glow externo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          filter: "blur(15px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Selo principal */}
      <motion.div
        className="relative w-full h-full rounded-full border-4 border-galorys-purple/50 flex items-center justify-center"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(139, 92, 246, 0.2) 0%, 
              rgba(236, 72, 153, 0.2) 50%, 
              rgba(139, 92, 246, 0.2) 100%
            )
          `,
          boxShadow: `
            0 0 40px rgba(139, 92, 246, 0.3),
            inset 0 0 40px rgba(236, 72, 153, 0.1)
          `,
        }}
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Ícone central */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Crown className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-galorys-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Badge #1 */}
      <motion.div
        className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-galorys-purple to-galorys-pink text-white font-black text-xs sm:text-sm shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        #1 BRASIL
      </motion.div>
    </motion.div>
  )
}

// ============================================
// CONTADOR ANIMADO
// ============================================
function AnimatedCounter({ 
  end, 
  duration = 2,
  suffix = "",
  prefix = ""
}: { 
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    
    let startTime: number | null = null
    const startValue = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * (end - startValue) + startValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString("pt-BR")}{suffix}
    </span>
  )
}

// ============================================
// TEXTO COM ANIMAÇÃO DE REVELAÇÃO
// ============================================
function RevealText({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: string
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export function PioneersSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const stats = [
    { icon: Calendar, value: 2024, label: "Ano de Fundação", prefix: "", suffix: "" },
    { icon: Gamepad2, value: 5, label: "Jogos Criados", prefix: "", suffix: "+" },
    { icon: Users, value: 100000, label: "Jogadores Alcançados", prefix: "", suffix: "+" },
  ]

  return (
    <section 
      ref={containerRef}
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-galorys-surface/20 to-background"
    >
      {/* Efeitos de fundo */}
      <GalorysAurora />
      <GalorysParticles />
      <FloatingRobloxBlocks />
      
      {/* Grid de fundo */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Badge "PIONEIROS" */}
        <motion.div
          className="flex justify-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-galorys-purple/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-galorys-purple/20 to-galorys-pink/20 border border-galorys-purple/30 text-galorys-purple text-xs sm:text-sm font-bold tracking-wider">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              PIONEIROS NO BRASIL
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
          </div>
        </motion.div>

        {/* Conteúdo principal */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-20">
          
          {/* Selo 3D */}
          <div className="flex-shrink-0">
            <RotatingBadge3D />
          </div>

          {/* Textos */}
          <div className="text-center lg:text-left max-w-2xl">
            {/* Título principal */}
            <div className="mb-4 md:mb-6">
              <RevealText
                delay={0.2}
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight"
              >
                <span className="gradient-text">PRIMEIRA EMPRESA</span>
              </RevealText>
              <RevealText
                delay={0.4}
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight"
              >
                GAMER DO BRASIL
              </RevealText>
            </div>

            {/* Subtítulo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-4 md:mb-8"
            >
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
                A projetar jogos de{" "}
                <span className="text-red-500 font-bold">ROBLOX</span>
              </p>
              <motion.div
                className="h-0.5 md:h-1 w-24 md:w-32 mx-auto lg:mx-0 mt-3 md:mt-4 rounded-full bg-gradient-to-r from-galorys-purple to-galorys-pink"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.div>

            {/* Descrição - escondida em mobile muito pequeno */}
            <motion.p
              className="hidden sm:block text-muted-foreground text-sm md:text-base lg:text-lg mb-4 md:mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
            >
              Fazemos história no cenário brasileiro de games, sendo a primeira organização 
              a desenvolver e publicar jogos próprios na plataforma Roblox, 
              alcançando milhares de jogadores em todo o país.
            </motion.p>
          </div>
        </div>

        {/* Stats - Layout Premium Mobile/Tablet */}
        <motion.div
          className="mt-12 md:mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          {/* Mobile: Cards compactos em linha horizontal */}
          <div className="flex md:hidden justify-center gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative group flex-1 max-w-[120px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6 + index * 0.1 }}
              >
                {/* Glow sutil */}
                <div className="absolute inset-0 rounded-xl bg-galorys-purple/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-3 rounded-xl bg-card/30 backdrop-blur-md border border-galorys-purple/10 hover:border-galorys-purple/30 transition-all duration-300 text-center">
                  <stat.icon className="w-5 h-5 text-galorys-purple mx-auto mb-2" />
                  
                  <div className="text-xl font-black gradient-text">
                    {isInView && (
                      <AnimatedCounter 
                        end={stat.value} 
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        duration={2}
                      />
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-[10px] leading-tight mt-1">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tablet/Desktop: Grid elegante */}
          <div className="hidden md:grid grid-cols-3 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6 + index * 0.15 }}
              >
                {/* Glow de fundo */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-galorys-purple/10 to-galorys-pink/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-4 lg:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-galorys-purple/10 hover:border-galorys-purple/30 transition-all duration-300">
                  <stat.icon className="w-6 lg:w-8 h-6 lg:h-8 text-galorys-purple mb-3 lg:mb-4" />
                  
                  <div className="text-2xl lg:text-4xl font-black gradient-text mb-1 lg:mb-2">
                    {isInView && (
                      <AnimatedCounter 
                        end={stat.value} 
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        duration={2}
                      />
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-xs lg:text-sm">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Linha decorativa final - escondida em mobile */}
        <motion.div
          className="hidden md:flex items-center justify-center gap-4 mt-12 lg:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 }}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-galorys-purple/50" />
          <Trophy className="w-6 h-6 text-galorys-purple/50" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-galorys-purple/50" />
        </motion.div>
      </div>
    </section>
  )
}