"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft, Database, Download, Upload, RefreshCw, Trash2,
  AlertTriangle, Cloud, Server, Settings, CheckCircle2, XCircle,
  Loader2, Play, Pause, History, Calendar, Shield, Zap,
  ChevronDown, ChevronUp, Terminal, X, Eraser, HardDrive,
  Clock, Activity, Info, FileArchive, Mail, FolderOpen,
  Sparkles, CircleDot, Eye, Lock, ExternalLink, Copy, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================

interface BackupConfig {
  hostingType: string
  storageType: string
  autoBackup: boolean
  frequency: string
  backupTime: string
  emailNotify: boolean
  notifyEmail: string
  backupDatabase: boolean
  backupUploads: boolean
  keepBackups: number
}

interface BackupHistoryItem {
  id: string
  type: string
  status: string
  size: number | null
  duration: number | null
  filePath: string | null
  error: string | null
  createdAt: string
  fileExists?: boolean
  isDirectory?: boolean
}

interface RestoreBackup {
  id: string | null
  fileName: string
  filePath: string
  size: number
  date: string
  fileExists: boolean
  isDirectory: boolean
}

interface LogEntry {
  time: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

// ============================================
// CONSTANTS
// ============================================

const defaultConfig: BackupConfig = {
  hostingType: 'dedicated',
  storageType: 'local',
  autoBackup: false,
  frequency: 'daily',
  backupTime: '03:00',
  emailNotify: false,
  notifyEmail: '',
  backupDatabase: true,
  backupUploads: false,
  keepBackups: 7
}

const TOOLTIPS = {
  hostingType: "Selecione onde seu site está hospedado. Isso determina como os backups são armazenados e gerenciados.",
  storageType: "Local salva no servidor. Backblaze B2 envia para a nuvem (10GB grátis, recomendado).",
  autoBackup: "Ativa backups automáticos. Requer configuração de CRON no servidor ou Vercel Cron.",
  frequency: "Define a frequência dos backups automáticos. Diário é recomendado para sites ativos.",
  backupTime: "Horário preferencial para backup automático. Recomendado: madrugada (menor uso).",
  emailNotify: "Receba notificações por email quando backups forem criados ou falharem.",
  backupDatabase: "Inclui todos os dados: times, jogadores, configurações, notícias, etc. ESSENCIAL!",
  backupUploads: "Inclui imagens e arquivos enviados. Aumenta significativamente o tamanho do backup.",
  keepBackups: "Quantidade de backups a manter. Os mais antigos são removidos automaticamente.",
  safetyBackup: "Cria uma cópia de segurança dos dados atuais ANTES de restaurar. Altamente recomendado!",
}

// ============================================
// ANIMATED BACKGROUND COMPONENT
// ============================================

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
      <div className="absolute top-0 -right-40 w-80 h-80 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}

// ============================================
// GLASSMORPHIC CARD COMPONENT
// ============================================

function GlassCard({ 
  children, 
  className = "",
  glow = false,
  glowColor = "primary"
}: { 
  children: React.ReactNode
  className?: string
  glow?: boolean
  glowColor?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const glowColors = {
    primary: 'before:bg-primary/20 hover:shadow-primary/10',
    success: 'before:bg-emerald-500/20 hover:shadow-emerald-500/10',
    warning: 'before:bg-amber-500/20 hover:shadow-amber-500/10',
    danger: 'before:bg-red-500/20 hover:shadow-red-500/10',
    info: 'before:bg-cyan-500/20 hover:shadow-cyan-500/10',
  }

  return (
    <div className={cn(
      "relative rounded-2xl border border-white/10 dark:border-white/5",
      "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl",
      "shadow-xl shadow-black/5 dark:shadow-black/20",
      "transition-all duration-500 ease-out",
      "hover:shadow-2xl hover:border-white/20 dark:hover:border-white/10",
      glow && [
        "before:absolute before:inset-0 before:rounded-2xl before:opacity-0",
        "before:transition-opacity before:duration-500 before:blur-xl before:-z-10",
        "hover:before:opacity-100",
        glowColors[glowColor]
      ],
      className
    )}>
      {children}
    </div>
  )
}

// ============================================
// PREMIUM STATUS CARD
// ============================================

function StatusCard({ 
  icon, 
  label, 
  value, 
  color,
  description,
  pulse = false
}: { 
  icon: React.ReactNode
  label: string
  value: string
  description?: string
  color: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'gray' | 'cyan'
  pulse?: boolean
}) {
  const colorStyles = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      text: 'text-blue-500',
      glow: 'shadow-blue-500/20',
      ring: 'ring-blue-500/20'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      text: 'text-purple-500',
      glow: 'shadow-purple-500/20',
      ring: 'ring-purple-500/20'
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-500',
      glow: 'shadow-emerald-500/20',
      ring: 'ring-emerald-500/20'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      text: 'text-amber-500',
      glow: 'shadow-amber-500/20',
      ring: 'ring-amber-500/20'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
      text: 'text-red-500',
      glow: 'shadow-red-500/20',
      ring: 'ring-red-500/20'
    },
    gray: {
      bg: 'bg-gradient-to-br from-zinc-500/20 to-zinc-600/10',
      border: 'border-zinc-500/30',
      text: 'text-zinc-500',
      glow: 'shadow-zinc-500/20',
      ring: 'ring-zinc-500/20'
    },
    cyan: {
      bg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-500',
      glow: 'shadow-cyan-500/20',
      ring: 'ring-cyan-500/20'
    },
  }

