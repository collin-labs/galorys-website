import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar configuração de email
export async function GET() {
  try {
    let config = await prisma.emailConfig.findFirst()
    
    if (!config) {
      config = await prisma.emailConfig.create({
        data: {
          provider: 'none',
          fromEmail: '',
          fromName: 'Galorys',
          isConfigured: false
        }
      })
    }

    // Não retornar senhas/keys completas por segurança
    return NextResponse.json({
      config: {
        ...config,
        resendApiKey: config.resendApiKey ? '••••••••' + config.resendApiKey.slice(-4) : '',
        sendgridApiKey: config.sendgridApiKey ? '••••••••' + config.sendgridApiKey.slice(-4) : '',
        smtpPass: config.smtpPass ? '••••••••' : ''
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar config de email:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Salvar configuração de email
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const existing = await prisma.emailConfig.findFirst()

    // Preparar dados - só atualizar senhas se não forem mascaradas
    const updateData: any = {
      provider: data.provider,
      fromEmail: data.fromEmail,
      fromName: data.fromName,
      smtpHost: data.smtpHost || null,
      smtpPort: data.smtpPort || null,
      smtpUser: data.smtpUser || null,
      smtpSecure: data.smtpSecure ?? true,
      isConfigured: data.provider !== 'none'
    }

    // Só atualizar keys se não estiverem mascaradas
    if (data.resendApiKey && !data.resendApiKey.startsWith('••••')) {
      updateData.resendApiKey = data.resendApiKey
    }
    if (data.sendgridApiKey && !data.sendgridApiKey.startsWith('••••')) {
      updateData.sendgridApiKey = data.sendgridApiKey
    }
    if (data.smtpPass && !data.smtpPass.startsWith('••••')) {
      updateData.smtpPass = data.smtpPass
    }

    let config
    if (existing) {
      config = await prisma.emailConfig.update({
        where: { id: existing.id },
        data: updateData
      })
    } else {
      config = await prisma.emailConfig.create({
        data: updateData
      })
    }

    return NextResponse.json({
      config: {
        ...config,
        resendApiKey: config.resendApiKey ? '••••••••' + config.resendApiKey.slice(-4) : '',
        sendgridApiKey: config.sendgridApiKey ? '••••••••' + config.sendgridApiKey.slice(-4) : '',
        smtpPass: config.smtpPass ? '••••••••' : ''
      }
    })
  } catch (error: any) {
    console.error('Erro ao salvar config de email:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
