import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// Códigos padrão dos servidores (fallback se não houver no banco)
const DEFAULT_SERVERS = [
  { code: "r4z8dg", name: "KUSH PVP", game: "gtarp-kush", instagram: "@joguekush", videoPath: "/videos/video-kush.mp4", discordInvite: "kushpvp" },
  { code: "3emg7o", name: "Flow RP", game: "gtarp-flow", instagram: "@flowrpgg", videoPath: "/videos/video-flow.mp4", discordInvite: "flowrp" },
]

// Cache para não sobrecarregar a API do FiveM
let cache: {
  data: any
  timestamp: number
} | null = null

const CACHE_DURATION = 60 * 1000 // 1 minuto

// Função para limpar o cache (exportada para uso externo)
export function clearFivemCache() {
  cache = null
}

// Função para buscar dados de um servidor FiveM
async function fetchServerData(serverCode: string) {
  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${serverCode}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'User-Agent': 'Galorys-Website/1.0'
        }
      }
    )
    
    if (!response.ok) {
      console.error(`Erro ao buscar servidor ${serverCode}: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Erro ao buscar servidor ${serverCode}:`, error)
    return null
  }
}

// Função para extrair dados relevantes do servidor
function parseServerData(data: any, serverInfo: { code: string, name: string, game: string, instagram?: string | null, videoPath?: string | null, discordInvite?: string | null }) {
  if (!data || !data.Data) {
    return {
      code: serverInfo.code,
      game: serverInfo.game,
      name: serverInfo.name,
      players: 0,
      maxPlayers: 0,
      online: false,
      hostname: serverInfo.name,
      connectUrl: `https://cfx.re/join/${serverInfo.code}`,
      instagram: serverInfo.instagram || null,
      videoPath: serverInfo.videoPath || null,
      discordInvite: serverInfo.discordInvite || null,
    }
  }

  const serverData = data.Data
  
  return {
    code: serverInfo.code,
    game: serverInfo.game,
    name: serverInfo.name,
    players: serverData.clients || 0,
    maxPlayers: serverData.sv_maxclients || serverData.svMaxclients || 128,
    online: true,
    hostname: serverData.hostname || serverInfo.name,
    connectUrl: `https://cfx.re/join/${serverInfo.code}`,
    instagram: serverInfo.instagram || null,
    videoPath: serverInfo.videoPath || null,
    discordInvite: serverInfo.discordInvite || null,
    // Dados extras que podem ser úteis
    gametype: serverData.gametype || null,
    mapname: serverData.mapname || null,
    resources: serverData.resources?.length || 0,
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

    // Tentar buscar configurações do banco de dados
    let servers = DEFAULT_SERVERS
    
    try {
      const dbLinks = await prisma.gameLink.findMany({
        where: {
          game: { startsWith: "gtarp" },
          active: true
        }
      })
      
      if (dbLinks.length > 0) {
        servers = dbLinks.map(link => ({
          code: link.serverCode,
          name: link.name,
          game: link.game,
          instagram: link.instagram,
          videoPath: link.videoPath,
          discordInvite: link.discordInvite,
        }))
      }
    } catch (dbError) {
      console.log("Usando servidores padrão (banco não disponível)")
    }

    // Buscar dados de todos os servidores em paralelo
    const serverPromises = servers.map(async (server) => {
      const data = await fetchServerData(server.code)
      return parseServerData(data, server)
    })

    const serversData = await Promise.all(serverPromises)

    // Calcular total de jogadores
    const totalPlayers = serversData.reduce((sum, server) => sum + server.players, 0)
    const totalMaxPlayers = serversData.reduce((sum, server) => sum + server.maxPlayers, 0)
    const allOnline = serversData.every(server => server.online)

    // Montar resposta
    const result = {
      servers: serversData,
      totalPlayers,
      totalMaxPlayers,
      allOnline,
      serverCount: serversData.length,
      fetchedAt: new Date().toISOString(),
    }

    // Salvar em cache
    cache = {
      data: result,
      timestamp: Date.now(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar dados do FiveM:", error)
    
    // Retornar cache antigo se houver erro
    if (cache) {
      return NextResponse.json({
        ...cache.data,
        fromCache: true,
        error: "Usando dados em cache",
      })
    }

    // Retorno de fallback
    return NextResponse.json({
      servers: DEFAULT_SERVERS.map(s => ({
        ...s,
        players: 0,
        maxPlayers: 128,
        online: false,
        hostname: s.name,
        connectUrl: `https://cfx.re/join/${s.code}`
      })),
      totalPlayers: 0,
      totalMaxPlayers: 256,
      allOnline: false,
      serverCount: 2,
      fetchedAt: new Date().toISOString(),
      error: "Falha ao buscar dados do FiveM"
    })
  }
}