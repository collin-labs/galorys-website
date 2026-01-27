import { NextResponse } from 'next/server'
import { players, getPlayerBySlug, getPlayersByTeam, getFeaturedPlayers } from '@/data/players'

// GET /api/players - Lista todos os jogadores
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const teamSlug = searchParams.get('team')
    const game = searchParams.get('game')
    const slug = searchParams.get('slug')

    // Se slug for fornecido, retorna um jogador específico
    if (slug) {
      const player = getPlayerBySlug(slug)
      if (!player) {
        return NextResponse.json({ error: 'Jogador não encontrado' }, { status: 404 })
      }
      return NextResponse.json(player)
    }

    let result = players

    // Filtrar por featured
    if (featured === 'true') {
      result = getFeaturedPlayers()
    }

    // Filtrar por time
    if (teamSlug) {
      result = getPlayersByTeam(teamSlug)
    }

    // Filtrar por jogo
    if (game) {
      result = result.filter(p => p.game === game)
    }

    return NextResponse.json({
      players: result,
      total: result.length,
    })
  } catch (error) {
    console.error('Erro na API de jogadores:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/players - Criar novo jogador (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.nickname || !body.slug || !body.teamId) {
      return NextResponse.json(
        { error: 'Nickname, slug e time são obrigatórios' },
        { status: 400 }
      )
    }

    if (getPlayerBySlug(body.slug)) {
      return NextResponse.json(
        { error: 'Já existe um jogador com este slug' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Jogador criado com sucesso',
      player: body,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar jogador:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
