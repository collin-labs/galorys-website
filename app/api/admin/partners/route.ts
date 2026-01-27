import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ partners })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar parceiros' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        logo: data.logo || null,
        website: data.website || null,
        order: data.order ?? 0,
        active: data.active ?? true,
      }
    })
    return NextResponse.json({ partner })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
