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

// Invalida cache quando admin altera jogos
export function invalidateGamesCache() {
  cache = null
}

// ==================== ROBLOX: CONVERTER PLACE ID → UNIVERSE ID ====================

// Fetch com timeout de 5s para evitar travamentos
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return resp
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

async function convertPlaceIdToUniverseId(placeId: string): Promise<string | null> {
  if (placeToUniverseCache[placeId]) {
    return placeToUniverseCache[placeId]
  }
  
  const headers = { 
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }

  try {
    // Metodo 1 (principal): API publica sem auth
    const primaryResp = await fetchWithTimeout(
      `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
      { headers }
    )
    
    if (primaryResp.ok) {
      const primaryData = await primaryResp.json()
      const universeId = primaryData?.universeId?.toString()
      
      if (universeId) {
        placeToUniverseCache[placeId] = universeId
        console.log(`[Roblox] Place ${placeId} → Universe ${universeId}`)
        return universeId
      }
    }
  } catch (err) {
    console.log(`[Roblox] Metodo 1 timeout/erro para ${placeId}`)
  }

  try {
    // Metodo 2 (fallback): multiget-place-details (pode exigir auth)
    const fallbackResp = await fetchWithTimeout(
      `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`,
      { headers }
    )
    
    if (fallbackResp.ok) {
      const fallbackData = await fallbackResp.json()
      const universeId = fallbackData?.[0]?.universeId?.toString()
      
      if (universeId) {
        placeToUniverseCache[placeId] = universeId
        console.log(`[Roblox] Place ${placeId} → Universe ${universeId} (fallback)`)
        return universeId
      }
    }
  } catch (err) {
    console.log(`[Roblox] Metodo 2 timeout/erro para ${placeId}`)
  }

  try {
    // Metodo 3: talvez o cliente colou um Universe ID direto
    const testResp = await fetchWithTimeout(
      `https://games.roblox.com/v1/games?universeIds=${placeId}`,
      { headers }
    )
    
    if (testResp.ok) {
      const testData = await testResp.json()
      if (testData?.data?.[0]?.id) {
        placeToUniverseCache[placeId] = placeId
        console.log(`[Roblox] ${placeId} JA era Universe ID`)
        return placeId
      }
    }
  } catch (err) {
    console.log(`[Roblox] Metodo 3 timeout/erro para ${placeId}`)
  }
    
  console.log(`[Roblox] Falha total ao converter: ${placeId}`)
  return null
}

// ==================== ROBLOX: BUSCAR STATS DO JOGO ====================

async function fetchRobloxGameStats(placeId: string, universeId: string) {
  const headers = { 
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }

  try {
    const statsResponse = await fetchWithTimeout(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`,
      { headers }
    )
    
    if (!statsResponse.ok) {
      console.log(`[Roblox] Erro HTTP ${statsResponse.status} para Universe ${universeId}`)
      return null
    }
    
    const statsData = await statsResponse.json()
    const game = statsData.data?.[0]
    
    if (!game) {
      console.log(`[Roblox] Jogo nao encontrado para Universe ${universeId}`)
      return null
    }
    
    let icon: string | null = null
    try {
      const iconResp = await fetchWithTimeout(
        `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`,
        { headers }, 3000
      )
      if (iconResp.ok) {
        const iconData = await iconResp.json()
        icon = iconData.data?.[0]?.imageUrl || null
      }
    } catch {}
    
    let thumbnail: string | null = null
    try {
      const thumbResp = await fetchWithTimeout(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&countPerUniverse=1`,
        { headers }, 3000
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

// ==================== FIVEM: MÉTODO 1 — dynamic.json (MELHOR) ====================
// Endpoint leve que retorna { clients, hostname, gametype, mapname, sv_maxclients }
// Não requer autenticação, não é afetado por sv_requestParanoia < 2
// Ref: https://docs.fivem.net/ e código fonte InfoHttpHandler.cpp

async function fetchFivemDynamic(ip: string, port: number) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(
      `http://${ip}:${port}/dynamic.json`,
      { signal: controller.signal, cache: 'no-store' }
    )
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.log(`[FiveM] dynamic.json falhou HTTP ${response.status} para ${ip}:${port}`)
      return null
    }
    
    const data = await response.json()
    const clients = data?.clients ?? 0
    const maxPlayers = parseInt(data?.sv_maxclients) || 128
    const hostname = data?.hostname?.replace(/\^[0-9]/g, '') || ""
    
    console.log(`[FiveM] ✅ dynamic.json OK: ${ip}:${port} → ${clients} jogadores (max: ${maxPlayers})`)
    return {
      players: clients,
      maxPlayers,
      hostname,
      online: true,
      method: 'dynamic.json'
    }
  } catch (error) {
    console.log(`[FiveM] dynamic.json falhou para ${ip}:${port}:`, (error as any)?.message || error)
    return null
  }
}

// ==================== FIVEM: MÉTODO 2 — players.json (FALLBACK DIRETO) ====================
// Retorna array de jogadores conectados. Pode ser bloqueado por sv_requestParanoia >= 2

async function fetchFivemPlayers(ip: string, port: number) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(
      `http://${ip}:${port}/players.json`,
      { signal: controller.signal, cache: 'no-store' }
    )
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.log(`[FiveM] players.json falhou HTTP ${response.status} para ${ip}:${port}`)
      return null
    }
    
    const players = await response.json()
    const count = Array.isArray(players) ? players.length : 0
    
    console.log(`[FiveM] ✅ players.json OK: ${ip}:${port} → ${count} jogadores`)
    return {
      players: count,
      maxPlayers: 128,
      hostname: "",
      online: true,
      method: 'players.json'
    }
  } catch (error) {
    console.log(`[FiveM] players.json falhou para ${ip}:${port}:`, (error as any)?.message || error)
    return null
  }
}

