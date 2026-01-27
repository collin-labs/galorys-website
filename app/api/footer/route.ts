import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar colunas do footer com itens (público - apenas ativos)
export async function GET() {
  try {
    const columns = await prisma.footerColumn.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        items: {
          where: { active: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    // Filtrar colunas que têm pelo menos 1 item ativo
    const columnsWithItems = columns.filter(col => col.items.length > 0)

    return NextResponse.json({ columns: columnsWithItems })
  } catch (error) {
    console.error('Erro ao buscar footer:', error)
    return NextResponse.json({ error: 'Erro ao buscar footer' }, { status: 500 })
  }
}
