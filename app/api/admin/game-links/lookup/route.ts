import { NextResponse } from "next/server"

const ROBLOX_HEADERS = { 'Accept': 'application/json', 'User-Agent': 'Galorys-Website/1.0' }

// Converte Place ID para Universe ID
async function placeIdToUniverseId(placeId: string): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
      { headers: ROBLOX_HEADERS }
    )
    if (!resp.ok) return null
    const data = await resp.json()
    return data?.universeId?.toString() || null
  } catch {
    return null
  }
}

// Busca dados do jogo pelo Universe ID (ja resolvido)
async function fetchGameByUniverse(universeId: string) {
  const statsResponse = await fetch(
    `https://games.roblox.com/v1/games?universeIds=${universeId}`,
    { headers: ROBLOX_HEADERS }
  )
  if (!statsResponse.ok) return null
  const statsData = await statsResponse.json()
  return statsData.data?.[0] || null
}

// Buscar dados de jogo Roblox — aceita Place ID ou Universe ID
async function lookupRoblox(inputId: string) {
  try {
    // Estrategia: tenta como Place ID primeiro (mais comum, vem da URL do jogo)
    // Se falhar, tenta como Universe ID direto
    let universeId: string | null = null
    let wasPlaceId = false

    // Tentativa 1: inputId eh Place ID → converter para Universe ID
    const converted = await placeIdToUniverseId(inputId)
    if (converted) {
      universeId = converted
      wasPlaceId = true
    }

    // Tentativa 2: inputId ja eh Universe ID
    if (!universeId) {
      const directGame = await fetchGameByUniverse(inputId)
      if (directGame) {
        universeId = inputId
      }
    }

    if (!universeId) {
      return { error: "Jogo nao encontrado no Roblox. Verifique se o ID esta correto." }
    }

    const game = await fetchGameByUniverse(universeId)
    if (!game) return { error: "Jogo nao encontrado no Roblox" }

    // O Place ID real do jogo (rootPlaceId da API do Roblox)
    const placeId = game.rootPlaceId?.toString() || (wasPlaceId ? inputId : null)

    // Icone
    let icon: string | null = null
    try {
      const iconResp = await fetch(
        `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`,
        { headers: ROBLOX_HEADERS }
      )
      if (iconResp.ok) {
        const iconData = await iconResp.json()
        icon = iconData.data?.[0]?.imageUrl || null
      }
    } catch {}

    // Thumbnail
    let thumbnail: string | null = null
    try {
      const thumbResp = await fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&countPerUniverse=1`,
        { headers: ROBLOX_HEADERS }
      )
      if (thumbResp.ok) {
        const thumbData = await thumbResp.json()
        thumbnail = thumbData.data?.[0]?.thumbnails?.[0]?.imageUrl || null
      }
    } catch {}

    return {
      found: true,
      platform: "roblox",
      name: game.name,
      description: game.description,
      playing: game.playing || 0,
      visits: game.visits || 0,
      favorites: game.favoritedCount || 0,
      maxPlayers: game.maxPlayers || 50,
      icon,
      thumbnail,
      rootPlaceId: placeId,
      universeId,
      // serverCode deve ser o Place ID (padrao do games-stats)
      resolvedPlaceId: placeId,
      url: `https://www.roblox.com/games/${placeId || inputId}`
    }
  } catch (error) {
    return { error: "Erro ao buscar dados do Roblox" }
  }
}

// Buscar dados de servidor FiveM
async function lookupFivem(code: string) {
  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${code}`,
      { headers: { 'Accept': 'application/json', 'User-Agent': 'Galorys-Website/1.0' } }
    )
    
    if (!response.ok) return { error: "Servidor não encontrado no FiveM" }
    
    const data = await response.json()
    
    if (!data?.Data) return { error: "Servidor não encontrado no FiveM" }
    
    return {
      found: true,
      platform: "fivem",
      name: data.Data.hostname?.replace(/\^[0-9]/g, '') || "Servidor FiveM",
      players: data.Data.clients || 0,
      maxPlayers: data.Data.sv_maxclients || 128,
      online: (data.Data.clients || 0) > 0,
      url: `https://cfx.re/join/${code}`
    }
  } catch (error) {
    return { error: "Erro ao buscar dados do FiveM" }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { platform, externalId } = body
    
    if (!platform || !externalId) {
      return NextResponse.json({ error: "Campos obrigatórios: platform, externalId" }, { status: 400 })
    }
    
    let result
    
    if (platform === "roblox") {
      result = await lookupRoblox(externalId)
    } else if (platform === "fivem") {
      result = await lookupFivem(externalId)
    } else {
      return NextResponse.json({ error: "Plataforma inválida" }, { status: 400 })
    }
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 })
  }
}
