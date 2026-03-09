import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

// ============================================
// API ROUTE PARA SERVIR ARQUIVOS DINÂMICOS
// ============================================
// Solução para o problema conhecido do Next.js:
// Arquivos adicionados ao /public/ DEPOIS do build não são
// servidos pelo Next.js em produção (retornam 404).
// 
// Esta rota lê o arquivo do disco e o serve com os headers
// corretos, funcionando tanto em DEV quanto em PRODUÇÃO.
//
// Uso: /api/files/images/players/foto.png
//      → lê de public/images/players/foto.png
// ============================================

export const dynamic = 'force-dynamic'

// Mapa de MIME types por extensão
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jpe': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.svgz': 'image/svg+xml',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.jxl': 'image/jxl',
  '.apng': 'image/apng',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params

    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'Caminho não especificado' }, { status: 400 })
    }

    // Segurança: bloquear path traversal (../ ou ..\)
    const requestedPath = pathSegments.join('/')
    if (requestedPath.includes('..') || requestedPath.includes('~')) {
      console.warn(`[FILES-API] Tentativa de path traversal bloqueada: "${requestedPath}"`)
      return NextResponse.json({ error: 'Caminho inválido' }, { status: 400 })
    }

    // Construir caminho absoluto para o arquivo em public/
    const filePath = path.join(process.cwd(), 'public', ...pathSegments)

    // Verificar se o arquivo existe
    let fileStat
    try {
      fileStat = await stat(filePath)
    } catch {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    // Bloquear acesso a diretórios
    if (fileStat.isDirectory()) {
      return NextResponse.json({ error: 'Caminho é um diretório' }, { status: 400 })
    }

    // Ler o arquivo do disco
    const fileBuffer = await readFile(filePath)

    // Determinar MIME type pela extensão
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    // Headers de cache: 1 hora em produção, sem cache em dev
    const isDev = process.env.NODE_ENV === 'development'
    const cacheControl = isDev 
      ? 'no-cache, no-store, must-revalidate' 
      : 'public, max-age=3600, immutable'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileStat.size),
        'Cache-Control': cacheControl,
        'Last-Modified': fileStat.mtime.toUTCString(),
      },
    })
  } catch (error: any) {
    console.error('[FILES-API] Erro ao servir arquivo:', error)
    return NextResponse.json(
      { error: 'Erro interno ao servir arquivo' },
      { status: 500 }
    )
  }
}
