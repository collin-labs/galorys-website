"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Twitter, Instagram, Twitch, Youtube, Facebook, ChevronDown } from "lucide-react"

const footerLinks = {
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

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/galorys" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/galorys" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/galorys" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/galorys" },
  { name: "Twitch", icon: Twitch, href: "https://twitch.tv/galorys" },
]

const footerSections = [
  { title: "Institucional", links: footerLinks.institucional },
  { title: "Nossos Times", links: footerLinks.times },
  { title: "Links Úteis", links: footerLinks.links },
]

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title)
  }

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
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
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
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
          <Link href="/" className="flex items-center gap-0.5">
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
