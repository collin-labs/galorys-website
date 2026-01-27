import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/contact - Enviar mensagem de contato
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validação
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar tamanho da mensagem
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'A mensagem deve ter pelo menos 10 caracteres' },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'A mensagem deve ter no máximo 5000 caracteres' },
        { status: 400 }
      )
    }

    // Salvar no banco
    const contact = await prisma.contact.create({
      data: {
        name,
        email: email.toLowerCase(),
        subject,
        message,
      },
    })

    // Em produção, poderia enviar email de notificação aqui
    // await sendNotificationEmail(contact)

    return NextResponse.json({
      message: 'Mensagem enviada com sucesso! Responderemos em até 48 horas.',
      id: contact.id,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar contato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}

// GET /api/contact - Listar mensagens (Admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const read = searchParams.get('read')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (read === 'true') where.read = true
    if (read === 'false') where.read = false

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const total = await prisma.contact.count({ where })
    const unreadCount = await prisma.contact.count({ where: { read: false } })

    return NextResponse.json({
      contacts,
      total,
      unreadCount,
    })
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
