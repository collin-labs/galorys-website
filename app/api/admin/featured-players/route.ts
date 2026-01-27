import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar jogadores em destaque com conquistas do time
export async function GET() {
  try {
    const featuredPlayers = await prisma.featuredPlayer.findMany({
      orderBy: { order: 'asc' },
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            realName: true,
            slug: true,
            photo: true,
            role: true,
            bio: true,
            twitter: true,
            instagram: true,
            twitch: true,
            youtube: true,
            tiktok: true,
            team: {
              select: {
                id: true,
                name: true,
                slug: true,
                titlesCount: true,
                playersCount: true,
                // Buscar conquistas do time
                achievements: {
                  where: { active: true },
                  select: {
                    id: true,
                    title: true,
                    placement: true,
                    tournament: true,
                    featured: true,
                  },
                  orderBy: { date: 'desc' },
                  take: 10,
                }
              }
            }
          }
        }
      }
    })

    // Processar para adicionar estatísticas calculadas
    const processedPlayers = featuredPlayers.map(fp => {
      const team = fp.player.team
      const achievements = team.achievements || []
      
      // Contar títulos (placements que indicam vitória)
      const titlesCount = team.titlesCount || achievements.filter(a => 
        a.placement === "1º" || 
        a.placement === "1º Lugar" || 
        a.placement === "Campeão" ||
        a.placement.toLowerCase().includes("campeão") ||
        a.placement.toLowerCase().includes("1º")
      ).length

      // Contar conquistas em destaque como "records"
      const recordsCount = achievements.filter(a => a.featured).length || achievements.length

      // Determinar ranking baseado em conquistas
      let ranking = "-"
      if (titlesCount >= 10) ranking = "Top BR"
      else if (titlesCount >= 5) ranking = "Top 5"
      else if (titlesCount >= 1) ranking = "Elite"
      else if (achievements.length > 0) ranking = "Pro"

      return {
        ...fp,
        stats: {
          titles: titlesCount,
          records: recordsCount,
          ranking: ranking,
          achievementsCount: achievements.length,
        }
      }
    })

    return NextResponse.json({ featuredPlayers: processedPlayers })
  } catch (error) {
    console.error('Erro ao buscar jogadores em destaque:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar jogadores em destaque' },
      { status: 500 }
    )
  }
}

// POST - Adicionar jogador em destaque
export async function POST(request: NextRequest) {
  try {
    const { playerId, order } = await request.json()

    // Verificar se já existe
    const existing = await prisma.featuredPlayer.findUnique({
      where: { playerId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Este jogador já está em destaque' },
        { status: 400 }
      )
    }

    // Verificar limite de 3 jogadores
    const count = await prisma.featuredPlayer.count()
    if (count >= 3) {
      return NextResponse.json(
        { error: 'Máximo de 3 jogadores em destaque permitidos' },
        { status: 400 }
      )
    }

    const featuredPlayer = await prisma.featuredPlayer.create({
      data: { playerId, order: order || count + 1 },
      include: { player: { include: { team: true } } }
    })

    return NextResponse.json({ featuredPlayer })
  } catch (error) {
    console.error('Erro ao adicionar jogador em destaque:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar jogador em destaque' },
      { status: 500 }
    )
  }
}

// PUT - Reordenar jogadores em destaque
export async function PUT(request: NextRequest) {
  try {
    const { items } = await request.json() // Array de { id, order }

    for (const item of items) {
      await prisma.featuredPlayer.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao reordenar jogadores em destaque:', error)
    return NextResponse.json(
      { error: 'Erro ao reordenar jogadores em destaque' },
      { status: 500 }
    )
  }
}

// DELETE - Remover jogador em destaque
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

    await prisma.featuredPlayer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover jogador em destaque:', error)
    return NextResponse.json(
      { error: 'Erro ao remover jogador em destaque' },
      { status: 500 }
    )
  }
}
