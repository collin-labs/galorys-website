import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// IDs padrão da Galorys no Roblox (fallback)
const DEFAULT_GROUP_ID = "313210721"
const DEFAULT_GAMES = [
  { key: "roblox", id: "76149317725679" },
  { key: "roblox-2", id: "131891835047442" },
]

// Cache simples para não sobrecarregar a API do Roblox
let cache: {
  data: any
  timestamp: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Função para buscar dados de um jogo específico
async function fetchGameData(gameId: string) {
  try {
    // Converter Place ID para Universe ID
    const universeResponse = await fetch(
      `https://apis.roblox.com/universes/v1/places/${gameId}/universe`,
      { next: { revalidate: 300 } }
    )
    const universeData = await universeResponse.json()
    const universeId = universeData.universeId

    if (!universeId) return null

    // Dados do jogo
    const gameResponse = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`,
      { next: { revalidate: 300 } }
    )
    const gameResult = await gameResponse.json()
    const gameData = gameResult.data?.[0] || null

    if (!gameData) return null

    // Ícone do jogo
    const iconResponse = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png`,
      { next: { revalidate: 300 } }
    )
    const iconResult = await iconResponse.json()
    const gameIcon = iconResult.data?.[0]?.imageUrl || null

    // Thumbnail do jogo
    const thumbResponse = await fetch(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&countPerUniverse=1`,
      { next: { revalidate: 300 } }
    )
    const thumbResult = await thumbResponse.json()
    const gameThumbnail = thumbResult.data?.[0]?.thumbnails?.[0]?.imageUrl || null

    return {
      id: gameId,
      universeId: universeId,
      name: gameData.name,
      description: gameData.description,
      playing: gameData.playing,
      visits: gameData.visits,
      maxPlayers: gameData.maxPlayers,
      created: gameData.created,
      updated: gameData.updated,
      favoritedCount: gameData.favoritedCount,
      genre: gameData.genre,
      icon: gameIcon,
      thumbnail: gameThumbnail,
      url: `https://www.roblox.com/games/${gameId}`,
    }
  } catch (error) {
    console.error(`Erro ao buscar dados do jogo ${gameId}:`, error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar se deve ignorar cache (?refresh=true)
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    
    // Verificar cache (ignorar se forceRefresh)
    if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data)
    }

    // Tentar buscar configuração do banco de dados
    let gameIds: { key: string; id: string }[] = [...DEFAULT_GAMES]
    let groupId = DEFAULT_GROUP_ID
    
    try {
      // Buscar Game IDs do banco
      const dbGameLink1 = await prisma.gameLink.findUnique({
        where: { game: "roblox" }
      })
      
      const dbGameLink2 = await prisma.gameLink.findUnique({
        where: { game: "roblox-2" }
      })
      
      if (dbGameLink1?.serverCode) {
        gameIds[0] = { key: "roblox", id: dbGameLink1.serverCode }
      }
      
      if (dbGameLink2?.serverCode) {
        gameIds[1] = { key: "roblox-2", id: dbGameLink2.serverCode }
      }
      
      // Buscar Group ID (entrada "roblox-group")
      const dbGroupLink = await prisma.gameLink.findUnique({
        where: { game: "roblox-group" }
      })
      
      if (dbGroupLink?.serverCode) {
        groupId = dbGroupLink.serverCode
      }
    } catch (dbError) {
      console.log("Usando IDs padrão do Roblox (banco não disponível)")
    }

    // Buscar dados do grupo
    const groupResponse = await fetch(
      `https://groups.roblox.com/v1/groups/${groupId}`,
      { next: { revalidate: 300 } }
    )
    const groupData = await groupResponse.json()

    // Buscar ícone do grupo
    const groupIconResponse = await fetch(
      `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=420x420&format=Png`,
      { next: { revalidate: 300 } }
    )
    const groupIconData = await groupIconResponse.json()
    const groupIcon = groupIconData.data?.[0]?.imageUrl || null

    // Buscar dados de todos os jogos em paralelo
    const gamesPromises = gameIds.map(game => fetchGameData(game.id))
    const gamesResults = await Promise.all(gamesPromises)
    
    // Filtrar jogos válidos (não nulos)
    const games = gamesResults.filter(game => game !== null)

    // Calcular totais
    const totalPlaying = games.reduce((sum, game) => sum + (game?.playing || 0), 0)
    const totalVisits = games.reduce((sum, game) => sum + (game?.visits || 0), 0)
    const totalFavorites = games.reduce((sum, game) => sum + (game?.favoritedCount || 0), 0)

    // Montar resposta
    const result = {
      group: {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        memberCount: groupData.memberCount,
        owner: groupData.owner,
        icon: groupIcon,
        url: `https://www.roblox.com/groups/${groupId}`,
      },
      games: games,
      totals: {
        playing: totalPlaying,
        visits: totalVisits,
        favorites: totalFavorites,
        gamesCount: games.length,
      },
      fetchedAt: new Date().toISOString(),
    }

    // Salvar em cache
    cache = {
      data: result,
      timestamp: Date.now(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar dados do Roblox:", error)
    
    // Retornar cache antigo se houver erro
    if (cache) {
      return NextResponse.json({
        ...cache.data,
        fromCache: true,
        error: "Usando dados em cache",
      })
    }

    return NextResponse.json(
      { error: "Falha ao buscar dados do Roblox" },
      { status: 500 }
    )
  }
}
