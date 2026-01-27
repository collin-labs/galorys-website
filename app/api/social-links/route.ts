import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/social-links - Listar redes sociais ativas
export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ socialLinks })
  } catch (error) {
    console.error('Erro ao buscar redes sociais:', error)
    return NextResponse.json({ socialLinks: [] })
  }
}
