import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar redes sociais
export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ socialLinks })
  } catch (error) {
    console.error('Erro ao buscar redes sociais:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar redes sociais' },
      { status: 500 }
    )
  }
}

// POST - Criar rede social
export async function POST(request: NextRequest) {
  try {
    const { platform, url, icon, active, order } = await request.json()

    // Verificar se já existe
    const existing = await prisma.socialLink.findUnique({
      where: { platform }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Esta rede social já existe' },
        { status: 400 }
      )
    }

    const socialLink = await prisma.socialLink.create({
      data: {
        platform,
        url,
        icon,
        active: active ?? true,
        order: order || 0,
      }
    })

    return NextResponse.json({ socialLink })
  } catch (error) {
    console.error('Erro ao criar rede social:', error)
    return NextResponse.json(
      { error: 'Erro ao criar rede social' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar rede social
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Se for array, é reordenação
    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        await prisma.socialLink.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      }
      return NextResponse.json({ success: true })
    }

    // Atualização de item único
    const { id, url, active } = body

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: { url, active }
    })

    return NextResponse.json({ socialLink })
  } catch (error) {
    console.error('Erro ao atualizar rede social:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar rede social' },
      { status: 500 }
    )
  }
}

// DELETE - Remover rede social
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID não informado' },
        { status: 400 }
      )
    }

    await prisma.socialLink.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover rede social:', error)
    return NextResponse.json(
      { error: 'Erro ao remover rede social' },
      { status: 500 }
    )
  }
}
