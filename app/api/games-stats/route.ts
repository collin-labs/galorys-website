import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * API UNIFICADA DE STATS DE JOGOS
 * 
 * Retorna TODOS os dados de uma vez só:
 * - Total geral de jogadores
 * - Lista de jogos Roblox com stats individuais
 * - Lista de servidores FiveM com stats individuais
 * 
 * Todos os componentes usam esta API = mesmos dados = mesma atualização
 */

// Configurações
const DEFAULT_GROUP_ID = "313210721" // Grupo Galorys no Roblox
const DEFAULT_FIVEM_SERVERS = [
  { code: "r4z8dg", name: "KUSH PVP", game: "gtarp-kush" },
  { code: "3emg7o", name: "FLOW RP", game: "gtarp-flow" },
]
const SEARCH_TAGS = ["galorys", "kush", "flow"]

// Cache único para todos
let cache: {
  data: any
  timestamp: number
} | null = null

const CACHE_DURATION = 30 * 1000 // 30 segundos - igual em todo lugar

// Tipos
interface RobloxGame {
  id: string
  universeId: string
  name: string
  description: string
  playing: number
  visits: number
  favorites: number
  icon: string | null
  thumbnail: string | null
  url: string
}

interface FivemServer {
  code: string
  name: string
  game: string
  players: number
  maxPlayers: number
  online: boolean
  hostname: string
  url: string
  instagram?: string
  discord?: string
  video?: string
}

interface GamesStatsResponse {
  // Totais
  totalPlayers: number
  breakdown: {
    roblox: number
    fivem: number
  }
  isLive: boolean
  
  // Detalhes por plataforma
  roblox: {
    group: {
      id: string
      name: string
      memberCount: number
      icon: string | null
    } | null
    games: RobloxGame[]
    totalPlayers: number
  }
  
  fivem: {
    servers: FivemServer[]
    totalPlayers: number
  }
  
  // Metadata
  fetchedAt: string
  cacheAge: number
}

// ==================== ROBLOX ====================

async function fetchAllRobloxData() {
  let groupId = DEFAULT_GROUP_ID
  let groupData: any = null
  let groupIcon: string | null = null
  const games: RobloxGame[] = []
  let totalPlayers = 0

  // Tentar pegar groupId do banco
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

  // 1. Buscar dados do grupo
  try {
    const groupResponse = await fetch(
      `https://groups.roblox.com/v1/groups/${groupId}`,
      { next: { revalidate: 30 } }
    )
    if (groupResponse.ok) {
      groupData = await groupResponse.json()
    }

    // Ícone do grupo
    const iconResponse = await fetch(
      `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=420x420&format=Png`,
      { next: { revalidate: 30 } }
    )
    if (iconResponse.ok) {
      const iconData = await iconResponse.json()
      groupIcon = iconData.data?.[0]?.imageUrl || null
    }
  } catch (e) {
    console.log("GamesStats: Erro ao buscar grupo Roblox")
  }

  // 2. Buscar lista de jogos do grupo
  try {
    const gamesListResponse = await fetch(
      `https://games.roblox.com/v2/groups/${groupId}/games?accessFilter=Public&limit=50&sortOrder=Desc`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Galorys-Website/1.0'
        },
        next: { revalidate: 30 }
      }
    )

    if (gamesListResponse.ok) {
      const gamesList = await gamesListResponse.json()
      const gamesFromGroup = gamesList.data || []

      console.log(`GamesStats: Encontrados ${gamesFromGroup.length} jogos Roblox no grupo`)

      // 3. Buscar stats de cada jogo
      for (const game of gamesFromGroup) {
        try {
          const universeId = game.id

          // Stats do jogo
          const statsResponse = await fetch(
            `https://games.roblox.com/v1/games?universeIds=${universeId}`,
            {
              headers: { 'Accept': 'application/json', 'User-Agent': 'Galorys-Website/1.0' },
              next: { revalidate: 30 }
            }
          )

          let gameStats: any = null
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            gameStats = statsData.data?.[0]
          }

          // Ícone do jogo
          let gameIcon: string | null = null
          try {
            const iconResp = await fetch(
              `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`,
              { next: { revalidate: 30 } }
            )
            if (iconResp.ok) {
              const iconData = await iconResp.json()
              gameIcon = iconData.data?.[0]?.imageUrl || null
            }
          } catch (e) {}

          // Thumbnail do jogo
          let gameThumbnail: string | null = null
          try {
            const thumbResp = await fetch(
              `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&countPerUniverse=1`,
              { next: { revalidate: 30 } }
            )
            if (thumbResp.ok) {
              const thumbData = await thumbResp.json()
              gameThumbnail = thumbData.data?.[0]?.thumbnails?.[0]?.imageUrl || null
            }
          } catch (e) {}

          const playing = gameStats?.playing || 0
          totalPlayers += playing

          games.push({
            id: game.rootPlace?.id?.toString() || universeId.toString(),
            universeId: universeId.toString(),
            name: gameStats?.name || game.name || "Jogo Roblox",
            description: gameStats?.description || "",
            playing: playing,
            visits: gameStats?.visits || 0,
            favorites: gameStats?.favoritedCount || 0,
            icon: gameIcon,
            thumbnail: gameThumbnail,
            url: `https://www.roblox.com/games/${game.rootPlace?.id || universeId}`
          })

          console.log(`GamesStats Roblox: ${gameStats?.name || game.name} = ${playing} jogadores`)
        } catch (e) {
          console.log(`GamesStats: Erro ao buscar jogo ${game.name}`)
        }
      }
    }
  } catch (e) {
    console.error("GamesStats: Erro ao buscar jogos do grupo Roblox:", e)
  }

  return {
    group: groupData ? {
      id: groupData.id?.toString() || groupId,
      name: groupData.name || "Galorys",
      memberCount: groupData.memberCount || 0,
      icon: groupIcon
    } : null,
    games,
    totalPlayers
  }
}

