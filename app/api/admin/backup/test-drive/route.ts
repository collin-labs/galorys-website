import { NextRequest, NextResponse } from 'next/server'
import { testDriveConnection } from '@/lib/google-drive'

// POST - Testar conexão com Google Drive
export async function POST(request: NextRequest) {
  try {
    const { credentials, folderId } = await request.json()

    if (!credentials || !folderId) {
      return NextResponse.json(
        { success: false, error: 'Credenciais e ID da pasta são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar estrutura das credenciais
    if (!credentials.client_email || !credentials.private_key) {
      return NextResponse.json(
        { success: false, error: 'JSON inválido. Deve conter client_email e private_key' },
        { status: 400 }
      )
    }

    // Testar conexão
    const result = await testDriveConnection({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key
      },
      folderId
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        folderName: result.folderName,
        message: `Conectado à pasta "${result.folderName}"`
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Erro ao testar Drive:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao testar conexão' },
      { status: 500 }
    )
  }
}
