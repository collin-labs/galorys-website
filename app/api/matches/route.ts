import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Listar partidas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const upcoming = searchParams.get("upcoming") === "true"
    const live = searchParams.get("live") === "true"

    const where: any = {}

    // Filtrar partidas futuras ou ao vivo
    if (upcoming) {
      where.date = { gte: new Date() }
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            game: true,
            logo: true,
          }
        }
      },
      orderBy: { date: "asc" },
      take: limit,
    })

    // Formatar resposta
    const formattedMatches = matches.map(match => ({
      id: match.id,
      team: match.team.name,
      teamSlug: match.team.slug,
      teamGame: match.team.game,
      teamLogo: match.team.logo,
      opponent: match.opponent,
      opponentLogo: match.opponentLogo,
      tournament: match.result || "Torneio", // Usando result temporariamente como tournament
      date: match.date,
      status: match.isLive ? "live" : (new Date(match.date) > new Date() ? "upcoming" : "finished"),
      streamUrl: match.streamUrl,
      result: match.result,
    }))

    return NextResponse.json({
      success: true,
      matches: formattedMatches,
      count: formattedMatches.length,
    })
  } catch (error) {
    console.error("Erro ao buscar partidas:", error)
    return NextResponse.json({
      success: false,
      matches: [],
      count: 0,
      error: "Erro ao buscar partidas"
    })
  }
}

// POST - Criar partida
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamId, opponent, opponentLogo, date, streamUrl, result, isLive } = body

    if (!teamId || !opponent || !date) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios: teamId, opponent, date" },
        { status: 400 }
      )
    }

    const match = await prisma.match.create({
      data: {
        teamId,
        opponent,
        opponentLogo,
        date: new Date(date),
        streamUrl,
        result,
        isLive: isLive || false,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            game: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      match,
      message: "Partida criada com sucesso"
    })
  } catch (error) {
    console.error("Erro ao criar partida:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao criar partida" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar partida
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, opponent, opponentLogo, date, streamUrl, result, isLive } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID da partida é obrigatório" },
        { status: 400 }
      )
    }

    const match = await prisma.match.update({
      where: { id },
      data: {
        ...(opponent !== undefined && { opponent }),
        ...(opponentLogo !== undefined && { opponentLogo }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(streamUrl !== undefined && { streamUrl }),
        ...(result !== undefined && { result }),
        ...(isLive !== undefined && { isLive }),
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
            game: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      match,
      message: "Partida atualizada com sucesso"
    })
  } catch (error) {
    console.error("Erro ao atualizar partida:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar partida" },
      { status: 500 }
    )
  }
}

// DELETE - Remover partida
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID da partida é obrigatório" },
        { status: 400 }
      )
    }

    await prisma.match.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Partida removida com sucesso"
    })
  } catch (error) {
    console.error("Erro ao remover partida:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao remover partida" },
      { status: 500 }
    )
  }
}
