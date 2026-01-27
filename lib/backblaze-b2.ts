import B2 from 'backblaze-b2'
import fs from 'fs'
import crypto from 'crypto'

interface B2Config {
  applicationKeyId: string
  applicationKey: string
  bucketId: string
  bucketName?: string
}

// Instância do cliente B2 (reutilizável)
let b2Client: B2 | null = null
let lastAuthTime = 0
const AUTH_DURATION = 23 * 60 * 60 * 1000 // 23 horas (token dura 24h)

// Criar/obter cliente autenticado do Backblaze B2
async function getB2Client(config: B2Config): Promise<B2> {
  const now = Date.now()
  
  // Reutilizar cliente se ainda válido
  if (b2Client && (now - lastAuthTime) < AUTH_DURATION) {
    return b2Client
  }

  // Criar novo cliente
  b2Client = new B2({
    applicationKeyId: config.applicationKeyId,
    applicationKey: config.applicationKey
  })

  // Autenticar (obter token de sessão)
  await b2Client.authorize()
  lastAuthTime = now
  
  console.log('✅ Backblaze B2 autenticado com sucesso')
  return b2Client
}

// Calcular SHA1 do arquivo (necessário para upload)
function calculateSHA1(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1')
    const stream = fs.createReadStream(filePath)
    
    stream.on('data', (data) => hash.update(data))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', reject)
  })
}

// Upload de arquivo para o Backblaze B2
export async function uploadToB2(
  filePath: string,
  fileName: string,
  config: B2Config
): Promise<{ success: boolean; fileId?: string; fileUrl?: string; error?: string }> {
  try {
    const b2 = await getB2Client(config)

    // Ler arquivo
    const fileBuffer = fs.readFileSync(filePath)
    const fileStats = fs.statSync(filePath)
    const sha1Hash = await calculateSHA1(filePath)

    console.log(`📤 Enviando para Backblaze B2: ${fileName} (${(fileStats.size / 1024).toFixed(1)} KB)`)

    // Obter URL de upload
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: config.bucketId
    })

    // Upload do arquivo
    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: fileName,
      data: fileBuffer,
      hash: sha1Hash
    })

    const fileId = uploadResponse.data.fileId
    const fileUrl = `https://f005.backblazeb2.com/file/${config.bucketName || 'galorys-backups'}/${fileName}`

    console.log('✅ Upload para Backblaze B2 concluído')
    console.log(`   FileId: ${fileId}`)
    console.log(`   URL: ${fileUrl}`)

    return {
      success: true,
      fileId,
      fileUrl
    }
  } catch (error: any) {
    console.error('❌ Erro ao fazer upload para Backblaze B2:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

// Listar arquivos no bucket B2
export async function listB2Files(
  config: B2Config,
  maxResults: number = 10
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const b2 = await getB2Client(config)

    const response = await b2.listFileNames({
      bucketId: config.bucketId,
      maxFileCount: maxResults,
      prefix: 'backup_'
    })

    const files = (response.data.files || []).map((file: any) => ({
      id: file.fileId,
      name: file.fileName,
      size: file.contentLength,
      createdTime: new Date(file.uploadTimestamp).toISOString(),
      url: `https://f005.backblazeb2.com/file/${config.bucketName || 'galorys-backups'}/${file.fileName}`
    }))

    // Ordenar por data (mais recente primeiro)
    files.sort((a: any, b: any) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())

    return {
      success: true,
      files
    }
  } catch (error: any) {
    console.error('❌ Erro ao listar arquivos do B2:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

// Deletar arquivo do B2
export async function deleteFromB2(
  fileId: string,
  fileName: string,
  config: B2Config
): Promise<{ success: boolean; error?: string }> {
  try {
    const b2 = await getB2Client(config)

    await b2.deleteFileVersion({
      fileId,
      fileName
    })

    console.log(`✅ Arquivo deletado do B2: ${fileName}`)
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erro ao deletar arquivo do B2:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

// Testar conexão com B2
export async function testB2Connection(
  config: B2Config
): Promise<{ success: boolean; bucketName?: string; error?: string }> {
  try {
    const b2 = await getB2Client(config)

    // Listar buckets para verificar conexão
    const response = await b2.listBuckets()
    
    const bucket = response.data.buckets.find((b: any) => b.bucketId === config.bucketId)
    
    if (!bucket) {
      return {
        success: false,
        error: 'Bucket não encontrado. Verifique o ID do bucket.'
      }
    }

    console.log(`✅ Conexão com B2 OK - Bucket: ${bucket.bucketName}`)
    return {
      success: true,
      bucketName: bucket.bucketName
    }
  } catch (error: any) {
    console.error('❌ Erro ao testar conexão com B2:', error)
    
    let errorMessage = error.message || 'Erro desconhecido'
    
    if (error.response?.status === 401) {
      errorMessage = 'Credenciais inválidas. Verifique Application Key ID e Application Key.'
    } else if (error.response?.status === 403) {
      errorMessage = 'Sem permissão. Verifique as permissões da Application Key.'
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

// Limpar backups antigos do B2 (manter apenas N mais recentes)
export async function cleanOldB2Backups(
  config: B2Config,
  keepCount: number
): Promise<{ success: boolean; deleted: number; error?: string }> {
  try {
    const b2 = await getB2Client(config)

    // Listar todos os arquivos de backup
    const response = await b2.listFileNames({
      bucketId: config.bucketId,
      maxFileCount: 100,
      prefix: 'backup_'
    })

    const files = response.data.files || []
    
    // Ordenar por data (mais recente primeiro)
    files.sort((a: any, b: any) => b.uploadTimestamp - a.uploadTimestamp)
    
    if (files.length <= keepCount) {
      return { success: true, deleted: 0 }
    }

    // Deletar arquivos excedentes (os mais antigos)
    const filesToDelete = files.slice(keepCount)
    let deleted = 0

    for (const file of filesToDelete) {
      try {
        await b2.deleteFileVersion({
          fileId: file.fileId,
          fileName: file.fileName
        })
        deleted++
        console.log(`🗑️ Backup antigo removido do B2: ${file.fileName}`)
      } catch (e) {
        console.error(`Erro ao deletar ${file.fileName}:`, e)
      }
    }

    return { success: true, deleted }
  } catch (error: any) {
    console.error('❌ Erro ao limpar backups antigos do B2:', error)
    return {
      success: false,
      deleted: 0,
      error: error.message || 'Erro desconhecido'
    }
  }
}
