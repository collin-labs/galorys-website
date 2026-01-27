import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valores padrão (fallback)
const DEFAULT_CONFIG = {
  badge: "Servidores Exclusivos",
  title: "JOGUE COM A",
  titleHighlight: "GALORYS",
  subtitle: "Entre nos nossos servidores oficiais e faça parte da maior comunidade gaming do Brasil",
  games: [
    {
      title: "ROBLOX",
      subtitle: "Galorys Tycoon & Games",
      href: "/roblox",
      gradient: "bg-gradient-to-br from-red-500 to-rose-600",
      icon: "Gamepad2"
    },
    {
      title: "GTA RP",
      subtitle: "FiveM KUSH & FLOW",
      href: "/gtarp",
      gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
      icon: "Globe"
    }
  ],
  features: [
    { text: "Servidores 24/7", color: "text-yellow-500", icon: "Zap" },
    { text: "Comunidade Ativa", color: "text-green-500", icon: "Users" },
    { text: "100% Gratuito", color: "text-galorys-purple", icon: "Sparkles" }
  ]
}

export async function GET() {
  try {
    // Buscar configurações da CTA do banco
    const configs = await prisma.siteConfig.findMany({
      where: {
        key: {
          startsWith: "cta_"
        }
      }
    })
    
    // Converter para objeto
    const configFromDB: Record<string, string> = {}
    configs.forEach(config => {
      const key = config.key.replace("cta_", "")
      configFromDB[key] = config.value
    })
    
    // Montar resultado com valores do banco ou fallback
    const result = {
      badge: configFromDB.badge || DEFAULT_CONFIG.badge,
      title: configFromDB.title || DEFAULT_CONFIG.title,
      titleHighlight: configFromDB.titleHighlight || DEFAULT_CONFIG.titleHighlight,
      subtitle: configFromDB.subtitle || DEFAULT_CONFIG.subtitle,
      games: DEFAULT_CONFIG.games,
      features: DEFAULT_CONFIG.features,
    }
    
    // Parsear JSON se existirem
    if (configFromDB.games) {
      try {
        result.games = JSON.parse(configFromDB.games)
      } catch (e) {
        console.log("Erro ao parsear cta_games, usando padrão")
      }
    }
    
    if (configFromDB.features) {
      try {
        result.features = JSON.parse(configFromDB.features)
      } catch (e) {
        console.log("Erro ao parsear cta_features, usando padrão")
      }
    }

    return NextResponse.json({
      ...result,
      fetchedAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Erro ao buscar cta config:', error)
    
    // Retornar fallback em caso de erro
    return NextResponse.json({
      ...DEFAULT_CONFIG,
      fromFallback: true,
      fetchedAt: new Date().toISOString()
    })
  }
}