import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: { id: params.id },
      include: { team: { select: { id: true, name: true, game: true } } }
    })

    if (!achievement) {
      return NextResponse.json({ error: 'Conquista não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ achievement })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar conquista' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const achievement = await prisma.achievement.update({
      where: { id: params.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.placement !== undefined && { placement: data.placement }),
        ...(data.tournament !== undefined && { tournament: data.tournament }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.teamId !== undefined && { teamId: data.teamId }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.active !== undefined && { active: data.active }),
      }
    })

    return NextResponse.json({ achievement })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar conquista' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.achievement.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao excluir conquista' }, { status: 500 })
  }
}
