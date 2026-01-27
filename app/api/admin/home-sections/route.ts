import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todas as seções
export async function GET() {
  try {
    const sections = await prisma.homeSection.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, sections })
  } catch (error) {
    console.error('Erro ao buscar seções:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar seções' },
      { status: 500 }
    )
  }
}

// POST - Criar nova seção
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.slug) {
      return NextResponse.json(
        { success: false, error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existing = await prisma.homeSection.findUnique({
      where: { slug: data.slug }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Já existe uma seção com este slug' },
        { status: 400 }
      )
    }

    const section = await prisma.homeSection.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        order: data.order ?? 0,
        active: data.active ?? true,
      }
    })

    return NextResponse.json({ success: true, section })
  } catch (error: any) {
    console.error('Erro ao criar seção:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar seção' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar seção ou reordenar múltiplas
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Reordenação em lote
    if (data.sections && Array.isArray(data.sections)) {
      await Promise.all(
        data.sections.map((item: { id: string; order: number }) =>
          prisma.homeSection.update({
            where: { id: item.id },
            data: { order: item.order }
          })
        )
      )
      return NextResponse.json({ success: true })
    }

    // Atualização individual
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    const section = await prisma.homeSection.update({
      where: { id: data.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.active !== undefined && { active: data.active }),
      }
    })

    return NextResponse.json({ success: true, section })
  } catch (error: any) {
    console.error('Erro ao atualizar seção:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar seção' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir seção
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

    await prisma.homeSection.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir seção:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao excluir seção' },
      { status: 500 }
    )
  }
}
