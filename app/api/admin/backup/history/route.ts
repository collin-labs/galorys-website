import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rm, readdir } from 'fs/promises'
import { existsSync, statSync } from 'fs'
import path from 'path'

// Função para encontrar o backup (ZIP ou pasta)
function findBackup(filePath: string): { path: string; isZip: boolean; isDirectory: boolean } | null {
  const cwd = process.cwd()
  const normalizedPath = filePath.replace(/\\/g, '/')
  const fileName = path.basename(normalizedPath)
  const fileNameWithoutZip = fileName.replace('.zip', '')
  
  // Lista de caminhos para tentar
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

// GET - Listar histórico de backups
export async function GET() {
  try {
    const history = await prisma.backupHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Adicionar informação se o arquivo existe
    const historyWithStatus = await Promise.all(
      history.map(async (backup) => {
        let fileExists = false
        let actualPath = null
        let isDirectory = false
        
        if (backup.filePath) {
          const found = findBackup(backup.filePath)
          if (found) {
            fileExists = true
            actualPath = found.path
            isDirectory = found.isDirectory
          }
        }
        
        return {
          ...backup,
          fileExists,
          actualPath,
          isDirectory
        }
      })
    )

    return NextResponse.json({ history: historyWithStatus })
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Excluir um backup do histórico ou limpar órfãos
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const cleanOrphans = searchParams.get('cleanOrphans')

    // Limpar todos os registros órfãos (arquivo não existe)
    if (cleanOrphans === 'true') {
      console.log('=== LIMPANDO REGISTROS ÓRFÃOS ===')
      
      const allBackups = await prisma.backupHistory.findMany()
      let deletedCount = 0
      
      for (const backup of allBackups) {
        let fileExists = false
        
        if (backup.filePath) {
          const found = findBackup(backup.filePath)
          fileExists = !!found
        }
        
        // Se o arquivo não existe OU status é in_progress há mais de 1 hora, deletar
        const isStaleInProgress = backup.status === 'in_progress' && 
          (Date.now() - backup.createdAt.getTime()) > 60 * 60 * 1000
        
        if (!fileExists || isStaleInProgress) {
          await prisma.backupHistory.delete({ where: { id: backup.id } })
          deletedCount++
          console.log(`Deletado: ${backup.id} (${backup.filePath || 'sem arquivo'})`)
        }
      }
      
      console.log(`Total deletados: ${deletedCount}`)
      
      return NextResponse.json({ 
        success: true, 
        deletedCount,
        message: deletedCount > 0 
          ? `${deletedCount} registro(s) órfão(s) removido(s)!`
          : 'Nenhum registro órfão encontrado.'
      })
    }

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    // Buscar o backup
    const backup = await prisma.backupHistory.findUnique({
      where: { id }
    })

    if (!backup) {
      return NextResponse.json({ error: 'Backup não encontrado' }, { status: 404 })
    }

    console.log('='.repeat(50))
    console.log('=== EXCLUINDO BACKUP ===')
    console.log('ID:', id)
    console.log('filePath do banco:', backup.filePath)
    console.log('cwd:', process.cwd())

    let fileDeleted = false
    let deleteError = null
    let foundPath = null

    // Tentar deletar o arquivo/pasta se existir
    if (backup.filePath) {
      const found = findBackup(backup.filePath)
      
      if (found) {
        foundPath = found.path
        console.log(`Arquivo encontrado: ${found.path}`)
        console.log(`Tipo: ${found.isDirectory ? 'PASTA' : 'ARQUIVO'}`)
        
        try {
          // rm com recursive funciona tanto para arquivos quanto pastas
          await rm(found.path, { recursive: true, force: true })
          
          // Verificar se foi deletado
          if (!existsSync(found.path)) {
            fileDeleted = true
            console.log('✅ Arquivo/pasta deletado com sucesso!')
          } else {
            deleteError = 'Arquivo ainda existe após tentativa de exclusão'
            console.error('❌ ' + deleteError)
          }
        } catch (e: any) {
          deleteError = e.message
          console.error('❌ Erro ao deletar:', e.message)
        }
      } else {
        deleteError = 'Arquivo não encontrado no sistema de arquivos'
        console.log('❌ Arquivo não encontrado em nenhum caminho')
        
        // Listar o que existe na pasta backups para debug
        const backupDir = path.join(process.cwd(), 'backups')
        if (existsSync(backupDir)) {
          const files = await readdir(backupDir)
          console.log('Arquivos disponíveis em backups/:', files)
        }
      }
    }

    // Deletar do banco
    await prisma.backupHistory.delete({
      where: { id }
    })

    console.log('✅ Registro deletado do banco')
    console.log('='.repeat(50))

    return NextResponse.json({ 
      success: true, 
      fileDeleted,
      deleteError,
      foundPath,
      message: fileDeleted 
        ? 'Backup e arquivo excluídos com sucesso!' 
        : `Registro excluído do banco. ${deleteError || 'Arquivo não encontrado.'}`
    })
  } catch (error: any) {
    console.error('Erro ao deletar backup:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