// ==================== FIVEM ====================

async function fetchAllFivemData() {
  const servers: FivemServer[] = []
  let totalPlayers = 0
  const foundCodes = new Set<string>()

  // 1. Tentar busca automática por tags
  for (const tag of SEARCH_TAGS) {
    try {
      const searchResponse = await fetch(
        `https://servers-frontend.fivem.net/api/servers/search?query=${tag}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Galorys-Website/1.0'
          },
          next: { revalidate: 30 }
        }
      )

      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        const searchResults = searchData || []

        for (const server of searchResults) {
          const code = server.EndPoint || server.endpoint
          if (code && !foundCodes.has(code)) {
            foundCodes.add(code)
            const players = server.Data?.clients || server.clients || 0
            totalPlayers += players

            servers.push({
              code,
              name: server.Data?.hostname?.replace(/\^[0-9]/g, '') || tag.toUpperCase(),
              game: `gtarp-${tag}`,
              players,
              maxPlayers: server.Data?.sv_maxclients || server.sv_maxclients || 0,
              online: players > 0,
              hostname: server.Data?.hostname || tag.toUpperCase(),
              url: `https://cfx.re/join/${code}`
            })

            console.log(`GamesStats FiveM: ${server.Data?.hostname || tag} = ${players} jogadores`)
          }
        }
      }
    } catch (e) {
      // Silenciar erro de busca individual
    }
  }

  // 2. Se não encontrou na busca, usar servidores do banco/padrão
  if (servers.length === 0) {
    let dbServers = DEFAULT_FIVEM_SERVERS

    try {
      const dbLinks = await prisma.gameLink.findMany({
        where: {
          game: { startsWith: "gtarp" },
          active: true,
        },
        select: {
          serverCode: true,
          name: true,
          game: true,
          instagram: true,
          videoPath: true,
          discordInvite: true,
        },
      })

      if (dbLinks.length > 0) {
        dbServers = dbLinks.map(l => ({
          code: l.serverCode,
          name: l.name,
          game: l.game,
          instagram: l.instagram || undefined,
          video: l.videoPath || undefined,
          discord: l.discordInvite || undefined,
        }))
      }
    } catch (e) {
      // Usar padrão
    }

    for (const server of dbServers) {
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

          servers.push({
            code: server.code,
            name: server.name,
            game: server.game,
            players,
            maxPlayers: data?.Data?.sv_maxclients || 0,
            online: players > 0,
            hostname: data?.Data?.hostname?.replace(/\^[0-9]/g, '') || server.name,
            url: `https://cfx.re/join/${server.code}`,
            instagram: (server as any).instagram,
            discord: (server as any).discord,
            video: (server as any).video,
          })

          console.log(`GamesStats FiveM: ${server.name} = ${players} jogadores`)
        }
      } catch (e) {
        // Silenciar
      }
    }
  }

  console.log(`GamesStats: Total ${servers.length} servidores FiveM, ${totalPlayers} jogadores`)

  return {
    servers,
    totalPlayers
  }
}

// ==================== API PRINCIPAL ====================

export async function GET() {
  try {
    // Verificar cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cache.data,
        cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000)
      })
    }

    console.log("GamesStats: Buscando dados frescos...")

    // Buscar tudo em paralelo
    const [robloxData, fivemData] = await Promise.all([
      fetchAllRobloxData().catch(() => ({ group: null, games: [], totalPlayers: 0 })),
      fetchAllFivemData().catch(() => ({ servers: [], totalPlayers: 0 })),
    ])

    // Calcular totais
    const totalPlayers = robloxData.totalPlayers + fivemData.totalPlayers

    const result: GamesStatsResponse = {
      // Totais
      totalPlayers,
      breakdown: {
        roblox: robloxData.totalPlayers,
        fivem: fivemData.totalPlayers,
      },
      isLive: totalPlayers > 0,

      // Detalhes
      roblox: robloxData,
      fivem: fivemData,

      // Metadata
      fetchedAt: new Date().toISOString(),
      cacheAge: 0
    }

    // Salvar em cache
    cache = {
      data: result,
      timestamp: Date.now(),
    }

    console.log(`GamesStats: Total = ${totalPlayers} (Roblox: ${robloxData.totalPlayers}, FiveM: ${fivemData.totalPlayers})`)

    return NextResponse.json(result)
  } catch (error) {
    console.error("GamesStats: Erro geral:", error)

    // Retornar cache antigo se houver
    if (cache) {
      return NextResponse.json({
        ...cache.data,
        cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000),
        fromCache: true
      })
    }

    // Fallback vazio
    return NextResponse.json({
      totalPlayers: 0,
      breakdown: { roblox: 0, fivem: 0 },
      isLive: false,
      roblox: { group: null, games: [], totalPlayers: 0 },
      fivem: { servers: [], totalPlayers: 0 },
      fetchedAt: new Date().toISOString(),
      cacheAge: 0,
      error: "Falha ao buscar dados"
    })
  }
}
