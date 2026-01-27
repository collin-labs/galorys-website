import { google } from 'googleapis'
import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'

interface DriveCredentials {
  client_email: string
  private_key: string
}

interface DriveConfig {
  credentials: DriveCredentials
  folderId: string
}

// Criar cliente autenticado do Google Drive
function createDriveClient(credentials: DriveCredentials) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/drive']
  })

  return google.drive({ version: 'v3', auth })
}

// Upload de arquivo para o Google Drive
export async function uploadToDrive(
  filePath: string,
  fileName: string,
  config: DriveConfig & { ownerEmail?: string }
): Promise<{ success: boolean; fileId?: string; webViewLink?: string; error?: string }> {
  try {
    const drive = createDriveClient(config.credentials)

    // Criar stream do arquivo
    const fileStream = fs.createReadStream(filePath)
    const fileStats = fs.statSync(filePath)

    // Metadados do arquivo
    const fileMetadata = {
      name: fileName,
      parents: [config.folderId]
    }

    // Upload - supportsAllDrives permite usar pastas compartilhadas
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: 'application/zip',
        body: fileStream
      },
      fields: 'id, webViewLink',
      supportsAllDrives: true
    })

    const fileId = response.data.id

    // Transferir propriedade para o dono da pasta (resolve problema de quota)
    if (fileId && config.ownerEmail) {
      try {
        await drive.permissions.create({
          fileId,
          transferOwnership: true,
          requestBody: {
            type: 'user',
            role: 'owner',
            emailAddress: config.ownerEmail
          },
          supportsAllDrives: true
        })
        console.log(`✅ Propriedade transferida para ${config.ownerEmail}`)
      } catch (permError: any) {
        console.log('⚠️ Não foi possível transferir propriedade:', permError.message)
        // Continua mesmo se não conseguir transferir
      }
    }

    return {
      success: true,
      fileId: fileId || undefined,
      webViewLink: response.data.webViewLink || undefined
    }
  } catch (error: any) {
    console.error('Erro ao fazer upload para o Drive:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

// Listar arquivos na pasta do Drive
export async function listDriveFiles(
  config: DriveConfig,
  maxResults: number = 10
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const drive = createDriveClient(config.credentials)

    const response = await drive.files.list({
      q: `'${config.folderId}' in parents and trashed = false`,
      fields: 'files(id, name, size, createdTime, webViewLink)',
      orderBy: 'createdTime desc',
      pageSize: maxResults,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true
    })

    return {
      success: true,
      files: response.data.files || []
    }
  } catch (error: any) {
    console.error('Erro ao listar arquivos do Drive:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

// Deletar arquivo do Drive
export async function deleteFromDrive(
  fileId: string,
  config: DriveConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const drive = createDriveClient(config.credentials)

    await drive.files.delete({
      fileId,
      supportsAllDrives: true
    })

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao deletar arquivo do Drive:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}

// Testar conexão com o Drive
export async function testDriveConnection(
  config: DriveConfig
): Promise<{ success: boolean; folderName?: string; error?: string }> {
  try {
    const drive = createDriveClient(config.credentials)

    // Tentar acessar a pasta
    const response = await drive.files.get({
      fileId: config.folderId,
      fields: 'id, name',
      supportsAllDrives: true
    })

    return {
      success: true,
      folderName: response.data.name || undefined
    }
  } catch (error: any) {
    console.error('Erro ao testar conexão com Drive:', error)
    
    let errorMessage = error.message || 'Erro desconhecido'
    
    if (error.code === 404) {
      errorMessage = 'Pasta não encontrada. Verifique o ID da pasta.'
    } else if (error.code === 403) {
      errorMessage = 'Sem permissão. Compartilhe a pasta com o email da Service Account.'
    } else if (error.message?.includes('invalid_grant')) {
      errorMessage = 'Credenciais inválidas. Verifique o JSON da Service Account.'
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

// Limpar backups antigos do Drive (manter apenas N mais recentes)
export async function cleanOldDriveBackups(
  config: DriveConfig,
  keepCount: number
): Promise<{ success: boolean; deleted: number; error?: string }> {
  try {
    const drive = createDriveClient(config.credentials)

    // Listar todos os arquivos de backup
    const response = await drive.files.list({
      q: `'${config.folderId}' in parents and trashed = false and name contains 'backup_'`,
      fields: 'files(id, name, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 100,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true
    })

    const files = response.data.files || []
    
    if (files.length <= keepCount) {
      return { success: true, deleted: 0 }
    }

    // Deletar arquivos excedentes (os mais antigos)
    const filesToDelete = files.slice(keepCount)
    let deleted = 0

    for (const file of filesToDelete) {
      try {
        await drive.files.delete({ fileId: file.id!, supportsAllDrives: true })
        deleted++
      } catch (e) {
        console.error(`Erro ao deletar ${file.name}:`, e)
      }
    }

    return { success: true, deleted }
  } catch (error: any) {
    console.error('Erro ao limpar backups antigos do Drive:', error)
    return {
      success: false,
      deleted: 0,
      error: error.message || 'Erro desconhecido'
    }
  }
}
