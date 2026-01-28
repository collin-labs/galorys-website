import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET - Buscar jogo específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const game = await prisma.playableGame.findUnique({
      where: { id: params.id },
      include: { category: true }
    })

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ game })
  } catch (error) {
    console.error("Erro ao buscar jogo:", error)
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 })
  }
}

// PUT - Atualizar jogo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      universeId,
      gameUrl,
      instagram, 
      discordInvite, 
      videoPath,
      featured,
      active,
      order,
      categoryId 
    } = body

    // Verificar se jogo existe
    const existingGame = await prisma.playableGame.findUnique({
      where: { id: params.id }
    })

    if (!existingGame) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
    }

    // Se mudou o nome, gerar novo slug
    let slug = existingGame.slug
    if (name && name !== existingGame.name) {
      slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      // Verificar se novo slug já existe
      const slugExists = await prisma.playableGame.findFirst({
        where: { 
          slug,
          NOT: { id: params.id }
        }
      })
      
      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Atualizar jogo
    const game = await prisma.playableGame.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        slug,
        ...(platform && { platform }),
        ...(externalId && { externalId }),
        ...(universeId !== undefined && { universeId }),
        ...(gameUrl !== undefined && { gameUrl }),
        ...(instagram !== undefined && { instagram }),
        ...(discordInvite !== undefined && { discordInvite }),
        ...(videoPath !== undefined && { videoPath }),
        ...(featured !== undefined && { featured }),
        ...(active !== undefined && { active }),
        ...(order !== undefined && { order }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({ game, message: "Jogo atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error)
    return NextResponse.json({ error: "Erro ao atualizar jogo" }, { status: 500 })
  }
}

// DELETE - Excluir jogo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se jogo existe
    const existingGame = await prisma.playableGame.findUnique({
      where: { id: params.id }
    })

    if (!existingGame) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
    }

    // Excluir jogo
    await prisma.playableGame.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Jogo excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir jogo:", error)
    return NextResponse.json({ error: "Erro ao excluir jogo" }, { status: 500 })
  }
}
