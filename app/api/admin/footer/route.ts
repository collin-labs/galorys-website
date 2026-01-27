import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar colunas e itens do rodapé
export async function GET() {
  try {
    const columns = await prisma.footerColumn.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ columns })
  } catch (error) {
    console.error('Erro ao buscar rodapé:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar rodapé' },
      { status: 500 }
    )
  }
}

// POST - Criar coluna ou item
export async function POST(request: NextRequest) {
  try {
    const { type, ...data } = await request.json()

    if (type === 'column') {
      const column = await prisma.footerColumn.create({
        data: {
          name: data.name,
          slug: data.slug,
          order: data.order || 0,
        },
        include: { items: true }
      })
      return NextResponse.json({ column })
    }

    if (type === 'item') {
      const item = await prisma.footerItem.create({
        data: {
          label: data.label,
          href: data.href,
          order: data.order || 0,
          active: data.active ?? true,
          columnId: data.columnId,
        }
      })
      return NextResponse.json({ item })
    }

    return NextResponse.json(
      { error: 'Tipo inválido' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro ao criar item/coluna do rodapé:', error)
    return NextResponse.json(
      { error: 'Erro ao criar item/coluna do rodapé' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar coluna ou item
export async function PUT(request: NextRequest) {
  try {
    const { type, id, ...data } = await request.json()

    if (type === 'column') {
      const column = await prisma.footerColumn.update({
        where: { id },
        data: {
          name: data.name,
          order: data.order,
          active: data.active,
        },
        include: { items: true }
      })
      return NextResponse.json({ column })
    }

    if (type === 'item') {
      const item = await prisma.footerItem.update({
        where: { id },
        data: {
          label: data.label,
          href: data.href,
          order: data.order,
          active: data.active,
        }
      })
      return NextResponse.json({ item })
    }

    // Reordenar itens
    if (type === 'reorder-items' && Array.isArray(data.items)) {
      for (const item of data.items) {
        await prisma.footerItem.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      }
      return NextResponse.json({ success: true })
    }

    // Reordenar colunas
    if (type === 'reorder-columns' && Array.isArray(data.columns)) {
      for (const col of data.columns) {
        await prisma.footerColumn.update({
          where: { id: col.id },
          data: { order: col.order }
        })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Tipo inválido' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro ao atualizar rodapé:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar rodapé' },
      { status: 500 }
    )
  }
}

// DELETE - Remover coluna ou item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      )
    }

    if (type === 'column') {
      await prisma.footerColumn.delete({
        where: { id }
      })
    } else if (type === 'item') {
      await prisma.footerItem.delete({
        where: { id }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover do rodapé:', error)
    return NextResponse.json(
      { error: 'Erro ao remover do rodapé' },
      { status: 500 }
    )
  }
}
