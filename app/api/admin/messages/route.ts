import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar mensagens com filtros avançados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // inbox, starred, archived, trash, all
    const label = searchParams.get('label')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const where: any = {}

    // Filtros principais
    switch (filter) {
      case 'inbox':
        where.archived = false
        where.deleted = false
        break
      case 'starred':
        where.starred = true
        where.deleted = false
        break
      case 'archived':
        where.archived = true
        where.deleted = false
        break
      case 'trash':
        where.deleted = true
        break
      case 'all':
      default:
        where.deleted = false
        break
    }

    // Filtro por etiqueta
    if (label && label !== 'all') {
      where.label = label
    }

    // Filtro por status
    if (status && status !== 'all') {
      where.status = status
    }

    // Busca por texto
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    const messages = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Estatísticas
    const stats = await prisma.contact.groupBy({
      by: ['read', 'starred', 'archived', 'deleted', 'label'],
      _count: true,
    })

    const totalMessages = await prisma.contact.count({ where: { deleted: false } })
    const unreadCount = await prisma.contact.count({ where: { read: false, deleted: false, archived: false } })
    const starredCount = await prisma.contact.count({ where: { starred: true, deleted: false } })
    const archivedCount = await prisma.contact.count({ where: { archived: true, deleted: false } })
    const trashCount = await prisma.contact.count({ where: { deleted: true } })
    const todayCount = await prisma.contact.count({
      where: {
        deleted: false,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
    const weekCount = await prisma.contact.count({
      where: {
        deleted: false,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    // Contagem por etiqueta
    const labelCounts = await prisma.contact.groupBy({
      by: ['label'],
      where: { deleted: false, archived: false },
      _count: true,
    })

    return NextResponse.json({
      messages,
      stats: {
        total: totalMessages,
        unread: unreadCount,
        starred: starredCount,
        archived: archivedCount,
        trash: trashCount,
        today: todayCount,
        week: weekCount,
        byLabel: labelCounts.reduce((acc: any, item) => {
          if (item.label) acc[item.label] = item._count
          return acc
        }, {}),
      }
    })
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar mensagem (múltiplas ações)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ids, action, value, label, notes, status } = body

    // Ação em lote
    if (ids && Array.isArray(ids) && ids.length > 0) {
      let updateData: any = {}

      switch (action) {
        case 'read':
          updateData.read = true
          updateData.status = 'read'
          break
        case 'unread':
          updateData.read = false
          updateData.status = 'unread'
          break
        case 'star':
          updateData.starred = true
          break
        case 'unstar':
          updateData.starred = false
          break
        case 'archive':
          updateData.archived = true
          updateData.status = 'archived'
          break
        case 'unarchive':
          updateData.archived = false
          updateData.status = 'read'
          break
        case 'trash':
          updateData.deleted = true
          updateData.deletedAt = new Date()
          break
        case 'restore':
          updateData.deleted = false
          updateData.deletedAt = null
          break
        case 'label':
          updateData.label = value
          break
      }

      await prisma.contact.updateMany({
        where: { id: { in: ids } },
        data: updateData,
      })

      return NextResponse.json({ success: true, updated: ids.length })
    }

    // Ação individual
    if (!id) {
      return NextResponse.json(
        { error: 'ID não informado' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    if (action) {
      switch (action) {
        case 'read':
          updateData.read = true
          updateData.status = 'read'
          break
        case 'unread':
          updateData.read = false
          updateData.status = 'unread'
          break
        case 'star':
          updateData.starred = true
          break
        case 'unstar':
          updateData.starred = false
          break
        case 'archive':
          updateData.archived = true
          updateData.status = 'archived'
          break
        case 'unarchive':
          updateData.archived = false
          updateData.status = 'read'
          break
        case 'trash':
          updateData.deleted = true
          updateData.deletedAt = new Date()
          break
        case 'restore':
          updateData.deleted = false
          updateData.deletedAt = null
          break
        case 'reply':
          updateData.status = 'replied'
          break
      }
    }

    // Campos individuais
    if (label !== undefined) updateData.label = label
    if (notes !== undefined) updateData.notes = notes
    if (status !== undefined) updateData.status = status
    if (value !== undefined && action === 'read') updateData.read = value

    const message = await prisma.contact.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar mensagem' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir mensagem permanentemente ou esvaziar lixeira
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    // Esvaziar lixeira
    if (action === 'empty-trash') {
      const result = await prisma.contact.deleteMany({
        where: { deleted: true }
      })
      return NextResponse.json({ success: true, deleted: result.count })
    }

    // Excluir permanentemente mensagens com mais de 30 dias na lixeira
    if (action === 'cleanup') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const result = await prisma.contact.deleteMany({
        where: {
          deleted: true,
          deletedAt: { lt: thirtyDaysAgo }
        }
      })
      return NextResponse.json({ success: true, deleted: result.count })
    }

    // Excluir mensagem específica
    if (!id) {
      return NextResponse.json(
        { error: 'ID não informado' },
        { status: 400 }
      )
    }

    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir mensagem' },
      { status: 500 }
    )
  }
}

// POST - Exportar mensagens para CSV
export async function POST(request: NextRequest) {
  try {
    const { action, filter } = await request.json()

    if (action === 'export') {
      const where: any = { deleted: false }
      if (filter === 'archived') where.archived = true

      const messages = await prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })

      // Gerar CSV
      const headers = ['ID', 'Nome', 'Email', 'Assunto', 'Mensagem', 'Etiqueta', 'Status', 'Data']
      const rows = messages.map(m => [
        m.id,
        m.name,
        m.email,
        m.subject,
        m.message.replace(/"/g, '""'),
        m.label || '',
        m.status,
        new Date(m.createdAt).toLocaleString('pt-BR'),
      ])

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="mensagens-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
