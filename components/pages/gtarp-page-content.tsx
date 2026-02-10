"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  Globe, Users, Play, Pause, Volume2, VolumeX, 
  ExternalLink, Loader2, ArrowRight, Instagram,
  Gamepad2, Crown, MessageCircle,
  Sparkles, Zap, Shield, Star, ChevronRight, ChevronLeft, ChevronDown,
  UserCheck, Radio
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ============================================
// INTERFACES
// ============================================

interface FivemServer {
  code: string
  game: string
  name: string
  players: number
  maxPlayers: number
  online: boolean
  hostname: string
  connectUrl: string
  instagram?: string | null
  videoPath?: string | null
  discordInvite?: string | null
}

interface FivemData {
  servers: FivemServer[]
  totalPlayers: number
  allOnline: boolean
  fetchedAt: string
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
// MOBILE SERVERS CAROUSEL (< lg = 1024px)
// Carrossel premium com cards completos
// ============================================

function MobileServersCarousel({
  kushServer,
  flowServer,
  kushDiscord,
  flowDiscord,
  fivemLoading,
  discordLoading
}: {
  kushServer: FivemServer | undefined
  flowServer: FivemServer | undefined
  kushDiscord: DiscordCommunity | undefined
  flowDiscord: DiscordCommunity | undefined
  fivemLoading: boolean
  discordLoading: boolean
}) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const servers = [
    { server: kushServer, discord: kushDiscord, isVertical: true },
    { server: flowServer, discord: flowDiscord, isVertical: false }
  ]

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current
      const cardWidth = clientWidth * 0.92
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(Math.min(newIndex, servers.length - 1))
    }
  }

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.92
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll)
      return () => carousel.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <div className="relative -mx-4 px-4">
      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {servers.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[92%] snap-center"
          >
            <ServerCard
              server={item.server}
              discord={item.discord}
              isVertical={item.isVertical}
              loading={fivemLoading}
              discordLoading={discordLoading}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => scrollToIndex(0)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentIndex === 0
              ? 'bg-orange-500/30 text-orange-500'
              : 'bg-muted/20 text-muted-foreground active:bg-orange-500/20'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Dots */}
        <div className="flex items-center gap-3">
          {servers.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-orange-500 w-8'
                  : 'bg-muted-foreground/30 w-2.5 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => scrollToIndex(1)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentIndex === 1
              ? 'bg-orange-500/30 text-orange-500'
              : 'bg-muted/20 text-muted-foreground active:bg-orange-500/20'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// SERVER CARD COMPONENT (Reformulado)
// ============================================

function ServerCard({
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
  const online = server?.online || false
  const connectUrl = server?.connectUrl || `https://cfx.re/join/${isVertical ? "r4z8dg" : "3emg7o"}`
  
  // Dados dinâmicos do banco
  const videoPath = server?.videoPath || (isVertical ? "/videos/video-kush.mp4" : "/videos/video-flow.mp4")
  const instagram = server?.instagram || (isVertical ? "@joguekush" : "@flowrpgg")
  
  const memberCount = discord?.memberCount || 0
  const onlineCount = discord?.onlineCount || 0
  const discordUrl = discord?.inviteUrl || `https://discord.gg/${isVertical ? "kushpvp" : "flowrp"}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <div className="relative bg-card/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-border/50 dark:border-orange-500/20 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(249,115,22,0.15)]">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none" />
        
        {/* Header */}
        <div className="relative p-4 sm:p-5 md:p-6 border-b border-border/50 dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {/* Icon */}
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0"
              >
                {isVertical ? (
                  <Crown className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <Globe className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                )}
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 border-2 border-card dark:border-[#0B0B0F] flex items-center justify-center">
                  <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                </div>
              </motion.div>
              
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">{name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                  {isVertical ? (
                    <>
                      <Zap className="w-3 h-3 text-orange-500 flex-shrink-0" />
                      <span className="truncate">PVP Brasileiro</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3 text-orange-500 flex-shrink-0" />
                      <span className="truncate">Roleplay</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <motion.div 
              animate={{ scale: online ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex-shrink-0 ${
                online 
                  ? "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30" 
                  : "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
              }`}
            >
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${online ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide">{online ? "Online" : "Offline"}</span>
            </motion.div>
          </div>
        </div>

        {/* Video Section */}
        <div className="p-4 sm:p-5 md:p-6">
          <VideoPlayer
            videoPath={videoPath}
            isVertical={isVertical}
            serverName={name}
            players={players}
            loading={loading}
          />
        </div>

        {/* Stats Grid - FiveM + Discord */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border/50 dark:bg-white/10 mx-4 sm:mx-5 md:mx-6 rounded-2xl overflow-hidden">
          {/* FiveM Stats */}
          <div className="bg-card dark:bg-white/5 p-3 sm:p-4 text-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mx-auto mb-1.5 sm:mb-2" />
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto text-muted-foreground" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-foreground">{formatNumber(players)}</p>
            )}
            <p className="text-[10px] sm:text-xs text-muted-foreground">No Servidor</p>
          </div>
          
          {/* Discord Stats */}
          <div className="bg-card dark:bg-white/5 p-3 sm:p-4 text-center">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#5865F2] mx-auto mb-1.5 sm:mb-2" />
            {discordLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto text-muted-foreground" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-foreground">{formatNumber(memberCount)}</p>
            )}
            <p className="text-[10px] sm:text-xs text-muted-foreground">Membros Discord</p>
          </div>
          <div className="bg-card dark:bg-white/5 p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto mb-1.5 sm:mb-2" />
            {discordLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto text-muted-foreground" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-foreground">{formatNumber(onlineCount)}</p>
            )}
            <p className="text-[10px] sm:text-xs text-muted-foreground">Online Discord</p>
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 p-4 sm:p-5 md:p-6 space-y-3">
          {/* Main buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              asChild
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(249,115,22,0.4)] border-0"
            >
              <a href={connectUrl} target="_blank" rel="noopener noreferrer">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Conectar
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base border-[#5865F2]/50 text-[#5865F2] hover:bg-[#5865F2]/10 hover:border-[#5865F2] rounded-xl transition-all duration-300"
            >
              <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Discord
              </a>
            </Button>
          </div>
          
          {/* Instagram link */}
          <a 
            href={`https://instagram.com/${instagram.replace("@", "")}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-pink-500 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>{instagram}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// COMMUNITY HIGHLIGHT SECTION
// ============================================

function CommunityHighlight({ 
  discordData, 
  fivemData,
  loading 
}: { 
  discordData: DiscordData | null
  fivemData: FivemData | null
  loading: boolean 
}) {
  const totalDiscordMembers = discordData?.totalMembers || 0
  const totalDiscordOnline = discordData?.totalOnline || 0
  const totalFivemPlayers = fivemData?.totalPlayers || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8 sm:mb-12"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Discord Members */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#5865F2]/10 to-[#5865F2]/5 dark:from-[#5865F2]/20 dark:to-[#5865F2]/10 border border-[#5865F2]/20 p-4 sm:p-6">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#5865F2]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#5865F2]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Discord</span>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> : formatNumber(totalDiscordMembers)}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">membros</p>
          </div>
        </div>

        {/* Discord Online Now */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/10 border border-green-500/20 p-4 sm:p-6">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Online</span>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> : formatNumber(totalDiscordOnline)}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">agora</p>
          </div>
        </div>

        {/* FiveM Players */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 dark:from-orange-500/20 dark:to-orange-500/10 border border-orange-500/20 p-4 sm:p-6 col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Jogando</span>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {loading ? <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> : formatNumber(totalFivemPlayers)}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">nos servidores</p>
          </div>
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
  const kushDiscord = discordData?.communities.find(c => c.game === "gtarp-kush" || c.code === "kushpvp")
  const flowDiscord = discordData?.communities.find(c => c.game === "gtarp-flow" || c.code === "flowrp")

  const communities = [
    {
      data: kushDiscord,
      name: "KUSH PVP",
      description: "Servidor PVP com ação intensa e combates épicos",
      color: "#22C55E",
      fallbackCode: "kushpvp", 
      icon: <Zap className="w-6 h-6" />,
      gradient: "from-emerald-500 to-green-600"
    },
    {
      data: flowDiscord,
      name: "Flow RP",
      description: "Servidor de Roleplay com foco em histórias e narrativas imersivas",
      color: "#5865F2",
      fallbackCode: "flowrp",
      icon: <Shield className="w-6 h-6" />,
      gradient: "from-[#5865F2] to-indigo-600"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-12"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#5865F2]" />
        </div>
        Comunidades Discord
      </h2>

      {/* ========================================
          MOBILE/TABLET: Carrossel (< md = 768px)
          ======================================== */}
      <div className="md:hidden">
        <MobileDiscordCarousel communities={communities} loading={loading} />
      </div>

      {/* ========================================
          DESKTOP: Grid Original (>= md = 768px)
          100% IGUAL AO ORIGINAL
          ======================================== */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {communities.map((community, index) => (
          <DiscordCommunityCard 
            key={community.name} 
            community={community} 
            loading={loading} 
            index={index} 
          />
        ))}
      </div>
    </motion.div>
  )
}

// ============================================
// MOBILE DISCORD CAROUSEL (< md = 768px)
// ============================================

function MobileDiscordCarousel({
  communities,
  loading
}: {
  communities: Array<{
    data: DiscordCommunity | undefined
    name: string
    description: string
    color: string
    fallbackCode: string
    icon: React.ReactNode
    gradient: string
  }>
  loading: boolean
}) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current
      const cardWidth = clientWidth * 0.9
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(Math.min(newIndex, communities.length - 1))
    }
  }

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.9
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll)
      return () => carousel.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <div className="relative -mx-4 px-4">
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {communities.map((community, index) => (
          <div
            key={community.name}
            className="flex-shrink-0 w-[90%] snap-center"
          >
            <DiscordCommunityCard community={community} loading={loading} index={index} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-3 mt-2">
        {communities.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#5865F2] w-7'
                : 'bg-muted-foreground/30 w-2.5'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// DISCORD COMMUNITY CARD (Shared component)
// ============================================

function DiscordCommunityCard({
  community,
  loading,
  index
}: {
  community: {
    data: DiscordCommunity | undefined
    name: string
    description: string
    color: string
    fallbackCode: string
    icon: React.ReactNode
    gradient: string
  }
  loading: boolean
  index: number
}) {
  const memberCount = community.data?.memberCount || 0
  const onlineCount = community.data?.onlineCount || 0
  const inviteUrl = community.data?.inviteUrl || `https://discord.gg/${community.fallbackCode}`
  const icon = community.data?.icon
  const isOnline = community.data?.online ?? false
  const guildName = community.data?.guildName || community.name
  const verified = community.data?.verified || false
  const partnered = community.data?.partnered || false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="group h-full"
    >
      <div className="relative bg-card/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#5865F2]/20 hover:border-[#5865F2]/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(88,101,242,0.15)] h-full">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/0 to-[#5865F2]/0 group-hover:from-[#5865F2]/5 group-hover:to-[#5865F2]/5 transition-all duration-500 pointer-events-none" />
        
        {/* Header with gradient */}
        <div className={`relative h-20 sm:h-24 bg-gradient-to-r ${community.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] opacity-10 pointer-events-none" />
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Online status badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-white text-[10px] sm:text-xs font-medium">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Badges */}
          {(verified || partnered) && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2">
              {verified && (
                <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
              {partnered && (
                <div className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6">
          {/* Icon/Avatar */}
          <div className="flex items-start gap-3 sm:gap-4 -mt-10 sm:-mt-12 mb-3 sm:mb-4">
            <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${community.gradient} flex items-center justify-center shadow-lg border-4 border-background dark:border-[#0B0B0F] overflow-hidden flex-shrink-0`}>
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
            
            <div className="pt-10 sm:pt-12 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 truncate">
                {guildName}
                {(verified || partnered) && (
                  <span className="text-[#5865F2] flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{community.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-background/50 dark:bg-white/5 rounded-xl p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#5865F2]" />
              </div>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-foreground">{formatNumber(memberCount)}</p>
              )}
              <p className="text-[10px] sm:text-xs text-muted-foreground">Membros</p>
            </div>
            <div className="bg-background/50 dark:bg-white/5 rounded-xl p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Radio className="w-4 h-4 text-green-500" />
              </div>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-foreground">{formatNumber(onlineCount)}</p>
              )}
              <p className="text-[10px] sm:text-xs text-muted-foreground">Online</p>
            </div>
          </div>

          {/* Join Button */}
          <Button
            asChild
            size="default"
            className="w-full h-10 sm:h-11 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(88,101,242,0.4)]"
          >
            <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Entrar no Discord</span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
            </a>
          </Button>
        </div>
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
      icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
      link: "https://fivem.net"
    },
    {
      number: "02", 
      title: "Instale e Abra",
      description: "Instale o FiveM e vincule sua conta Rockstar Games",
      icon: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      link: null
    },
    {
      number: "03",
      title: "Conecte-se",
      description: "Clique no botão 'Conectar Agora' e entre no servidor!",
      icon: <Play className="w-5 h-5 sm:w-6 sm:h-6" />,
      link: null
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative bg-card/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-border/50 dark:border-orange-500/20 mb-12 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-orange-500" />
          </div>
          Como Conectar
        </h2>
        
        {/* ========================================
            MOBILE/TABLET: Accordion (< md = 768px)
            ======================================== */}
        <div className="md:hidden">
          <MobileHowToConnectAccordion steps={steps} />
        </div>

        {/* ========================================
            DESKTOP: Grid Original (>= md = 768px)
            100% IGUAL AO ORIGINAL
            ======================================== */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
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
              
              <div className="text-center p-6 rounded-2xl bg-background/50 dark:bg-black/20 border border-border/50 dark:border-white/5 hover:border-orange-500/30 transition-all duration-300 group">
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
// MOBILE HOW TO CONNECT ACCORDION (< md = 768px)
// ============================================

function MobileHowToConnectAccordion({
  steps
}: {
  steps: Array<{
    number: string
    title: string
    description: string
    icon: React.ReactNode
    link: string | null
  }>
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleStep = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="overflow-hidden"
        >
          {/* Accordion Header */}
          <button
            onClick={() => toggleStep(index)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
              openIndex === index
                ? 'bg-orange-500/10 border border-orange-500/30'
                : 'bg-background/50 dark:bg-black/20 border border-border/50 dark:border-white/5 hover:border-orange-500/20'
            }`}
          >
            {/* Number badge */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              openIndex === index
                ? 'bg-orange-500 text-white'
                : 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 text-orange-500'
            }`}>
              <span className="text-sm font-bold">{step.number}</span>
            </div>
            
            {/* Title */}
            <div className="flex-1 text-left">
              <h3 className={`font-semibold transition-colors ${
                openIndex === index ? 'text-orange-500' : 'text-foreground'
              }`}>
                {step.title}
              </h3>
            </div>
            
            {/* Chevron */}
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>

          {/* Accordion Content */}
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-3 ml-[52px]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500">{step.icon}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pt-2">
                      {step.link ? (
                        <>
                          {step.description.split("fivem.net")[0]}
                          <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-medium">
                            fivem.net
                          </a>
                          {step.description.split("fivem.net")[1]}
                        </>
                      ) : (
                        step.description
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function GtaRpPageContent() {
  const [fivemData, setFivemData] = useState<FivemData | null>(null)
  const [discordData, setDiscordData] = useState<DiscordData | null>(null)
  const [fivemLoading, setFivemLoading] = useState(true)
  const [discordLoading, setDiscordLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFivemData() {
      try {
        setFivemLoading(true)
        const response = await fetch("/api/games-stats")
        if (!response.ok) throw new Error("Falha ao carregar")
        const data = await response.json()
        // Adaptar para o formato esperado pelo componente
        setFivemData({
          servers: (data.fivem?.servers || []).map((s: any) => ({
            code: s.code,
            game: s.game,
            name: s.name,
            players: s.players,
            maxPlayers: s.maxPlayers || 0,
            online: s.online || s.players > 0,
            hostname: s.hostname || s.name,
            connectUrl: s.url || `https://cfx.re/join/${s.code}`,
            serverIp: "",
            resources: 0,
            instagram: s.instagram || null,
            videoPath: s.video || null,
            discordInvite: s.discord || null
          })),
          totalPlayers: data.fivem?.totalPlayers || 0,
          fetchedAt: data.fetchedAt
        })
      } catch (err) {
        console.error("Erro FiveM:", err)
      } finally {
        setFivemLoading(false)
      }
    }

    async function fetchDiscordData() {
      try {
        setDiscordLoading(true)
        const response = await fetch("/api/discord")
        if (!response.ok) throw new Error("Falha ao carregar Discord")
        const data = await response.json()
        setDiscordData(data)
      } catch (err) {
        console.error("Erro Discord:", err)
      } finally {
        setDiscordLoading(false)
      }
    }

    fetchFivemData()
    fetchDiscordData()
    
    // Atualizar FiveM a cada 30 segundos (mesmo intervalo do contador do topo)
    const fivemInterval = setInterval(fetchFivemData, 30000)
    // Atualizar Discord a cada 5 minutos
    const discordInterval = setInterval(fetchDiscordData, 300000)
    
    return () => {
      clearInterval(fivemInterval)
      clearInterval(discordInterval)
    }
  }, [])

  const kushServer = fivemData?.servers.find(s => s.code === "r4z8dg" || s.game === "gtarp-kush")
  const flowServer = fivemData?.servers.find(s => s.code === "3emg7o" || s.game === "gtarp-flow")
  
  const kushDiscord = discordData?.communities.find(c => c.game === "gtarp-kush" || c.code === "kushpvp")
  const flowDiscord = discordData?.communities.find(c => c.game === "gtarp-flow" || c.code === "flowrp")

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
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
        </motion.div>

        {/* Community Highlight Stats */}
        <CommunityHighlight 
          discordData={discordData}
          fivemData={fivemData}
          loading={fivemLoading || discordLoading}
        />

        {error && (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Section Header - Nossos Jogos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Nossos Jogos</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">2 servidores disponíveis</p>
            </div>
          </div>
        </motion.div>

        {/* ========================================
            MOBILE/TABLET: Carrossel (< lg = 1024px)
            ======================================== */}
        <div className="lg:hidden mb-12">
          <MobileServersCarousel
            kushServer={kushServer}
            flowServer={flowServer}
            kushDiscord={kushDiscord}
            flowDiscord={flowDiscord}
            fivemLoading={fivemLoading}
            discordLoading={discordLoading}
          />
        </div>

        {/* ========================================
            DESKTOP: Grid Original (>= lg = 1024px)
            100% IGUAL AO ORIGINAL
            ======================================== */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 mb-12">
          {/* KUSH PVP */}
          <ServerCard
            server={kushServer}
            discord={kushDiscord}
            isVertical={true}
            loading={fivemLoading}
            discordLoading={discordLoading}
          />

          {/* Flow RP */}
          <ServerCard
            server={flowServer}
            discord={flowDiscord}
            isVertical={false}
            loading={fivemLoading}
            discordLoading={discordLoading}
          />
        </div>

        {/* Discord Communities Section - Cards individuais */}
        <DiscordCommunitiesSection 
          discordData={discordData}
          loading={discordLoading}
        />

        {/* How to Connect Section */}
        <HowToConnect />

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
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
    </section>
  )
}