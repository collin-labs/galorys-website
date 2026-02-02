import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Buscar um jogo específico
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const link = await prisma.gameLink.findUnique({
      where: { id }
    })
    
    if (!link) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
    }
    
    return NextResponse.json(link)
  } catch (error) {
    console.error("Erro ao buscar game link:", error)
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 })
  }
}

// PUT - Atualizar jogo
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { name, serverCode, serverUrl, serverIp, serverPort, instagram, videoPath, discordInvite, thumbnailUrl, active } = body
    
    const link = await prisma.gameLink.findUnique({
      where: { id }
    })
    
    if (!link) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
    }
    
    const updated = await prisma.gameLink.update({
      where: { id },
      data: {
        name: name !== undefined ? name : link.name,
        serverCode: serverCode !== undefined ? serverCode : link.serverCode,
        serverUrl: serverUrl !== undefined ? serverUrl : link.serverUrl,
        serverIp: serverIp !== undefined ? (serverIp || null) : link.serverIp,
        serverPort: serverPort !== undefined ? (serverPort || null) : link.serverPort,
        instagram: instagram !== undefined ? instagram : link.instagram,
        videoPath: videoPath !== undefined ? videoPath : link.videoPath,
        discordInvite: discordInvite !== undefined ? discordInvite : link.discordInvite,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : link.thumbnailUrl,
        active: active !== undefined ? active : link.active,
      }
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Erro ao atualizar game link:", error)
    return NextResponse.json({ error: "Erro ao atualizar jogo" }, { status: 500 })
  }
}

// DELETE - Excluir jogo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const link = await prisma.gameLink.findUnique({
      where: { id }
    })
    
    if (!link) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 })
    }
    
    await prisma.gameLink.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, message: "Jogo excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir game link:", error)
    return NextResponse.json({ error: "Erro ao excluir jogo" }, { status: 500 })
  }
}
