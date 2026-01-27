"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Twitter, Instagram, Twitch, Youtube } from "lucide-react"
import type { Player } from "@/lib/data/players"
import { getPlayerAvatar } from "@/lib/data/players"

interface PlayerCardProps {
  player: Player
  teamSlug: string
  index?: number
}

export function PlayerCard({ player, teamSlug, index = 0 }: PlayerCardProps) {
  const [imgError, setImgError] = useState(false)
  const [bgError, setBgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/times/${teamSlug}/jogador/${player.id}`}>
        <div className="relative rounded-2xl overflow-hidden border border-border hover:border-galorys-purple/50 transition-all bg-muted/30">
          {/* Player Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-galorys-purple/20 to-galorys-pink/20">
            {/* Background base */}
            {!bgError && (
              <Image
                src="/images/base/base-imagem-galorys.png"
                alt="Background"
                fill
                className="object-cover"
                onError={() => setBgError(true)}
              />
            )}
            
            {/* Player photo */}
            <Image
              src={imgError ? getPlayerAvatar(player.nickname) : player.photo}
              alt={player.nickname}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />

            {/* Gradient Glow Effect */}
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/60 to-pink-500/40 blur-xl" />

            {/* Bottom Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Player Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-white text-lg">{player.nickname}</h3>
              <p className="text-white/70 text-sm">{player.realName}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-galorys-purple">
                {player.role}
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {player.socials?.twitter && (
              <a 
                href={player.socials.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1DA1F2] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {player.socials?.instagram && (
              <a 
                href={player.socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#E4405F] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {player.socials?.twitch && (
              <a 
                href={player.socials.twitch} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#9146FF] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitch className="w-4 h-4" />
              </a>
            )}
            {player.socials?.youtube && (
              <a 
                href={player.socials.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#FF0000] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
