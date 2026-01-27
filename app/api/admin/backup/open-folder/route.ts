import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

// GET - Listar arquivos na pasta de backups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedPath = searchParams.get('path')
    
    // Pasta padrão de backups
    const backupDir = path.join(process.cwd(), 'backups')
    
    // Segurança: só permitir acesso à pasta de backups
    const safePath = requestedPath?.startsWith(backupDir) ? requestedPath : backupDir
    
    try {
      const files = await readdir(safePath)
      const fileInfos = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(safePath, file)
          try {
            const stats = await stat(filePath)
            return {
              name: file,
              size: stats.size,
              isDirectory: stats.isDirectory(),
              modified: stats.mtime.toISOString()
            }
          } catch {
            return { name: file, size: 0, isDirectory: false, modified: null }
          }
        })
      )
      
      // Ordenar por data (mais recente primeiro)
      fileInfos.sort((a, b) => {
        if (!a.modified) return 1
        if (!b.modified) return -1
        return new Date(b.modified).getTime() - new Date(a.modified).getTime()
      })
      
      return NextResponse.json({
        success: true,
        path: safePath,
        files: fileInfos,
        info: {
          message: 'Para acessar os backups via terminal/SSH:',
          commands: [
            `cd ${safePath}`,
            'ls -la',
            '# Para copiar para seu computador:',
            `scp user@servidor:${safePath}/*.zip ~/Downloads/`
          ]
        }
      })
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Pasta não encontrada',
        path: safePath,
        info: {
          message: 'A pasta de backups ainda não foi criada. Crie um backup primeiro.'
        }
      })
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
