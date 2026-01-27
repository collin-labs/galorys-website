"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Twitter, Instagram, Twitch, Youtube, Facebook, ChevronDown, Globe } from "lucide-react"

// Mapeamento de plataforma para ícone
const iconMap: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  twitch: Twitch,
  x: Twitter,
  tiktok: Globe,
  discord: Globe,
}

interface SocialLink {
  id: string
  platform: string
  url: string
  active: boolean
  order: number
}

// Interface para colunas do footer
interface FooterItemDB {
  id: string
  label: string
  href: string
  order: number
  active: boolean
}

interface FooterColumnDB {
  id: string
  name: string
  slug: string
  order: number
  active: boolean
  items: FooterItemDB[]
}

// Fallback estático
const fallbackFooterLinks = {
  institucional: [
    { name: "Sobre", href: "/sobre" },
    { name: "Conquistas", href: "/conquistas" },
    { name: "Contato", href: "/contato" },
    { name: "FAQ", href: "/faq" },
  ],
  times: [
    { name: "Gran Turismo", href: "/times/gran-turismo" },
    { name: "Call of Duty Mobile", href: "/times/cod-mobile" },
    { name: "CS2 Galorynhos", href: "/times/cs2-galorynhos" },
    { name: "Counter Strike 2", href: "/times/cs2" },
  ],
  links: [
    { name: "Termos de Uso", href: "/termos" },
    { name: "Política de Privacidade", href: "/privacidade" },
    { name: "Wallpapers", href: "/wallpapers" },
    { name: "Roblox", href: "/roblox" },
  ],
}

const fallbackSections = [
  { title: "Institucional", links: fallbackFooterLinks.institucional },
  { title: "Nossos Times", links: fallbackFooterLinks.times },
  { title: "Links Úteis", links: fallbackFooterLinks.links },
]

// Fallback para quando não conseguir buscar do banco
const defaultSocialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/galorys" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/galorys" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/galorys" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/galorys" },
  { name: "Twitch", icon: Twitch, href: "https://twitch.tv/galorys" },
]

// Converter colunas do banco para formato da UI
function convertColumnsToUI(columns: FooterColumnDB[]) {
  // Filtrar apenas colunas ativas e com itens ativos
  return columns
    .filter(col => col.active && col.items.length > 0)
    .map(col => ({
      title: col.name,
      links: col.items.map(item => ({
        name: item.label,
        href: item.href
      }))
    }))
}

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [footerSections, setFooterSections] = useState(fallbackSections)
  const [loadedFromDb, setLoadedFromDb] = useState(false)

  // Buscar colunas do footer do banco
  useEffect(() => {
    async function fetchFooterColumns() {
      try {
        const response = await fetch('/api/footer')
        if (response.ok) {
          const data = await response.json()
          if (data.columns && data.columns.length > 0) {
            const converted = convertColumnsToUI(data.columns)
            setFooterSections(converted)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar footer:', error)
      }
    }
    fetchFooterColumns()
  }, [])

  // Buscar redes sociais do banco
  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const response = await fetch('/api/social-links')
        if (response.ok) {
          const data = await response.json()
          if (data.socialLinks && data.socialLinks.length > 0) {
            setSocialLinks(data.socialLinks.filter((s: SocialLink) => s.active))
            setLoadedFromDb(true)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar redes sociais:', error)
      }
    }
    fetchSocialLinks()
  }, [])

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title)
  }

  // Renderizar ícones sociais
  const renderSocialLinks = () => {
    if (loadedFromDb && socialLinks.length > 0) {
      return socialLinks.map((social) => {
        const Icon = iconMap[social.platform.toLowerCase()] || Globe
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all"
            title={social.platform}
          >
            <Icon className="w-4 h-4" />
          </a>
        )
      })
    }

    // Fallback
    return defaultSocialLinks.map((social) => (
      <a
        key={social.name}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all"
      >
        <social.icon className="w-4 h-4" />
      </a>
    ))
  }

  // Calcular classes do grid baseado no número de colunas
  const getGridClasses = () => {
    const numSections = footerSections.length
    // Logo ocupa 2 colunas, cada seção ocupa 1
    // Total = 2 + numSections
    if (numSections <= 2) return 'lg:grid-cols-4' // 2 + 2 = 4
    if (numSections === 3) return 'lg:grid-cols-5' // 2 + 3 = 5
    if (numSections === 4) return 'lg:grid-cols-6' // 2 + 4 = 6
    return 'lg:grid-cols-7' // 2 + 5 = 7
  }

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-10">
        <div className={`grid grid-cols-1 ${getGridClasses()} gap-6 lg:gap-8`}>
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-0.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-transparent border-2 border-galorys-purple p-1 flex items-center justify-center">
                <Image
                  src="/images/logo/logo_g.png"
                  alt="Galorys"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </div>
              <Image
                src="/images/logo/logo_galorys.png"
                alt="Galorys"
                width={100}
                height={30}
                className="h-6 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              A Galorys é uma empresa que visa se inserir em mercados promissores na área de games e conteúdo digital.
              Nosso intuito é sermos revolucionários e multilaterais no segmento de jogos, notícias, conteúdo digital e
              publicidade, sendo referência no mercado brasileiro.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 mt-4">
              {renderSocialLinks()}
            </div>
          </div>

          {/* Links - Desktop (normal) / Mobile (accordion) */}
          {footerSections.map((section) => (
            <div key={section.title}>
              {/* Desktop - sempre visível */}
              <div className="hidden lg:block">
                <h4 className="font-semibold text-foreground mb-3 text-sm">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-galorys-purple transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile - accordion */}
              <div className="lg:hidden border-b border-border">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between py-3 text-left"
                >
                  <h4 className="font-semibold text-foreground text-sm">{section.title}</h4>
                  <ChevronDown 
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      openSection === section.title ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openSection === section.title ? "max-h-48 pb-3" : "max-h-0"
                  }`}
                >
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-galorys-purple transition-colors text-sm"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs md:text-sm">
            © {new Date().getFullYear()} Galorys. Todos os direitos reservados.
          </p>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-transparent border border-galorys-purple p-0.5 flex items-center justify-center">
              <Image
                src="/images/logo/logo_g.png"
                alt="Galorys"
                width={12}
                height={12}
                className="w-3 h-3 object-contain"
              />
            </div>
            <span className="text-xs font-semibold gradient-text">galorys</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
