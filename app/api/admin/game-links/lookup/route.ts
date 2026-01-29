import { NextResponse } from "next/server"

// Buscar dados de jogo Roblox
async function lookupRoblox(universeId: string) {
  try {
    const statsResponse = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`,
      { headers: { 'Accept': 'application/json', 'User-Agent': 'Galorys-Website/1.0' } }
    )
    
    if (!statsResponse.ok) return { error: "Jogo não encontrado no Roblox" }
    
    const statsData = await statsResponse.json()
    const game = statsData.data?.[0]
    
    if (!game) return { error: "Jogo não encontrado no Roblox" }
    
    // Ícone
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
    
    // Thumbnail
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
      rootPlaceId: game.rootPlaceId?.toString(),
      url: `https://www.roblox.com/games/${game.rootPlaceId || universeId}`
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
