import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const redemption = await prisma.userReward.findUnique({
      where: { id: (await params).id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        reward: {
          select: {
            id: true,
            name: true,
            type: true,
            image: true,
            downloadUrl: true,
          }
        }
      }
    })

    if (!redemption) {
      return NextResponse.json({ error: 'Resgate não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ redemption })
  } catch (error: any) {
    console.error('Erro ao buscar resgate:', error)
    return NextResponse.json({ error: error.message || 'Erro ao buscar resgate' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json()
    
    const updateData: any = {}
    
    // Atualizar status com timestamps
    if (data.status !== undefined) {
      updateData.status = data.status
      
      if (data.status === 'processando') {
        updateData.processedAt = new Date()
      } else if (data.status === 'enviado') {
        updateData.shippedAt = new Date()
      } else if (data.status === 'entregue') {
        updateData.deliveredAt = new Date()
      }
    }
    
    // Atualizar código de rastreamento
    if (data.trackingCode !== undefined) {
      updateData.trackingCode = data.trackingCode
    }
    
    // Atualizar notas
    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }
    
    // Atualizar endereço
    if (data.addressStreet !== undefined) updateData.addressStreet = data.addressStreet
    if (data.addressCity !== undefined) updateData.addressCity = data.addressCity
    if (data.addressState !== undefined) updateData.addressState = data.addressState
    if (data.addressZip !== undefined) updateData.addressZip = data.addressZip

    const redemption = await prisma.userReward.update({
      where: { id: (await params).id },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        reward: { select: { name: true, type: true } }
      }
    })

    return NextResponse.json({ redemption })
  } catch (error: any) {
    console.error('Erro ao atualizar resgate:', error)
    return NextResponse.json({ error: error.message || 'Erro ao atualizar resgate' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Buscar resgate para devolver pontos
    const redemption = await prisma.userReward.findUnique({
      where: { id: (await params).id },
      include: { reward: true }
    })

    if (!redemption) {
      return NextResponse.json({ error: 'Resgate não encontrado' }, { status: 404 })
    }

    // Só permite cancelar se estiver pendente ou processando
    if (redemption.status === 'enviado' || redemption.status === 'entregue') {
      return NextResponse.json({ error: 'Não é possível cancelar um resgate já enviado' }, { status: 400 })
    }

    // Devolver pontos ao usuário
    await prisma.user.update({
      where: { id: redemption.userId },
      data: { points: { increment: redemption.reward.cost } }
    })

    // Registrar atividade
    await prisma.activity.create({
      data: {
        userId: redemption.userId,
        type: 'REWARD_CANCELLED',
        points: redemption.reward.cost,
        description: `Resgate cancelado: ${redemption.reward.name}`
      }
    })

    // Deletar resgate
    await prisma.userReward.delete({ where: { id: (await params).id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao cancelar resgate:', error)
    return NextResponse.json({ error: error.message || 'Erro ao cancelar resgate' }, { status: 500 })
  }
}
