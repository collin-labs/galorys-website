import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET - Listar todos os jogos jogáveis
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform")
    const featured = searchParams.get("featured")
    const active = searchParams.get("active")

    const where: any = {}
    
    if (platform) where.platform = platform
    if (featured === "true") where.featured = true
    if (featured === "false") where.featured = false
    if (active === "true") where.active = true
    if (active === "false") where.active = false

    const games = await prisma.playableGame.findMany({
      where,
      include: {
        category: true
      },
      orderBy: [
        { featured: "desc" },
        { order: "asc" },
        { name: "asc" }
      ]
    })

    const categories = await prisma.playableGameCategory.findMany({
      orderBy: { order: "asc" }
    })

    return NextResponse.json({ 
      games, 
      categories,
      total: games.length 
    })
  } catch (error) {
    console.error("Erro ao listar jogos:", error)
    return NextResponse.json({ error: "Erro ao listar jogos" }, { status: 500 })
  }
}

// POST - Criar novo jogo jogável
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      platform, 
      externalId, 
      gameUrl,
      instagram, 
      discordInvite, 
      videoPath,
      featured,
      active,
      categoryId 
    } = body

    // Validações básicas
    if (!name || !platform || !externalId) {
      return NextResponse.json({ 
        error: "Nome, plataforma e ID externo são obrigatórios" 
      }, { status: 400 })
    }

    // Gerar slug
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    // Verificar se slug já existe
    const existingGame = await prisma.playableGame.findUnique({
      where: { slug }
    })
    
    if (existingGame) {
      return NextResponse.json({ 
        error: "Já existe um jogo com este nome" 
      }, { status: 400 })
    }

    // Buscar próximo order
    const lastGame = await prisma.playableGame.findFirst({
      where: { platform },
      orderBy: { order: "desc" }
    })
    const nextOrder = (lastGame?.order || 0) + 1

    // Criar jogo
    const game = await prisma.playableGame.create({
      data: {
        name,
        slug,
        platform,
        externalId,
        gameUrl: gameUrl || (platform === "roblox" 
          ? `https://www.roblox.com/games/${externalId}` 
          : `https://cfx.re/join/${externalId}`),
        instagram,
        discordInvite,
        videoPath,
        featured: featured || false,
        active: active !== false,
        order: nextOrder,
        categoryId
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({ game, message: "Jogo criado com sucesso" })
  } catch (error) {
    console.error("Erro ao criar jogo:", error)
    return NextResponse.json({ error: "Erro ao criar jogo" }, { status: 500 })
  }
}
