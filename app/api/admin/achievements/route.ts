import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const where: any = { active: true }
    if (featured === 'true') {
      where.featured = true
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [{ featuredOrder: 'asc' }, { date: 'desc' }],
      take: limit ? parseInt(limit) : undefined,
      include: {
        team: {
          select: { id: true, name: true, game: true, slug: true }
        }
      }
    })

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error)
    return NextResponse.json({ error: 'Erro ao buscar conquistas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const achievement = await prisma.achievement.create({
      data: {
        title: data.title,
        description: data.description || null,
        placement: data.placement,
        tournament: data.tournament,
        date: new Date(data.date),
        image: data.image || null,
        teamId: data.teamId,
        featured: data.featured ?? false,
        active: data.active ?? true,
      }
    })

    return NextResponse.json({ achievement })
  } catch (error: any) {
    console.error('Erro ao criar conquista:', error)
    return NextResponse.json({ error: error.message || 'Erro ao criar conquista' }, { status: 500 })
  }
}
