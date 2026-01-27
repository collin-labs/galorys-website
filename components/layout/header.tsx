"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Users, Instagram, Twitter, Youtube, Twitch, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

// Interface para redes sociais do banco
interface SocialLink {
  id: string
  platform: string
  url: string
  active: boolean
  order: number
}

// Interface para menu do banco
interface MenuItemDB {
  id: string
  label: string
  href: string
  order: number
  active: boolean
  children?: MenuItemDB[]
}

// Mapeamento de plataforma para ícone
const socialIconMap: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  twitch: Twitch,
  tiktok: Globe,
  discord: Globe,
  facebook: Globe,
}

// Menu fallback estático
const fallbackNavLinks = [
  { name: "Início", href: "/" },
  {
    name: "Times",
    href: "/times",
    hasDropdown: true,
    items: [
      { name: "Ver Todos os Times", href: "/times", icon: Users },
      { name: "Gran Turismo", href: "/times/gran-turismo", icon: "🏎️" },
      { name: "Call of Duty Mobile", href: "/times/cod-mobile", icon: "🎯" },
      { name: "CS2 Galorynhos", href: "/times/cs2-galorynhos", icon: "💜" },
      { name: "Counter Strike 2", href: "/times/cs2", icon: "🎮" },
    ],
  },
  { name: "Jogadores", href: "/jogadores" },
  { name: "Conquistas", href: "/conquistas" },
  { name: "Wallpapers", href: "/wallpapers" },
  { name: "Roblox", href: "/roblox" },
  { name: "GTA RP", href: "/gtarp" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
]

// Converter dados do banco para formato da UI
function convertMenuToUI(dbItems: MenuItemDB[]) {
  return dbItems.map(item => ({
    name: item.label,
    href: item.href,
    hasDropdown: item.children && item.children.length > 0,
    items: item.children?.map(child => ({
      name: child.label,
      href: child.href,
      icon: Users // Default icon
    }))
  }))
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [navLinks, setNavLinks] = useState(fallbackNavLinks)
  const pathname = usePathname()

  // Buscar menu do banco
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch('/api/menu')
        if (response.ok) {
          const data = await response.json()
          if (data.menuItems && data.menuItems.length > 0) {
            const converted = convertMenuToUI(data.menuItems)
            setNavLinks(converted)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar menu:', error)
      }
    }
    fetchMenu()
  }, [])

  // Buscar redes sociais do banco
  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const response = await fetch('/api/social-links')
        if (response.ok) {
          const data = await response.json()
          if (data.socialLinks) {
            setSocialLinks(data.socialLinks)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar redes sociais:', error)
      }
    }
    fetchSocialLinks()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  // LiveCounter só existe na home, então o header só precisa de offset na home
  const isHome = pathname === "/"

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed ${isHome ? "top-10" : "top-0"} left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Mobile - só a logo com nome */}
            <Image
              src="/images/logo/logo_galorys.png"
              alt="Galorys"
              width={120}
              height={36}
              className="sm:hidden h-8 w-auto"
            />
            {/* Desktop - quadrado com G + logo com nome */}
            <div className="hidden sm:flex items-center gap-0.5">
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
                className="h-7 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-popover border-border">
                    {link.items?.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center gap-3 cursor-pointer">
                          {typeof item.icon === "string" ? (
                            <span>{item.icon}</span>
                          ) : (
                            <item.icon className="w-4 h-4 text-galorys-purple" />
                          )}
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm rounded-full transition-all ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-foreground">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Fullscreen Glassmorphism */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-[100]"
              style={{ top: isHome ? "40px" : "0" }}
            >
              {/* Backdrop com blur */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Gradiente decorativo */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-galorys-purple/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-galorys-pink/20 rounded-full blur-3xl" />
              </div>

              {/* Container do menu */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative h-full flex flex-col"
              >
                {/* Header do menu mobile */}
                <div className="flex items-center justify-between px-4 h-16 border-b border-border/50">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
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
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="w-10 h-10 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Links do menu */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                      }
                    }}
                    className="space-y-2"
                  >
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.name}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                            isActive(link.href)
                              ? "bg-gradient-to-r from-galorys-purple/20 to-galorys-pink/20 border border-galorys-purple/30"
                              : "hover:bg-muted/50 border border-transparent hover:border-border/50"
                          }`}
                        >
                          {/* Número do item */}
                          <span className={`text-xs font-mono ${
                            isActive(link.href) ? "text-galorys-purple" : "text-muted-foreground"
                          }`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          
                          {/* Nome do link */}
                          <span className={`flex-1 text-lg font-medium transition-colors ${
                            isActive(link.href) 
                              ? "text-foreground" 
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}>
                            {link.name}
                          </span>
                          
                          {/* Indicador ativo */}
                          {isActive(link.href) && (
                            <motion.div 
                              layoutId="activeIndicator"
                              className="w-2 h-2 rounded-full bg-gradient-to-r from-galorys-purple to-galorys-pink"
                            />
                          )}
                          
                          {/* Seta */}
                          <ChevronDown className={`w-4 h-4 -rotate-90 transition-transform ${
                            isActive(link.href) 
                              ? "text-galorys-purple" 
                              : "text-muted-foreground group-hover:text-foreground group-hover:translate-x-1"
                          }`} />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </nav>

                {/* Footer do menu mobile */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="px-4 py-6 border-t border-border/50"
                >
                  {/* Redes sociais dinâmicas do banco */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {socialLinks.length > 0 ? (
                      socialLinks.map((social) => {
                        const Icon = socialIconMap[social.platform.toLowerCase()] || Globe
                        return (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                            className="w-10 h-10 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-galorys-purple/50 hover:bg-galorys-purple/10 transition-all"
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        )
                      })
                    ) : (
                      // Fallback enquanto carrega
                      <>
                        <div className="w-10 h-10 rounded-xl bg-muted/30 animate-pulse" />
                        <div className="w-10 h-10 rounded-xl bg-muted/30 animate-pulse" />
                        <div className="w-10 h-10 rounded-xl bg-muted/30 animate-pulse" />
                      </>
                    )}
                  </div>
                  
                  {/* Copyright */}
                  <p className="text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Galorys eSports
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
