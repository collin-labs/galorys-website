"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Handshake, Loader2, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Interface para parceiros do banco
interface PartnerDB {
  id: string
  name: string
  logo: string | null
  website: string | null
  order: number
  active: boolean
}

export function PartnersSection() {
  const [partners, setPartners] = useState<PartnerDB[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch('/api/admin/partners')
        if (response.ok) {
          const data = await response.json()
          if (data.partners && data.partners.length > 0) {
            // Filtrar apenas ativos e ordenar
            const activePartners = data.partners
              .filter((p: PartnerDB) => p.active)
              .sort((a: PartnerDB, b: PartnerDB) => a.order - b.order)
            setPartners(activePartners)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar parceiros:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPartners()
  }, [])

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying || partners.length <= 4) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % partners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, partners.length])

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % partners.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + partners.length) % partners.length)
    setIsAutoPlaying(false)
  }

  // Calcular quantos itens mostrar por vez
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4
    if (window.innerWidth < 640) return 2
    if (window.innerWidth < 1024) return 3
    return 4
  }

  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount())
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Se não tiver parceiros, mostrar CTA imponente
  if (!loading && partners.length === 0) {
    return (
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-galorys-purple/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-galorys-purple/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Card principal */}
            <div className="relative bg-gradient-to-br from-galorys-surface/90 to-galorys-surface/50 backdrop-blur-xl border border-galorys-purple/20 rounded-3xl p-8 md:p-12 lg:p-16 text-center overflow-hidden">
              {/* Decorações */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-galorys-purple/20 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-galorys-pink/20 to-transparent rounded-tr-full" />
              
              {/* Ícone animado */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="relative mx-auto mb-6 w-20 h-20 md:w-24 md:h-24"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-galorys-purple to-galorys-pink rounded-2xl rotate-6 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-galorys-purple to-galorys-pink rounded-2xl flex items-center justify-center">
                  <Handshake className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-galorys-purple/10 border border-galorys-purple/30 text-galorys-purple text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Oportunidade Exclusiva
              </motion.div>

              {/* Título */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
              >
                Quer ser nosso{" "}
                <span className="gradient-text">Parceiro</span>?
              </motion.h2>

              {/* Descrição */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8"
              >
                Junte-se à Galorys e conecte sua marca a milhares de fãs apaixonados por eSports. 
                Oferecemos visibilidade, engajamento e oportunidades únicas de crescimento.
              </motion.p>

              {/* Benefícios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 mb-10"
              >
                {[
                  "Exposição em Campeonatos",
                  "Conteúdo Exclusivo",
                  "Ativações Personalizadas",
                  "ROI Comprovado"
                ].map((benefit, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-background/50 border border-border text-sm text-muted-foreground"
                  >
                    {benefit}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/contato">
                  <Button size="lg" className="bg-gradient-to-r from-galorys-purple to-galorys-pink hover:opacity-90 text-white px-8 h-12 text-base group">
                    Quero ser parceiro
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="mailto:contato@galorys.com">
                  <Button size="lg" variant="outline" className="border-border hover:bg-muted/50 px-8 h-12 text-base">
                    <Mail className="w-4 h-4 mr-2" />
                    contato@galorys.com
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // Loading
  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  // Se tiver parceiros, mostrar carrossel moderno
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-galorys-purple/5 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-galorys-purple/10 border border-galorys-purple/20 text-galorys-purple text-sm font-medium mb-4">
            Parceiros
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            NOSSOS <span className="gradient-text">PARCEIROS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empresas que acreditam no nosso trabalho e nos ajudam a alcançar novos patamares
          </p>
        </motion.div>

        {/* Carrossel moderno */}
        <div className="relative max-w-6xl mx-auto">
          {/* Gradientes nas bordas */}
          {partners.length > visibleCount && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            </>
          )}

          {/* Container do carrossel */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <motion.div
              className="flex gap-6"
              animate={{
                x: partners.length > visibleCount 
                  ? `-${currentIndex * (100 / visibleCount)}%`
                  : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                width: partners.length > visibleCount 
                  ? `${(partners.length / visibleCount) * 100}%`
                  : '100%'
              }}
            >
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0"
                  style={{
                    width: partners.length > visibleCount 
                      ? `calc(${100 / partners.length}% - 24px)`
                      : `calc(${100 / Math.min(partners.length, visibleCount)}% - 24px)`
                  }}
                >
                  <a
                    href={partner.website || '#'}
                    target={partner.website ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="relative h-32 md:h-40 rounded-2xl bg-gradient-to-br from-galorys-surface to-background border border-border hover:border-galorys-purple/50 transition-all duration-500 flex items-center justify-center p-6 overflow-hidden">
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-galorys-purple/0 to-galorys-pink/0 group-hover:from-galorys-purple/10 group-hover:to-galorys-pink/10 transition-all duration-500" />
                      
                      {/* Logo */}
                      {partner.logo ? (
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={160}
                          height={80}
                          className="max-h-16 md:max-h-20 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                          {partner.name}
                        </span>
                      )}

                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-galorys-purple to-transparent" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Controles do carrossel */}
          {partners.length > visibleCount && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border-border hover:bg-galorys-purple/10 hover:border-galorys-purple/50"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Indicadores */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(partners.length / visibleCount) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i * visibleCount)
                      setIsAutoPlaying(false)
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / visibleCount) === i
                        ? 'w-8 bg-gradient-to-r from-galorys-purple to-galorys-pink'
                        : 'w-2 bg-border hover:bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border-border hover:bg-galorys-purple/10 hover:border-galorys-purple/50"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* CTA Minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/contato">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground group">
              <Handshake className="w-4 h-4 mr-2" />
              Quer ser nosso parceiro?
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
