import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: {
          select: { id: true, name: true, game: true }
        }
      }
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Jogador não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ player })
  } catch (error) {
    console.error('Erro ao buscar jogador:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar jogador' },
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
    
    const player = await prisma.player.update({
      where: { id },
      data: {
        ...(data.nickname !== undefined && { nickname: data.nickname }),
        ...(data.realName !== undefined && { realName: data.realName }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.photo !== undefined && { photo: data.photo }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.teamId !== undefined && { teamId: data.teamId }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.twitter !== undefined && { twitter: data.twitter }),
        ...(data.instagram !== undefined && { instagram: data.instagram }),
        ...(data.twitch !== undefined && { twitch: data.twitch }),
        ...(data.youtube !== undefined && { youtube: data.youtube }),
        ...(data.tiktok !== undefined && { tiktok: data.tiktok }),
      }
    })

    return NextResponse.json({ player })
  } catch (error: any) {
    console.error('Erro ao atualizar jogador:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar jogador' },
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
    
    await prisma.player.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir jogador:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao excluir jogador' },
      { status: 500 }
    )
  }
}
