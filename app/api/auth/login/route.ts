import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      )
    }

    // Verificar se está banido
    if (user.banned) {
      return NextResponse.json(
        { error: 'Conta suspensa' },
        { status: 403 }
      )
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Criar sessão simples (token = id do usuário + timestamp + random)
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
      })
    ).toString('base64')

    // Definir cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error: any) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}

// GET - Verificar sessão
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    try {
      const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString())
      
      // Verificar expiração
      if (decoded.exp < Date.now()) {
        cookieStore.delete('admin_session')
        return NextResponse.json(
          { authenticated: false, error: 'Sessão expirada' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        }
      })
    } catch {
      cookieStore.delete('admin_session')
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
