"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
