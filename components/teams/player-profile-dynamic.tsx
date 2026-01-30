"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Gamepad2, Calendar, Twitter, Instagram, Twitch, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

// Interfaces para dados do banco
interface Player {
  id: string
  nickname: string
  realName: string | null
  slug: string
  photo: string | null
  role: string | null
  bio: string | null
  joinedAt: Date
  twitter: string | null
  instagram: string | null
  twitch: string | null
  youtube: string | null
  tiktok: string | null
}

interface Team {
  id: string
  slug: string
  name: string
  game: string
  gameLabel?: string | null
}

interface PlayerProfileDynamicProps {
  player: Player
  team: Team
  teammates: Player[]
}

// Função para gerar avatar placeholder
const getPlayerAvatar = (nickname: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=9B30FF&color=fff&size=256`
}

export function PlayerProfileDynamic({ player, team, teammates }: PlayerProfileDynamicProps) {
  const [imgError, setImgError] = useState(false)
  const [bgError, setBgError] = useState(false)
  const [teammateErrors, setTeammateErrors] = useState<Record<string, boolean>>({})

  const handleTeammateError = (id: string) => {
    setTeammateErrors(prev => ({ ...prev, [id]: true }))
  }

  // Formatar data de entrada
  const joinedYear = new Date(player.joinedAt).getFullYear()
  const gameLabel = team.gameLabel || team.game

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href={`/times/${team.slug}`}
            className="inline-flex items-center gap-2 text-galorys-purple hover:text-galorys-pink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">VOLTAR</span>
          </Link>
        </motion.div>

        {/* Player Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Player Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Circular Gradient Background */}
              <div className="absolute -top-8 -right-8 w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-purple-500/60 to-pink-500/40 blur-3xl" />

              {/* Player Image */}
              <div className="relative w-[280px] h-[350px] md:w-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 blur-2xl scale-75" />
                {!bgError && (
                  <Image
                    src="/images/base/base-imagem-galorys.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    onError={() => setBgError(true)}
                  />
                )}
                <Image
                  src={imgError || !player.photo ? getPlayerAvatar(player.nickname) : player.photo}
                  alt={player.nickname}
                  fill
                  className="object-cover object-top"
                  onError={() => setImgError(true)}
                />

                {/* Game Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-galorys-purple text-white text-sm font-semibold">
                    <Gamepad2 className="w-4 h-4" />
                    {gameLabel}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Player Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {/* Role Badge */}
            <span className="inline-block w-fit px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-galorys-purple mb-4">
              {player.role || 'Player'}
            </span>

            {/* Nickname */}
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-2">{player.nickname}</h1>

            {/* Real Name */}
            {player.realName && (
              <p className="text-xl text-muted-foreground mb-6">{player.realName}</p>
            )}

            {/* Info Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{gameLabel}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Desde {joinedYear}</span>
              </div>
            </div>

            {/* Bio */}
            {player.bio && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Sobre</h3>
                <div className="text-muted-foreground space-y-2">
                  {player.bio.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(player.twitter || player.instagram || player.twitch || player.youtube) && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Redes Sociais</h3>
                <div className="flex flex-wrap gap-3">
                  {player.twitter && (
                    <a
                      href={player.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border hover:border-[#1DA1F2]/50 transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                      <span className="text-sm text-[#1DA1F2]">Twitter</span>
                    </a>
                  )}
                  {player.instagram && (
                    <a
                      href={player.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border hover:border-[#E4405F]/50 transition-colors"
                    >
                      <Instagram className="w-4 h-4 text-[#E4405F]" />
                      <span className="text-sm text-[#E4405F]">Instagram</span>
                    </a>
                  )}
                  {player.twitch && (
                    <a
                      href={player.twitch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border hover:border-[#9146FF]/50 transition-colors"
                    >
                      <Twitch className="w-4 h-4 text-[#9146FF]" />
                      <span className="text-sm text-[#9146FF]">Twitch</span>
                    </a>
                  )}
                  {player.youtube && (
                    <a
                      href={player.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border hover:border-[#FF0000]/50 transition-colors"
                    >
                      <Youtube className="w-4 h-4 text-[#FF0000]" />
                      <span className="text-sm text-[#FF0000]">YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Teammates Section */}
        {teammates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">👥</span>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Colegas de Time</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {teammates.map((teammate, index) => (
                <Link key={teammate.id} href={`/times/${team.slug}/jogador/${teammate.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-2xl overflow-hidden border border-border hover:border-galorys-purple/50 transition-all"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-galorys-purple/20 to-galorys-pink/20">
                      <Image
                        src="/images/base/base-imagem-galorys.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <Image
                        src={teammateErrors[teammate.id] || !teammate.photo ? getPlayerAvatar(teammate.nickname) : teammate.photo}
                        alt={teammate.nickname}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={() => handleTeammateError(teammate.id)}
                      />

                      {/* Gradient Glow */}
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/60 to-pink-500/40 blur-xl" />

                      {/* Bottom Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white">{teammate.nickname}</h3>
                        <p className="text-white/70 text-sm">{teammate.role || 'Player'}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/jogadores">
            <Button variant="outline" className="border-border bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Todos os Jogadores
            </Button>
          </Link>
          <Link href={`/times/${team.slug}`}>
            <Button className="bg-galorys-purple hover:bg-galorys-purple/80 text-white">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Ver Time {team.name}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
