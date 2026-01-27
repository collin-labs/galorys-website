import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, getPasswordResetTemplate } from '@/lib/email'
import crypto from 'crypto'

// POST - Solicitar recuperação de senha
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email não fornecido' }, { status: 400 })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Sempre retornar sucesso (por segurança, não revelar se email existe)
    if (!user || user.role !== 'ADMIN') {
      // Simular delay para não revelar se email existe
      await new Promise(resolve => setTimeout(resolve, 1000))
      return NextResponse.json({ success: true })
    }

    // Gerar token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Invalidar tokens anteriores
    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true }
    })

    // Criar novo token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    })

    // Montar URL de reset
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/admin/login/nova-senha?token=${token}`

    // Enviar email
    const template = getPasswordResetTemplate(resetUrl, user.name || 'Usuário')
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    if (!result.success) {
      console.error('Erro ao enviar email de recuperação:', result.error)
      // Não revelar erro ao usuário
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro na recuperação de senha:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
