"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Mail,
  Settings,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  Key,
  TestTube
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface EmailConfig {
  provider: string
  fromEmail: string
  fromName: string
  resendApiKey: string
  sendgridApiKey: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  smtpSecure: boolean
  isConfigured: boolean
  lastTest: string | null
  lastTestOk: boolean
}

const defaultConfig: EmailConfig = {
  provider: 'none',
  fromEmail: '',
  fromName: 'Galorys',
  resendApiKey: '',
  sendgridApiKey: '',
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  smtpSecure: true,
  isConfigured: false,
  lastTest: null,
  lastTestOk: false
}

const providers = [
  {
    id: 'none',
    name: 'Não configurado',
    icon: XCircle,
    description: 'Email desativado',
    color: 'text-muted-foreground'
  },
  {
    id: 'resend',
    name: 'Resend',
    icon: Send,
    description: 'Simples e moderno',
    color: 'text-blue-400',
    docsUrl: 'https://resend.com/docs'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    icon: Mail,
    description: 'Robusto e escalável',
    color: 'text-blue-500',
    docsUrl: 'https://docs.sendgrid.com'
  },
  {
    id: 'smtp',
    name: 'SMTP',
    icon: Server,
    description: 'Servidor próprio',
    color: 'text-purple-400'
  }
]

export default function EmailConfigPage() {
  const [config, setConfig] = useState<EmailConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showSmtpPass, setShowSmtpPass] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/email/config')
      if (response.ok) {
        const data = await response.json()
        if (data.config) {
          setConfig({ ...defaultConfig, ...data.config })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar config:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      if (response.ok) {
        const data = await response.json()
        setConfig({ ...defaultConfig, ...data.config })
        setTestResult({ success: true, message: 'Configurações salvas!' })
        setTimeout(() => setTestResult(null), 3000)
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setTestResult({ success: false, message: 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) {
      setTestResult({ success: false, message: 'Digite um email para teste' })
      return
    }

    setTesting(true)
    setTestResult(null)
    try {
      const response = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      })
      const data = await response.json()
      setTestResult({
        success: data.success,
        message: data.success ? 'Email enviado com sucesso!' : data.error || 'Falha ao enviar'
      })
      if (data.success) {
        fetchConfig() // Atualiza status do teste
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Erro ao enviar teste' })
    } finally {
      setTesting(false)
    }
  }

  const selectedProvider = providers.find(p => p.id === config.provider)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/configuracoes" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-galorys-purple to-galorys-pink flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Configuração de Email</h1>
            <p className="text-sm text-muted-foreground">Configure o envio de emails do sistema</p>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border ${
          config.isConfigured && config.lastTestOk
            ? 'bg-green-500/10 border-green-500/30'
            : config.isConfigured
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {config.isConfigured && config.lastTestOk ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : config.isConfigured ? (
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <div>
            <p className={`font-medium ${
              config.isConfigured && config.lastTestOk ? 'text-green-400' :
              config.isConfigured ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {config.isConfigured && config.lastTestOk
                ? 'Email configurado e funcionando'
                : config.isConfigured
                ? 'Email configurado, mas não testado'
                : 'Email não configurado'}
            </p>
            {config.lastTest && (
              <p className="text-xs text-muted-foreground mt-1">
                Último teste: {new Date(config.lastTest).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Provedor */}
      <div className="space-y-4">
        <Label className="text-foreground font-semibold text-base">Provedor de Email</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setConfig({ ...config, provider: provider.id })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                config.provider === provider.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <provider.icon className={`w-6 h-6 mb-2 ${
                config.provider === provider.id ? 'text-primary' : provider.color
              }`} />
              <p className="font-medium text-foreground">{provider.name}</p>
              <p className="text-xs text-muted-foreground">{provider.description}</p>
              {provider.docsUrl && (
                <a
                  href={provider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                >
                  Documentação <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Configurações do provedor */}
      {config.provider !== 'none' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6"
        >
          {/* Configurações gerais */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações Gerais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email de Envio</Label>
                <Input
                  type="email"
                  placeholder="noreply@galorys.com"
                  value={config.fromEmail}
                  onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Email que aparece como remetente
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Nome de Envio</Label>
                <Input
                  placeholder="Galorys"
                  value={config.fromName}
                  onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Nome que aparece como remetente
                </p>
              </div>
            </div>
          </div>

          {/* Resend */}
          {config.provider === 'resend' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4" />
                Configuração Resend
              </h3>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">API Key</Label>
                <div className="relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="re_xxxxxxxxxxxx"
                    value={config.resendApiKey}
                    onChange={(e) => setConfig({ ...config, resendApiKey: e.target.value })}
                    className="bg-background border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pegue sua API Key em{' '}
                  <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    resend.com/api-keys
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* SendGrid */}
          {config.provider === 'sendgrid' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4" />
                Configuração SendGrid
              </h3>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">API Key</Label>
                <div className="relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="SG.xxxxxxxxxxxx"
                    value={config.sendgridApiKey}
                    onChange={(e) => setConfig({ ...config, sendgridApiKey: e.target.value })}
                    className="bg-background border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pegue sua API Key em{' '}
                  <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    app.sendgrid.com/settings/api_keys
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* SMTP */}
          {config.provider === 'smtp' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Server className="w-4 h-4" />
                Configuração SMTP
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Host</Label>
                  <Input
                    placeholder="smtp.gmail.com"
                    value={config.smtpHost}
                    onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Porta</Label>
                  <Input
                    type="number"
                    placeholder="587"
                    value={config.smtpPort || ''}
                    onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) || 587 })}
                    className="bg-background border-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Usuário</Label>
                  <Input
                    placeholder="seu@email.com"
                    value={config.smtpUser}
                    onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Senha</Label>
                  <div className="relative">
                    <Input
                      type={showSmtpPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={config.smtpPass}
                      onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                      className="bg-background border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPass(!showSmtpPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm text-foreground">Conexão Segura (TLS/SSL)</p>
                  <p className="text-xs text-muted-foreground">Recomendado para maior segurança</p>
                </div>
                <Switch
                  checked={config.smtpSecure}
                  onCheckedChange={(checked) => setConfig({ ...config, smtpSecure: checked })}
                />
              </div>
            </div>
          )}

          {/* Teste */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Testar Configuração
            </h3>
            
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Digite seu email para teste"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="bg-background border-border flex-1"
              />
              <Button
                onClick={sendTestEmail}
                disabled={testing || !config.provider || config.provider === 'none'}
                variant="outline"
                className="border-border"
              >
                {testing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Teste
                  </>
                )}
              </Button>
            </div>

            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                  {testResult.message}
                </span>
              </motion.div>
            )}
          </div>

          {/* Salvar */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={fetchConfig}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={saveConfig}
              disabled={saving}
              className="bg-gradient-to-r from-galorys-purple to-galorys-pink hover:opacity-90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm text-blue-200">
          <strong>💡 Dica:</strong> O email é usado para recuperação de senha e notificações do sistema (como avisos de backup).
          Recomendamos o <strong>Resend</strong> por ser simples e ter plano gratuito generoso.
        </p>
      </div>
    </div>
  )
}
