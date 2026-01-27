import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { copyFile, mkdir, readdir, stat } from 'fs/promises'
import path from 'path'
import { execSync } from 'child_process'
import { sendEmail, getBackupNotificationTemplate } from '@/lib/email'
import { uploadToDrive, cleanOldDriveBackups } from '@/lib/google-drive'

// Chave secreta para proteger o endpoint (defina no .env)
const CRON_SECRET = process.env.CRON_SECRET || 'galorys-backup-secret-2024'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

// GET - Executar backup automático (chamado pelo Vercel Cron)
export async function GET(request: NextRequest) {
  // Verificar autorização
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  let backupRecord = null
  let config = null

  try {
    // Buscar configurações
    config = await prisma.backupConfig.findFirst()
    
    // Verificar se backup automático está ativado
    if (!config?.autoBackup) {
      return NextResponse.json({ 
        success: false, 
        message: 'Backup automático desativado' 
      })
    }

    // Verificar frequência (simplificado - em produção, usar lógica mais robusta)
    const lastBackup = await prisma.backupHistory.findFirst({
      where: { type: 'auto', status: 'success' },
      orderBy: { createdAt: 'desc' }
    })

    if (lastBackup) {
      const hoursSinceLastBackup = (Date.now() - lastBackup.createdAt.getTime()) / (1000 * 60 * 60)
      
      const minHours = {
        daily: 20,    // Pelo menos 20 horas desde o último
        weekly: 144,  // ~6 dias
        monthly: 672  // ~28 dias
      }[config.frequency] || 20

      if (hoursSinceLastBackup < minHours) {
        return NextResponse.json({ 
          success: false, 
          message: `Backup não necessário ainda (último há ${Math.round(hoursSinceLastBackup)}h)` 
        })
      }
    }

    // Criar registro no histórico
    backupRecord = await prisma.backupHistory.create({
      data: {
        type: 'auto',
        status: 'in_progress',
        details: JSON.stringify({ started: new Date().toISOString() })
      }
    })

    // Criar pasta de backups
    const backupDir = path.join(process.cwd(), 'backups')
    await mkdir(backupDir, { recursive: true })

    // Nome do arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupName = `backup_auto_${timestamp}`
    const backupPath = path.join(backupDir, backupName)
    await mkdir(backupPath, { recursive: true })

    let totalSize = 0

    // Backup do banco
    if (config.backupDatabase) {
      const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
      const dbBackupPath = path.join(backupPath, 'database.db')
      try {
        await copyFile(dbPath, dbBackupPath)
        const dbStats = await stat(dbBackupPath)
        totalSize += dbStats.size
      } catch (e) {
        console.error('Erro ao copiar banco:', e)
      }
    }

    // Backup de uploads
    if (config.backupUploads) {
      const uploadsDir = path.join(process.cwd(), 'public', 'images')
      const uploadsBackupDir = path.join(backupPath, 'uploads')
      try {
        await copyDirectory(uploadsDir, uploadsBackupDir)
        const uploadsSize = await getDirectorySize(uploadsBackupDir)
        totalSize += uploadsSize
      } catch (e) {
        console.error('Erro ao copiar uploads:', e)
      }
    }

    // Criar ZIP
    const zipPath = `${backupPath}.zip`
    try {
      execSync(`cd "${backupDir}" && zip -r "${backupName}.zip" "${backupName}"`, { stdio: 'ignore' })
      execSync(`rm -rf "${backupPath}"`, { stdio: 'ignore' })
      const zipStats = await stat(zipPath)
      totalSize = zipStats.size
    } catch (e) {
      console.error('Erro ao criar ZIP:', e)
    }

    const duration = Math.round((Date.now() - startTime) / 1000)

    let storageUrl = null
    let driveFileId = null

    // Upload para Google Drive
    if (config.storageType === 'google_drive' && config.storageConfig) {
      try {
        const storageConfig = JSON.parse(config.storageConfig)
        if (storageConfig.credentials && storageConfig.folderId) {
          const driveResult = await uploadToDrive(
            zipPath,
            `${backupName}.zip`,
            {
              credentials: storageConfig.credentials,
              folderId: storageConfig.folderId
            }
          )

          if (driveResult.success) {
            storageUrl = driveResult.webViewLink || null
            driveFileId = driveResult.fileId || null

            await cleanOldDriveBackups(
              {
                credentials: storageConfig.credentials,
                folderId: storageConfig.folderId
              },
              config.keepBackups
            )
          }
        }
      } catch (driveError) {
        console.error('Erro no upload para Drive:', driveError)
      }
    }

    // Atualizar registro de sucesso
    await prisma.backupHistory.update({
      where: { id: backupRecord.id },
      data: {
        status: 'success',
        size: totalSize,
        duration,
        filePath: `backups/${backupName}.zip`,
        storageUrl,
        details: JSON.stringify({
          started: new Date(startTime).toISOString(),
          completed: new Date().toISOString(),
          driveFileId,
          uploadedToDrive: !!storageUrl
        })
      }
    })

    // Limpar backups locais antigos
    await cleanOldLocalBackups(config.keepBackups)

    // Enviar email de notificação
    if (config.emailNotify) {
      const notifyEmail = config.notifyEmail || 'contato@galorys.com'
      const template = getBackupNotificationTemplate({
        status: 'success',
        type: 'auto',
        size: formatSize(totalSize),
        duration: formatDuration(duration),
        date: new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })
      })
      
      sendEmail({
        to: notifyEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      }).catch(err => console.error('Erro ao enviar email:', err))
    }

    return NextResponse.json({ 
      success: true, 
      backup: {
        id: backupRecord.id,
        size: totalSize,
        duration,
        uploadedToDrive: !!storageUrl
      }
    })
  } catch (error: any) {
    console.error('Erro no backup automático:', error)

    const duration = Math.round((Date.now() - startTime) / 1000)

    if (backupRecord) {
      await prisma.backupHistory.update({
        where: { id: backupRecord.id },
        data: {
          status: 'failed',
          error: error.message,
          duration
        }
      })
    }

    // Enviar email de falha
    if (config?.emailNotify) {
      const notifyEmail = config.notifyEmail || 'contato@galorys.com'
      const template = getBackupNotificationTemplate({
        status: 'failed',
        type: 'auto',
        error: error.message,
        date: new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })
      })
      
      sendEmail({
        to: notifyEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      }).catch(err => console.error('Erro ao enviar email:', err))
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Funções auxiliares
async function copyDirectory(src: string, dest: string) {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      await copyFile(srcPath, destPath)
    }
  }
}

async function getDirectorySize(dir: string): Promise<number> {
  let totalSize = 0
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        totalSize += await getDirectorySize(fullPath)
      } else {
        const stats = await stat(fullPath)
        totalSize += stats.size
      }
    }
  } catch (e) {}
  return totalSize
}

async function cleanOldLocalBackups(keepCount: number) {
  try {
    const backups = await prisma.backupHistory.findMany({
      where: { status: 'success' },
      orderBy: { createdAt: 'desc' }
    })

    const toDelete = backups.slice(keepCount)
    
    for (const backup of toDelete) {
      if (backup.filePath) {
        try {
          const fullPath = path.join(process.cwd(), backup.filePath)
          execSync(`rm -f "${fullPath}"`, { stdio: 'ignore' })
        } catch (e) {}
      }
      await prisma.backupHistory.delete({ where: { id: backup.id } })
    }
  } catch (e) {
    console.error('Erro ao limpar backups:', e)
  }
}
