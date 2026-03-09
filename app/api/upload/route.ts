import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, access, stat } from 'fs/promises'
import { constants } from 'fs'
import path from 'path'

// Garantir que o route handler seja sempre dinâmico (nunca cacheado)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // ============================================
    // PARSE DO FORM DATA
    // ============================================
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (parseError: any) {
      console.error('[UPLOAD] Erro ao parsear FormData:', parseError)
      return NextResponse.json({ 
        error: `Erro ao processar o arquivo enviado. Tente novamente. (${parseError.message || 'parse error'})` 
      }, { status: 400 })
    }

    const file = formData.get('file')
    const folder = formData.get('folder') as string || 'uploads'

    // Verificar se o arquivo existe e é do tipo correto (File/Blob)
    if (!file || typeof file === 'string') {
      console.warn('[UPLOAD] Nenhum arquivo recebido ou arquivo inválido. Tipo recebido:', typeof file)
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Cast seguro para File após verificação
    const uploadFile = file as File

    console.log(`[UPLOAD] Recebido: "${uploadFile.name}" | MIME: "${uploadFile.type}" | Tamanho: ${(uploadFile.size / 1024).toFixed(1)}KB | Pasta: ${folder}`)

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
    const fileExtension = path.extname(uploadFile.name).toLowerCase()
    const hasMimeType = uploadFile.type && uploadFile.type.length > 0
    const isMimeValid = hasMimeType && validMimeTypes.includes(uploadFile.type)
    const isExtensionValid = validExtensions.includes(fileExtension)

    // Aceitar se MIME type é válido OU se extensão é válida (fallback)
    if (!isMimeValid && !isExtensionValid) {
      const tiposAceitos = 'JPG, PNG, GIF, WEBP, SVG, AVIF, BMP, TIFF, HEIC, HEIF, ICO, JFIF'
      console.warn(`[UPLOAD] Tipo rejeitado — MIME: "${uploadFile.type}", Extensão: "${fileExtension}", Arquivo: "${uploadFile.name}"`)
      return NextResponse.json({ 
        error: `Tipo de arquivo não permitido. Formatos aceitos: ${tiposAceitos}` 
      }, { status: 400 })
    }

    // Validar tamanho (max 5MB)
    if (uploadFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 5MB)' }, { status: 400 })
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now()
    const originalName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`

    // Criar pasta se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (mkdirError: any) {
      console.error(`[UPLOAD] Erro ao criar diretório "${uploadDir}":`, mkdirError)
      return NextResponse.json({ 
        error: `Erro ao preparar diretório de upload. Verifique permissões do servidor. (${mkdirError.code || mkdirError.message})` 
      }, { status: 500 })
    }

    // Verificar permissão de escrita no diretório
    try {
      await access(uploadDir, constants.W_OK)
    } catch {
      console.error(`[UPLOAD] Sem permissão de escrita em "${uploadDir}"`)
      return NextResponse.json({ 
        error: 'Sem permissão para salvar arquivos no servidor. Contate o administrador.' 
      }, { status: 500 })
    }

    // Converter para buffer e salvar
    let bytes: ArrayBuffer
    try {
      bytes = await uploadFile.arrayBuffer()
    } catch (bufferError: any) {
      console.error('[UPLOAD] Erro ao ler arrayBuffer do arquivo:', bufferError)
      return NextResponse.json({ 
        error: `Erro ao processar o conteúdo do arquivo. (${bufferError.message || 'buffer error'})` 
      }, { status: 500 })
    }

    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, fileName)

    try {
      await writeFile(filePath, buffer)
    } catch (writeError: any) {
      console.error(`[UPLOAD] Erro ao gravar arquivo "${filePath}":`, writeError)
      return NextResponse.json({ 
        error: `Erro ao salvar o arquivo no disco. (${writeError.code || writeError.message})` 
      }, { status: 500 })
    }

    // Verificar se o arquivo foi realmente gravado
    try {
      const fileStat = await stat(filePath)
      console.log(`[UPLOAD] ✅ Salvo com sucesso: "${filePath}" (${(fileStat.size / 1024).toFixed(1)}KB)`)
    } catch {
      console.error(`[UPLOAD] ⚠️ Arquivo gravado mas não encontrado na verificação: "${filePath}"`)
    }

    // Retornar caminho relativo para uso no site
    const publicPath = `/images/${folder}/${fileName}`

    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      fileName: fileName
    })
  } catch (error: any) {
    console.error('[UPLOAD] Erro inesperado:', error)
    return NextResponse.json({ 
      error: `Erro interno no upload: ${error.message || 'erro desconhecido'}` 
    }, { status: 500 })
  }
}
