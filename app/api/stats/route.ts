import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valores padrão (fallback)
const DEFAULT_STATS = {
  titulos_nacionais: "35",
  titulos_internacionais: "15",
  recordes_mundiais: "20",
  anos_historia: "5",
}

export async function GET() {
  try {
    // Buscar stats do banco
    const configs = await prisma.siteConfig.findMany({
      where: {
        key: {
          startsWith: "stats_"
        }
      }
    })
    
    // Converter para objeto
    const statsFromDB = configs.reduce((acc, config) => {
      // Remove prefixo "stats_" da key
      const key = config.key.replace("stats_", "")
      acc[key] = config.value
      return acc
    }, {} as Record<string, string>)
    
    // Mesclar com valores padrão (DB tem prioridade)
    const stats = {
      ...DEFAULT_STATS,
      ...statsFromDB
    }

    return NextResponse.json({
      stats: [
        { label: "Títulos Nacionais", value: parseInt(stats.titulos_nacionais) || 35, suffix: "+" },
        { label: "Títulos Internacionais", value: parseInt(stats.titulos_internacionais) || 15, suffix: "+" },
        { label: "Recordes Mundiais", value: parseInt(stats.recordes_mundiais) || 20, suffix: "+" },
        { label: "Anos de História", value: parseInt(stats.anos_historia) || 5, suffix: "" },
      ],
      raw: stats,
      fetchedAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Erro ao buscar stats:', error)
    
    // Retornar fallback em caso de erro
    return NextResponse.json({
      stats: [
        { label: "Títulos Nacionais", value: 35, suffix: "+" },
        { label: "Títulos Internacionais", value: 15, suffix: "+" },
        { label: "Recordes Mundiais", value: 20, suffix: "+" },
        { label: "Anos de História", value: 5, suffix: "" },
      ],
      fromFallback: true,
      fetchedAt: new Date().toISOString()
    })
  }
}