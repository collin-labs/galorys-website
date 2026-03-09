import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // ============================================
    // VALIDAÇÃO DE TIPO DE ARQUIVO (MIME + Extensão)
    // ============================================
    // Lista completa de MIME types de imagem aceitos
    // Inclui formatos modernos (AVIF, HEIC/HEIF) e legados (BMP, TIFF, JFIF)
    const validMimeTypes = [
      'image/jpeg',          // .jpg, .jpeg
      'image/png',           // .png
      'image/gif',           // .gif
      'image/webp',          // .webp
      'image/svg+xml',       // .svg
      'image/avif',          // .avif (formato moderno, suporte amplo em 2025+)
      'image/bmp',           // .bmp (Windows Bitmap)
      'image/x-ms-bmp',      // .bmp (variante Microsoft)
      'image/tiff',          // .tiff, .tif
      'image/apng',          // .apng (Animated PNG)
      'image/x-icon',        // .ico (ícones)
      'image/vnd.microsoft.icon', // .ico (variante IANA)
      'image/heic',          // .heic (iPhone - Apple HEVC)
      'image/heif',          // .heif (High Efficiency Image)
      'image/heic-sequence',  // .heics (sequência HEIC)
      'image/heif-sequence',  // .heifs (sequência HEIF)
      'image/jxl',           // .jxl (JPEG XL - novo formato)
      'image/jp2',           // .jp2 (JPEG 2000)
      'image/pjpeg',         // .jpeg (Progressive JPEG - legado IE)
    ]

    // Extensões válidas como fallback (File.type pode ser vazio para HEIC, JFIF, etc.)
    const validExtensions = [
      '.jpg', '.jpeg', '.jpe', '.jfif', '.jif',  // JPEG e variantes
      '.png', '.apng',                             // PNG
      '.gif',                                       // GIF
      '.webp',                                      // WebP
      '.svg', '.svgz',                              // SVG
      '.avif', '.avifs',                            // AVIF
      '.bmp', '.dib',                               // Bitmap
      '.tiff', '.tif',                              // TIFF
      '.ico', '.cur',                               // Ícones
      '.heic', '.heics',                            // HEIC (Apple)
      '.heif', '.heifs',                            // HEIF
      '.jxl',                                        // JPEG XL
      '.jp2', '.j2k',                               // JPEG 2000
    ]

    // Extrair extensão do nome do arquivo (fallback para quando file.type é vazio)
    const fileExtension = path.extname(file.name).toLowerCase()
    const hasMimeType = file.type && file.type.length > 0
    const isMimeValid = hasMimeType && validMimeTypes.includes(file.type)
    const isExtensionValid = validExtensions.includes(fileExtension)

    // Aceitar se MIME type é válido OU se extensão é válida (fallback)
    if (!isMimeValid && !isExtensionValid) {
      const tiposAceitos = 'JPG, PNG, GIF, WEBP, SVG, AVIF, BMP, TIFF, HEIC, HEIF, ICO, JFIF'
      console.warn(`[UPLOAD] Tipo rejeitado — MIME: "${file.type}", Extensão: "${fileExtension}", Arquivo: "${file.name}"`)
      return NextResponse.json({ 
        error: `Tipo de arquivo não permitido. Formatos aceitos: ${tiposAceitos}` 
      }, { status: 400 })
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 5MB)' }, { status: 400 })
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`

    // Criar pasta se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
    await mkdir(uploadDir, { recursive: true })

    // Converter para buffer e salvar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Retornar caminho relativo para uso no site
    const publicPath = `/images/${folder}/${fileName}`

    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      fileName: fileName
    })
  } catch (error: any) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: error.message || 'Erro no upload' }, { status: 500 })
  }
}
