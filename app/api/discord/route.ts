import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Comunidades Discord padrão (fallback)
const DEFAULT_COMMUNITIES = [
  { code: "flowrp", name: "Flow RP", game: "gtarp-flow" },
  { code: "kushpvp", name: "KUSH PVP", game: "gtarp-kush" },
]

// Cache para não sobrecarregar a API do Discord
let cache: {
  data: any
  timestamp: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos (Discord tem rate limits mais rígidos)

// Função para buscar dados de um convite do Discord
async function fetchDiscordInvite(inviteCode: string) {
  try {
    // API pública do Discord para convites
    const response = await fetch(
      `https://discord.com/api/v9/invites/${inviteCode}?with_counts=true&with_expiration=true`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Galorys-Website/1.0'
        },
        next: { revalidate: 300 } // Revalidar a cada 5 minutos
      }
    )

    if (!response.ok) {
      console.error(`Erro ao buscar Discord ${inviteCode}: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Erro ao buscar Discord ${inviteCode}:`, error)
    return null
  }
}

// Função para extrair dados relevantes da comunidade
function parseCommunityData(data: any, communityInfo: { code: string; name: string; game: string }) {
  if (!data || !data.guild) {
    return {
      code: communityInfo.code,
      game: communityInfo.game,
      name: communityInfo.name,
      memberCount: 0,
      onlineCount: 0,
      guildId: null,
      guildName: communityInfo.name,
      icon: null,
      banner: null,
      inviteUrl: `https://discord.gg/${communityInfo.code}`,
      verified: false,
      partnered: false,
      online: false
    }
  }

  const guild = data.guild
  
  return {
    code: communityInfo.code,
    game: communityInfo.game,
    name: communityInfo.name,
    memberCount: data.approximate_member_count || 0,
    onlineCount: data.approximate_presence_count || 0,
    guildId: guild.id,
    guildName: guild.name,
    icon: guild.icon 
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=256`
      : null,
    banner: guild.banner
      ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${guild.banner.startsWith('a_') ? 'gif' : 'png'}?size=1024`
      : null,
    splash: guild.splash
      ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=1024`
      : null,
    inviteUrl: `https://discord.gg/${communityInfo.code}`,
    verified: guild.features?.includes('VERIFIED') || false,
    partnered: guild.features?.includes('PARTNERED') || false,
    vanityUrl: guild.vanity_url_code || null,
    description: guild.description || null,
    online: true
  }
}

export async function GET() {
  try {
    // Verificar cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data)
    }

    // Tentar buscar configurações do banco de dados
    let communities = DEFAULT_COMMUNITIES

    try {
      const dbLinks = await prisma.gameLink.findMany({
        where: {
          game: { startsWith: "gtarp" },
          active: true
        }
      })

      // Pegar discordInvite do banco se existir
      if (dbLinks.length > 0) {
        communities = dbLinks
          .filter(link => link.discordInvite)
          .map(link => ({
            code: link.discordInvite!.replace('https://discord.gg/', '').replace('https://discord.com/invite/', ''),
            name: link.name,
            game: link.game
          }))
        
        // Se não tem discord configurado, usar os padrões
        if (communities.length === 0) {
          communities = DEFAULT_COMMUNITIES
        }
      }
    } catch (dbError) {
      console.log("Usando comunidades padrão (banco não disponível)")
    }

    // Buscar dados de todas as comunidades em paralelo
    const communityPromises = communities.map(async (community) => {
      const data = await fetchDiscordInvite(community.code)
      return parseCommunityData(data, community)
    })

    const communitiesData = await Promise.all(communityPromises)

    // Calcular totais
    const totalMembers = communitiesData.reduce((sum, c) => sum + c.memberCount, 0)
    const totalOnline = communitiesData.reduce((sum, c) => sum + c.onlineCount, 0)
    const allOnline = communitiesData.every(c => c.online)

    // Montar resposta
    const result = {
      communities: communitiesData,
      totalMembers,
      totalOnline,
      allOnline,
      communityCount: communitiesData.length,
      fetchedAt: new Date().toISOString(),
    }

    // Salvar em cache
    cache = {
      data: result,
      timestamp: Date.now(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar dados do Discord:", error)

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
      communities: DEFAULT_COMMUNITIES.map(c => ({
        ...c,
        memberCount: 0,
        onlineCount: 0,
        guildId: null,
        guildName: c.name,
        icon: null,
        banner: null,
        inviteUrl: `https://discord.gg/${c.code}`,
        verified: false,
        partnered: false,
        online: false
      })),
      totalMembers: 0,
      totalOnline: 0,
      allOnline: false,
      communityCount: 2,
      fetchedAt: new Date().toISOString(),
      error: "Falha ao buscar dados do Discord"
    })
  }
}
