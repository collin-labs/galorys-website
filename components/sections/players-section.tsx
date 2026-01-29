"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight, Twitter, Instagram, Twitch, Youtube, Trophy, Target, TrendingUp, Loader2, Medal, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { getPlayerAvatar } from "@/lib/data/players"

// Interface para jogadores do banco (atualizada com stats)
interface FeaturedPlayerDB {
  id: string
  order: number
  stats?: {
    titles: number
    records: number
    ranking: string
    achievementsCount: number
  }
  player: {
    id: string
    nickname: string
    realName: string | null
    slug: string
    photo: string | null
    role: string | null
    bio: string | null
    twitter: string | null
    instagram: string | null
    twitch: string | null
    youtube: string | null
    tiktok: string | null
    team: {
      id: string
      name: string
      slug: string
      titlesCount?: number
      playersCount?: number
    }
  }
}

// Dados estáticos como fallback
const fallbackPlayers = [
  {
    id: "didico",
    nickname: "Didico",
    realName: "Adriano Carrazza",
    photo: "/images/players/didico.png",
    role: "Piloto Principal",
    team: "Gran Turismo",
    teamSlug: "gran-turismo",
    achievement: "Piloto de Gran Turismo desde 2022",
    stats: {
      titles: 15,
      records: 20,
      ranking: "Top BR",
    },
    socials: {
      twitter: "https://twitter.com/didico",
      instagram: "https://instagram.com/didico",
    },
  },
  {
    id: "anaozera",
    nickname: "Anãozera",
    realName: "Mateus Augusto Pesarini",
    photo: "/images/players/anaozera.png",
    role: "Capitão / IGL",
    team: "CS2 Galorynhos",
    teamSlug: "cs2-galorynhos",
    achievement: "Capitão da primeira equipe de atletas com nanismo de CS2",
    stats: {
      titles: 1,
      records: 3,
      ranking: "Elite",
    },
    socials: {
      twitter: "https://twitter.com/anaozera",
      instagram: "https://instagram.com/anaozera",
      twitch: "https://twitch.tv/anaozera",
    },
  },
  {
    id: "nython",
    nickname: "Nython",
    realName: "Gabriel Lino",
    photo: "/images/players/nython.png",
    role: "Player",
    team: "Counter-Strike 2",
    teamSlug: "cs2",
    achievement: "Novo talento 2025",
    stats: {
      titles: 0,
      records: 1,
      ranking: "Pro",
    },
    socials: {
      instagram: "https://instagram.com/nython",
    },
  },
]

const socialIcons = {
  twitter: Twitter,
  instagram: Instagram,
  twitch: Twitch,
  youtube: Youtube,
}

// Converter dados do banco para formato da UI
function convertDBToUI(dbPlayers: FeaturedPlayerDB[]) {
  return dbPlayers.map(fp => ({
    id: fp.player.id,
    nickname: fp.player.nickname,
    realName: fp.player.realName || "",
    photo: fp.player.photo || "/images/players/default-avatar.png",
    role: fp.player.role || "Jogador",
    team: fp.player.team.name,
    teamSlug: fp.player.team.slug,
    achievement: fp.player.bio || `Atleta profissional de ${fp.player.team.name}`,
    // Usar stats que vêm da API (calculados a partir das conquistas)
    stats: {
      titles: fp.stats?.titles ?? fp.player.team.titlesCount ?? 0,
      records: fp.stats?.records ?? fp.stats?.achievementsCount ?? 0,
      ranking: fp.stats?.ranking || (fp.player.team.titlesCount && fp.player.team.titlesCount >= 5 ? "Top BR" : "Pro"),
    },
    socials: {
      ...(fp.player.twitter && { twitter: fp.player.twitter }),
      ...(fp.player.instagram && { instagram: fp.player.instagram }),
      ...(fp.player.twitch && { twitch: fp.player.twitch }),
      ...(fp.player.youtube && { youtube: fp.player.youtube }),
    },
  }))
}

