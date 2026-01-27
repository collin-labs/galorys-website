import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readdir, stat, copyFile, mkdir, rm } from 'fs/promises'
import { existsSync, statSync } from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const isWindows = process.platform === 'win32'

// Função para encontrar o backup (ZIP ou pasta)
function findBackup(filePath: string): { path: string; isZip: boolean; isDirectory: boolean } | null {
  const cwd = process.cwd()
  const normalizedPath = filePath.replace(/\\/g, '/')
  const fileName = path.basename(normalizedPath)
  const fileNameWithoutZip = fileName.replace('.zip', '')
  
  const pathsToTry = [
    path.join(cwd, 'backups', fileName),
    path.join(cwd, 'backups', fileNameWithoutZip),
    path.join(cwd, normalizedPath),
    path.join(cwd, filePath),
    filePath,
    normalizedPath,
  ]

  for (const p of pathsToTry) {
    if (existsSync(p)) {
      const stats = statSync(p)
      return { 
        path: p, 
        isZip: p.endsWith('.zip'),
        isDirectory: stats.isDirectory()
      }
    }
  }

  return null
}

// GET - Listar backups disponíveis para restauração
export async function GET() {
  try {
    const cwd = process.cwd()
    const backupDir = path.join(cwd, 'backups')
    const backups: Array<{
      id: string | null
      fileName: string
      filePath: string
      size: number
      date: string
      source: 'database' | 'filesystem'
      status: string | null
      fileExists: boolean
      isDirectory: boolean
    }> = []

    console.log('=== LISTANDO BACKUPS PARA RESTAURAÇÃO ===')
    console.log('cwd:', cwd)
    console.log('backupDir:', backupDir)

    // 1. Buscar backups do banco de dados
    const dbBackups = await prisma.backupHistory.findMany({
      where: { status: 'success' },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    console.log('Backups no banco:', dbBackups.length)

    const addedFiles = new Set<string>()

    for (const backup of dbBackups) {
      if (backup.filePath) {
        const found = findBackup(backup.filePath)
        const fileExists = !!found
        const fileName = path.basename(backup.filePath).replace('.zip', '')
        
        if (!addedFiles.has(fileName)) {
          addedFiles.add(fileName)
          
          backups.push({
            id: backup.id,
            fileName: path.basename(backup.filePath),
            filePath: found?.path || path.join(cwd, backup.filePath),
            size: backup.size || 0,
            date: backup.createdAt.toISOString(),
            source: 'database',
            status: backup.status,
            fileExists,
            isDirectory: found?.isDirectory || false
          })
          
          console.log(`  ${backup.filePath} -> ${fileExists ? '✅' : '❌'} ${found?.isDirectory ? '(pasta)' : '(zip)'}`)
        }
      }
    }

    // 2. Buscar backups do sistema de arquivos que não estão no banco
    if (existsSync(backupDir)) {
      try {
        const files = await readdir(backupDir)
        
        for (const file of files) {
          // Ignorar pasta safety
          if (file === 'safety') continue
          
          const filePath = path.join(backupDir, file)
          const fileName = file.replace('.zip', '')
          
          // Verificar se já foi adicionado
          if (addedFiles.has(fileName)) continue
          
          try {
            const fileStat = await stat(filePath)
            addedFiles.add(fileName)
            
            backups.push({
              id: null,
              fileName: file,
              filePath: filePath,
              size: fileStat.isDirectory() ? 0 : fileStat.size,
              date: fileStat.mtime.toISOString(),
              source: 'filesystem',
              status: null,
              fileExists: true,
              isDirectory: fileStat.isDirectory()
            })
            
            console.log(`  ${file} -> ✅ (filesystem) ${fileStat.isDirectory() ? '(pasta)' : '(zip)'}`)
          } catch (e) {
            // Ignorar erros
          }
        }
      } catch (e) {
        console.error('Erro ao ler pasta de backups:', e)
      }
    }

    // Ordenar por data (mais recente primeiro)
    backups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    console.log('Total backups encontrados:', backups.length)

    return NextResponse.json({ 
      backups,
      backupDir,
      total: backups.length
    })
  } catch (error: any) {
    console.error('Erro ao listar backups:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Restaurar um backup
export async function POST(request: NextRequest) {
  try {
    const { filePath, createSafetyBackup = true } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: 'Caminho do arquivo não fornecido' }, { status: 400 })
    }

    console.log('='.repeat(50))
    console.log('=== RESTAURAÇÃO DE BACKUP ===')
    console.log('filePath recebido:', filePath)
    console.log('cwd:', process.cwd())
    console.log('Sistema:', isWindows ? 'Windows' : 'Linux/Mac')

    // Encontrar o backup
    const found = findBackup(filePath)
    
    if (!found) {
      console.error('❌ Backup não encontrado')
      return NextResponse.json({ 
        error: 'Arquivo de backup não encontrado',
        debug: { received: filePath, cwd: process.cwd() }
      }, { status: 404 })
    }

    console.log('✅ Backup encontrado:', found.path)
    console.log('Tipo:', found.isDirectory ? 'PASTA' : 'ZIP')

    const cwd = process.cwd()
    const dbPath = path.join(cwd, 'prisma', 'dev.db')
    const tempDir = path.join(cwd, 'temp_restore')
    const safetyBackupDir = path.join(cwd, 'backups', 'safety')

    // 1. Criar backup de segurança
    let safetyBackupPath = null
    if (createSafetyBackup && existsSync(dbPath)) {
      console.log('\n--- Criando backup de segurança ---')
      await mkdir(safetyBackupDir, { recursive: true })
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      safetyBackupPath = path.join(safetyBackupDir, `safety_${timestamp}.db`)
      await copyFile(dbPath, safetyBackupPath)
      console.log('✅ Backup de segurança:', safetyBackupPath)
    }

    try {
      let extractedDbPath: string | null = null

      if (found.isDirectory) {
        // Backup é uma PASTA - procurar database.db diretamente
        console.log('\n--- Restaurando de PASTA ---')
        extractedDbPath = path.join(found.path, 'database.db')
        
        if (!existsSync(extractedDbPath)) {
          throw new Error('Arquivo database.db não encontrado na pasta de backup')
        }
      } else {
        // Backup é um ZIP - extrair primeiro
        console.log('\n--- Extraindo ZIP ---')
        await mkdir(tempDir, { recursive: true })
        
        if (isWindows) {
          const psCommand = `powershell -NoProfile -Command "Expand-Archive -Path '${found.path}' -DestinationPath '${tempDir}' -Force"`
          console.log('Comando:', psCommand)
          execSync(psCommand, { stdio: 'pipe', timeout: 300000 })
        } else {
          execSync(`unzip -o "${found.path}" -d "${tempDir}"`, { stdio: 'pipe', timeout: 300000 })
        }
        
        console.log('✅ ZIP extraído')
        
        // Procurar database.db recursivamente
        const findDbFile = async (dir: string): Promise<string | null> => {
          const entries = await readdir(dir, { withFileTypes: true })
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
              const found = await findDbFile(fullPath)
              if (found) return found
            } else if (entry.name === 'database.db') {
              return fullPath
            }
          }
          return null
        }
        
        extractedDbPath = await findDbFile(tempDir)
        
        if (!extractedDbPath) {
          // Listar conteúdo para debug
          const listContents = await readdir(tempDir, { recursive: true })
          throw new Error(`database.db não encontrado. Conteúdo: ${listContents.join(', ')}`)
        }
      }

      console.log('✅ database.db encontrado:', extractedDbPath)

      // Verificar integridade (se possível)
      if (!isWindows) {
        try {
          execSync(`sqlite3 "${extractedDbPath}" "PRAGMA integrity_check;"`, { stdio: 'pipe' })
          console.log('✅ Integridade verificada')
        } catch (e) {
          console.log('⚠️ Não foi possível verificar integridade (sqlite3 não disponível)')
        }
      }

      // Substituir banco atual
      console.log('\n--- Substituindo banco de dados ---')
      await copyFile(extractedDbPath, dbPath)
      console.log('✅ Banco restaurado!')

      // Limpar pasta temporária (se usou)
      if (!found.isDirectory && existsSync(tempDir)) {
        await rm(tempDir, { recursive: true, force: true })
        console.log('✅ Pasta temporária removida')
      }

      console.log('\n' + '='.repeat(50))
      console.log('=== RESTAURAÇÃO CONCLUÍDA ===')
      console.log('='.repeat(50))

      // NÃO criar registro no histórico!
      // O banco foi substituído, o Prisma está conectado ao banco antigo
      // Isso causaria conflitos e comportamento estranho
      // A página deve ser recarregada para reconectar ao novo banco

      return NextResponse.json({ 
        success: true,
        message: 'Backup restaurado com sucesso!',
        safetyBackup: safetyBackupPath,
        note: 'Recomendado reiniciar a aplicação.'
      })

    } catch (error: any) {
      // Se falhou, tentar restaurar backup de segurança
      if (safetyBackupPath && existsSync(safetyBackupPath)) {
        console.log('\n⚠️ Erro! Revertendo para backup de segurança...')
        try {
          await copyFile(safetyBackupPath, dbPath)
          console.log('✅ Revertido com sucesso')
        } catch (e) {
          console.error('❌ Erro ao reverter:', e)
        }
      }

      // Limpar pasta temporária
      if (existsSync(tempDir)) {
        await rm(tempDir, { recursive: true, force: true })
      }

      throw error
    }
  } catch (error: any) {
    console.error('❌ ERRO NA RESTAURAÇÃO:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
