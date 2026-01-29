import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * API UNIFICADA DE STATS DE JOGOS
 * 
 * FONTE ÚNICA DE DADOS PARA:
 * - Live Counter (barra no topo)
 * - Games Section (seção da home)
 * - Página /roblox
 * - Página /gtarp
 * 
 * FLUXO:
 * 1. Busca jogos da tabela GameLink
 * 2. Para Roblox: converte Place ID → Universe ID → busca stats
 * 3. Para FiveM: busca stats direto
 * 4. Retorna tudo unificado com cache de 30s
 */

// ==================== CACHE ====================
let cache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 30 * 1000 // 30 segundos

// Cache de conversão Place ID -> Universe ID (persiste mais tempo)
const placeToUniverseCache: Record<string, string> = {}

// ==================== ROBLOX: CONVERTER PLACE ID → UNIVERSE ID ====================

async function convertPlaceIdToUniverseId(placeId: string): Promise<string | null> {
  // Verificar cache local
  if (placeToUniverseCache[placeId]) {
    console.log(`[Roblox] Cache hit: Place ${placeId} → Universe ${placeToUniverseCache[placeId]}`)
    return placeToUniverseCache[placeId]
  }
  
  try {
    // Usar API multiget-place-details que retorna o universeId
    const response = await fetch(
      `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      const universeId = data?.[0]?.universeId?.toString()
      
      if (universeId) {
        placeToUniverseCache[placeId] = universeId
        console.log(`[Roblox] Convertido: Place ${placeId} → Universe ${universeId}`)
        return universeId
      }
    }
    
    // Fallback: tentar API alternativa
    const altResponse = await fetch(
      `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (altResponse.ok) {
      const altData = await altResponse.json()
      const universeId = altData?.universeId?.toString()
      
      if (universeId) {
        placeToUniverseCache[placeId] = universeId
        console.log(`[Roblox] Convertido (alt): Place ${placeId} → Universe ${universeId}`)
        return universeId
      }
    }
    
    console.log(`[Roblox] Falha ao converter Place ${placeId}`)
    return null
  } catch (error) {
    console.error(`[Roblox] Erro ao converter Place ${placeId}:`, error)
    return null
  }
}

// ==================== ROBLOX: BUSCAR STATS DO JOGO ====================

async function fetchRobloxGameStats(placeId: string, universeId: string) {
  try {
    // Buscar stats do jogo
    const statsResponse = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!statsResponse.ok) {
      console.log(`[Roblox] Erro HTTP ${statsResponse.status} para Universe ${universeId}`)
      return null
    }
    
    const statsData = await statsResponse.json()
    const game = statsData.data?.[0]
    
    if (!game) {
      console.log(`[Roblox] Jogo não encontrado para Universe ${universeId}`)
      return null
    }
    
    // Buscar ícone
    let icon: string | null = null
    try {
      const iconResp = await fetch(
        `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`
      )
      if (iconResp.ok) {
        const iconData = await iconResp.json()
        icon = iconData.data?.[0]?.imageUrl || null
      }
    } catch {}
    
    // Buscar thumbnail
    let thumbnail: string | null = null
    try {
      const thumbResp = await fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&countPerUniverse=1`
      )
      if (thumbResp.ok) {
        const thumbData = await thumbResp.json()
        thumbnail = thumbData.data?.[0]?.thumbnails?.[0]?.imageUrl || null
      }
    } catch {}
    
    return {
      name: game.name || "Jogo Roblox",
      description: game.description || "",
      playing: game.playing || 0,
      visits: game.visits || 0,
      favorites: game.favoritedCount || 0,
      maxPlayers: game.maxPlayers || 50,
      icon,
      thumbnail,
      rootPlaceId: game.rootPlaceId?.toString() || placeId
    }
  } catch (error) {
    console.error(`[Roblox] Erro ao buscar stats:`, error)
    return null
  }
}

// ==================== ROBLOX: BUSCAR DADOS DO GRUPO ====================

async function fetchRobloxGroupData(groupId: string = "313210721") {
  try {
    const [groupResp, iconResp] = await Promise.all([
      fetch(`https://groups.roblox.com/v1/groups/${groupId}`),
      fetch(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=420x420&format=Png`)
    ])
    
    let groupData = null
    let groupIcon = null
    
    if (groupResp.ok) groupData = await groupResp.json()
    if (iconResp.ok) {
      const iconData = await iconResp.json()
      groupIcon = iconData.data?.[0]?.imageUrl || null
    }
    
    return groupData ? {
      id: groupData.id?.toString() || groupId,
      name: groupData.name || "Galorys",
      memberCount: groupData.memberCount || 0,
      icon: groupIcon
    } : null
  } catch {
    return null
  }
}

// ==================== FIVEM: BUSCAR STATS DO SERVIDOR ====================

async function fetchFivemServerStats(code: string) {
  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${code}`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    return {
      players: data?.Data?.clients || 0,
      maxPlayers: data?.Data?.sv_maxclients || 128,
      hostname: data?.Data?.hostname?.replace(/\^[0-9]/g, '') || "Servidor FiveM",
      online: (data?.Data?.clients || 0) > 0 || data?.Data !== null
    }
  } catch {
    return null
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

    console.log("========================================")
    console.log("[GamesStats] Buscando dados frescos...")
    console.log("========================================")

    // 1. BUSCAR JOGOS DA TABELA GameLink
    let gameLinks: any[] = []
    try {
      gameLinks = await prisma.gameLink.findMany({
        where: { active: true },
        orderBy: { createdAt: 'asc' }
      })
      console.log(`[DB] ${gameLinks.length} jogos ativos encontrados`)
    } catch (error) {
      console.error("[DB] Erro ao buscar GameLink:", error)
    }

    // Separar por plataforma
    const robloxLinks = gameLinks.filter(l => l.game.startsWith("roblox") && l.game !== "roblox-group")
    const fivemLinks = gameLinks.filter(l => l.game.startsWith("gtarp"))

    console.log(`[DB] Roblox: ${robloxLinks.length}, FiveM: ${fivemLinks.length}`)

    // 2. BUSCAR GRUPO ROBLOX
    const groupLink = gameLinks.find(l => l.game === "roblox-group")
    const group = await fetchRobloxGroupData(groupLink?.serverCode || "313210721")

    // 3. PROCESSAR JOGOS ROBLOX
    const robloxGames: any[] = []
    let robloxTotalPlayers = 0

    for (const link of robloxLinks) {
      const placeId = link.serverCode
      console.log(`[Roblox] Processando: ${link.name} (Place ID: ${placeId})`)
      
      // Converter Place ID → Universe ID
      const universeId = await convertPlaceIdToUniverseId(placeId)
      
      if (!universeId) {
        console.log(`[Roblox] ❌ Não conseguiu converter Place ID: ${placeId}`)
        continue
      }
      
      // Buscar stats
      const stats = await fetchRobloxGameStats(placeId, universeId)
      
      if (stats) {
        robloxTotalPlayers += stats.playing
        
        robloxGames.push({
          id: stats.rootPlaceId || placeId,
          placeId: placeId,
          universeId: universeId,
          name: link.name || stats.name,
          description: stats.description,
          playing: stats.playing,
          visits: stats.visits,
          favorites: stats.favorites,
          favoritedCount: stats.favorites,
          maxPlayers: stats.maxPlayers,
          icon: stats.icon,
          thumbnail: (link as any).thumbnailUrl || stats.thumbnail,
          url: link.serverUrl || `https://www.roblox.com/games/${placeId}`,
          instagram: link.instagram || null,
          videoPath: link.videoPath || null,
          discordInvite: link.discordInvite || null
        })
        
        console.log(`[Roblox] ✅ ${link.name}: ${stats.playing} jogando`)
      } else {
        console.log(`[Roblox] ❌ Falha ao buscar stats: ${link.name}`)
      }
    }

    // 4. PROCESSAR SERVIDORES FIVEM
    const fivemServers: any[] = []
    let fivemTotalPlayers = 0

    for (const link of fivemLinks) {
      const code = link.serverCode
      console.log(`[FiveM] Processando: ${link.name} (${code})`)
      
      const stats = await fetchFivemServerStats(code)
      
      const players = stats?.players || 0
      fivemTotalPlayers += players
      
      fivemServers.push({
        code: code,
        name: link.name,
        game: link.game,
        players,
        maxPlayers: stats?.maxPlayers || 128,
        online: stats?.online || false,
        hostname: stats?.hostname || link.name,
        url: link.serverUrl || `https://cfx.re/join/${code}`,
        connectUrl: link.serverUrl || `https://cfx.re/join/${code}`,
        instagram: link.instagram || null,
        discord: link.discordInvite || null,
        video: link.videoPath || null,
        thumbnail: (link as any).thumbnailUrl || null
      })
      
      console.log(`[FiveM] ✅ ${link.name}: ${players} jogadores`)
    }

    // 5. MONTAR RESULTADO FINAL
    const totalPlayers = robloxTotalPlayers + fivemTotalPlayers

    const result = {
      // Total geral (para Live Counter)
      totalPlayers,
      breakdown: {
        roblox: robloxTotalPlayers,
        fivem: fivemTotalPlayers,
      },
      isLive: totalPlayers > 0,
      
      // Dados Roblox (para Games Section e /roblox)
      roblox: {
        group,
        games: robloxGames,
        totalPlayers: robloxTotalPlayers
      },
      
      // Dados FiveM (para Games Section e /gtarp)
      fivem: {
        servers: fivemServers,
        totalPlayers: fivemTotalPlayers
      },
      
      // Metadata
      fetchedAt: new Date().toISOString(),
      cacheAge: 0
    }

    // Salvar no cache
    cache = { data: result, timestamp: Date.now() }

    console.log("========================================")
    console.log(`[RESULTADO] Total: ${totalPlayers} jogadores`)
    console.log(`  Roblox: ${robloxTotalPlayers} (${robloxGames.length} jogos)`)
    console.log(`  FiveM: ${fivemTotalPlayers} (${fivemServers.length} servidores)`)
    console.log("========================================")

    return NextResponse.json(result)
  } catch (error) {
    console.error("[GamesStats] ERRO GERAL:", error)

    // Retornar cache antigo se disponível
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
