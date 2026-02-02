import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// Códigos padrão dos servidores (fallback se não houver no banco)
const DEFAULT_SERVERS = [
  { code: "r4z8dg", name: "KUSH PVP", game: "gtarp-kush", instagram: "@joguekush", videoPath: "/videos/video-kush.mp4", discordInvite: "kushpvp", serverIp: "172.84.94.77", serverPort: 30120 },
  { code: "3emg7o", name: "Flow RP", game: "gtarp-flow", instagram: "@flowrpgg", videoPath: "/videos/video-flow.mp4", discordInvite: "flowrp", serverIp: "45.40.99.228", serverPort: 30120 },
]

// Cache para não sobrecarregar as APIs
let cache: {
  data: any
  timestamp: number
} | null = null

const CACHE_DURATION = 30 * 1000 // 30 segundos (pode ser menor agora que é direto)

// Função para limpar o cache (exportada para uso externo)
export function clearFivemCache() {
  cache = null
}

// ============================================
// MÉTODO DIRETO (recomendado pelo Eric)
// Busca players.json direto do servidor FiveM
// ============================================
async function fetchPlayersDirectly(ip: string, port: number): Promise<{ count: number, online: boolean }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    const response = await fetch(
      `http://${ip}:${port}/players.json`,
      { 
        signal: controller.signal,
        cache: 'no-store'
      }
    )
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`Erro ao buscar players direto ${ip}:${port}: ${response.status}`)
      return { count: 0, online: false }
    }
    
    const players = await response.json()
    // players.json retorna um array de jogadores, basta contar
    return { 
      count: Array.isArray(players) ? players.length : 0, 
      online: true 
    }
  } catch (error) {
    console.error(`Erro ao buscar players direto ${ip}:${port}:`, error)
    return { count: 0, online: false }
  }
}

// ============================================
// MÉTODO FALLBACK (API pública do FiveM)
// Usado quando não tem IP:Porta configurado
// ============================================
async function fetchServerDataFallback(serverCode: string) {
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

// Tipo para serverInfo
interface ServerInfo {
  code: string
  name: string
  game: string
  instagram?: string | null
  videoPath?: string | null
  discordInvite?: string | null
  serverIp?: string | null
  serverPort?: number | null
}

// Função para buscar dados do servidor (escolhe método automaticamente)
async function fetchServerData(serverInfo: ServerInfo) {
  // Se tem IP e Porta, usa método direto (mais rápido e preciso)
  if (serverInfo.serverIp && serverInfo.serverPort) {
    const { count, online } = await fetchPlayersDirectly(serverInfo.serverIp, serverInfo.serverPort)
    return {
      code: serverInfo.code,
      game: serverInfo.game,
      name: serverInfo.name,
      players: count,
      maxPlayers: 128, // Valor padrão (players.json não retorna isso)
      online,
      hostname: serverInfo.name,
      connectUrl: `https://cfx.re/join/${serverInfo.code}`,
      instagram: serverInfo.instagram || null,
      videoPath: serverInfo.videoPath || null,
      discordInvite: serverInfo.discordInvite || null,
      method: 'direct' // Para debug
    }
  }
  
  // Fallback: usa API pública do FiveM
  const data = await fetchServerDataFallback(serverInfo.code)
  return parseServerDataFallback(data, serverInfo)
}

// Parse dos dados do fallback (API pública)
function parseServerDataFallback(data: any, serverInfo: ServerInfo) {
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
      method: 'fallback-offline'
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
    gametype: serverData.gametype || null,
    mapname: serverData.mapname || null,
    resources: serverData.resources?.length || 0,
    method: 'fallback-fivem'
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
    let servers: ServerInfo[] = DEFAULT_SERVERS
    
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
          serverIp: link.serverIp,
          serverPort: link.serverPort,
        }))
      }
    } catch (dbError) {
      console.log("Usando servidores padrão (banco não disponível)")
    }

    // Buscar dados de todos os servidores em paralelo
    const serverPromises = servers.map(server => fetchServerData(server))
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