import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Dados iniciais padrão
const DEFAULT_GAME_LINKS = [
  {
    game: "roblox",
    name: "Evolução da Aura",
    serverCode: "76149317725679",
    serverUrl: "https://www.roblox.com/games/76149317725679",
    instagram: "@galorysroblox",
    videoPath: "/videos/galorys-video.mp4",
  },
  {
    game: "roblox-2",
    name: "Escape Tsunami For Animals",
    serverCode: "131891835047442",
    serverUrl: "https://www.roblox.com/games/131891835047442",
    instagram: "@galorysroblox",
    videoPath: null,
  },
  {
    game: "gtarp-kush",
    name: "KUSH PVP",
    serverCode: "r4z8dg",
    serverUrl: "https://servers.fivem.net/servers/detail/r4z8dg",
    instagram: "@joguekush",
    videoPath: "/videos/video-kush.mp4",
  },
  {
    game: "gtarp-flow",
    name: "Flow RP",
    serverCode: "3emg7o",
    serverUrl: "https://servers.fivem.net/servers/detail/3emg7o",
    instagram: "@flowrpgg",
    videoPath: "/videos/video-flow.mp4",
  },
]

// GET - Listar todos os links
export async function GET() {
  try {
    let links = await prisma.gameLink.findMany({
      orderBy: { game: "asc" }
    })

    // Se não houver links ou faltam alguns, criar os padrões
    if (links.length < DEFAULT_GAME_LINKS.length) {
      const existingGames = links.map(l => l.game)
      const missingLinks = DEFAULT_GAME_LINKS.filter(
        d => !existingGames.includes(d.game)
      )
      
      if (missingLinks.length > 0) {
        await prisma.gameLink.createMany({
          data: missingLinks,
          skipDuplicates: true,
        })
        links = await prisma.gameLink.findMany({
          orderBy: { game: "asc" }
        })
      }
    }

    return NextResponse.json({
      success: true,
      links,
      count: links.length
    })
  } catch (error) {
    console.error("Erro ao buscar links:", error)
    
    // Retornar dados padrão em caso de erro
    return NextResponse.json({
      success: false,
      links: DEFAULT_GAME_LINKS.map((link, index) => ({
        id: `default-${index}`,
        ...link,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      count: DEFAULT_GAME_LINKS.length,
      error: "Usando dados padrão (banco não disponível)"
    })
  }
}

// PUT - Atualizar um link específico
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { game, name, serverCode, serverUrl, instagram, videoPath, active } = body

    if (!game) {
      return NextResponse.json(
        { success: false, error: "Campo 'game' é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o link existe
    const existingLink = await prisma.gameLink.findUnique({
      where: { game }
    })

    if (!existingLink) {
      // Criar se não existir
      const newLink = await prisma.gameLink.create({
        data: {
          game,
          name: name || game,
          serverCode: serverCode || "",
          serverUrl,
          instagram,
          videoPath,
          active: active !== undefined ? active : true
        }
      })

      return NextResponse.json({
        success: true,
        link: newLink,
        message: "Link criado com sucesso"
      })
    }

    // Atualizar link existente
    const updatedLink = await prisma.gameLink.update({
      where: { game },
      data: {
        ...(name !== undefined && { name }),
        ...(serverCode !== undefined && { serverCode }),
        ...(serverUrl !== undefined && { serverUrl }),
        ...(instagram !== undefined && { instagram }),
        ...(videoPath !== undefined && { videoPath }),
        ...(active !== undefined && { active }),
      }
    })

    return NextResponse.json({
      success: true,
      link: updatedLink,
      message: "Link atualizado com sucesso"
    })
  } catch (error) {
    console.error("Erro ao atualizar link:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar link" },
      { status: 500 }
    )
  }
}

// POST - Criar/Resetar links (útil para seed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "seed") {
      // Deletar todos os links existentes
      await prisma.gameLink.deleteMany({})
      
      // Criar links padrão
      await prisma.gameLink.createMany({
        data: DEFAULT_GAME_LINKS
      })

      const links = await prisma.gameLink.findMany({
        orderBy: { game: "asc" }
      })

      return NextResponse.json({
        success: true,
        links,
        message: "Links resetados para valores padrão"
      })
    }

    // Criar um único link
    const { game, name, serverCode, serverUrl, instagram, videoPath } = body

    if (!game || !name || !serverCode) {
      return NextResponse.json(
        { success: false, error: "Campos 'game', 'name' e 'serverCode' são obrigatórios" },
        { status: 400 }
      )
    }

    const newLink = await prisma.gameLink.create({
      data: {
        game,
        name,
        serverCode,
        serverUrl,
        instagram,
        videoPath,
      }
    })

    return NextResponse.json({
      success: true,
      link: newLink,
      message: "Link criado com sucesso"
    })
  } catch (error) {
    console.error("Erro ao criar link:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao criar link" },
      { status: 500 }
    )
  }
}
