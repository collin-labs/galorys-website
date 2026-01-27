import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Status do backup para o dashboard
export async function GET() {
  try {
    // Buscar último backup (com ou sem sucesso para debug)
    const lastBackupAny = await prisma.backupHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    // Buscar último backup com sucesso
    const lastBackup = await prisma.backupHistory.findFirst({
      where: { status: 'success' },
      orderBy: { createdAt: 'desc' }
    })

    // Buscar configurações de backup
    const backupConfig = await prisma.backupConfig.findFirst()

    // Buscar configurações de email do sistema
    const emailConfig = await prisma.emailConfig.findFirst()

    // Logs para debug
    console.log('=== STATUS DO BACKUP ===')
    console.log('Último backup (qualquer):', lastBackupAny?.id, lastBackupAny?.status, lastBackupAny?.createdAt)
    console.log('Último backup (sucesso):', lastBackup?.id, lastBackup?.status, lastBackup?.createdAt)
    console.log('Backup config:', backupConfig?.autoBackup, backupConfig?.emailNotify, backupConfig?.notifyEmail)
    console.log('Email config:', emailConfig?.isConfigured, emailConfig?.provider)
    console.log('========================')

    // Calcular dias desde último backup
    let daysAgo = null
    if (lastBackup) {
      const now = new Date()
      const backupDate = new Date(lastBackup.createdAt)
      const diffTime = Math.abs(now.getTime() - backupDate.getTime())
      daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    }

    // Verificar se email está configurado:
    // 1. Se tem email de notificação no backup config OU
    // 2. Se o sistema de email está configurado
    const hasNotifyEmail = !!(backupConfig?.notifyEmail && backupConfig.notifyEmail.length > 0)
    const hasSystemEmail = !!(emailConfig?.isConfigured && emailConfig.provider !== 'none')
    const emailConfigured = hasNotifyEmail || hasSystemEmail

    // Contar backups
    const totalBackups = await prisma.backupHistory.count()
    const successBackups = await prisma.backupHistory.count({ where: { status: 'success' } })
    const failedBackups = await prisma.backupHistory.count({ where: { status: 'failed' } })

    return NextResponse.json({
      lastBackup: lastBackup ? {
        id: lastBackup.id,
        date: lastBackup.createdAt,
        status: lastBackup.status,
        size: lastBackup.size,
        duration: lastBackup.duration,
        daysAgo
      } : null,
      config: backupConfig ? {
        autoBackup: backupConfig.autoBackup,
        frequency: backupConfig.frequency,
        backupTime: backupConfig.backupTime,
        emailNotify: backupConfig.emailNotify,
        notifyEmail: backupConfig.notifyEmail,
        storageType: backupConfig.storageType,
        hostingType: backupConfig.hostingType,
        keepBackups: backupConfig.keepBackups,
        isConfigured: true
      } : {
        autoBackup: false,
        frequency: 'daily',
        backupTime: '03:00',
        emailNotify: false,
        notifyEmail: null,
        storageType: 'local',
        hostingType: 'vercel',
        keepBackups: 7,
        isConfigured: false
      },
      emailConfigured,
      stats: {
        total: totalBackups,
        success: successBackups,
        failed: failedBackups
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar status do backup:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
