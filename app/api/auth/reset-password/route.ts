import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST - Redefinir senha
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token e senha são obrigatórios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter no mínimo 6 caracteres' }, { status: 400 })
    }

    // Buscar token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'Este link já foi utilizado' }, { status: 400 })
    }

    if (resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Link expirado. Solicite um novo.' }, { status: 400 })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Marcar token como usado
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// GET - Verificar se token é válido
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token não fornecido' })
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json({ valid: false, error: 'Token inválido' })
    }

    if (resetToken.used) {
      return NextResponse.json({ valid: false, error: 'Este link já foi utilizado' })
    }

    if (resetToken.expires < new Date()) {
      return NextResponse.json({ valid: false, error: 'Link expirado' })
    }

    return NextResponse.json({ valid: true })
  } catch (error: any) {
    console.error('Erro ao verificar token:', error)
    return NextResponse.json({ valid: false, error: 'Erro interno' })
  }
}