// ==================== FIVEM: MÉTODO 3 — API PÚBLICA (FALLBACK FINAL) ====================

async function fetchFivemPublicApi(code: string) {
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
    
    if (!response.ok) {
      console.log(`[FiveM] API pública falhou HTTP ${response.status} para código ${code}`)
      return null
    }
    
    const data = await response.json()
    return {
      players: data?.Data?.clients || 0,
      maxPlayers: data?.Data?.sv_maxclients || 128,
      hostname: data?.Data?.hostname?.replace(/\^[0-9]/g, '') || "Servidor FiveM",
      online: (data?.Data?.clients || 0) > 0 || data?.Data !== null,
      method: 'api-publica'
    }
  } catch (error) {
    console.log(`[FiveM] API pública falhou para código ${code}:`, (error as any)?.message || error)
    return null
  }
}

// ==================== FIVEM: ORQUESTRADOR COM 3 FALLBACKS ====================
// Cadeia: dynamic.json → players.json → API pública FiveM

async function fetchFivemServerWithFallback(code: string, serverIp?: string | null, serverPort?: number | null) {
  // Se tem IP+Porta, tenta métodos diretos primeiro
  if (serverIp && serverPort) {
    // Prioridade 1: dynamic.json (mais leve, mais confiável)
    console.log(`[FiveM] Tentando dynamic.json: ${serverIp}:${serverPort}`)
    const dynamicResult = await fetchFivemDynamic(serverIp, serverPort)
    if (dynamicResult) return dynamicResult
    
    // Prioridade 2: players.json (pode estar bloqueado por paranoia)
    console.log(`[FiveM] Tentando players.json: ${serverIp}:${serverPort}`)
    const playersResult = await fetchFivemPlayers(serverIp, serverPort)
    if (playersResult) return playersResult
    
    console.log(`[FiveM] Métodos diretos falharam, tentando API pública...`)
  }
  
  // Prioridade 3: API pública do FiveM (fallback final)
  return await fetchFivemPublicApi(code)
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

    // 2. BUSCAR GRUPO ROBLOX (em paralelo com jogos)
    const groupLink = gameLinks.find(l => l.game === "roblox-group")
    const groupPromise = fetchRobloxGroupData(groupLink?.serverCode || "313210721")

    // 3. PROCESSAR JOGOS ROBLOX (PARALELO para evitar timeout com muitos jogos)
    let robloxTotalPlayers = 0

    async function processRobloxLink(link: any) {
      const placeId = link.serverCode

      try {
        const universeId = await convertPlaceIdToUniverseId(placeId)

        if (!universeId) {
          return {
            id: placeId,
            placeId,
            universeId: null,
            name: link.name,
            description: "",
            playing: 0,
            visits: 0,
            favorites: 0,
            favoritedCount: 0,
            maxPlayers: 50,
            icon: null,
            thumbnail: (link as any).thumbnailUrl || null,
            url: link.serverUrl || `https://www.roblox.com/games/${placeId}`,
            instagram: link.instagram || null,
            videoPath: link.videoPath || null,
            discordInvite: link.discordInvite || null,
            offline: true
          }
        }

        const stats = await fetchRobloxGameStats(placeId, universeId)

        return {
          id: stats?.rootPlaceId || placeId,
          placeId,
          universeId,
          name: link.name || stats?.name || "Jogo Roblox",
          description: stats?.description || "",
          playing: stats?.playing || 0,
          visits: stats?.visits || 0,
          favorites: stats?.favorites || 0,
          favoritedCount: stats?.favorites || 0,
          maxPlayers: stats?.maxPlayers || 50,
          icon: stats?.icon || null,
          thumbnail: (link as any).thumbnailUrl || stats?.thumbnail || null,
          url: link.serverUrl || `https://www.roblox.com/games/${placeId}`,
          instagram: link.instagram || null,
          videoPath: link.videoPath || null,
          discordInvite: link.discordInvite || null,
          offline: !stats
        }
      } catch (err) {
        return {
          id: placeId,
          placeId,
          universeId: null,
          name: link.name,
          description: "",
          playing: 0,
          visits: 0,
          favorites: 0,
          favoritedCount: 0,
          maxPlayers: 50,
          icon: null,
          thumbnail: (link as any).thumbnailUrl || null,
          url: link.serverUrl || `https://www.roblox.com/games/${placeId}`,
          instagram: link.instagram || null,
          videoPath: link.videoPath || null,
          discordInvite: link.discordInvite || null,
          offline: true
        }
      }
    }

    const robloxGames = await Promise.all(robloxLinks.map(processRobloxLink))
    robloxTotalPlayers = robloxGames.reduce((sum, g) => sum + (g.playing || 0), 0)

    // 4. PROCESSAR SERVIDORES FIVEM
    async function processFivemLink(link: any) {
      const code = link.serverCode
      const stats = await fetchFivemServerWithFallback(code, link.serverIp, link.serverPort)
      const players = stats?.players || 0
      const connectUrl = `https://cfx.re/join/${code}`

      return {
        code,
        name: link.name,
        game: link.game,
        players,
        maxPlayers: stats?.maxPlayers || 128,
        online: stats?.online || false,
        hostname: stats?.hostname || link.name,
        url: connectUrl,
        connectUrl,
        instagram: link.instagram || null,
        discord: link.discordInvite || null,
        video: link.videoPath || null,
        thumbnail: (link as any).thumbnailUrl || null
      }
    }

    const fivemServers = await Promise.all(fivemLinks.map(processFivemLink))
    const fivemTotalPlayers = fivemServers.reduce((sum, s) => sum + (s.players || 0), 0)

    // 5. MONTAR RESULTADO FINAL
    const group = await groupPromise
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
