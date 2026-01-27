import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const type = searchParams.get('type') || ''

    const redemptions = await prisma.userReward.findMany({
      where: {
        AND: [
          status && status !== 'all' ? { status } : {},
          type && type !== 'all' ? { reward: { type } } : {},
        ]
      },
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
      },
      orderBy: { redeemedAt: 'desc' }
    })

    // Estatísticas
    const stats = {
      total: await prisma.userReward.count(),
      pendente: await prisma.userReward.count({ where: { status: 'pendente' } }),
      processando: await prisma.userReward.count({ where: { status: 'processando' } }),
      enviado: await prisma.userReward.count({ where: { status: 'enviado' } }),
      entregue: await prisma.userReward.count({ where: { status: 'entregue' } }),
    }

    return NextResponse.json({ redemptions, stats })
  } catch (error: any) {
    console.error('Erro ao buscar resgates:', error)
    return NextResponse.json({ error: error.message || 'Erro ao buscar resgates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Verificar se usuário e recompensa existem
    const user = await prisma.user.findUnique({ where: { id: data.userId } })
    const reward = await prisma.reward.findUnique({ where: { id: data.rewardId } })
    
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }
    if (!reward) {
      return NextResponse.json({ error: 'Recompensa não encontrada' }, { status: 404 })
    }
    
    // Verificar se usuário tem pontos suficientes
    if (user.points < reward.cost) {
      return NextResponse.json({ error: 'Pontos insuficientes' }, { status: 400 })
    }

    // Criar resgate
    const redemption = await prisma.userReward.create({
      data: {
        userId: data.userId,
        rewardId: data.rewardId,
        status: 'pendente',
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressZip: data.addressZip,
      },
      include: {
        user: { select: { name: true, email: true } },
        reward: { select: { name: true, type: true } }
      }
    })

    // Deduzir pontos do usuário
    await prisma.user.update({
      where: { id: data.userId },
      data: { points: { decrement: reward.cost } }
    })

    // Registrar atividade
    await prisma.activity.create({
      data: {
        userId: data.userId,
        type: 'REWARD_REDEEMED',
        points: -reward.cost,
        description: `Resgatou: ${reward.name}`
      }
    })

    return NextResponse.json({ redemption })
  } catch (error: any) {
    console.error('Erro ao criar resgate:', error)
    return NextResponse.json({ error: error.message || 'Erro ao criar resgate' }, { status: 500 })
  }
}
