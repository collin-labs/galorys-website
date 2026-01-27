import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const wallpapers = await prisma.wallpaper.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ wallpapers })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar wallpapers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const wallpaper = await prisma.wallpaper.create({
      data: {
        title: data.title,
        image: data.image,
        thumbnail: data.thumbnail || data.image,
        category: data.category || null,
        downloads: 0,
        active: data.active ?? true,
      }
    })
    return NextResponse.json({ wallpaper })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
