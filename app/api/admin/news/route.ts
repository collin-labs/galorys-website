import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const news = await prisma.news.findMany({ orderBy: { publishedAt: 'desc' } })
    return NextResponse.json({ news })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar notícias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const news = await prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        image: data.image || null,
        category: data.category || null,
        game: data.game || null,
        author: data.author || null,
        featured: data.featured ?? false,
        active: data.active ?? true,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      }
    })
    return NextResponse.json({ news })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
