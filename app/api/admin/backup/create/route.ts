import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { copyFile, mkdir, readdir, stat, rm } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { sendEmail, getBackupNotificationTemplate } from '@/lib/email'
import { uploadToB2, cleanOldB2Backups } from '@/lib/backblaze-b2'

// Detectar sistema operacional
const isWindows = process.platform === 'win32'

// Formatar tamanho
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Formatar duração
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

// Função para criar ZIP (compatível Windows e Linux)
async function createZip(sourcePath: string, zipPath: string): Promise<boolean> {
  console.log(`Criando ZIP: ${sourcePath} -> ${zipPath}`)
  console.log(`Sistema: ${isWindows ? 'Windows' : 'Linux/Mac'}`)
  
  try {
    if (isWindows) {
      // Windows: usar PowerShell Compress-Archive
      const psCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${sourcePath}\\*' -DestinationPath '${zipPath}' -Force"`
      console.log('Comando PowerShell:', psCommand)
      execSync(psCommand, { stdio: 'pipe', timeout: 300000 }) // 5 min timeout
    } else {
      // Linux/Mac: usar zip
      const parentDir = path.dirname(sourcePath)
      const folderName = path.basename(sourcePath)
      execSync(`cd "${parentDir}" && zip -r "${zipPath}" "${folderName}"`, { stdio: 'pipe', timeout: 300000 })
    }
    
    // Verificar se ZIP foi criado
    if (existsSync(zipPath)) {
      const zipStats = await stat(zipPath)
      console.log(`✅ ZIP criado com sucesso: ${formatSize(zipStats.size)}`)
      return true
    } else {
      console.error('❌ ZIP não foi criado')
      return false
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar ZIP:', error.message)
    return false
  }
}

// Função para remover pasta (compatível Windows e Linux)
async function removeFolder(folderPath: string): Promise<void> {
  try {
    await rm(folderPath, { recursive: true, force: true })
    console.log(`✅ Pasta removida: ${folderPath}`)
  } catch (error: any) {
    console.error(`⚠️ Erro ao remover pasta: ${error.message}`)
  }
}

// Copiar diretório recursivamente
async function copyDirectory(src: string, dest: string): Promise<void> {
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

// Calcular tamanho do diretório
async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      
      if (entry.isDirectory()) {
        totalSize += await getDirectorySize(fullPath)
      } else {
        const stats = await stat(fullPath)
        totalSize += stats.size
      }
    }
  } catch (e) {
    // Ignora erros
  }
  
  return totalSize
}

