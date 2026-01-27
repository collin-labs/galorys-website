import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    const users = await prisma.user.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ]
          } : {},
          role && role !== 'all' ? { role } : {},
          status === 'banned' ? { banned: true } : {},
          status === 'active' ? { banned: false } : {},
        ]
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        banned: true,
        createdAt: true,
        image: true,
      }
    })

    // Estatísticas
    const total = await prisma.user.count()
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } })
    const banned = await prisma.user.count({ where: { banned: true } })

    return NextResponse.json({ 
      users,
      stats: { total, admins, banned }
    })
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json({ error: error.message || 'Erro ao buscar usuários' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Verificar se email já existe
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } })
      if (existing) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
      }
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || 'USER',
        points: data.points || 0,
      }
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ error: error.message || 'Erro ao criar usuário' }, { status: 500 })
  }
}
