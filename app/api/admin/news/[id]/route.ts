import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const news = await prisma.news.findUnique({ where: { id: params.id } })
    if (!news) return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 })
    return NextResponse.json({ news })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar notícia' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const news = await prisma.news.update({
      where: { id: params.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.game !== undefined && { game: data.game }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.publishedAt !== undefined && { publishedAt: new Date(data.publishedAt) }),
      }
    })
    return NextResponse.json({ news })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.news.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
