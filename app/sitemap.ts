import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galorys.com'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/times`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jogadores`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/conquistas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wallpapers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/roblox`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gta-rp`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Páginas dinâmicas - Times
  let teamPages: MetadataRoute.Sitemap = []
  try {
    const teams = await prisma.team.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true }
    })
    teamPages = teams.map((team) => ({
      url: `${baseUrl}/times/${team.slug}`,
      lastModified: team.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (e) {
    console.error('Erro ao buscar times para sitemap:', e)
  }

  // Páginas dinâmicas - Jogadores
  let playerPages: MetadataRoute.Sitemap = []
  try {
    const players = await prisma.player.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true }
    })
    playerPages = players.map((player) => ({
      url: `${baseUrl}/jogadores/${player.slug}`,
      lastModified: player.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (e) {
    console.error('Erro ao buscar jogadores para sitemap:', e)
  }

  // Páginas dinâmicas - Notícias
  let newsPages: MetadataRoute.Sitemap = []
  try {
    const news = await prisma.news.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true }
    })
    newsPages = news.map((item) => ({
      url: `${baseUrl}/noticias/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error('Erro ao buscar notícias para sitemap:', e)
  }

  return [...staticPages, ...teamPages, ...playerPages, ...newsPages]
}