// ========================================
// CARROSSEL MOBILE/TABLET - JOGADORES
// Apenas visível em telas < md (768px)
// ========================================
function MobilePlayersCarousel({ 
  players, 
  imgErrors, 
  onImgError,
  onPlayerClick 
}: { 
  players: typeof fallbackPlayers
  imgErrors: Record<string, boolean>
  onImgError: (id: string) => void
  onPlayerClick: (teamSlug: string) => void
}) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      
      const cardWidth = clientWidth * 0.85
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(Math.min(newIndex, players.length - 1))
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => carousel.removeEventListener('scroll', checkScroll)
    }
  }, [players.length])

  return (
    <div className="relative -mx-4 px-4">
      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex-shrink-0 w-[85%] sm:w-[75%] snap-center"
          >
            <div 
              onClick={() => onPlayerClick(player.teamSlug)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-galorys-surface via-galorys-surface/95 to-background border border-galorys-purple/20 shadow-xl active:scale-[0.98] transition-transform cursor-pointer"
            >
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-galorys-purple/10 rounded-full blur-3xl pointer-events-none" />

              {/* Player Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-galorys-purple/20 to-galorys-pink/20">
                <Image
                  src={imgErrors[player.id] ? getPlayerAvatar(player.nickname) : player.photo}
                  alt={player.nickname}
                  fill
                  className="object-cover object-top"
                  onError={() => onImgError(player.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-galorys-surface via-transparent to-transparent" />
                
                {/* Position Badge */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-black">{index + 1}º</span>
                </div>
                
                {/* Team Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                  <span className="text-white text-xs font-semibold">{player.team}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Name & Role */}
                <div className="mb-3">
                  <h3 className="text-2xl font-black text-foreground mb-1">
                    {player.nickname}
                  </h3>
                  <p className="text-sm text-muted-foreground">{player.realName}</p>
                  <p className="text-xs text-galorys-purple font-medium mt-1">{player.role}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <Trophy className="w-4 h-4 text-galorys-purple mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{player.stats.titles}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Títulos</div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <Target className="w-4 h-4 text-galorys-pink mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{player.stats.records}+</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Conquistas</div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <TrendingUp className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">{player.stats.ranking}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Ranking</div>
                  </div>
                </div>

                {/* Achievement */}
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-muted/20">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground line-clamp-1">{player.achievement}</span>
                </div>

                {/* Socials & CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {Object.entries(player.socials).map(([platform, url]) => {
                      const Icon = socialIcons[platform as keyof typeof socialIcons]
                      return Icon ? (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-galorys-purple hover:text-white flex items-center justify-center text-muted-foreground transition-all"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ) : null
                    })}
                  </div>
                  
                  <div className="flex items-center gap-2 text-galorys-purple font-semibold text-sm">
                    <span>Ver Perfil</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            canScrollLeft
              ? 'bg-galorys-purple/20 text-galorys-purple active:bg-galorys-purple active:text-white'
              : 'bg-muted/20 text-muted-foreground/30 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Dots */}
        <div className="flex items-center gap-2">
          {players.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-galorys-purple w-6'
                  : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            canScrollRight
              ? 'bg-galorys-purple/20 text-galorys-purple active:bg-galorys-purple active:text-white'
              : 'bg-muted/20 text-muted-foreground/30 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export function PlayersSection() {
  const router = useRouter()
  const [featuredPlayers, setFeaturedPlayers] = useState(fallbackPlayers)
  const [loading, setLoading] = useState(true)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const [bgError, setBgError] = useState(false)

  useEffect(() => {
    async function fetchFeaturedPlayers() {
      try {
        const response = await fetch('/api/admin/featured-players')
        if (response.ok) {
          const data = await response.json()
          if (data.featuredPlayers && data.featuredPlayers.length > 0) {
            const converted = convertDBToUI(data.featuredPlayers)
            setFeaturedPlayers(converted)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar jogadores em destaque:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedPlayers()
  }, [])

  const mainPlayer = featuredPlayers[0]
  const otherPlayers = featuredPlayers.slice(1)

  const handleImgError = (playerId: string) => {
    setImgErrors(prev => ({ ...prev, [playerId]: true }))
  }

  const handlePlayerClick = (teamSlug: string) => {
    router.push(`/times/${teamSlug}`)
  }

  if (loading) {
    return (
      <section className="py-24 relative overflow-hidden" id="jogadores">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-galorys-purple" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 relative overflow-hidden" id="jogadores">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-galorys-surface/50 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-galorys-purple/10 border border-galorys-purple/20 text-galorys-purple text-sm font-medium mb-4">
            Nossos Atletas
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            JOGADORES EM <span className="gradient-text">DESTAQUE</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça os atletas que fazem a diferença nas competições e elevam o nome da Galorys ao mais alto nível.
          </p>
        </motion.div>

        {/* ========================================
            MOBILE/TABLET: Carrossel (< md = 768px)
            ======================================== */}
        <div className="md:hidden">
          <MobilePlayersCarousel 
            players={featuredPlayers}
            imgErrors={imgErrors}
            onImgError={handleImgError}
            onPlayerClick={handlePlayerClick}
          />
        </div>

        {/* ========================================
            DESKTOP: Layout Original (>= md = 768px)
            100% IGUAL AO ORIGINAL
            ======================================== */}
        <div className="hidden md:block">
          {/* Main featured player - Card Robusto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div 
              onClick={() => handlePlayerClick(mainPlayer.teamSlug)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-galorys-surface via-galorys-surface/95 to-background border border-galorys-purple/20 hover:border-galorys-purple/50 transition-all cursor-pointer shadow-xl hover:shadow-[0_0_60px_rgba(168,85,247,0.15)]"
            >
              {/* Glow effect */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-galorys-purple/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-galorys-pink/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative grid lg:grid-cols-5 gap-0">
                {/* Imagem do jogador - Lado esquerdo */}
                <div className="lg:col-span-2 relative">
                  <div className="aspect-[4/5] lg:aspect-auto lg:h-full relative overflow-hidden bg-gradient-to-br from-galorys-purple/10 to-galorys-pink/10">
                    {!bgError && (
                      <Image
                        src="/images/base/base-imagem-galorys.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-50"
                        onError={() => setBgError(true)}
                      />
                    )}
                    <Image
                      src={imgErrors[mainPlayer.id] ? getPlayerAvatar(mainPlayer.nickname) : mainPlayer.photo}
                      alt={mainPlayer.nickname}
                      fill
                      className="object-cover object-top"
                      onError={() => handleImgError(mainPlayer.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-galorys-surface via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-galorys-surface" />
                    
                    {/* Badge flutuante */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold shadow-lg">
                      🏎️ PILOTO OFICIAL
                    </div>
                  </div>
                </div>

                {/* Informações do jogador - Lado direito */}
                <div className="lg:col-span-3 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  {/* Tag do time */}
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-galorys-purple/20 text-galorys-purple text-xs font-semibold uppercase tracking-wider">
                      {mainPlayer.team}
                    </span>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-muted-foreground text-sm">{mainPlayer.role}</span>
                  </div>

                  {/* Nome */}
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-2 group-hover:text-galorys-purple transition-colors">
                    {mainPlayer.nickname}
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground mb-2">{mainPlayer.realName}</p>
                  <p className="text-muted-foreground mb-8 max-w-md">{mainPlayer.achievement}</p>

                  {/* Stats em cards */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-4 border border-border/50 text-center hover:border-galorys-purple/30 transition-colors">
                      <Trophy className="w-5 h-5 text-galorys-purple mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-bold text-foreground">{mainPlayer.stats.titles}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Títulos</div>
                    </div>
                    <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-4 border border-border/50 text-center hover:border-galorys-pink/30 transition-colors">
                      <Target className="w-5 h-5 text-galorys-pink mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-bold text-foreground">{mainPlayer.stats.records}+</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Conquistas</div>
                    </div>
                    <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-4 border border-border/50 text-center hover:border-cyan-500/30 transition-colors">
                      <TrendingUp className="w-5 h-5 text-cyan-500 mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-bold text-foreground">{mainPlayer.stats.ranking}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Ranking</div>
                    </div>
                  </div>

                  {/* Redes sociais e CTA */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {Object.entries(mainPlayer.socials).map(([platform, url]) => {
                        const Icon = socialIcons[platform as keyof typeof socialIcons]
                        return Icon ? (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-xl bg-muted/50 hover:bg-galorys-purple hover:text-white flex items-center justify-center text-muted-foreground transition-all"
                          >
                            <Icon className="w-5 h-5" />
                          </a>
                        ) : null
                      })}
                    </div>
                    
                    <div className="flex-1" />
                    
                    <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-galorys-purple to-galorys-pink text-white font-semibold hover:opacity-90 transition-opacity shadow-lg">
                      Ver Perfil
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other players grid - Cards menores ESTILIZADOS */}
          <div className="grid md:grid-cols-2 gap-6">
            {otherPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div 
                  onClick={() => handlePlayerClick(player.teamSlug)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-galorys-surface via-galorys-surface/95 to-background border border-border hover:border-galorys-purple/50 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]"
                >
                  {/* Glow sutil */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-galorys-purple/5 rounded-full blur-2xl pointer-events-none group-hover:bg-galorys-purple/10 transition-colors" />

                  <div className="relative flex">
                    {/* Avatar com gradiente */}
                    <div className="relative w-32 md:w-40 flex-shrink-0">
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-galorys-purple/20 to-galorys-pink/20">
                        <Image
                          src={imgErrors[player.id] ? getPlayerAvatar(player.nickname) : player.photo}
                          alt={player.nickname}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          onError={() => handleImgError(player.id)}
                        />
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-galorys-surface/50" />
                      </div>
                      
                      {/* Badge de posição */}
                      <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">{index + 2}º</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-5 flex flex-col justify-center">
                      {/* Tag do time */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-full bg-galorys-purple/20 text-galorys-purple text-xs font-semibold">
                          {player.team}
                        </span>
                        <span className="text-xs text-muted-foreground">{player.role}</span>
                      </div>
                      
                      {/* Nome */}
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-galorys-purple transition-colors">
                        {player.nickname}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{player.realName}</p>
                      
                      {/* Mini stats */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Trophy className="w-3.5 h-3.5 text-galorys-purple" />
                          <span className="font-semibold text-foreground">{player.stats.titles}</span>
                          <span>títulos</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Medal className="w-3.5 h-3.5 text-galorys-pink" />
                          <span className="font-semibold text-foreground">{player.stats.ranking}</span>
                        </div>
                      </div>
                      
                      {/* Socials */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {Object.entries(player.socials).map(([platform, url]) => {
                          const Icon = socialIcons[platform as keyof typeof socialIcons]
                          return Icon ? (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-galorys-purple hover:text-white flex items-center justify-center text-muted-foreground transition-all"
                            >
                              <Icon className="w-4 h-4" />
                            </a>
                          ) : null
                        })}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center pr-5">
                      <div className="w-10 h-10 rounded-xl bg-muted/30 group-hover:bg-galorys-purple/20 flex items-center justify-center transition-all">
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-galorys-purple group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Achievement footer */}
                  <div className="px-5 py-3 bg-gradient-to-r from-muted/30 to-muted/10 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-xs text-muted-foreground line-clamp-1">{player.achievement}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => router.push('/jogadores')}
            className="inline-flex items-center gap-2 text-galorys-purple hover:text-foreground transition-colors group"
          >
            Ver todos os jogadores
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
