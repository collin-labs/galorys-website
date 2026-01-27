import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar configuração de backup
export async function GET() {
  try {
    let config = await prisma.backupConfig.findFirst()
    
    // Se não existir, criar uma configuração padrão
    if (!config) {
      config = await prisma.backupConfig.create({
        data: {
          hostingType: 'vercel',
          storageType: 'local',
          autoBackup: false,
          frequency: 'daily',
          backupTime: '03:00',
          emailNotify: true,
          notifyEmail: '',
          backupDatabase: true,
          backupUploads: true,
          keepBackups: 7
        }
      })
    }

    return NextResponse.json({ config })
  } catch (error: any) {
    console.error('Erro ao buscar config de backup:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Salvar configuração de backup
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Verificar se já existe uma configuração
    const existing = await prisma.backupConfig.findFirst()

    // Preparar dados de atualização
    const updateData: any = {
      hostingType: data.hostingType,
      storageType: data.storageType,
      autoBackup: data.autoBackup,
      frequency: data.frequency,
      backupTime: data.backupTime,
      emailNotify: data.emailNotify,
      notifyEmail: data.notifyEmail || '',
      backupDatabase: data.backupDatabase,
      backupUploads: data.backupUploads,
      keepBackups: data.keepBackups
    }

    // Adicionar storageConfig se fornecido
    if (data.storageConfig) {
      updateData.storageConfig = data.storageConfig
    }

    let config
    if (existing) {
      config = await prisma.backupConfig.update({
        where: { id: existing.id },
        data: updateData
      })
    } else {
      config = await prisma.backupConfig.create({
        data: updateData
      })
    }

    // Não retornar credenciais sensíveis
    const safeConfig = {
      ...config,
      storageConfig: config.storageConfig ? '***configured***' : null
    }

    return NextResponse.json({ config: safeConfig })
  } catch (error: any) {
    console.error('Erro ao salvar config de backup:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
