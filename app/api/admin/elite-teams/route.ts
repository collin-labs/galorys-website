import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar times de elite
export async function GET() {
  try {
    const eliteTeams = await prisma.eliteTeam.findMany({
      orderBy: { order: 'asc' },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            shortName: true,
            game: true,
            gameLabel: true,
            description: true,
            longDescription: true,
            logo: true,
            banner: true,
            color: true,
            bgColor: true,
            textColor: true,
            badge: true,
            playersCount: true,
            titlesCount: true,
            foundedYear: true,
            active: true,
          }
        }
      }
    })

    return NextResponse.json({ eliteTeams })
  } catch (error) {
    console.error('Erro ao buscar times de elite:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar times de elite' },
      { status: 500 }
    )
  }
}

// POST - Adicionar time de elite
export async function POST(request: NextRequest) {
  try {
    const { teamId, order } = await request.json()

    // Verificar se já existe
    const existing = await prisma.eliteTeam.findUnique({
      where: { teamId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Este time já está na lista de elite' },
        { status: 400 }
      )
    }

    // Verificar limite de 4 times
    const count = await prisma.eliteTeam.count()
    if (count >= 4) {
      return NextResponse.json(
        { error: 'Máximo de 4 times de elite permitidos' },
        { status: 400 }
      )
    }

    const eliteTeam = await prisma.eliteTeam.create({
      data: { teamId, order: order || count + 1 },
      include: { team: true }
    })

    return NextResponse.json({ eliteTeam })
  } catch (error) {
    console.error('Erro ao adicionar time de elite:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar time de elite' },
      { status: 500 }
    )
  }
}

// PUT - Reordenar times de elite
export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json() // Array de { id, order }

    for (const item of items) {
      await prisma.eliteTeam.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao reordenar times de elite:', error)
    return NextResponse.json(
      { error: 'Erro ao reordenar times de elite' },
      { status: 500 }
    )
  }
}

// DELETE - Remover time de elite
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID não informado' },
        { status: 400 }
      )
    }

    await prisma.eliteTeam.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover time de elite:', error)
    return NextResponse.json(
      { error: 'Erro ao remover time de elite' },
      { status: 500 }
    )
  }
}