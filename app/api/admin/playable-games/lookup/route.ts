import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * API para buscar informações de um jogo externo
 * Usado quando o admin cola um ID para auto-preencher os dados
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { platform, externalId } = body

    if (!platform || !externalId) {
      return NextResponse.json({ 
        error: "Plataforma e ID são obrigatórios" 
      }, { status: 400 })
    }

    if (platform === "roblox") {
      return await lookupRobloxGame(externalId)
    } else if (platform === "fivem") {
      return await lookupFivemServer(externalId)
    }

    return NextResponse.json({ 
      error: "Plataforma não suportada" 
    }, { status: 400 })
  } catch (error) {
    console.error("Erro ao buscar jogo:", error)
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 })
  }
}

// Buscar informações de jogo Roblox
async function lookupRobloxGame(placeId: string) {
  try {
    // 1. Converter Place ID para Universe ID
    let universeId = placeId
    
    // Se parece ser um Place ID (número grande), converter
    if (placeId.length > 10) {
      const universeResponse = await fetch(
        `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
      )
      
      if (universeResponse.ok) {
        const universeData = await universeResponse.json()
        universeId = universeData.universeId?.toString()
      }
    }

    if (!universeId) {
      return NextResponse.json({ 
        error: "Não foi possível encontrar o jogo" 
      }, { status: 404 })
    }

    // 2. Buscar dados do jogo
    const gameResponse = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`
    )
    
    if (!gameResponse.ok) {
      return NextResponse.json({ 
        error: "Jogo não encontrado no Roblox" 
      }, { status: 404 })
    }

    const gameData = await gameResponse.json()
    const game = gameData.data?.[0]

    if (!game) {
      return NextResponse.json({ 
        error: "Jogo não encontrado" 
      }, { status: 404 })
    }

    // 3. Buscar thumbnail
    let thumbnail = null
    try {
      const thumbResponse = await fetch(
        `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`
      )
      if (thumbResponse.ok) {
        const thumbData = await thumbResponse.json()
        thumbnail = thumbData.data?.[0]?.imageUrl
      }
    } catch (e) {}

    // 4. Buscar thumbnail grande
    let largeThumbnail = null
    try {
      const largeThumbResponse = await fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&countPerUniverse=1`
      )
      if (largeThumbResponse.ok) {
        const largeThumbData = await largeThumbResponse.json()
        largeThumbnail = largeThumbData.data?.[0]?.thumbnails?.[0]?.imageUrl
      }
    } catch (e) {}

    return NextResponse.json({
      found: true,
      platform: "roblox",
      data: {
        name: game.name,
        description: game.description,
        placeId: placeId,
        universeId: universeId,
        playing: game.playing || 0,
        visits: game.visits || 0,
        favorites: game.favoritedCount || 0,
        created: game.created,
        updated: game.updated,
        thumbnail,
        largeThumbnail,
        url: `https://www.roblox.com/games/${placeId}`
      }
    })
  } catch (error) {
    console.error("Erro ao buscar jogo Roblox:", error)
    return NextResponse.json({ 
      error: "Erro ao buscar informações do Roblox" 
    }, { status: 500 })
  }
}

// Buscar informações de servidor FiveM
async function lookupFivemServer(serverCode: string) {
  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${serverCode}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Galorys-Website/1.0'
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json({ 
        error: "Servidor não encontrado no FiveM" 
      }, { status: 404 })
    }

    const data = await response.json()

    if (!data || !data.Data) {
      return NextResponse.json({ 
        error: "Servidor não encontrado" 
      }, { status: 404 })
    }

    // Limpar hostname (remover códigos de cor)
    const hostname = data.Data.hostname?.replace(/\^[0-9]/g, '') || serverCode

    return NextResponse.json({
      found: true,
      platform: "fivem",
      data: {
        name: hostname,
        serverCode: serverCode,
        players: data.Data.clients || 0,
        maxPlayers: data.Data.sv_maxclients || 0,
        online: (data.Data.clients || 0) > 0,
        gametype: data.Data.gametype,
        mapname: data.Data.mapname,
        url: `https://cfx.re/join/${serverCode}`
      }
    })
  } catch (error) {
    console.error("Erro ao buscar servidor FiveM:", error)
    return NextResponse.json({ 
      error: "Erro ao buscar informações do FiveM" 
    }, { status: 500 })
  }
}
