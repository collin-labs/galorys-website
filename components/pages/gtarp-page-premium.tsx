"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  Car, Globe, Users, Search, Filter, Loader2, ExternalLink, 
  Instagram, MessageCircle, Play, Pause, Volume2, VolumeX,
  Crown, Shield, Zap, Sparkles, Star, Radio, Gamepad2, ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============================================
// INTERFACES
// ============================================

interface FivemServer {
  id?: string
  code: string
  name: string
  game?: string
  players: number
  maxPlayers: number
  online: boolean
  hostname?: string
  url: string
  instagram?: string
  discord?: string
  discordInvite?: string
  video?: string
  videoPath?: string
  featured?: boolean
  order?: number
}

interface DiscordCommunity {
  code: string
  game: string
  name: string
  memberCount: number
  onlineCount: number
  guildName: string
  icon: string | null
  banner: string | null
  inviteUrl: string
  verified: boolean
  partnered: boolean
  online: boolean
}

interface DiscordData {
  communities: DiscordCommunity[]
  totalMembers: number
  totalOnline: number
  fetchedAt: string
}

interface GamesStatsResponse {
  totalPlayers: number
  fivem: {
    servers: FivemServer[]
    totalPlayers: number
  }
}

type SortOption = "players" | "slots" | "name"

// ============================================
// UTILS
// ============================================

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toLocaleString("pt-BR")
}

