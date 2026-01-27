import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            players: true,
            achievements: true,
          }
        }
      }
    })

    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Erro ao buscar times:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar times' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const team = await prisma.team.create({
      data: {
        name: data.name,
        slug: data.slug,
        game: data.game,
        description: data.description,
        logo: data.logo,
        banner: data.banner,
        active: data.active ?? true,
        order: data.order ?? 0,
      }
    })

    return NextResponse.json({ team })
  } catch (error: any) {
    console.error('Erro ao criar time:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar time' },
      { status: 500 }
    )
  }
}
