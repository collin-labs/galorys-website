import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ rewards })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar recompensas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const reward = await prisma.reward.create({
      data: {
        name: data.name,
        description: data.description || null,
        type: data.type || 'digital',
        cost: data.cost || data.points || 0,
        image: data.image || null,
        downloadUrl: data.downloadUrl || null,
        quantity: data.quantity || data.stock || null,
        active: data.active ?? true,
      }
    })
    return NextResponse.json({ reward })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}