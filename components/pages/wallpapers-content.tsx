"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { ImageIcon, Play, Monitor, Download } from "lucide-react"

const stats = [
  { icon: ImageIcon, value: "4", label: "Total" },
  { icon: Play, value: "3", label: "Animados" },
  { icon: Monitor, value: "HD", label: "Qualidade" },
]

const wallpapers = [
  {
    id: 1,
    title: "Wallpaper Galorys Purple",
    description: "Wallpaper animado em vídeo com tema roxo.",
    type: "Animado",
    file: "/images/wallpapers/1_Wallpaper_Galorys_PURPLE.mp4",
    isVideo: true,
  },
  {
    id: 2,
    title: "Wallpaper Galorys RGB",
    description: "Wallpaper animado em vídeo com efeito RGB.",
    type: "Animado",
    file: "/images/wallpapers/2_Wallpaper_Galorys_RGB.mp4",
    isVideo: true,
  },
  {
    id: 3,
    title: "Wallpaper Galorys Animado",
    description: "Wallpaper animado em vídeo.",
    type: "Animado",
    file: "/images/wallpapers/3_Wallpaper_Galorys_1.mp4",
    isVideo: true,
  },
  {
    id: 4,
    title: "Galorys Logo",
    description: "Logo da Galorys em alta resolução.",
    type: "Estático",
    file: "/images/wallpapers/4_GALORYS-LOGO.png",
    isVideo: false,
  },
]

export function WallpapersContent() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <PageHeader
          badge="Downloads"
          title="WALLPAPERS"
          highlightedText="EXCLUSIVOS"
          description="Baixe wallpapers oficiais da Galorys para personalizar seu desktop e celular."
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} index={index} />
          ))}
        </div>

        {/* Wallpapers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {wallpapers.map((wallpaper, index) => (
            <motion.div
              key={wallpaper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass rounded-2xl overflow-hidden border border-border hover:border-galorys-purple/50 transition-all">
                <div className="relative aspect-video overflow-hidden bg-galorys-surface">
                  {wallpaper.isVideo ? (
                    <video
                      src={wallpaper.file}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={wallpaper.file}
                      alt={wallpaper.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                    {wallpaper.type === "Animado" ? <Play className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {wallpaper.type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1">{wallpaper.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{wallpaper.description}</p>
                  <a 
                    href={wallpaper.file} 
                    download 
                    onClick={(e) => e.stopPropagation()}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-galorys-purple to-galorys-pink text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}