import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface EmailResult {
  success: boolean
  error?: string
}

// Buscar configuração de email
async function getEmailConfig() {
  let config = await prisma.emailConfig.findFirst()
  
  if (!config) {
    config = await prisma.emailConfig.create({
      data: {
        provider: 'none',
        fromEmail: '',
        fromName: 'Galorys',
        isConfigured: false
      }
    })
  }
  
  return config
}

// Enviar email via Resend
async function sendViaResend(options: EmailOptions, apiKey: string, fromEmail: string, fromName: string): Promise<EmailResult> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Erro ao enviar via Resend' }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Enviar email via SendGrid
async function sendViaSendGrid(options: EmailOptions, apiKey: string, fromEmail: string, fromName: string): Promise<EmailResult> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: options.to }] }],
        from: { email: fromEmail, name: fromName },
        subject: options.subject,
        content: [
          { type: 'text/html', value: options.html },
          ...(options.text ? [{ type: 'text/plain', value: options.text }] : [])
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: error || 'Erro ao enviar via SendGrid' }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Enviar email via SMTP
async function sendViaSMTP(
  options: EmailOptions, 
  host: string, 
  port: number, 
  user: string, 
  pass: string, 
  secure: boolean,
  fromEmail: string,
  fromName: string
): Promise<EmailResult> {
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    })

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Função principal de envio
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const config = await getEmailConfig()

  if (!config.isConfigured || config.provider === 'none') {
    return { success: false, error: 'Email não configurado. Configure em /admin/configuracoes/email' }
  }

  const fromEmail = config.fromEmail || 'noreply@galorys.com'
  const fromName = config.fromName || 'Galorys'

  switch (config.provider) {
    case 'resend':
      if (!config.resendApiKey) {
        return { success: false, error: 'API Key do Resend não configurada' }
      }
      return sendViaResend(options, config.resendApiKey, fromEmail, fromName)

    case 'sendgrid':
      if (!config.sendgridApiKey) {
        return { success: false, error: 'API Key do SendGrid não configurada' }
      }
      return sendViaSendGrid(options, config.sendgridApiKey, fromEmail, fromName)

    case 'smtp':
      if (!config.smtpHost || !config.smtpPort || !config.smtpUser || !config.smtpPass) {
        return { success: false, error: 'Configurações SMTP incompletas' }
      }
      return sendViaSMTP(
        options,
        config.smtpHost,
        config.smtpPort,
        config.smtpUser,
        config.smtpPass,
        config.smtpSecure,
        fromEmail,
        fromName
      )

    default:
      return { success: false, error: 'Provedor de email não suportado' }
  }
}

