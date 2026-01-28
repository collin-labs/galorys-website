import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * API para reordenar jogos via drag & drop
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ 
        error: "Lista de itens inválida" 
      }, { status: 400 })
    }

    // Atualizar ordem de cada jogo
    const updates = items.map((item: { id: string; order: number }, index: number) => 
      prisma.playableGame.update({
        where: { id: item.id },
        data: { order: item.order ?? index }
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ 
      message: "Ordem atualizada com sucesso",
      count: items.length
    })
  } catch (error) {
    console.error("Erro ao reordenar jogos:", error)
    return NextResponse.json({ error: "Erro ao reordenar jogos" }, { status: 500 })
  }
}
