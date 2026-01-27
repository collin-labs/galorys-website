import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reward = await prisma.reward.findUnique({
      where: { id: params.id }
    })

    if (!reward) {
      return NextResponse.json({ error: 'Recompensa não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ reward })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar recompensa' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const reward = await prisma.reward.update({
      where: { id: params.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.downloadUrl !== undefined && { downloadUrl: data.downloadUrl }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.active !== undefined && { active: data.active }),
      }
    })

    return NextResponse.json({ reward })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar recompensa' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reward.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao excluir recompensa' }, { status: 500 })
  }
}