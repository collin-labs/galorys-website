import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ banners })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar banners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        image: data.image,
        link: data.link || null,
        order: data.order ?? 0,
        active: data.active ?? true,
      }
    })
    return NextResponse.json({ banner })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