// POST - Criar backup
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let backupRecord = null
  let config = null

  console.log('='.repeat(50))
  console.log('=== INICIANDO BACKUP ===')
  console.log(`Sistema operacional: ${isWindows ? 'Windows' : 'Linux/Mac'}`)
  console.log(`Diretório de trabalho: ${process.cwd()}`)
  console.log('='.repeat(50))

  try {
    const { type = 'manual' } = await request.json()

    // Buscar configurações
    config = await prisma.backupConfig.findFirst()
    
    // Criar registro no histórico
    backupRecord = await prisma.backupHistory.create({
      data: {
        type,
        status: 'in_progress',
        details: JSON.stringify({ started: new Date().toISOString() })
      }
    })

    // Criar pasta de backups se não existir
    const backupDir = path.join(process.cwd(), 'backups')
    await mkdir(backupDir, { recursive: true })

    // Nome do arquivo de backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupName = `backup_${timestamp}`
    const backupPath = path.join(backupDir, backupName)
    const zipPath = `${backupPath}.zip`
    
    await mkdir(backupPath, { recursive: true })

    console.log(`Pasta temporária: ${backupPath}`)
    console.log(`Arquivo ZIP final: ${zipPath}`)

    let totalSize = 0
    let dbBackupSuccess = false
    let uploadsBackupSuccess = false
    let dbError = null
    let uploadsError = null

    // Backup do banco de dados (SQLite)
    const shouldBackupDb = !config || config.backupDatabase !== false
    if (shouldBackupDb) {
      const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
      const dbBackupPath = path.join(backupPath, 'database.db')
      
      console.log('\n--- Backup do Banco de Dados ---')
      console.log(`Origem: ${dbPath}`)
      console.log(`Destino: ${dbBackupPath}`)
      
      try {
        if (!existsSync(dbPath)) {
          throw new Error('Banco de dados não encontrado')
        }
        
        const dbStats = await stat(dbPath)
        console.log(`Tamanho do banco: ${formatSize(dbStats.size)}`)
        
        // Tentar usar sqlite3 .backup primeiro (mais seguro)
        let usedSqlite = false
        if (!isWindows) {
          try {
            execSync(`sqlite3 "${dbPath}" ".backup '${dbBackupPath}'"`, { stdio: 'pipe' })
            usedSqlite = true
            console.log('✅ Backup via sqlite3 .backup')
          } catch {
            // Fallback para cópia
          }
        }
        
        if (!usedSqlite) {
          await copyFile(dbPath, dbBackupPath)
          console.log('✅ Backup via cópia de arquivo')
        }
        
        const backupStats = await stat(dbBackupPath)
        totalSize += backupStats.size
        dbBackupSuccess = true
        console.log(`✅ Banco copiado: ${formatSize(backupStats.size)}`)
      } catch (e: any) {
        dbError = e.message
        console.error('❌ Erro no backup do banco:', e.message)
      }
    } else {
      console.log('\n--- Backup do Banco: DESABILITADO ---')
    }

    // Backup de uploads (imagens)
    const shouldBackupUploads = config?.backupUploads === true
    if (shouldBackupUploads) {
      const uploadsDir = path.join(process.cwd(), 'public', 'images')
      const uploadsBackupDir = path.join(backupPath, 'uploads')
      
      console.log('\n--- Backup de Imagens ---')
      console.log(`Origem: ${uploadsDir}`)
      console.log(`Destino: ${uploadsBackupDir}`)
      
      try {
        if (!existsSync(uploadsDir)) {
          throw new Error('Pasta de uploads não encontrada')
        }
        
        await copyDirectory(uploadsDir, uploadsBackupDir)
        const uploadsSize = await getDirectorySize(uploadsBackupDir)
        totalSize += uploadsSize
        uploadsBackupSuccess = true
        console.log(`✅ Uploads copiados: ${formatSize(uploadsSize)}`)
      } catch (e: any) {
        uploadsError = e.message
        console.error('❌ Erro no backup de uploads:', e.message)
      }
    } else {
      console.log('\n--- Backup de Imagens: DESABILITADO ---')
    }

    // Criar arquivo ZIP
    console.log('\n--- Criando ZIP ---')
    const zipCreated = await createZip(backupPath, zipPath)
    
    if (zipCreated) {
      // Remover pasta temporária após criar o ZIP
      await removeFolder(backupPath)
      
      // Atualizar tamanho com o ZIP
      const zipStats = await stat(zipPath)
      totalSize = zipStats.size
      console.log(`✅ Tamanho final do ZIP: ${formatSize(totalSize)}`)
    } else {
      console.error('⚠️ ZIP não foi criado - mantendo pasta de backup')
    }

    const duration = Math.round((Date.now() - startTime) / 1000)

    let storageUrl = null
    let cloudFileId = null

    // Upload para Backblaze B2 (se configurado)
    if (config?.storageType === 'backblaze_b2') {
      try {
        // Usar credenciais do .env
        const applicationKeyId = process.env.BACKBLAZE_KEY_ID
        const applicationKey = process.env.BACKBLAZE_APP_KEY
        const bucketId = process.env.BACKBLAZE_BUCKET_ID
        const bucketName = process.env.BACKBLAZE_BUCKET_NAME

        if (applicationKeyId && applicationKey && bucketId) {
          console.log('\n--- Upload para Backblaze B2 ---')
          
          // Verificar qual arquivo enviar (ZIP ou pasta)
          const fileToUpload = existsSync(zipPath) ? zipPath : backupPath
          const fileName = existsSync(zipPath) ? `${backupName}.zip` : backupName
          
          console.log(`Enviando: ${fileName}`)
          console.log(`Para bucket: ${bucketName || bucketId}`)
          
          const b2Result = await uploadToB2(
            fileToUpload,
            fileName,
            {
              applicationKeyId,
              applicationKey,
              bucketId,
              bucketName
            }
          )

          if (b2Result.success) {
            storageUrl = b2Result.fileUrl || null
            cloudFileId = b2Result.fileId || null
            console.log('✅ Upload para Backblaze B2 concluído:', storageUrl)

            // Limpar backups antigos do B2
            await cleanOldB2Backups(
              {
                applicationKeyId,
                applicationKey,
                bucketId,
                bucketName
              },
              config.keepBackups
            )
          } else {
            console.error('❌ Erro no upload para B2:', b2Result.error)
          }
        } else {
          console.error('❌ Credenciais do Backblaze B2 não configuradas')
          console.log('Configure no .env: BACKBLAZE_KEY_ID, BACKBLAZE_APP_KEY, BACKBLAZE_BUCKET_ID')
        }
      } catch (b2Error) {
        console.error('❌ Erro ao processar upload para B2:', b2Error)
      }
    }

    // Determinar o caminho final salvo no banco
    const finalFilePath = existsSync(zipPath) 
      ? `backups/${backupName}.zip`
      : `backups/${backupName}`

    // Atualizar registro de sucesso
    await prisma.backupHistory.update({
      where: { id: backupRecord.id },
      data: {
        status: 'success',
        size: totalSize,
        duration,
        filePath: finalFilePath,
        storageUrl,
        details: JSON.stringify({
          started: new Date(startTime).toISOString(),
          completed: new Date().toISOString(),
          isZip: existsSync(zipPath),
          database: {
            included: shouldBackupDb,
            success: dbBackupSuccess,
            error: dbError
          },
          uploads: {
            included: shouldBackupUploads,
            success: uploadsBackupSuccess,
            error: uploadsError
          },
          cloudFileId,
          uploadedToCloud: !!storageUrl,
          system: isWindows ? 'windows' : 'linux'
        })
      }
    })

    console.log('\n' + '='.repeat(50))
    console.log('=== BACKUP CONCLUÍDO ===')
    console.log(`Duração: ${formatDuration(duration)}`)
    console.log(`Tamanho: ${formatSize(totalSize)}`)
    console.log(`Arquivo: ${finalFilePath}`)
    console.log(`ZIP criado: ${existsSync(zipPath) ? 'SIM' : 'NÃO (pasta mantida)'}`)
    console.log('='.repeat(50))

    // Limpar backups antigos locais
    if (config?.keepBackups) {
      try {
        const backups = await prisma.backupHistory.findMany({
          where: { status: 'success' },
          orderBy: { createdAt: 'desc' }
        })

        if (backups.length > config.keepBackups) {
          const toDelete = backups.slice(config.keepBackups)
          
          for (const old of toDelete) {
            if (old.filePath) {
              const oldPath = path.join(process.cwd(), old.filePath)
              if (existsSync(oldPath)) {
                await rm(oldPath, { recursive: true, force: true })
                console.log(`🗑️ Backup antigo removido: ${old.filePath}`)
              }
            }
            await prisma.backupHistory.delete({ where: { id: old.id } })
          }
        }
      } catch (cleanupError) {
        console.error('Erro ao limpar backups antigos:', cleanupError)
      }
    }

    // Enviar email de notificação (se configurado)
    if (config?.emailNotify && config?.notifyEmail) {
      try {
        const template = getBackupNotificationTemplate({
          type,
          status: 'success',
          size: formatSize(totalSize),
          duration: formatDuration(duration),
          date: new Date().toLocaleDateString('pt-BR'),
          time: new Date().toLocaleTimeString('pt-BR')
        })
        
        await sendEmail({
          to: config.notifyEmail,
          subject: template.subject,
          html: template.html
        })
        console.log('📧 Email de notificação enviado')
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Backup criado com sucesso!',
      backup: {
        id: backupRecord.id,
        type,
        size: totalSize,
        sizeFormatted: formatSize(totalSize),
        duration,
        durationFormatted: formatDuration(duration),
        filePath: finalFilePath,
        isZip: existsSync(zipPath),
        storageUrl,
        database: { included: shouldBackupDb, success: dbBackupSuccess },
        uploads: { included: shouldBackupUploads, success: uploadsBackupSuccess }
      }
    })

  } catch (error: any) {
    console.error('\n❌ ERRO NO BACKUP:', error)

    // Atualizar registro com erro
    if (backupRecord) {
      await prisma.backupHistory.update({
        where: { id: backupRecord.id },
        data: {
          status: 'failed',
          error: error.message,
          duration: Math.round((Date.now() - startTime) / 1000)
        }
      })
    }

    // Enviar email de erro
    if (config?.emailNotify && config?.notifyEmail) {
      try {
        const template = getBackupNotificationTemplate({
          type: 'manual',
          status: 'failed',
          error: error.message,
          date: new Date().toLocaleDateString('pt-BR'),
          time: new Date().toLocaleTimeString('pt-BR')
        })
        
        await sendEmail({
          to: config.notifyEmail,
          subject: template.subject,
          html: template.html
        })
      } catch (emailError) {
        console.error('Erro ao enviar email de erro:', emailError)
      }
    }

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
