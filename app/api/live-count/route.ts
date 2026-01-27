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

const CACHE_DURATION = 30 * 1000 // 30 segundos
const STALE_DURATION = 5 * 60 * 1000 // 5 minutos para dados stale

// Buscar TODOS os servidores FiveM da Galorys automaticamente
async function fetchFivemDirect() {
  let totalPlayers = 0
  let serversFound: { code: string; name: string; players: number }[] = []
  
  // Tags para buscar servidores da Galorys (case insensitive)
  const SEARCH_TAGS = ["galorys", "kush", "flow"]
  
  try {
    // 1. Tentar buscar servidores automaticamente pela API de busca do FiveM
    for (const tag of SEARCH_TAGS) {
      try {
        const searchResponse = await fetch(
          `https://servers-frontend.fivem.net/api/servers/search?query=${tag}`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Galorys-Website/1.0'
            },
            next: { revalidate: 300 } // Cache de 5 min para busca
          }
        )
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          const servers = searchData || []
          
          for (const server of servers) {
            // Verificar se já não adicionamos esse servidor
            const code = server.EndPoint || server.endpoint
            if (code && !serversFound.find(s => s.code === code)) {
              const players = server.Data?.clients || server.clients || 0
              const name = server.Data?.hostname || server.hostname || tag
              serversFound.push({ code, name, players })
              totalPlayers += players
              console.log(`LiveCount FiveM: ${name} = ${players} jogadores`)
            }
          }
        }
      } catch (e) {
        // Silenciar erro de busca individual
      }
    }
    
    console.log(`LiveCount: Encontrados ${serversFound.length} servidores FiveM automaticamente`)
    
    // 2. Se não encontrou nada na busca automática, usar fallback do banco
    if (serversFound.length === 0) {
      console.log("LiveCount: Buscando servidores FiveM do banco de dados...")
      return await fetchFivemFromDatabase()
    }
    
  } catch (e) {
    console.error("LiveCount: Erro na busca automática FiveM:", e)
    return await fetchFivemFromDatabase()
  }
  
  return totalPlayers
}

// Fallback: buscar servidores FiveM do banco de dados
async function fetchFivemFromDatabase() {
  let servers = DEFAULT_FIVEM_SERVERS
  
  try {
    const dbServers = await prisma.gameLink.findMany({
      where: {
        game: { startsWith: "gtarp" },
        active: true,
      },
      select: {
        serverCode: true,
        name: true,
        game: true,
      },
    })
    
    if (dbServers.length > 0) {
      servers = dbServers.map((s) => ({ code: s.serverCode, game: s.game }))
      console.log(`LiveCount: Fallback - ${dbServers.length} servidores FiveM do banco`)
    }
  } catch (dbError) {
    console.log("LiveCount: usando servidores FiveM padrão")
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
          next: { revalidate: 30 }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const players = data?.Data?.clients || 0
        totalPlayers += players
        console.log(`LiveCount FiveM: ${server.game} = ${players} jogadores`)
      }
    } catch (e) {
      // Silenciar erros individuais
    }
  }
  
  return totalPlayers
}

// Buscar jogadores de TODOS os jogos Roblox do GRUPO automaticamente
async function fetchRobloxDirect() {
  let totalPlayers = 0
  const DEFAULT_GROUP_ID = "313210721" // Grupo Galorys no Roblox
  
  try {
    // 1. Buscar TODOS os jogos do GRUPO automaticamente via API Roblox
    let groupId = DEFAULT_GROUP_ID
    
    // Tentar pegar groupId do banco (se configurado diferente)
    try {
      const dbGroup = await prisma.gameLink.findUnique({
        where: { game: "roblox-group" },
        select: { serverCode: true },
      })
      if (dbGroup?.serverCode) {
        groupId = dbGroup.serverCode
      }
    } catch (e) {
      // Usar padrão
    }
    
    // 2. Buscar lista de jogos do grupo
    const gamesListResponse = await fetch(
      `https://games.roblox.com/v2/groups/${groupId}/games?accessFilter=Public&limit=50&sortOrder=Desc`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Galorys-Website/1.0'
        },
        next: { revalidate: 300 } // Cache de 5 min para lista
      }
    )
    
    if (!gamesListResponse.ok) {
      console.log("LiveCount: Erro ao buscar jogos do grupo, tentando fallback...")
      // Fallback para tabela RobloxGame ou GameLink
      return await fetchRobloxFromDatabase()
    }
    
    const gamesList = await gamesListResponse.json()
    const games = gamesList.data || []
    
    console.log(`LiveCount: Encontrados ${games.length} jogos no grupo Roblox`)
    
    if (games.length === 0) {
      return await fetchRobloxFromDatabase()
    }
    
    // 3. Buscar jogadores de CADA jogo
    for (const game of games) {
      try {
        const universeId = game.id // A API retorna o universeId como 'id'
        
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
    // Tentar fallback do banco
    return await fetchRobloxFromDatabase()
  }
  
  return totalPlayers
}

// Fallback: buscar do banco de dados se API do grupo falhar
async function fetchRobloxFromDatabase() {
  let totalPlayers = 0
  let robloxGames: { universeId: string; name: string }[] = []
  
  // Tentar tabela RobloxGame primeiro
  try {
    const dbGames = await prisma.robloxGame.findMany({
      where: { featured: true },
      select: { universeId: true, name: true },
    })
    
    if (dbGames.length > 0) {
      robloxGames = dbGames
      console.log(`LiveCount: Fallback - ${dbGames.length} jogos da tabela RobloxGame`)
    }
  } catch (e) {
    // Tabela não existe
  }
  
  // Se não encontrou, tentar GameLink
  if (robloxGames.length === 0) {
    try {
      const dbLinks = await prisma.gameLink.findMany({
        where: {
          game: { startsWith: "roblox" },
          active: true,
        },
        select: { serverCode: true, name: true },
      })
      
      if (dbLinks.length > 0) {
        robloxGames = dbLinks.map(l => ({ universeId: l.serverCode, name: l.name }))
        console.log(`LiveCount: Fallback - ${dbLinks.length} jogos da tabela GameLink`)
      }
    } catch (e) {
      // Usar padrão
    }
  }
  
  // Fallback final
  if (robloxGames.length === 0) {
    robloxGames = [{ universeId: DEFAULT_ROBLOX_UNIVERSE_ID, name: "Padrão" }]
  }
  
  // Buscar jogadores
  for (const game of robloxGames) {
    try {
      let universeId = game.universeId
      
      // Converter Place ID para Universe ID se necessário
      if (universeId.length > 10) {
        const universeResponse = await fetch(
          `https://apis.roblox.com/universes/v1/places/${universeId}/universe`,
          {
            headers: { 'Accept': 'application/json', 'User-Agent': 'Galorys-Website/1.0' },
            next: { revalidate: 60 }
          }
        )
        if (universeResponse.ok) {
          const universeData = await universeResponse.json()
          universeId = universeData.universeId?.toString() || universeId
        }
      }
      
      const response = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${universeId}`,
        {
          headers: { 'Accept': 'application/json', 'User-Agent': 'Galorys-Website/1.0' },
          next: { revalidate: 60 }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const playing = data.data?.[0]?.playing || 0
        totalPlayers += playing
      }
    } catch (e) {
      // Silenciar
    }
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