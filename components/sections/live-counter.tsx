"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Wifi, WifiOff } from "lucide-react"

interface LiveCountData {
  totalPlayers: number
  isLive: boolean
  fetchedAt: string
}

// Componente de número animado
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    // Animação de contagem
    const duration = 1000 // 1 segundo
    const steps = 30
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <span>{displayValue.toLocaleString("pt-BR")}</span>
}

// Partículas de fundo sutis
function SubtleParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: "50%",
          }}
          animate={{
            y: [-5, 5, -5],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function LiveCounter() {
  const [data, setData] = useState<LiveCountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchLiveCount() {
      try {
        const response = await fetch("/api/live-count")
        if (!response.ok) throw new Error("Falha ao carregar")
        const result = await response.json()
        setData(result)
        setError(false)
      } catch (err) {
        console.error("Erro ao buscar contador:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    // Buscar imediatamente
    fetchLiveCount()

    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchLiveCount, 60000)
    return () => clearInterval(interval)
  }, [])

  const totalPlayers = data?.totalPlayers || 0
  const isLive = data?.isLive || false

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[60] w-full overflow-hidden"
    >
      {/* Background com gradiente Galorys e efeitos modernos */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F] via-galorys-purple/80 to-[#0B0B0F]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.3)_0%,transparent_70%)]" />
      
      {/* Animated border/glow effect */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 50%, transparent 100%)",
            "linear-gradient(90deg, transparent 0%, rgba(236,72,153,0.5) 50%, transparent 100%)",
            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 50%, transparent 100%)",
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      <SubtleParticles />

      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 md:gap-6 py-2 md:py-2.5">
          {/* Indicador de status com pulse */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.div
                animate={isLive ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                  isLive ? "bg-green-400" : "bg-gray-400"
                }`}
              />
              <div className={`relative w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                isLive ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" : "bg-gray-400"
              }`} />
            </div>
            <span className="text-white/90 text-[10px] md:text-xs font-bold uppercase tracking-widest hidden sm:inline">
              COMUNIDADE GALORYS
            </span>
          </div>

          {/* Separador animado */}
          <motion.div 
            className="hidden sm:block w-px h-4 bg-gradient-to-b from-transparent via-white/40 to-transparent"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Contador principal */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-white/60 text-xs">Carregando...</span>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-white/60"
              >
                <WifiOff className="w-4 h-4" />
                <span className="text-xs">Offline</span>
              </motion.div>
            ) : (
              <motion.div
                key="count"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 md:gap-3"
              >
                <div className="relative">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <motion.div
                    className="absolute inset-0 text-galorys-purple"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Users className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <motion.span 
                    className="text-white font-bold text-base md:text-lg lg:text-xl tracking-tight"
                    animate={{ textShadow: ["0 0 10px rgba(139,92,246,0)", "0 0 10px rgba(139,92,246,0.5)", "0 0 10px rgba(139,92,246,0)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AnimatedNumber value={totalPlayers} />
                  </motion.span>
                  <span className="text-white/80 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                    JOGADORES
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge "AO VIVO" com efeito de brilho */}
          {isLive && !loading && !error && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Wifi className="w-3 h-3 text-green-400" />
              </motion.div>
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">
                AO VIVO
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Linha inferior com gradiente animado */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #8B5CF6 25%, #EC4899 50%, #8B5CF6 75%, transparent 100%)",
          backgroundSize: "200% 100%"
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}
