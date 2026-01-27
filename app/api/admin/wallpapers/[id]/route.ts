import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const wallpaper = await prisma.wallpaper.findUnique({ where: { id: params.id } })
    if (!wallpaper) return NextResponse.json({ error: 'Wallpaper não encontrado' }, { status: 404 })
    return NextResponse.json({ wallpaper })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar wallpaper' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const wallpaper = await prisma.wallpaper.update({
      where: { id: params.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.active !== undefined && { active: data.active }),
      }
    })
    return NextResponse.json({ wallpaper })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.wallpaper.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
