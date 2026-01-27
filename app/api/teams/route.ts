import { NextResponse } from 'next/server'
import { teams, getTeamBySlug, getFeaturedTeams } from '@/lib/data/teams'
import { getPlayersByTeam } from '@/lib/data/players'

// GET /api/teams - Lista todos os times
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const game = searchParams.get('game')
    const slug = searchParams.get('slug')

    // Se slug for fornecido, retorna um time específico
    if (slug) {
      const team = getTeamBySlug(slug)
      if (!team) {
        return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 })
      }
      
      // Incluir jogadores
      const players = getPlayersByTeam(slug)
      
      return NextResponse.json({
        ...team,
        players,
      })
    }

    let result = teams

    // Filtrar por featured
    if (featured === 'true') {
      result = getFeaturedTeams()
    }

    // Filtrar por jogo
    if (game) {
      result = result.filter(t => t.game === game)
    }

    return NextResponse.json({
      teams: result,
      total: result.length,
    })
  } catch (error) {
    console.error('Erro na API de times:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST /api/teams - Criar novo time (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.name || !body.slug || !body.game) {
      return NextResponse.json(
        { error: 'Nome, slug e jogo são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se slug já existe
    if (getTeamBySlug(body.slug)) {
      return NextResponse.json(
        { error: 'Já existe um time com este slug' },
        { status: 400 }
      )
    }

    // Em produção, salvaria no banco
    // const team = await prisma.team.create({ data: body })
    
    return NextResponse.json({
      message: 'Time criado com sucesso',
      team: body,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar time:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
