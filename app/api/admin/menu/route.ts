import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os itens do menu (admin)
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ menuItems })
  } catch (error) {
    console.error('Erro ao buscar menu:', error)
    return NextResponse.json({ error: 'Erro ao buscar menu' }, { status: 500 })
  }
}

// POST - Criar item do menu
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const menuItem = await prisma.menuItem.create({
      data: {
        label: data.label,
        href: data.href,
        order: data.order ?? 0,
        active: data.active ?? true,
        parentId: data.parentId || null
      }
    })

    return NextResponse.json({ menuItem })
  } catch (error: any) {
    console.error('Erro ao criar item do menu:', error)
    return NextResponse.json({ error: error.message || 'Erro ao criar item' }, { status: 500 })
  }
}

// PUT - Atualizar item do menu
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: 'ID não informado' }, { status: 400 })
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ menuItem })
  } catch (error: any) {
    console.error('Erro ao atualizar item do menu:', error)
    return NextResponse.json({ error: error.message || 'Erro ao atualizar' }, { status: 500 })
  }
}

// DELETE - Remover item do menu
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não informado' }, { status: 400 })
    }

    // Deletar filhos primeiro
    await prisma.menuItem.deleteMany({
      where: { parentId: id }
    })

    await prisma.menuItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao remover item do menu:', error)
    return NextResponse.json({ error: error.message || 'Erro ao remover' }, { status: 500 })
  }
}