// Templates de email
export function getPasswordResetTemplate(resetUrl: string, userName: string = 'Usuário'): { subject: string; html: string; text: string } {
  return {
    subject: 'Recuperação de Senha - Galorys',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0B0B0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0B0F; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                <!-- Logo -->
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-weight: bold; font-size: 20px;">G</span>
                      </div>
                      <span style="color: white; font-size: 24px; font-weight: bold;">Galorys</span>
                    </div>
                  </td>
                </tr>
                
                <!-- Card -->
                <tr>
                  <td style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 40px;">
                    <h1 style="color: white; font-size: 24px; margin: 0 0 20px; text-align: center;">
                      Recuperação de Senha
                    </h1>
                    
                    <p style="color: #9CA3AF; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                      Olá ${userName},
                    </p>
                    
                    <p style="color: #9CA3AF; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                      Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px;">
                            Redefinir Senha
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
                      Este link expira em <strong style="color: #9CA3AF;">1 hora</strong>.
                    </p>
                    
                    <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0; text-align: center;">
                      Se você não solicitou esta redefinição, ignore este email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding-top: 30px; text-align: center;">
                    <p style="color: #4B5563; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} Galorys eSports. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Recuperação de Senha - Galorys

Olá ${userName},

Recebemos uma solicitação para redefinir sua senha.

Acesse o link abaixo para criar uma nova senha:
${resetUrl}

Este link expira em 1 hora.

Se você não solicitou esta redefinição, ignore este email.

© ${new Date().getFullYear()} Galorys eSports
    `
  }
}

// Template de email de notificação de backup
interface BackupEmailData {
  status: 'success' | 'failed'
  type: 'manual' | 'auto'
  size?: string
  duration?: string
  error?: string
  date: string
}

export function getBackupNotificationTemplate(data: BackupEmailData): { subject: string; html: string; text: string } {
  const isSuccess = data.status === 'success'
  const typeLabel = data.type === 'manual' ? 'Manual' : 'Automático'
  
  return {
    subject: isSuccess 
      ? `✅ Backup ${typeLabel} Realizado - Galorys` 
      : `❌ Falha no Backup ${typeLabel} - Galorys`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0B0B0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0B0F; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                <!-- Logo -->
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                      <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-weight: bold; font-size: 20px;">G</span>
                      </div>
                      <span style="color: white; font-size: 24px; font-weight: bold;">Galorys</span>
                    </div>
                  </td>
                </tr>
                
                <!-- Card -->
                <tr>
                  <td style="background: ${isSuccess 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1)); border: 1px solid rgba(34, 197, 94, 0.3)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1)); border: 1px solid rgba(239, 68, 68, 0.3)'
                  }; border-radius: 16px; padding: 40px;">
                    
                    <!-- Status Icon -->
                    <div style="text-align: center; margin-bottom: 24px;">
                      <div style="width: 64px; height: 64px; margin: 0 auto; background: ${isSuccess ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 32px;">${isSuccess ? '✅' : '❌'}</span>
                      </div>
                    </div>
                    
                    <h1 style="color: white; font-size: 24px; margin: 0 0 8px; text-align: center;">
                      Backup ${typeLabel} ${isSuccess ? 'Realizado!' : 'Falhou'}
                    </h1>
                    
                    <p style="color: #9CA3AF; font-size: 14px; margin: 0 0 30px; text-align: center;">
                      ${data.date}
                    </p>
                    
                    <!-- Info Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px;">
                      ${isSuccess ? `
                        <tr>
                          <td style="padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span style="color: #9CA3AF; font-size: 14px;">📦 Tamanho</span>
                            <span style="color: white; font-size: 14px; float: right; font-weight: 600;">${data.size || '-'}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 20px;">
                            <span style="color: #9CA3AF; font-size: 14px;">⏱️ Duração</span>
                            <span style="color: white; font-size: 14px; float: right; font-weight: 600;">${data.duration || '-'}</span>
                          </td>
                        </tr>
                      ` : `
                        <tr>
                          <td style="padding: 12px 20px;">
                            <span style="color: #9CA3AF; font-size: 14px;">❌ Erro</span>
                            <p style="color: #EF4444; font-size: 14px; margin: 8px 0 0;">${data.error || 'Erro desconhecido'}</p>
                          </td>
                        </tr>
                      `}
                    </table>
                    
                    ${!isSuccess ? `
                      <p style="color: #9CA3AF; font-size: 14px; margin: 24px 0 0; text-align: center;">
                        Acesse o painel administrativo para verificar o problema.
                      </p>
                    ` : `
                      <p style="color: #22C55E; font-size: 14px; margin: 24px 0 0; text-align: center;">
                        ✓ Seus dados estão seguros!
                      </p>
                    `}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding-top: 30px; text-align: center;">
                    <p style="color: #4B5563; font-size: 12px; margin: 0;">
                      Este é um email automático do sistema de backup.
                    </p>
                    <p style="color: #4B5563; font-size: 12px; margin: 8px 0 0;">
                      © ${new Date().getFullYear()} Galorys eSports
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Backup ${typeLabel} - Galorys

Status: ${isSuccess ? 'SUCESSO ✅' : 'FALHOU ❌'}
Data: ${data.date}
${isSuccess ? `Tamanho: ${data.size || '-'}
Duração: ${data.duration || '-'}` : `Erro: ${data.error || 'Erro desconhecido'}`}

${isSuccess ? 'Seus dados estão seguros!' : 'Acesse o painel administrativo para verificar o problema.'}

© ${new Date().getFullYear()} Galorys eSports
    `
  }
}
