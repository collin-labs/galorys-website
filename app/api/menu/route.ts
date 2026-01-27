import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar itens do menu (público)
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { 
        active: true,
        parentId: null // Apenas itens de nível raiz
      },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { active: true },
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
