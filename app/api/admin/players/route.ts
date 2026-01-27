import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: [{ team: { order: 'asc' } }, { nickname: 'asc' }],
      include: {
        team: {
          select: { id: true, name: true, game: true }
        }
      }
    })

    return NextResponse.json({ players })
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar jogadores' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const player = await prisma.player.create({
      data: {
        nickname: data.nickname,
        realName: data.realName || null,
        slug: data.slug,
        photo: data.photo || null,
        role: data.role || null,
        bio: data.bio || null,
        teamId: data.teamId,
        active: data.active ?? true,
        twitter: data.twitter || null,
        instagram: data.instagram || null,
        twitch: data.twitch || null,
        youtube: data.youtube || null,
        tiktok: data.tiktok || null,
      }
    })

    return NextResponse.json({ player })
  } catch (error: any) {
    console.error('Erro ao criar jogador:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar jogador' },
      { status: 500 }
    )
  }
}
