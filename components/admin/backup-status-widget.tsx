"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Cloud,
  HardDrive,
  Mail,
  ChevronRight,
  Shield,
  RefreshCw,
  Calendar,
  Zap
} from "lucide-react"

interface BackupStatus {
  lastBackup: {
    id: string
    date: string
    status: string
    size: number
    duration: number
    daysAgo: number
  } | null
  config: {
    autoBackup: boolean
    frequency: string
    backupTime: string
    emailNotify: boolean
    notifyEmail: string | null
    storageType: string
    hostingType: string
    keepBackups: number
    isConfigured: boolean
  }
  emailConfigured: boolean
  stats: {
    total: number
    success: number
    failed: number
  }
}

export function BackupStatusWidget() {
  const [status, setStatus] = useState<BackupStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/admin/backup/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Erro ao buscar status:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-card to-card/80 border border-border rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const { lastBackup, config, emailConfigured, stats } = status
  
  // Determinar status geral do sistema de backup
  const isHealthy = lastBackup && lastBackup.daysAgo <= 7 && lastBackup.status === 'success'
  const hasWarnings = !lastBackup || lastBackup.daysAgo > 7 || lastBackup.status === 'failed'
  const needsAttention = config.hostingType === 'vercel' && config.storageType === 'local'

  // Construir lista de avisos (apenas relevantes)
  const warnings: string[] = []
  
  if (!lastBackup) {
    warnings.push('Nenhum backup realizado ainda')
  } else if (lastBackup.daysAgo > 7) {
    warnings.push(`Último backup há ${lastBackup.daysAgo} dias`)
  }
  
  // Só mostrar aviso de Vercel se realmente estiver no Vercel
  if (config.hostingType === 'vercel' && config.storageType === 'local') {
    warnings.push('Configure storage externo (Google Drive/S3)')
  }

  // Só mostrar aviso de email se notificação está ativa mas sem email
  if (config.emailNotify && !emailConfigured && !config.notifyEmail) {
    warnings.push('Email de notificação não configurado')
  }

  // Determinar cor do status
  const statusColor = isHealthy 
    ? 'from-green-500/20 to-emerald-500/10 border-green-500/30' 
    : hasWarnings 
      ? 'from-yellow-500/20 to-orange-500/10 border-yellow-500/30'
      : 'from-card to-card/80 border-border'

  return (
    <div className={`bg-gradient-to-br ${statusColor} border rounded-2xl overflow-hidden shadow-lg`}>
      {/* Header com gradiente */}
      <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isHealthy ? 'bg-green-500/20' : hasWarnings ? 'bg-yellow-500/20' : 'bg-primary/20'
            }`}>
              <Shield className={`w-5 h-5 ${
                isHealthy ? 'text-green-400' : hasWarnings ? 'text-yellow-400' : 'text-primary'
              }`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Status do Backup</h3>
              <p className="text-xs text-muted-foreground">
                {isHealthy ? 'Sistema protegido' : hasWarnings ? 'Requer atenção' : 'Verificando...'}
              </p>
            </div>
          </div>
          <Link 
            href="/admin/backup"
            className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1"
          >
            Gerenciar <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 space-y-4">
        {/* Status Cards em Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Último Backup */}
          <div className="bg-background/50 rounded-xl p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Último Backup</span>
            </div>
            {lastBackup ? (
              <div className="flex items-center gap-2">
                {lastBackup.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${
                  lastBackup.daysAgo > 7 ? 'text-yellow-400' : 'text-foreground'
                }`}>
                  {lastBackup.daysAgo === 0 ? 'Hoje' : 
                   lastBackup.daysAgo === 1 ? 'Ontem' : 
                   `${lastBackup.daysAgo} dias`}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-yellow-400">Nunca</span>
            )}
            {lastBackup && (
              <p className="text-xs text-muted-foreground mt-1">{formatSize(lastBackup.size)}</p>
            )}
          </div>

          {/* Backup Automático */}
          <div className="bg-background/50 rounded-xl p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Automático</span>
            </div>
            {config.autoBackup ? (
              <>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-foreground">
                    {config.frequency === 'daily' ? 'Diário' : 
                     config.frequency === 'weekly' ? 'Semanal' : 'Mensal'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">às {config.backupTime}</p>
              </>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">Desativado</span>
            )}
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center justify-between py-3 px-4 bg-background/30 rounded-xl border border-border/30">
          {/* Storage */}
          <div className="flex items-center gap-2">
            {config.storageType === 'local' ? (
              <HardDrive className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Cloud className="w-4 h-4 text-green-400" />
            )}
            <span className="text-sm text-foreground capitalize">
              {config.storageType.replace('_', ' ')}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-border" />

          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className={`w-4 h-4 ${
              (config.emailNotify && (emailConfigured || config.notifyEmail)) 
                ? 'text-green-400' 
                : 'text-muted-foreground'
            }`} />
            <span className="text-sm text-foreground">
              {config.emailNotify 
                ? (emailConfigured || config.notifyEmail) ? 'Notificação ativa' : 'Sem email'
                : 'Notificação off'}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-border" />

          {/* Stats */}
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">
              {stats.total} backup{stats.total !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Avisos - Só mostrar se relevantes */}
        {warnings.length > 0 && (
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {warnings.map((warning, i) => (
                  <p key={i} className="text-xs text-yellow-400">{warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Status de saúde */}
        {isHealthy && !needsAttention && (
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-xs text-green-400 font-medium">
                Tudo certo! Seus dados estão protegidos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
