import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar itens do menu
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { parentId: null }, // Apenas itens de nível superior
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ menuItems })
  } catch (error) {
    console.error('Erro ao buscar itens do menu:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar itens do menu' },
      { status: 500 }
    )
  }
}

// POST - Criar item de menu
export async function POST(request: NextRequest) {
  try {
    const { label, href, order, active, parentId } = await request.json()

    const menuItem = await prisma.menuItem.create({
      data: {
        label,
        href,
        order: order || 0,
        active: active ?? true,
        parentId: parentId || null,
      },
      include: { children: true }
    })

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error('Erro ao criar item de menu:', error)
    return NextResponse.json(
      { error: 'Erro ao criar item de menu' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar item de menu ou reordenar
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Se for array, é reordenação
    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        await prisma.menuItem.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      }
      return NextResponse.json({ success: true })
    }

    // Se não, é atualização de item único
    const { id, label, href, active, parentId } = body

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        label,
        href,
        active,
        parentId: parentId || null,
      },
      include: { children: true }
    })

    return NextResponse.json({ menuItem })
  } catch (error) {
    console.error('Erro ao atualizar item de menu:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar item de menu' },
      { status: 500 }
    )
  }
}

// DELETE - Remover item de menu
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

    await prisma.menuItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover item de menu:', error)
    return NextResponse.json(
      { error: 'Erro ao remover item de menu' },
      { status: 500 }
    )
  }
}
