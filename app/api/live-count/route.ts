import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Fallback hardcoded (usado se banco não tiver dados)
const DEFAULT_FIVEM_SERVERS = [
  { code: "r4z8dg", game: "gtarp-kush" },
  { code: "3emg7o", game: "gtarp-flow" },
]
const DEFAULT_ROBLOX_UNIVERSE_ID = "6194867050"

// Cache para não fazer muitas requisições
let cache: {
  data: any
  timestamp: number
} | null = null

// Cache de fallback (último valor válido)
let lastValidData: any = {
  totalPlayers: 0,
  breakdown: { roblox: 0, fivem: 0 },
  isLive: false,
  fetchedAt: new Date().toISOString(),
}

const CACHE_DURATION = 60 * 1000 // 60 segundos
const STALE_DURATION = 5 * 60 * 1000 // 5 minutos para dados stale

// Buscar diretamente da API do FiveM (sem fetch interno)
async function fetchFivemDirect() {
  // Tentar buscar servidores do banco de dados
  let servers = DEFAULT_FIVEM_SERVERS
  
  try {
    const dbServers = await prisma.gameLink.findMany({
      where: {
        game: { startsWith: "gtarp" },
        active: true,
      },
      select: {
        serverCode: true,
        game: true,
      },
    })
    
    if (dbServers.length > 0) {
      servers = dbServers.map((s) => ({ code: s.serverCode, game: s.game }))
    }
  } catch (dbError) {
    // Usar fallback se banco falhar
    console.log("LiveCount: usando servidores FiveM padrão (banco não disponível)")
  }
  
  let totalPlayers = 0
  
  for (const server of servers) {
    try {
      const response = await fetch(
        `https://servers-frontend.fivem.net/api/servers/single/${server.code}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Galorys-Website/1.0'
          },
          next: { revalidate: 60 }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        totalPlayers += data?.Data?.clients || 0
      }
    } catch (e) {
      // Silenciar erros individuais
    }
  }
  
  return totalPlayers
}

// Buscar jogadores de TODOS os jogos Roblox
async function fetchRobloxDirect() {
  let totalPlayers = 0
  
  try {
    // 1. Buscar jogos da tabela RobloxGame (múltiplos jogos)
    let robloxGames: { universeId: string; name: string }[] = []
    
    try {
      const dbGames = await prisma.robloxGame.findMany({
        where: { featured: true },
        select: { universeId: true, name: true },
      })
      
      if (dbGames.length > 0) {
        robloxGames = dbGames
        console.log(`LiveCount: Encontrados ${dbGames.length} jogos Roblox no banco`)
      }
    } catch (dbError) {
      console.log("LiveCount: tabela RobloxGame não disponível")
    }
    
    // 2. Se não encontrou na tabela RobloxGame, buscar da GameLink
    if (robloxGames.length === 0) {
      try {
        // Buscar TODOS os jogos que começam com "roblox" na GameLink
        const dbLinks = await prisma.gameLink.findMany({
          where: {
            game: { startsWith: "roblox" },
            active: true,
          },
          select: { serverCode: true, name: true, game: true },
        })
        
        if (dbLinks.length > 0) {
          // serverCode pode ser Place ID, precisamos converter para Universe ID
          for (const link of dbLinks) {
            if (link.serverCode) {
              robloxGames.push({ 
                universeId: link.serverCode, // Será convertido abaixo
                name: link.name 
              })
            }
          }
          console.log(`LiveCount: Encontrados ${dbLinks.length} jogos Roblox na GameLink`)
        }
      } catch (dbError) {
        console.log("LiveCount: usando ID Roblox padrão (banco não disponível)")
      }
    }
    
    // 3. Fallback para ID padrão se não encontrou nada
    if (robloxGames.length === 0) {
      robloxGames = [{ universeId: DEFAULT_ROBLOX_UNIVERSE_ID, name: "Padrão" }]
    }
    
    // 4. Buscar jogadores de CADA jogo
    for (const game of robloxGames) {
      try {
        let universeId = game.universeId
        
        // Se parece ser um Place ID (número grande), converter para Universe ID
        if (universeId.length > 10) {
          const universeResponse = await fetch(
            `https://apis.roblox.com/universes/v1/places/${universeId}/universe`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Galorys-Website/1.0'
              },
              next: { revalidate: 60 }
            }
          )
          
          if (universeResponse.ok) {
            const universeData = await universeResponse.json()
            universeId = universeData.universeId?.toString() || universeId
          }
        }
        
        // Buscar dados do jogo usando Universe ID
        const response = await fetch(
          `https://games.roblox.com/v1/games?universeIds=${universeId}`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Galorys-Website/1.0'
            },
            next: { revalidate: 60 }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          const playing = data.data?.[0]?.playing || 0
          totalPlayers += playing
          console.log(`LiveCount: ${game.name} = ${playing} jogadores`)
        }
      } catch (e) {
        console.log(`LiveCount: Erro ao buscar ${game.name}`)
      }
    }
  } catch (e) {
    console.error("LiveCount: Erro geral no Roblox:", e)
  }
  
  return totalPlayers
}

export async function GET() {
  try {
    // Verificar cache válido
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data)
    }

    // Buscar dados diretamente das APIs externas (mais confiável)
    const [fivemPlayers, robloxPlayers] = await Promise.all([
      fetchFivemDirect().catch(() => 0),
      fetchRobloxDirect().catch(() => 0),
    ])

    // Calcular total
    const totalPlayers = robloxPlayers + fivemPlayers

    const result = {
      totalPlayers,
      breakdown: {
        roblox: robloxPlayers,
        fivem: fivemPlayers,
      },
      isLive: totalPlayers > 0,
      fetchedAt: new Date().toISOString(),
    }

    // Se temos dados válidos, salvar como lastValidData
    if (totalPlayers > 0) {
      lastValidData = result
    }

    // Se não tem dados válidos mas temos lastValidData, usar ele
    if (totalPlayers === 0 && lastValidData.totalPlayers > 0) {
      return NextResponse.json({
        ...lastValidData,
        fromCache: true,
        fetchedAt: new Date().toISOString(),
      })
    }

    // Salvar em cache
    cache = {
      data: result,
      timestamp: Date.now(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar contador global:", error)
    
    // Retornar cache se disponível (mesmo que stale)
    if (cache && Date.now() - cache.timestamp < STALE_DURATION) {
      return NextResponse.json({
        ...cache.data,
        fromCache: true,
      })
    }
    
    // Retornar lastValidData se disponível
    if (lastValidData.totalPlayers > 0) {
      return NextResponse.json({
        ...lastValidData,
        fromCache: true,
      })
    }

    // Fallback
    return NextResponse.json({
      totalPlayers: 0,
      breakdown: {
        roblox: 0,
        fivem: 0,
      },
      isLive: false,
      fetchedAt: new Date().toISOString(),
      error: "Falha ao buscar dados"
    })
  }
}