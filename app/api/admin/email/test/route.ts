import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

// POST - Enviar email de teste
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email não fornecido' }, { status: 400 })
    }

    // Enviar email de teste
    const result = await sendEmail({
      to: email,
      subject: '✅ Teste de Email - Galorys',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin: 0; padding: 40px; background-color: #0B0B0F; font-family: sans-serif;">
          <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 40px; text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px;">✓</span>
            </div>
            <h1 style="color: white; font-size: 24px; margin: 0 0 10px;">Email Configurado!</h1>
            <p style="color: #9CA3AF; font-size: 16px; margin: 0;">
              Seu sistema de email está funcionando corretamente.
            </p>
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              Galorys eSports • ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </body>
        </html>
      `,
      text: 'Seu sistema de email está funcionando corretamente! - Galorys eSports'
    })

    // Atualizar status do teste no banco
    const config = await prisma.emailConfig.findFirst()
    if (config) {
      await prisma.emailConfig.update({
        where: { id: config.id },
        data: {
          lastTest: new Date(),
          lastTestOk: result.success
        }
      })
    }

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Erro ao enviar teste:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
