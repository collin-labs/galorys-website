import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Listar todos os jogos
export async function GET() {
  try {
    const links = await prisma.gameLink.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    return NextResponse.json(links)
  } catch (error) {
    console.error("Erro ao listar game links:", error)
    return NextResponse.json({ error: "Erro ao listar jogos" }, { status: 500 })
  }
}

// POST - Criar novo jogo
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { game, name, serverCode, serverUrl, instagram, videoPath, discordInvite, thumbnailUrl } = body
    
    if (!game || !name || !serverCode) {
      return NextResponse.json(
        { error: "Campos obrigatórios: game, name, serverCode" },
        { status: 400 }
      )
    }
    
    // Verificar se já existe
    const existing = await prisma.gameLink.findUnique({
      where: { game }
    })
    
    if (existing) {
      return NextResponse.json(
        { error: "Já existe um jogo com este identificador" },
        { status: 400 }
      )
    }
    
    const newLink = await prisma.gameLink.create({
      data: {
        game,
        name,
        serverCode,
        serverUrl: serverUrl || null,
        instagram: instagram || null,
        videoPath: videoPath || null,
        discordInvite: discordInvite || null,
        thumbnailUrl: thumbnailUrl || null,
        active: true
      }
    })
    
    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar game link:", error)
    return NextResponse.json({ error: "Erro ao criar jogo" }, { status: 500 })
  }
}