  const styles = colorStyles[color]

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border p-4 sm:p-5",
      "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm",
      "transition-all duration-500 ease-out",
      "hover:scale-[1.02] hover:-translate-y-1",
      "hover:shadow-xl",
      styles.border,
      styles.glow
    )}>
      {/* Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        styles.bg
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className={cn(
            "p-2.5 sm:p-3 rounded-xl transition-all duration-300",
            "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
            "group-hover:scale-110 group-hover:shadow-lg",
            styles.ring,
            "ring-2 ring-inset"
          )}>
            <div className={cn(styles.text, pulse && "animate-pulse")}>
              {icon}
            </div>
          </div>
          
          {pulse && (
            <div className="relative flex h-3 w-3">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", styles.bg.replace('from-', 'bg-').split(' ')[0].replace('/20', ''))} />
              <span className={cn("relative inline-flex rounded-full h-3 w-3", styles.bg.replace('from-', 'bg-').split(' ')[0].replace('/20', ''))} />
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-1">
          <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            {label}
          </p>
          <p className="text-base sm:text-lg font-bold text-foreground truncate">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground/70 truncate">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// HELP TOOLTIP COMPONENT
// ============================================

function HelpTip({ content, side = "top" }: { content: string; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button 
          type="button"
          className={cn(
            "inline-flex ml-1.5 p-0.5 rounded-full",
            "text-muted-foreground/50 hover:text-primary",
            "hover:bg-primary/10 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side={side} 
        className={cn(
          "max-w-[280px] text-xs",
          "bg-zinc-900/95 dark:bg-zinc-800/95 text-white",
          "backdrop-blur-xl border-white/10",
          "shadow-2xl shadow-black/50"
        )}
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// ============================================
// PROGRESS RING COMPONENT
// ============================================

function ProgressRing({ 
  progress, 
  size = 48, 
  strokeWidth = 4,
  showPercent = false
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  showPercent?: boolean
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(262, 83%, 58%)" />
          </linearGradient>
        </defs>
      </svg>
      {showPercent && (
        <span className="absolute text-xs font-bold">{Math.round(progress)}%</span>
      )}
    </div>
  )
}

// ============================================
// SKELETON LOADER COMPONENT
// ============================================

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-muted/50" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 rounded bg-muted/50" />
          <div className="h-5 w-32 rounded bg-muted/50" />
        </div>
      </div>
    </div>
  )
}

function SkeletonHistory() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-muted/30" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-muted/30" />
            <div className="h-3 w-48 rounded bg-muted/30" />
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 rounded-lg bg-muted/30" />
            <div className="w-9 h-9 rounded-lg bg-muted/30" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BackupPage() {
  // Core State
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<BackupConfig>(defaultConfig)
  const [history, setHistory] = useState<BackupHistoryItem[]>([])
  const [creating, setCreating] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Modal State
  const [configOpen, setConfigOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false)
  const [backupToDelete, setBackupToDelete] = useState<BackupHistoryItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  // Restore State
  const [availableBackups, setAvailableBackups] = useState<RestoreBackup[]>([])
  const [loadingBackups, setLoadingBackups] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [createSafetyBackup, setCreateSafetyBackup] = useState(true)
  const [confirmText, setConfirmText] = useState('')
  const [countdown, setCountdown] = useState(5)

  // UI State
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('backup')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [showTerminal, setShowTerminal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [cleaningOrphans, setCleaningOrphans] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  // ============================================
  // HELPERS
  // ============================================

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('pt-BR')
    setLogs(prev => [...prev, { time, message, type }])
    setShowTerminal(true)
    setTimeout(() => {
      terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }, [])

  const clearLogs = () => setLogs([])

  const formatSize = (b: number | null) => {
    if (!b) return '-'
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
    return `${(b / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDuration = (s: number | null) => {
    if (!s) return '-'
    if (s < 60) return `${s}s`
    return `${Math.floor(s / 60)}m${s % 60}s`
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Agora'
    if (diffHours < 24) return `${diffHours}h atrás`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Ontem'
    return `${diffDays} dias`
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // ============================================
  // DATA FETCHING
  // ============================================

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (activeTab === 'restore') fetchAvailableBackups()
  }, [activeTab])

  useEffect(() => {
    if (!restoreConfirmOpen || countdown <= 0) return
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [restoreConfirmOpen, countdown])

  useEffect(() => {
    if (restoreConfirmOpen) {
      setConfirmText('')
      setCountdown(5)
    }
  }, [restoreConfirmOpen])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [configRes, historyRes] = await Promise.all([
        fetch('/api/admin/backup/config'),
        fetch('/api/admin/backup/history')
      ])
      if (configRes.ok) {
        const data = await configRes.json()
        if (data.config) setConfig({ ...defaultConfig, ...data.config })
      }
      if (historyRes.ok) {
        const data = await historyRes.json()
        if (data.history) setHistory(data.history)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchAvailableBackups = async () => {
    setLoadingBackups(true)
    try {
      const res = await fetch('/api/admin/backup/restore')
      const data = await res.json()
      if (data.backups) setAvailableBackups(data.backups)
    } catch (e) { 
      toast.error('Erro ao carregar backups disponíveis')
    }
    finally { setLoadingBackups(false) }
  }

  // ============================================
  // ACTIONS
  // ============================================

  const createBackup = async () => {
    if (config.hostingType === 'vercel' && config.storageType === 'local') {
      toast.error('Vercel + Local não é permitido! Configure Backblaze B2 primeiro.', {
        description: 'Os arquivos são perdidos a cada deploy na Vercel.'
      })
      return
    }

    if (creating) return
    setCreating(true)
    setProgress(0)
    clearLogs()
    addLog('🚀 Iniciando processo de backup...', 'info')
    addLog(`📍 Hospedagem: ${config.hostingType} | Storage: ${config.storageType}`, 'info')
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 12, 90))
    }, 400)
    
    try {
      const res = await fetch('/api/admin/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'manual' })
      })
      const data = await res.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      
      if (data.success) {
        addLog('✅ Backup criado com sucesso!', 'success')
        addLog(`📦 Tamanho: ${data.backup?.sizeFormatted || 'N/A'}`, 'info')
        addLog(`⏱️ Duração: ${data.backup?.durationFormatted || 'N/A'}`, 'info')
        if (data.backup?.isZip) addLog('📁 Formato: ZIP compactado', 'success')
        else addLog('⚠️ Formato: Pasta (ZIP falhou)', 'warning')
        
        toast.success('Backup criado com sucesso!', {
          description: `${data.backup?.sizeFormatted} em ${data.backup?.durationFormatted}`
        })
        await fetchData()
      } else {
        addLog(`❌ Erro: ${data.error}`, 'error')
        toast.error(data.error || 'Erro ao criar backup')
      }
    } catch (e: any) {
      clearInterval(progressInterval)
      addLog(`❌ Erro crítico: ${e.message}`, 'error')
      toast.error('Erro ao criar backup')
    } finally {
      setCreating(false)
      setTimeout(() => setProgress(0), 2000)
      addLog('─'.repeat(40), 'info')
    }
  }

  const saveConfig = async () => {
    try {
      const res = await fetch('/api/admin/backup/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      if (res.ok) {
        toast.success('Configurações salvas com sucesso!')
        setConfigOpen(false)
      } else {
        toast.error('Erro ao salvar configurações')
      }
    } catch { 
      toast.error('Erro ao salvar configurações') 
    }
  }

  const downloadBackup = async (id: string) => {
    addLog('📥 Preparando download...', 'info')
    try {
      const res = await fetch(`/api/admin/backup/download?id=${id}`)
      if (!res.ok) {
        const data = await res.json()
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error || 'Erro no download')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup_${new Date().toISOString().split('T')[0]}.zip`
      a.click()
      URL.revokeObjectURL(url)
      addLog('✅ Download iniciado!', 'success')
      toast.success('Download iniciado!')
    } catch {
      addLog('❌ Erro no download', 'error')
      toast.error('Erro no download')
    }
  }

  const confirmDelete = (b: BackupHistoryItem) => {
    setBackupToDelete(b)
    setDeleteOpen(true)
  }

  const deleteBackup = async () => {
    if (!backupToDelete) return
    setDeleting(true)
    addLog('🗑️ Excluindo backup...', 'info')
    try {
      const res = await fetch(`/api/admin/backup/history?id=${backupToDelete.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        addLog(data.fileDeleted ? '✅ Backup excluído!' : '⚠️ Registro removido (arquivo não encontrado)', data.fileDeleted ? 'success' : 'warning')
        toast.success(data.fileDeleted ? 'Backup excluído!' : 'Registro removido')
        await fetchData()
        setDeleteOpen(false)
        setBackupToDelete(null)
      } else {
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error)
      }
    } catch {
      addLog('❌ Erro ao excluir', 'error')
      toast.error('Erro ao excluir')
    } finally { setDeleting(false) }
  }

  // Limpar registros órfãos (onde o arquivo não existe mais)
  const cleanOrphanRecords = async () => {
    setCleaningOrphans(true)
    addLog('🧹 Limpando registros órfãos...', 'info')
    try {
      const res = await fetch('/api/admin/backup/history?cleanOrphans=true', { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        addLog(`✅ ${data.message}`, 'success')
        toast.success(data.message)
        await fetchData()
      } else {
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error)
      }
    } catch {
      addLog('❌ Erro ao limpar', 'error')
      toast.error('Erro ao limpar registros')
    } finally { setCleaningOrphans(false) }
  }

  const initiateRestore = () => {
    if (!selectedBackup) {
      toast.error('Selecione um backup primeiro')
      return
    }
    const backup = availableBackups.find(b => b.filePath === selectedBackup)
    if (!backup?.fileExists) {
      toast.error('Arquivo de backup não encontrado')
      return
    }
    setRestoreConfirmOpen(true)
  }

  const executeRestore = async () => {
    if (!selectedBackup || restoring) return
    const backup = availableBackups.find(b => b.filePath === selectedBackup)
    if (!backup?.fileExists) return
    
    setRestoring(true)
    clearLogs()
    addLog('🔄 Iniciando restauração...', 'info')
    addLog(`📦 Backup: ${backup.fileName}`, 'info')
    if (createSafetyBackup) addLog('🛡️ Criando backup de segurança...', 'info')
    
    try {
      const res = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedBackup, createSafetyBackup })
      })
      const data = await res.json()
      
      if (data.success) {
        addLog('✅ Restauração concluída!', 'success')
        if (data.safetyBackup) addLog(`🛡️ Backup de segurança: ${data.safetyBackup}`, 'info')
        toast.success('Backup restaurado com sucesso!', {
          description: 'Recarregue a página para ver as alterações'
        })
        setRestoreConfirmOpen(false)
        setTimeout(() => {
          if (confirm('Recarregar página para aplicar alterações?')) {
            window.location.reload()
          }
        }, 1500)
      } else {
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error || 'Erro na restauração')
      }
    } catch (e: any) {
      addLog(`❌ ${e.message}`, 'error')
      toast.error('Erro na restauração')
    } finally {
      setRestoring(false)
      addLog('─'.repeat(40), 'info')
    }
  }

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const lastBackup = history.find(h => h.status === 'success')
  const failedBackups = history.filter(h => h.status === 'failed').length
  const totalBackups = history.filter(h => h.status === 'success').length
  const displayHistory = showAllHistory ? history : history.slice(0, 5)
  const selectedBackupData = availableBackups.find(b => b.filePath === selectedBackup)
  const canRestore = confirmText.toUpperCase() === 'RESTAURAR' && countdown <= 0 && !restoring
  const isVercelLocalBlocked = config.hostingType === 'vercel' && config.storageType === 'local'

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <TooltipProvider>
        <div className="min-h-screen">
          <AnimatedBackground />
          <div className="space-y-6 pb-8 max-w-6xl mx-auto p-4 sm:p-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted/50 animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-48 rounded bg-muted/50 animate-pulse" />
                <div className="h-4 w-32 rounded bg-muted/50 animate-pulse" />
              </div>
            </div>
            
            {/* Status Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
            
            {/* Content Skeleton */}
            <GlassCard className="p-6">
              <SkeletonHistory />
            </GlassCard>
          </div>
        </div>
      </TooltipProvider>
    )
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <AnimatedBackground />
        
        <div className="space-y-6 pb-8 max-w-6xl mx-auto p-4 sm:p-6 relative">
          
          {/* ==================== HEADER ==================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className={cn(
                  "p-2.5 -ml-2 rounded-xl",
                  "text-muted-foreground hover:text-foreground",
                  "bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm",
                  "border border-white/20 dark:border-white/10",
                  "hover:bg-white/80 dark:hover:bg-zinc-800/80",
                  "transition-all duration-300",
                  "hover:scale-105 active:scale-95"
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className={cn(
                    "p-3 sm:p-4 rounded-2xl",
                    "bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20",
                    "border border-primary/30",
                    "shadow-lg shadow-primary/20",
                    "group-hover:shadow-xl group-hover:shadow-primary/30",
                    "transition-all duration-500"
                  )}>
                    <Database className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  {config.autoBackup && (
                    <div className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-background" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Centro de Backup
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Gerenciamento e proteção de dados
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl",
                "bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm",
                "border border-white/20 dark:border-white/10"
              )}>
                <div className="relative flex h-2.5 w-2.5">
                  <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    config.autoBackup ? "bg-emerald-400" : "bg-zinc-400"
                  )} />
                  <span className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    config.autoBackup ? "bg-emerald-500" : "bg-zinc-500"
                  )} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {config.autoBackup ? 'Auto Ativo' : 'Manual'}
                </span>
              </div>
              
              {/* Settings Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setConfigOpen(true)}
                className={cn(
                  "gap-2 h-10 px-4",
                  "bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm",
                  "border-white/20 dark:border-white/10",
                  "hover:bg-white/80 dark:hover:bg-zinc-800/80",
                  "hover:border-primary/50",
                  "transition-all duration-300"
                )}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurar</span>
              </Button>
            </div>
          </div>

          {/* ==================== CRITICAL ALERT ==================== */}
          {isVercelLocalBlocked && (
            <GlassCard className="overflow-hidden" glow glowColor="danger">
              <div className="relative p-5">
                {/* Animated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-20 animate-pulse" />
                
                <div className="relative flex flex-col sm:flex-row gap-4 items-start">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0",
                    "bg-red-500/20 border border-red-500/30"
                  )}>
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-red-500 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Configuração Crítica Detectada!
                    </h3>
                    <p className="text-sm text-red-400/90">
                      <strong>Vercel + Storage Local = Dados serão PERDIDOS!</strong>
                      <br />
                      A Vercel usa armazenamento efêmero. Seus backups serão deletados a cada deploy.
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => setConfigOpen(true)}
                      className={cn(
                        "mt-2 gap-2",
                        "bg-red-500 hover:bg-red-600 text-white",
                        "shadow-lg shadow-red-500/30"
                      )}
                    >
                      <Cloud className="w-4 h-4" />
                      Configurar Backblaze B2 Agora
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* ==================== STATUS CARDS ==================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatusCard 
              icon={<Server className="w-5 h-5 sm:w-6 sm:h-6" />} 
              label="Hospedagem" 
              value={
                config.hostingType === 'vercel' ? 'Vercel' : 
                config.hostingType === 'vps' ? 'VPS' : 
                config.hostingType === 'hostinger' ? 'Hostinger' : 'Dedicado'
              }
              description="Ambiente de produção"
              color={config.hostingType === 'vercel' ? 'purple' : 'blue'} 
            />
            <StatusCard 
              icon={<Cloud className="w-5 h-5 sm:w-6 sm:h-6" />} 
              label="Storage" 
              value={config.storageType === 'backblaze_b2' ? 'Backblaze B2' : 'Local'} 
              description={config.storageType === 'backblaze_b2' ? 'Nuvem segura' : 'Servidor local'}
              color={config.storageType === 'backblaze_b2' ? 'cyan' : isVercelLocalBlocked ? 'red' : 'gray'} 
            />
            <StatusCard 
              icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />} 
              label="Último Backup" 
              value={lastBackup ? getTimeAgo(lastBackup.createdAt) : 'Nunca'} 
              description={lastBackup ? formatSize(lastBackup.size) : 'Crie seu primeiro backup'}
              color={lastBackup ? 'green' : 'yellow'} 
            />
            <StatusCard 
              icon={config.autoBackup ? <Zap className="w-5 h-5 sm:w-6 sm:h-6" /> : <Pause className="w-5 h-5 sm:w-6 sm:h-6" />} 
              label="Automático" 
              value={config.autoBackup ? `${config.frequency === 'daily' ? 'Diário' : 'Semanal'}` : 'Desativado'} 
              description={config.autoBackup ? `Às ${config.backupTime}` : 'Apenas manual'}
              color={config.autoBackup ? 'green' : 'gray'}
              pulse={config.autoBackup}
            />
          </div>

          {/* ==================== QUICK STATS BAR ==================== */}
          <GlassCard className="p-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                <span className="text-sm text-muted-foreground">Backups:</span>
                <span className="text-sm font-bold">{totalBackups}</span>
              </div>
              
              {failedBackups > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  <span className="text-sm text-muted-foreground">Falhas:</span>
                  <span className="text-sm font-bold text-red-500">{failedBackups}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                <span className="text-sm text-muted-foreground">Retenção:</span>
                <span className="text-sm font-bold">{config.keepBackups}</span>
              </div>
              
              {lastBackup?.size && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
                  <span className="text-sm text-muted-foreground">Tamanho:</span>
                  <span className="text-sm font-bold">{formatSize(lastBackup.size)}</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* ==================== TABS ==================== */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={cn(
              "grid w-full grid-cols-2 h-14 sm:h-16 p-2",
              "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl",
              "border border-white/20 dark:border-white/10",
              "rounded-2xl shadow-lg"
            )}>
              <TabsTrigger 
                value="backup" 
                className={cn(
                  "h-full rounded-xl text-sm sm:text-base font-medium",
                  "transition-all duration-300",
                  "data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800",
                  "data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10",
                  "data-[state=active]:text-primary"
                )}
              >
                <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Backup</span>
              </TabsTrigger>
              <TabsTrigger 
                value="restore"
                className={cn(
                  "h-full rounded-xl text-sm sm:text-base font-medium",
                  "transition-all duration-300",
                  "data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800",
                  "data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/10",
                  "data-[state=active]:text-amber-500"
                )}
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Restauração</span>
              </TabsTrigger>
            </TabsList>

            {/* ==================== TAB: BACKUP ==================== */}
            <TabsContent value="backup" className="space-y-6 mt-0">
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={createBackup} 
                  disabled={creating || isVercelLocalBlocked}
                  size="lg"
                  className={cn(
                    "relative overflow-hidden h-14 sm:h-12 sm:flex-1 sm:max-w-xs",
                    "bg-gradient-to-r from-primary via-purple-500 to-pink-500",
                    "hover:shadow-xl hover:shadow-primary/30",
                    "transition-all duration-500",
                    "disabled:opacity-50"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2 font-semibold">
                    {creating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Criando backup...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-5 h-5" />
                        <span>Criar Backup Agora</span>
                      </>
                    )}
                  </span>
                  
                  {/* Progress Bar */}
                  {creating && progress > 0 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-white/50 transition-all duration-300" style={{ width: `${progress}%` }} />
                  )}
                  
                  {/* Shimmer Effect */}
                  {!creating && (
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={fetchData}
                  disabled={creating}
                  className={cn(
                    "h-14 sm:h-12 px-6",
                    "bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm",
                    "border-white/20 dark:border-white/10",
                    "hover:bg-white/80 dark:hover:bg-zinc-800/80"
                  )}
                >
                  <RefreshCw className={cn("w-5 h-5 mr-2", loading && "animate-spin")} />
                  Atualizar
                </Button>
              </div>

              {/* History */}
              <GlassCard className="overflow-hidden" glow glowColor="primary">
                <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <History className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Histórico de Backups</h3>
                      <p className="text-xs text-muted-foreground">{history.length} registros encontrados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Botão limpar órfãos - só mostra se houver registros sem arquivo */}
                    {history.some(h => h.fileExists === false) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cleanOrphanRecords}
                        disabled={cleaningOrphans}
                        className="text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                      >
                        {cleaningOrphans ? (
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 mr-1" />
                        )}
                        Limpar órfãos
                      </Button>
                    )}
                    <span className={cn(
                      "text-xs font-medium px-3 py-1.5 rounded-full",
                      "bg-primary/10 text-primary"
                    )}>
                      {totalBackups} sucesso
                    </span>
                  </div>
                </div>
                
                {history.length === 0 ? (
                  <div className="p-12 sm:p-16 text-center">
                    <div className={cn(
                      "w-20 h-20 rounded-2xl mx-auto mb-6",
                      "bg-gradient-to-br from-primary/20 to-purple-500/20",
                      "flex items-center justify-center"
                    )}>
                      <Database className="w-10 h-10 text-primary/50" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Nenhum backup ainda</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Clique no botão acima para criar seu primeiro backup
                    </p>
                    <Button 
                      onClick={createBackup}
                      disabled={isVercelLocalBlocked}
                      className="bg-primary"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Criar Primeiro Backup
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {displayHistory.map((b, i) => (
                      <div 
                        key={b.id} 
                        className={cn(
                          "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4",
                          "transition-all duration-300",
                          "hover:bg-white/50 dark:hover:bg-white/5",
                          i === 0 && b.status === 'success' && "bg-emerald-500/5"
                        )}
                      >
                        {/* Status Icon */}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          "transition-all duration-300",
                          b.status === 'success' && "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-500",
                          b.status === 'failed' && "bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-500",
                          b.status === 'pending' && "bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-500"
                        )}>
                          {b.status === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                           b.status === 'failed' ? <XCircle className="w-6 h-6" /> :
                           <Loader2 className="w-6 h-6 animate-spin" />}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {b.type === 'manual' ? 'Backup Manual' : 'Backup Automático'}
                            </span>
                            {i === 0 && b.status === 'success' && (
                              <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                              )}>
                                Mais Recente
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(b.createdAt)}
                            </span>
                            {b.size && (
                              <span className="flex items-center gap-1">
                                <HardDrive className="w-3.5 h-3.5" />
                                {formatSize(b.size)}
                              </span>
                            )}
                            {b.duration && (
                              <span className="flex items-center gap-1">
                                <Activity className="w-3.5 h-3.5" />
                                {formatDuration(b.duration)}
                              </span>
                            )}
                            {b.fileExists === false && (
                              <span className="text-amber-500 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Arquivo não encontrado
                              </span>
                            )}
                          </div>
                          {b.error && (
                            <p className="text-xs text-red-400 mt-2 truncate">{b.error}</p>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {b.status === 'success' && b.fileExists !== false && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => downloadBackup(b.id)}
                                  className={cn(
                                    "h-10 w-10 rounded-xl",
                                    "hover:bg-primary/10 hover:text-primary",
                                    "transition-all duration-300"
                                  )}
                                >
                                  <Download className="w-5 h-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Baixar backup</TooltipContent>
                            </Tooltip>
                          )}
                          
                          {b.filePath && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => copyToClipboard(b.filePath!, b.id)}
                                  className={cn(
                                    "h-10 w-10 rounded-xl",
                                    "hover:bg-blue-500/10 hover:text-blue-500",
                                    "transition-all duration-300"
                                  )}
                                >
                                  {copiedId === b.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copiar caminho</TooltipContent>
                            </Tooltip>
                          )}
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => confirmDelete(b)}
                                className={cn(
                                  "h-10 w-10 rounded-xl",
                                  "hover:bg-red-500/10 hover:text-red-500",
                                  "transition-all duration-300"
                                )}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {history.length > 5 && (
                  <div className="p-3 border-t border-white/5">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowAllHistory(!showAllHistory)}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      {showAllHistory ? (
                        <><ChevronUp className="w-4 h-4 mr-2" /> Mostrar menos</>
                      ) : (
                        <><ChevronDown className="w-4 h-4 mr-2" /> Ver todos ({history.length})</>
                      )}
                    </Button>
                  </div>
                )}
              </GlassCard>
            </TabsContent>

            {/* ==================== TAB: RESTORE ==================== */}
            <TabsContent value="restore" className="space-y-6 mt-0">
              
              {/* Warning Banner */}
              <GlassCard className="p-5" glow glowColor="warning">
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/20 shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-amber-500">Operação Sensível</h4>
                    <p className="text-sm text-muted-foreground">
                      A restauração substituirá <strong className="text-foreground">todos</strong> os dados atuais. 
                      Um backup de segurança será criado automaticamente antes da operação.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Available Backups */}
              <GlassCard className="overflow-hidden" glow glowColor="info">
                <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10">
                      <FileArchive className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Backups Disponíveis</h3>
                      <p className="text-xs text-muted-foreground">{availableBackups.length} arquivos encontrados</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fetchAvailableBackups}
                    disabled={loadingBackups}
                    className="gap-2"
                  >
                    <RefreshCw className={cn("w-4 h-4", loadingBackups && "animate-spin")} />
                    Atualizar
                  </Button>
                </div>

                {loadingBackups ? (
                  <div className="p-8">
                    <SkeletonHistory />
                  </div>
                ) : availableBackups.length === 0 ? (
                  <div className="p-12 sm:p-16 text-center">
                    <div className={cn(
                      "w-20 h-20 rounded-2xl mx-auto mb-6",
                      "bg-gradient-to-br from-cyan-500/20 to-blue-500/20",
                      "flex items-center justify-center"
                    )}>
                      <FolderOpen className="w-10 h-10 text-cyan-500/50" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Nenhum backup disponível</h4>
                    <p className="text-sm text-muted-foreground">
                      Crie um backup primeiro na aba "Backup"
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                    {availableBackups.map((b) => (
                      <label
                        key={b.filePath}
                        className={cn(
                          "flex items-center gap-4 p-4 sm:p-5 cursor-pointer",
                          "transition-all duration-300",
                          selectedBackup === b.filePath 
                            ? "bg-primary/10 border-l-4 border-l-primary" 
                            : "hover:bg-white/50 dark:hover:bg-white/5",
                          !b.fileExists && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <input
                          type="radio"
                          name="backup"
                          value={b.filePath}
                          checked={selectedBackup === b.filePath}
                          onChange={(e) => b.fileExists && setSelectedBackup(e.target.value)}
                          disabled={!b.fileExists}
                          className="sr-only"
                        />
                        
                        {/* Custom Radio */}
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                          "transition-all duration-300",
                          selectedBackup === b.filePath 
                            ? "border-primary bg-primary" 
                            : "border-muted-foreground/30"
                        )}>
                          {selectedBackup === b.filePath && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        
                        {/* Icon */}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          b.fileExists 
                            ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-500" 
                            : "bg-muted/50 text-muted-foreground"
                        )}>
                          {b.isDirectory ? <FolderOpen className="w-6 h-6" /> : <FileArchive className="w-6 h-6" />}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{b.fileName}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {formatDate(b.date)} • {formatSize(b.size)} • {b.isDirectory ? 'Pasta' : 'ZIP'}
                          </p>
                        </div>
                        
                        {!b.fileExists && (
                          <span className="text-xs text-red-400 shrink-0">Indisponível</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Safety Backup Option */}
              <GlassCard className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-semibold">Backup de Segurança</h4>
                        <HelpTip content={TOOLTIPS.safetyBackup} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Salva os dados atuais antes de restaurar
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={createSafetyBackup} 
                    onCheckedChange={setCreateSafetyBackup}
                  />
                </div>
              </GlassCard>

              {/* Restore Button */}
              <Button 
                onClick={initiateRestore}
                disabled={!selectedBackup || restoring}
                size="lg"
                className={cn(
                  "w-full h-14",
                  "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500",
                  "hover:shadow-xl hover:shadow-amber-500/30",
                  "disabled:opacity-50",
                  "transition-all duration-500"
                )}
              >
                {restoring ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Restaurando...</>
                ) : (
                  <><Upload className="w-5 h-5 mr-2" /> Restaurar Backup Selecionado</>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* ==================== TERMINAL LOG ==================== */}
          {showTerminal && logs.length > 0 && (
            <GlassCard className="overflow-hidden bg-zinc-900/95 dark:bg-zinc-950/95 border-zinc-700/50">
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/80 border-b border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" onClick={() => setShowTerminal(false)} />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-zinc-300">Log de Operações</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={clearLogs}
                      >
                        <Eraser className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Limpar</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={() => setShowTerminal(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fechar</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div 
                ref={terminalRef} 
                className="p-4 max-h-[200px] overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin scrollbar-thumb-zinc-700"
              >
                {logs.map((log, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex gap-3 animate-in fade-in slide-in-from-left-2 duration-200",
                      log.type === 'success' && "text-emerald-400",
                      log.type === 'error' && "text-red-400",
                      log.type === 'warning' && "text-amber-400",
                      log.type === 'info' && "text-zinc-400"
                    )}
                  >
                    <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* ==================== MODAL: CONFIGURAÇÕES ==================== */}
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogContent className={cn(
              "max-w-lg max-h-[90vh] overflow-y-auto",
              "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl",
              "border-white/20 dark:border-white/10"
            )}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  Configurações de Backup
                </DialogTitle>
                <DialogDescription>
                  Configure como seus backups serão criados e armazenados
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Hosting Type */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="text-sm font-medium">Tipo de Hospedagem</Label>
                    <HelpTip content={TOOLTIPS.hostingType} />
                  </div>
                  <Select value={config.hostingType} onValueChange={(v) => setConfig({...config, hostingType: v})}>
                    <SelectTrigger className="bg-white/50 dark:bg-zinc-800/50 border-white/20 dark:border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vercel">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          Vercel (Serverless)
                        </div>
                      </SelectItem>
                      <SelectItem value="vps">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          VPS
                        </div>
                      </SelectItem>
                      <SelectItem value="dedicated">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          Servidor Dedicado
                        </div>
                      </SelectItem>
                      <SelectItem value="hostinger">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          Hostinger
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Storage Type */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="text-sm font-medium">Armazenamento</Label>
                    <HelpTip content={TOOLTIPS.storageType} />
                  </div>
                  <Select value={config.storageType} onValueChange={(v) => setConfig({...config, storageType: v})}>
                    <SelectTrigger className="bg-white/50 dark:bg-zinc-800/50 border-white/20 dark:border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4" />
                          Local (Servidor)
                        </div>
                      </SelectItem>
                      <SelectItem value="backblaze_b2">
                        <div className="flex items-center gap-2">
                          <Cloud className="w-4 h-4" />
                          Backblaze B2
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {config.hostingType === 'vercel' && config.storageType === 'local' && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Vercel não suporta storage local persistente!
                    </p>
                  )}
                </div>

                {/* Backup Content */}
                <GlassCard className="p-4 space-y-4">
                  <Label className="text-sm font-medium">Conteúdo do Backup</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Database className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Banco de Dados</p>
                        <p className="text-xs text-muted-foreground">~500 KB (essencial)</p>
                      </div>
                      <HelpTip content={TOOLTIPS.backupDatabase} side="right" />
                    </div>
                    <Switch 
                      checked={config.backupDatabase} 
                      onCheckedChange={(v) => setConfig({...config, backupDatabase: v})} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <FolderOpen className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Imagens/Uploads</p>
                        <p className="text-xs text-muted-foreground">Pode ser grande</p>
                      </div>
                      <HelpTip content={TOOLTIPS.backupUploads} side="right" />
                    </div>
                    <Switch 
                      checked={config.backupUploads} 
                      onCheckedChange={(v) => setConfig({...config, backupUploads: v})} 
                    />
                  </div>
                  
                  {!config.backupDatabase && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-xs text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Sem banco de dados = sem dados importantes!
                      </p>
                    </div>
                  )}
                </GlassCard>

                {/* Auto Backup */}
                <GlassCard className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Zap className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Backup Automático</p>
                        <p className="text-xs text-muted-foreground">Requer CRON</p>
                      </div>
                      <HelpTip content={TOOLTIPS.autoBackup} side="right" />
                    </div>
                    <Switch 
                      checked={config.autoBackup} 
                      onCheckedChange={(v) => setConfig({...config, autoBackup: v})} 
                    />
                  </div>
                  
                  {config.autoBackup && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center">
                          <Label className="text-xs">Frequência</Label>
                          <HelpTip content={TOOLTIPS.frequency} />
                        </div>
                        <Select value={config.frequency} onValueChange={(v) => setConfig({...config, frequency: v})}>
                          <SelectTrigger className="h-9 bg-white/50 dark:bg-zinc-800/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center">
                          <Label className="text-xs">Horário</Label>
                          <HelpTip content={TOOLTIPS.backupTime} />
                        </div>
                        <Input 
                          type="time" 
                          value={config.backupTime} 
                          onChange={(e) => setConfig({...config, backupTime: e.target.value})} 
                          className="h-9 bg-white/50 dark:bg-zinc-800/50"
                        />
                      </div>
                    </div>
                  )}
                </GlassCard>

                {/* Retention */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="text-sm font-medium">Manter Últimos</Label>
                    <HelpTip content={TOOLTIPS.keepBackups} />
                  </div>
                  <Select value={String(config.keepBackups)} onValueChange={(v) => setConfig({...config, keepBackups: parseInt(v)})}>
                    <SelectTrigger className="bg-white/50 dark:bg-zinc-800/50 border-white/20 dark:border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 5, 7, 14, 30].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} backups</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Email Notifications */}
                <GlassCard className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Notificações por Email</p>
                        <p className="text-xs text-muted-foreground">Receba alertas</p>
                      </div>
                      <HelpTip content={TOOLTIPS.emailNotify} side="right" />
                    </div>
                    <Switch 
                      checked={config.emailNotify} 
                      onCheckedChange={(v) => setConfig({...config, emailNotify: v})} 
                    />
                  </div>
                  
                  {config.emailNotify && (
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={config.notifyEmail} 
                      onChange={(e) => setConfig({...config, notifyEmail: e.target.value})}
                      className="bg-white/50 dark:bg-zinc-800/50"
                    />
                  )}
                </GlassCard>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setConfigOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveConfig} className="bg-primary gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Salvar Configurações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* ==================== MODAL: EXCLUIR ==================== */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className={cn(
              "max-w-sm",
              "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl",
              "border-red-500/30"
            )}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-red-500">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  Excluir Backup
                </DialogTitle>
              </DialogHeader>
              
              {backupToDelete && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Tem certeza que deseja excluir este backup?
                  </p>
                  <GlassCard className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span className="font-medium">{formatDate(backupToDelete.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span className="font-medium">{formatSize(backupToDelete.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">{backupToDelete.type === 'manual' ? 'Manual' : 'Automático'}</span>
                    </div>
                  </GlassCard>
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-xs text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Esta ação é irreversível
                    </p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={deleteBackup} 
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* ==================== MODAL: CONFIRMAR RESTAURAÇÃO ==================== */}
          <Dialog open={restoreConfirmOpen} onOpenChange={setRestoreConfirmOpen}>
            <DialogContent className={cn(
              "max-w-md",
              "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl",
              "border-red-500/30"
            )}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-red-500">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  Confirmar Restauração
                </DialogTitle>
                <DialogDescription>
                  Esta é uma operação crítica e irreversível
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Warning */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30">
                  <p className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    ATENÇÃO: Esta ação é IRREVERSÍVEL!
                  </p>
                  <ul className="text-xs text-red-400/90 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Todos os dados atuais serão <strong>substituídos</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Times, jogadores, configurações - TUDO será alterado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Não será possível desfazer após confirmar</span>
                    </li>
                  </ul>
                </div>

                {/* Backup Info */}
                {selectedBackupData && (
                  <GlassCard className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Backup:</span>
                      <span className="font-medium truncate ml-2">{selectedBackupData.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span className="font-medium">{formatDate(selectedBackupData.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span className="font-medium">{formatSize(selectedBackupData.size)}</span>
                    </div>
                  </GlassCard>
                )}

                {/* Safety Backup Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Backup de segurança</p>
                      <p className="text-xs text-muted-foreground">Salva dados atuais antes</p>
                    </div>
                  </div>
                  <Switch checked={createSafetyBackup} onCheckedChange={setCreateSafetyBackup} />
                </div>

                {/* Confirmation Input */}
                <div className="space-y-2">
                  <Label className="text-sm">
                    Digite <strong className="text-red-500 font-bold">RESTAURAR</strong> para confirmar:
                  </Label>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Digite aqui..."
                    className="bg-white/50 dark:bg-zinc-800/50 font-mono"
                    autoComplete="off"
                    disabled={restoring}
                  />
                </div>

                {/* Countdown */}
                {countdown > 0 && (
                  <div className="flex items-center justify-center gap-4 py-3">
                    <ProgressRing progress={(5 - countdown) / 5 * 100} size={48} />
                    <div className="text-center">
                      <p className="text-2xl font-bold">{countdown}</p>
                      <p className="text-xs text-muted-foreground">segundos</p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setRestoreConfirmOpen(false)} disabled={restoring}>
                  Cancelar
                </Button>
                <Button
                  onClick={executeRestore}
                  disabled={!canRestore}
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  {restoring ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Restaurando...</>
                  ) : countdown > 0 ? (
                    `Aguarde ${countdown}s...`
                  ) : (
                    <><Upload className="w-4 h-4" /> Confirmar Restauração</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
      
      {/* ==================== GLOBAL STYLES ==================== */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 10px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 12s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </TooltipProvider>
  )
}