// ============================================
// ANIMATED BACKGROUND
// ============================================

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-500/5 to-background dark:from-[#0B0B0F] dark:via-[#1a0f05] dark:to-[#0B0B0F]" />
      
      {/* Radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15)_0%,transparent_50%)]" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-xl"
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// VIDEO PLAYER COMPONENT
// ============================================

function VideoPlayer({
  videoPath,
  isVertical = false,
  serverName,
  players,
  loading
}: {
  videoPath: string
  isVertical?: boolean
  serverName: string
  players: number
  loading: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted/50 dark:bg-black/50 group">
      {/* Container com aspect ratio fixo para ambos os tipos */}
      <div className={`relative ${isVertical ? "aspect-[9/16] max-h-[500px]" : "aspect-video"} w-full`}>
        <video
          ref={videoRef}
          src={videoPath}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Video Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-orange-500/90 flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors shadow-lg backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors shadow-lg"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Center Play Button when paused */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer hover:bg-orange-500/90 transition-colors shadow-[0_0_40px_rgba(249,115,22,0.5)]"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 z-10">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white text-xs font-medium">
            {loading ? "..." : formatNumber(players)} online
          </span>
        </div>

        {/* Server name badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-orange-500/90 backdrop-blur-sm z-10">
          <span className="text-white text-xs font-bold">{serverName}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SERVER CARD WITH VIDEO
// ============================================

function ServerCardWithVideo({
  server,
  discord,
  isVertical = false,
  loading,
  discordLoading
}: {
  server: FivemServer | undefined
  discord: DiscordCommunity | undefined
  isVertical?: boolean
  loading: boolean
  discordLoading: boolean
}) {
  const name = server?.name || (isVertical ? "KUSH PVP" : "Flow RP")
  const players = server?.players || 0
  const maxPlayers = server?.maxPlayers || 0
  const online = server?.online || false
  const connectUrl = server?.url || `https://cfx.re/join/${server?.code || (isVertical ? "r4z8dg" : "3emg7o")}`
  
  // Dados dinâmicos do banco
  const videoPath = server?.videoPath || server?.video || (isVertical ? "/videos/video-kush.mp4" : "/videos/video-flow.mp4")
  const instagram = server?.instagram || (isVertical ? "@joguekush" : "@flowrpgg")
  const discordInvite = server?.discord || server?.discordInvite
  
  const memberCount = discord?.memberCount || 0
  const onlineCount = discord?.onlineCount || 0
  const discordUrl = discord?.inviteUrl || (discordInvite ? `https://discord.gg/${discordInvite}` : `https://discord.gg/${isVertical ? "kushpvp" : "flowrp"}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <div className={cn(
        "relative overflow-hidden rounded-3xl",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl border border-orange-500/20",
        "hover:border-orange-500/50 transition-all duration-500",
        "hover:shadow-[0_0_60px_rgba(249,115,22,0.15)]"
      )}>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none" />
        
        {/* Header */}
        <div className="relative p-5 md:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25"
              >
                {isVertical ? (
                  <Crown className="w-7 h-7 text-white" />
                ) : (
                  <Globe className="w-7 h-7 text-white" />
                )}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0B0B0F] flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </motion.div>
              
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {isVertical ? (
                    <>
                      <Zap className="w-3 h-3 text-orange-500" />
                      Servidor PVP Brasileiro
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3 text-orange-500" />
                      Servidor Roleplay
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <motion.div 
              animate={{ scale: online ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                online 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-xs font-semibold uppercase tracking-wide">{online ? "Online" : "Offline"}</span>
            </motion.div>
          </div>
        </div>

        {/* Video Section */}
        <div className="p-5 md:p-6">
          <VideoPlayer
            videoPath={videoPath}
            isVertical={isVertical}
            serverName={name}
            players={players}
            loading={loading}
          />
        </div>

        {/* Stats */}
        <div className="px-5 md:px-6 pb-5 md:pb-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xl font-black text-green-500">{loading ? "..." : players}</span>
              </div>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="text-xl font-black text-orange-500">{maxPlayers}</span>
              </div>
              <p className="text-xs text-muted-foreground">Slots</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                <span className="text-xl font-black text-[#5865F2]">{discordLoading ? "..." : formatNumber(memberCount)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Discord</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 mb-4">
            {instagram && (
              <Link
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-500 text-sm hover:bg-pink-500/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                {instagram}
              </Link>
            )}
            <Link
              href={discordUrl}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 text-sm hover:bg-indigo-500/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Discord
            </Link>
          </div>

          {/* Connect Button */}
          <Link
            href={connectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 w-full",
              "py-3 px-6 rounded-xl",
              "font-bold text-white bg-orange-500",
              "transition-all duration-300",
              "hover:bg-orange-600 hover:scale-[1.02]",
              "active:scale-[0.98]"
            )}
            style={{
              boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)"
            }}
          >
            CONECTAR AGORA
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Server Code */}
          <p className="text-center text-xs text-muted-foreground mt-3 font-mono">
            cfx.re/join/{server?.code || (isVertical ? "r4z8dg" : "3emg7o")}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// DISCORD COMMUNITIES SECTION
// ============================================

function DiscordCommunitiesSection({ 
  discordData, 
  loading 
}: { 
  discordData: DiscordData | null
  loading: boolean 
}) {
  const communities = [
    {
      key: "kush",
      game: "gtarp-kush",
      code: "kushpvp",
      name: "KUSH PVP",
      description: "Comunidade oficial do servidor KUSH",
      gradient: "from-orange-500 to-red-500",
      icon: <Crown className="w-8 h-8" />
    },
    {
      key: "flow",
      game: "gtarp-flow",
      code: "flowrp",
      name: "Flow RP",
      description: "Comunidade oficial do servidor Flow",
      gradient: "from-blue-500 to-purple-500",
      icon: <Globe className="w-8 h-8" />
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-[#5865F2]" />
        Comunidades Discord
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((community) => {
          const data = discordData?.communities.find(
            c => c.game === community.game || c.code === community.code
          )
          
          const memberCount = data?.memberCount || 0
          const onlineCount = data?.onlineCount || 0
          const inviteUrl = data?.inviteUrl || `https://discord.gg/${community.code}`
          const icon = data?.icon
          const guildName = data?.guildName || community.name
          const verified = data?.verified || false
          const partnered = data?.partnered || false

          return (
            <motion.div
              key={community.key}
              whileHover={{ y: -4 }}
              className={cn(
                "relative rounded-2xl overflow-hidden",
                "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
                "backdrop-blur-xl border border-[#5865F2]/20",
                "hover:border-[#5865F2]/50 transition-all duration-300"
              )}
            >
              {/* Banner */}
              <div className={cn(
                "h-24 relative",
                `bg-gradient-to-r ${community.gradient}`
              )}>
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Icon/Avatar */}
                <div className="flex items-start gap-4 -mt-12 mb-4">
                  <div className={cn(
                    "relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-4 border-background overflow-hidden",
                    `bg-gradient-to-br ${community.gradient}`
                  )}>
                    {icon ? (
                      <img 
                        src={icon} 
                        alt={guildName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white">{community.icon}</span>
                    )}
                  </div>
                  
                  <div className="pt-12">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      {guildName}
                      {(verified || partnered) && (
                        <span className="text-[#5865F2]">
                          <Sparkles className="w-4 h-4" />
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{community.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-[#5865F2]" />
                    </div>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground">{formatNumber(memberCount)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Membros</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <Radio className="w-4 h-4 text-green-500" />
                    </div>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground">{formatNumber(onlineCount)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(88,101,242,0.4)]"
                >
                  <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Entrar no Discord
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ============================================
// HOW TO CONNECT SECTION
// ============================================

function HowToConnect() {
  const steps = [
    {
      number: "01",
      title: "Baixe o FiveM",
      description: "Acesse fivem.net e baixe o cliente oficial",
      icon: <Globe className="w-6 h-6" />,
      link: "https://fivem.net"
    },
    {
      number: "02", 
      title: "Instale e Abra",
      description: "Instale o FiveM e vincule sua conta Rockstar Games",
      icon: <Gamepad2 className="w-6 h-6" />,
      link: null
    },
    {
      number: "03",
      title: "Conecte-se",
      description: "Clique no botão 'Conectar Agora' e entre no servidor!",
      icon: <Play className="w-6 h-6" />,
      link: null
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={cn(
        "relative rounded-3xl p-6 md:p-8 mb-12 overflow-hidden",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl border border-orange-500/20"
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-orange-500" />
          </div>
          Como Conectar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] right-0 h-px bg-gradient-to-r from-orange-500/50 to-transparent" />
              )}
              
              <div className="text-center p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-orange-500/30 transition-all duration-300 group">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center mx-auto mb-4 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                    <span className="text-orange-500">{step.icon}</span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.link ? (
                    <>
                      {step.description.split("fivem.net")[0]}
                      <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                        fivem.net
                      </a>
                      {step.description.split("fivem.net")[1]}
                    </>
                  ) : (
                    step.description
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function GtarpPagePremium() {
  const [data, setData] = useState<GamesStatsResponse | null>(null)
  const [discordData, setDiscordData] = useState<DiscordData | null>(null)
  const [loading, setLoading] = useState(true)
  const [discordLoading, setDiscordLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("players")

  // Buscar dados FiveM
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/games-stats")
        if (!response.ok) throw new Error("Erro ao carregar dados")
        const json = await response.json()
        setData(json)
      } catch (err) {
        console.error("Erro:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Buscar dados Discord
  useEffect(() => {
    const fetchDiscord = async () => {
      try {
        const response = await fetch("/api/discord")
        if (!response.ok) throw new Error("Erro ao carregar Discord")
        const json = await response.json()
        setDiscordData(json)
      } catch (err) {
        console.error("Erro Discord:", err)
      } finally {
        setDiscordLoading(false)
      }
    }

    fetchDiscord()
    const interval = setInterval(fetchDiscord, 300000) // 5 minutos
    return () => clearInterval(interval)
  }, [])

  // Preparar servidores
  const servers = data?.fivem?.servers || []
  const kushServer = servers.find(s => s.code === "r4z8dg" || s.game === "gtarp-kush")
  const flowServer = servers.find(s => s.code === "3emg7o" || s.game === "gtarp-flow")
  
  const kushDiscord = discordData?.communities?.find(c => c.game === "gtarp-kush" || c.code === "kushpvp")
  const flowDiscord = discordData?.communities?.find(c => c.game === "gtarp-flow" || c.code === "flowrp")

  const totalPlayers = data?.fivem?.totalPlayers || 0
  const totalDiscordMembers = discordData?.totalMembers || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <AnimatedBackground />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 mb-6 shadow-[0_0_60px_rgba(249,115,22,0.4)]"
            >
              <Globe className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              GALORYS NO <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">GTA RP</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
              Entre nos melhores servidores de GTA RP do Brasil. Ação, roleplay e diversão garantidos com a comunidade Galorys!
            </p>

            {/* Quick stats badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-orange-500/30"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-foreground font-bold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : formatNumber(totalPlayers)}
                </span>
                <span className="text-muted-foreground text-sm">jogando</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                <span className="text-foreground font-bold">
                  {discordLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : formatNumber(totalDiscordMembers)}
                </span>
                <span className="text-muted-foreground text-sm">membros</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Servers Grid - Com Vídeo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* KUSH PVP */}
            <ServerCardWithVideo
              server={kushServer}
              discord={kushDiscord}
              isVertical={true}
              loading={loading}
              discordLoading={discordLoading}
            />

            {/* Flow RP */}
            <ServerCardWithVideo
              server={flowServer}
              discord={flowDiscord}
              isVertical={false}
              loading={loading}
              discordLoading={discordLoading}
            />
          </div>

          {/* Discord Communities */}
          <DiscordCommunitiesSection 
            discordData={discordData}
            loading={discordLoading}
          />

          {/* How to Connect */}
          <HowToConnect />

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Voltar para Home
            </Link>
          </motion.div>
        </div>

        {/* Bottom Glow */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.5), transparent)"
          }}
        />
      </section>
    </div>
  )
}

export default GtarpPagePremium
