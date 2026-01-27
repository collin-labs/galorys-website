import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      users,
      teams,
      teamsActive,
      players,
      playersActive,
      achievements,
      achievementsActive,
      matches,
      partners,
      news,
      banners,
      wallpapers,
      newsletter,
      contacts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.team.count({ where: { active: true } }),
      prisma.player.count(),
      prisma.player.count({ where: { active: true } }),
      prisma.achievement.count(),
      prisma.achievement.count({ where: { active: true } }),
      prisma.match.count(),
      prisma.partner.count(),
      prisma.news.count(),
      prisma.banner.count(),
      prisma.wallpaper.count(),
      prisma.newsletter.count(),
      prisma.contact.count({ where: { read: false } }),
    ])

    return NextResponse.json({
      users,
      teams,
      teamsActive,
      players,
      playersActive,
      achievements,
      achievementsActive,
      matches,
      partners,
      news,
      banners,
      wallpapers,
      newsletter,
      contacts,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
