import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: (await params).id },
      include: { team: { select: { id: true, name: true } } }
    })
    if (!match) return NextResponse.json({ error: 'Partida não encontrada' }, { status: 404 })
    return NextResponse.json({ match })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar partida' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await request.json()
    const match = await prisma.match.update({
      where: { id: (await params).id },
      data: {
        ...(data.opponent !== undefined && { opponent: data.opponent }),
        ...(data.opponentLogo !== undefined && { opponentLogo: data.opponentLogo }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.streamUrl !== undefined && { streamUrl: data.streamUrl }),
        ...(data.result !== undefined && { result: data.result }),
        ...(data.isLive !== undefined && { isLive: data.isLive }),
        ...(data.teamId !== undefined && { teamId: data.teamId }),
      }
    })
    return NextResponse.json({ match })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await prisma.match.delete({ where: { id: (await params).id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
