import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valores padrão (fallback)
const DEFAULT_CONFIG = {
  games: ["Counter Strike 2", "Call of Duty Mobile", "Gran Turismo", "Roblox"],
  badge: "TOP 2 Ranking Mundial COD Mobile",
  stats: [
    { value: "50+", label: "Conquistas" },
    { value: "25+", label: "Atletas" },
    { value: "5", label: "Modalidades" },
  ],
}

export async function GET() {
  try {
    // Buscar configurações do hero do banco
    const configs = await prisma.siteConfig.findMany({
      where: {
        key: {
          startsWith: "hero_"
        }
      }
    })
    
    // Converter para objeto
    const configFromDB: Record<string, string> = {}
    configs.forEach(config => {
      const key = config.key.replace("hero_", "")
      configFromDB[key] = config.value
    })
    
    // Parsear valores JSON se existirem
    let games = DEFAULT_CONFIG.games
    let badge = DEFAULT_CONFIG.badge
    let stats = DEFAULT_CONFIG.stats
    
    if (configFromDB.games) {
      try {
        games = JSON.parse(configFromDB.games)
      } catch (e) {
        console.log("Erro ao parsear hero_games, usando padrão")
      }
    }
    
    if (configFromDB.badge) {
      badge = configFromDB.badge
    }
    
    if (configFromDB.stats) {
      try {
        stats = JSON.parse(configFromDB.stats)
      } catch (e) {
        console.log("Erro ao parsear hero_stats, usando padrão")
      }
    }

    return NextResponse.json({
      games,
      badge,
      stats,
      fetchedAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Erro ao buscar hero config:', error)
    
    // Retornar fallback em caso de erro
    return NextResponse.json({
      ...DEFAULT_CONFIG,
      fromFallback: true,
      fetchedAt: new Date().toISOString()
    })
  }
}