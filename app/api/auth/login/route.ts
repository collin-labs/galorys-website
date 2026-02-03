import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { createAdminToken, validateAdminSession, checkRateLimit, resetRateLimit } from '@/lib/jwt'

// ============================================
// POST - LOGIN COM JWT SEGURO
// ============================================
export async function POST(request: NextRequest) {
  try {
    // Pegar IP para rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // ============================================
    // RATE LIMITING - Proteção contra brute force
    // ============================================
    const rateLimitKey = `login:${ip}:${email}`
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
      const resetInSeconds = Math.ceil(rateLimit.resetIn / 1000)
      return NextResponse.json(
        { 
          error: `Muitas tentativas. Aguarde ${resetInSeconds} segundos.`,
          retryAfter: resetInSeconds
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(resetInSeconds)
          }
        }
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

    // ============================================
    // LOGIN BEM SUCEDIDO - Criar JWT assinado
    // ============================================
    
    // Resetar rate limit após sucesso
    resetRateLimit(rateLimitKey)

    // Criar token JWT assinado
    const token = await createAdminToken({
      id: user.id,
      email: user.email!,
      name: user.name,
      role: user.role,
    })

    // Definir cookie seguro
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    })

    // Log de login bem sucedido (para auditoria)
    console.log(`[AUTH] Login bem sucedido: ${user.email} (IP: ${ip})`)

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

// ============================================
// DELETE - LOGOUT
// ============================================
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

// ============================================
// GET - VERIFICAR SESSÃO (COM VALIDAÇÃO NO BANCO)
// ============================================
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

    // Validar sessão completa (JWT + banco de dados)
    const validation = await validateAdminSession(session.value)

    if (!validation.valid) {
      // Limpar cookie inválido
      cookieStore.delete('admin_session')
      return NextResponse.json(
        { authenticated: false, error: validation.error },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: validation.user
    })
  } catch (error) {
    console.error('Erro ao verificar sessão:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
