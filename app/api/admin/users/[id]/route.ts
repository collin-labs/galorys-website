import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        rewards: {
          include: { reward: true },
          orderBy: { redeemedAt: 'desc' },
          take: 10
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json({ error: error.message || 'Erro ao buscar usuário' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.points !== undefined) updateData.points = data.points
    if (data.banned !== undefined) updateData.banned = data.banned
    if (data.addPoints !== undefined) {
      // Adicionar pontos ao valor atual
      const currentUser = await prisma.user.findUnique({ where: { id: params.id } })
      if (currentUser) {
        updateData.points = currentUser.points + data.addPoints
        
        // Registrar atividade
        await prisma.activity.create({
          data: {
            userId: params.id,
            type: 'POINTS_ADDED',
            points: data.addPoints,
            description: data.reason || 'Pontos adicionados pelo admin'
          }
        })
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json({ error: error.message || 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se não é o próprio admin tentando se deletar
    // (Isso seria verificado com autenticação real)
    
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error)
    return NextResponse.json({ error: error.message || 'Erro ao excluir usuário' }, { status: 500 })
  }
}
