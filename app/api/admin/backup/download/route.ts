import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile, readdir, stat } from 'fs/promises'
import { existsSync, statSync } from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const isWindows = process.platform === 'win32'

// Função para encontrar o backup (ZIP ou pasta)
function findBackup(filePath: string): { path: string; isZip: boolean } | null {
  const cwd = process.cwd()
  const normalizedPath = filePath.replace(/\\/g, '/')
  const fileName = path.basename(normalizedPath)
  const fileNameWithoutZip = fileName.replace('.zip', '')
  
  // Lista de caminhos para tentar
  const pathsToTry = [
    // Caminho direto
    { p: filePath, checkZip: true },
    { p: normalizedPath, checkZip: true },
    // Relativo ao cwd
    { p: path.join(cwd, normalizedPath), checkZip: true },
    { p: path.join(cwd, filePath), checkZip: true },
    // Na pasta backups
    { p: path.join(cwd, 'backups', fileName), checkZip: true },
    // Sem extensão .zip (pasta)
    { p: path.join(cwd, 'backups', fileNameWithoutZip), checkZip: false },
  ]

  console.log('=== BUSCANDO BACKUP ===')
  console.log('filePath original:', filePath)
  console.log('cwd:', cwd)

  for (const { p, checkZip } of pathsToTry) {
    if (existsSync(p)) {
      const isDirectory = statSync(p).isDirectory()
      console.log(`✅ Encontrado: ${p} (${isDirectory ? 'pasta' : 'arquivo'})`)
      return { path: p, isZip: !isDirectory }
    }
  }

  console.log('❌ Backup não encontrado')
  return null
}

// Criar ZIP temporário de uma pasta
async function createTempZip(folderPath: string): Promise<string | null> {
  const tempZipPath = `${folderPath}_temp.zip`
  
  try {
    if (isWindows) {
      const psCommand = `powershell -NoProfile -Command "Compress-Archive -Path '${folderPath}\\*' -DestinationPath '${tempZipPath}' -Force"`
      execSync(psCommand, { stdio: 'pipe', timeout: 300000 })
    } else {
      const parentDir = path.dirname(folderPath)
      const folderName = path.basename(folderPath)
      execSync(`cd "${parentDir}" && zip -r "${tempZipPath}" "${folderName}"`, { stdio: 'pipe' })
    }
    
    if (existsSync(tempZipPath)) {
      return tempZipPath
    }
  } catch (error) {
    console.error('Erro ao criar ZIP temporário:', error)
  }
  
  return null
}

// GET - Download de backup
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    // Buscar backup no banco
    const backup = await prisma.backupHistory.findUnique({
      where: { id }
    })

    if (!backup) {
      return NextResponse.json({ error: 'Backup não encontrado' }, { status: 404 })
    }

    if (!backup.filePath) {
      return NextResponse.json({ error: 'Arquivo de backup não disponível' }, { status: 404 })
    }

    // Encontrar o backup (pode ser ZIP ou pasta)
    const found = findBackup(backup.filePath)
    
    if (!found) {
      // Listar arquivos disponíveis para debug
      const backupDir = path.join(process.cwd(), 'backups')
      let availableFiles: string[] = []
      if (existsSync(backupDir)) {
        availableFiles = await readdir(backupDir)
      }
      
      return NextResponse.json({ 
        error: 'Arquivo não encontrado no servidor',
        debug: {
          filePath: backup.filePath,
          cwd: process.cwd(),
          availableFiles
        }
      }, { status: 404 })
    }

    let fileToSend = found.path
    let isTemp = false

    // Se é pasta, criar ZIP temporário
    if (!found.isZip) {
      console.log('Backup é pasta, criando ZIP temporário...')
      const tempZip = await createTempZip(found.path)
      
      if (!tempZip) {
        return NextResponse.json({ 
          error: 'Erro ao preparar download. O backup está em formato de pasta e não foi possível criar o ZIP.' 
        }, { status: 500 })
      }
      
      fileToSend = tempZip
      isTemp = true
    }

    // Ler arquivo
    const fileBuffer = await readFile(fileToSend)
    const fileName = path.basename(backup.filePath).replace(/\/?$/, '.zip')

    console.log(`✅ Download: ${fileName} (${fileBuffer.length} bytes)`)

    // Remover ZIP temporário após enviar
    if (isTemp) {
      // Usar setTimeout para dar tempo do response ser enviado
      setTimeout(async () => {
        try {
          const { rm } = await import('fs/promises')
          await rm(fileToSend, { force: true })
          console.log('ZIP temporário removido')
        } catch (e) {
          console.error('Erro ao remover ZIP temporário:', e)
        }
      }, 5000)
    }

    // Retornar como download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(fileBuffer.length)
      }
    })
  } catch (error: any) {
    console.error('Erro ao baixar backup:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
