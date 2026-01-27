import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os jogos
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, games })
  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar jogos' },
      { status: 500 }
    )
  }
}

// POST - Criar novo jogo
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validação básica
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { success: false, error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existing = await prisma.game.findFirst({
      where: {
        OR: [
          { name: data.name },
          { slug: data.slug }
        ]
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Já existe um jogo com este nome ou slug' },
        { status: 400 }
      )
    }

    const game = await prisma.game.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortName: data.shortName || null,
        icon: data.icon || null,
        color: data.color || null,
        order: data.order ?? 0,
        active: data.active ?? true,
      }
    })

    return NextResponse.json({ success: true, game })
  } catch (error: any) {
    console.error('Erro ao criar jogo:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar jogo' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar jogo existente
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar duplicidade (excluindo o próprio registro)
    if (data.name || data.slug) {
      const existing = await prisma.game.findFirst({
        where: {
          AND: [
            { id: { not: data.id } },
            {
              OR: [
                data.name ? { name: data.name } : {},
                data.slug ? { slug: data.slug } : {}
              ].filter(obj => Object.keys(obj).length > 0)
            }
          ]
        }
      })

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Já existe outro jogo com este nome ou slug' },
          { status: 400 }
        )
      }
    }

    const game = await prisma.game.update({
      where: { id: data.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.shortName !== undefined && { shortName: data.shortName }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.active !== undefined && { active: data.active }),
      }
    })

    return NextResponse.json({ success: true, game })
  } catch (error: any) {
    console.error('Erro ao atualizar jogo:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar jogo' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir jogo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.game.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir jogo:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao excluir jogo' },
      { status: 500 }
    )
  }
}
