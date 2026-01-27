import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { date: 'desc' },
      include: { team: { select: { id: true, name: true, game: true } } }
    })
    return NextResponse.json({ matches })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar partidas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const match = await prisma.match.create({
      data: {
        opponent: data.opponent,
        opponentLogo: data.opponentLogo || null,
        date: new Date(data.date),
        streamUrl: data.streamUrl || null,
        result: data.result || null,
        isLive: data.isLive ?? false,
        teamId: data.teamId,
      }
    })
    return NextResponse.json({ match })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
