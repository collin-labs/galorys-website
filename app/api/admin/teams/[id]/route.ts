import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        players: true,
        achievements: true,
        _count: {
          select: {
            players: true,
            achievements: true,
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Time não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ team })
  } catch (error) {
    console.error('Erro ao buscar time:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar time' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const team = await prisma.team.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.game !== undefined && { game: data.game }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.banner !== undefined && { banner: data.banner }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.order !== undefined && { order: data.order }),
      }
    })

    return NextResponse.json({ team })
  } catch (error: any) {
    console.error('Erro ao atualizar time:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar time' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.team.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir time:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao excluir time' },
      { status: 500 }
    )
  }
}
