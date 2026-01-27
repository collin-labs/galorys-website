"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft, Database, Download, Upload, RefreshCw, Trash2,
  AlertTriangle, Cloud, Server, Settings, CheckCircle2, XCircle,
  Loader2, Play, Pause, History, FileArchive, Calendar,
  ChevronDown, ChevronUp, Terminal, X, Eraser,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

// Types
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

export default function BackupPage() {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<BackupConfig>(defaultConfig)
  const [history, setHistory] = useState<BackupHistoryItem[]>([])
  const [creating, setCreating] = useState(false)
  
  const [configOpen, setConfigOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [backupToDelete, setBackupToDelete] = useState<BackupHistoryItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  const [availableBackups, setAvailableBackups] = useState<RestoreBackup[]>([])
  const [loadingBackups, setLoadingBackups] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [createSafetyBackup, setCreateSafetyBackup] = useState(true)

  const [showAllHistory, setShowAllHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('backup')
  
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [showTerminal, setShowTerminal] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('pt-BR')
    setLogs(prev => [...prev, { time, message, type }])
    setShowTerminal(true)
    setTimeout(() => {
      terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight)
    }, 50)
  }

  const clearLogs = () => setLogs([])

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (activeTab === 'restore') fetchAvailableBackups()
  }, [activeTab])

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
    } catch (e) { toast.error('Erro ao carregar') }
    finally { setLoadingBackups(false) }
  }

  const createBackup = async () => {
    if (creating) return
    setCreating(true)
    clearLogs()
    addLog('Iniciando backup...', 'info')
    
    try {
      const res = await fetch('/api/admin/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'manual' })
      })
      const data = await res.json()
      
      if (data.success) {
        addLog('✅ Backup criado!', 'success')
        addLog(`📦 ${data.backup?.sizeFormatted || 'N/A'} em ${data.backup?.durationFormatted || 'N/A'}`, 'info')
        if (data.backup?.isZip) addLog('✅ ZIP criado', 'success')
        else addLog('⚠️ Backup em pasta (ZIP falhou)', 'warning')
        toast.success('Backup criado!')
        await fetchData()
      } else {
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error || 'Erro')
      }
    } catch (e: any) {
      addLog(`❌ ${e.message}`, 'error')
      toast.error('Erro')
    } finally {
      setCreating(false)
      addLog('--- Finalizado ---', 'info')
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
        toast.success('Salvo!')
        setConfigOpen(false)
      } else toast.error('Erro')
    } catch { toast.error('Erro') }
  }

  const downloadBackup = async (id: string) => {
    addLog('Baixando...', 'info')
    try {
      const res = await fetch(`/api/admin/backup/download?id=${id}`)
      if (!res.ok) {
        const data = await res.json()
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error || 'Erro')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup_${new Date().toISOString().split('T')[0]}.zip`
      a.click()
      URL.revokeObjectURL(url)
      addLog('✅ Download iniciado', 'success')
      toast.success('Download iniciado!')
    } catch {
      addLog('❌ Erro', 'error')
      toast.error('Erro')
    }
  }

  const confirmDelete = (b: BackupHistoryItem) => {
    setBackupToDelete(b)
    setDeleteOpen(true)
  }

  const deleteBackup = async () => {
    if (!backupToDelete) return
    setDeleting(true)
    addLog('Excluindo...', 'info')
    try {
      const res = await fetch(`/api/admin/backup/history?id=${backupToDelete.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        addLog(data.fileDeleted ? '✅ Excluído' : '⚠️ Registro removido', data.fileDeleted ? 'success' : 'warning')
        toast.success(data.fileDeleted ? 'Excluído!' : 'Registro removido')
        await fetchData()
        setDeleteOpen(false)
        setBackupToDelete(null)
      } else {
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error)
      }
    } catch {
      addLog('❌ Erro', 'error')
      toast.error('Erro')
    } finally { setDeleting(false) }
  }

  const executeRestore = async () => {
    if (!selectedBackup || restoring) return
    const backup = availableBackups.find(b => b.filePath === selectedBackup)
    if (!backup?.fileExists) return toast.error('Indisponível')
    
    setRestoring(true)
    clearLogs()
    addLog('🔄 Iniciando restauração...', 'info')
    addLog(`📦 ${backup.fileName}`, 'info')
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
        if (data.safetyBackup) addLog(`🛡️ Segurança: ${data.safetyBackup}`, 'info')
        toast.success('Restaurado!')
        setTimeout(() => {
          if (confirm('Recarregar página?')) window.location.reload()
        }, 1000)
      } else {
        addLog(`❌ ${data.error}`, 'error')
        toast.error(data.error)
      }
    } catch (e: any) {
      addLog(`❌ ${e.message}`, 'error')
      toast.error('Erro')
    } finally {
      setRestoring(false)
      addLog('--- Finalizado ---', 'info')
    }
  }

  const formatSize = (b: number | null) => !b ? '-' : b < 1024 ? `${b} B` : b < 1024*1024 ? `${(b/1024).toFixed(0)} KB` : `${(b/(1024*1024)).toFixed(1)} MB`
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  const formatDuration = (s: number | null) => !s ? '-' : s < 60 ? `${s}s` : `${Math.floor(s/60)}m${s%60}s`

  const lastBackup = history.find(h => h.status === 'success')
  const displayHistory = showAllHistory ? history : history.slice(0, 5)

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link href="/admin" className="p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Database className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-base sm:text-lg font-bold truncate">Backup & Restauração</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setConfigOpen(true)} className="shrink-0">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline ml-1.5">Config</span>
          </Button>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <StatusCard icon={<Server className="w-4 h-4" />} label="Hospedagem" value={config.hostingType} color="blue" />
          <StatusCard icon={<Cloud className="w-4 h-4" />} label="Storage" value={config.storageType.replace('_', ' ')} color="purple" />
          <StatusCard icon={<Calendar className="w-4 h-4" />} label="Último" value={lastBackup ? formatDate(lastBackup.createdAt).split(',')[0] : 'Nunca'} color={lastBackup ? "green" : "yellow"} />
          <StatusCard icon={config.autoBackup ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />} label="Auto" value={config.autoBackup ? 'Ativo' : 'Off'} color={config.autoBackup ? "green" : "gray"} />
        </div>

        {/* Alerta */}
        {config.hostingType === 'vercel' && config.storageType === 'local' && (
          <div className="flex gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-500">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Vercel + Local = temporário. Configure Google Drive!</span>
          </div>
        )}

        {/* Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4 h-12 p-1 bg-muted/50">
            <TabsTrigger 
              value="backup" 
              className="h-10 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Database className="w-4 h-4 mr-2" />
              Backup
            </TabsTrigger>
            <TabsTrigger 
              value="restore"
              className="h-10 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Upload className="w-4 h-4 mr-2" />
              Restauração
            </TabsTrigger>
          </TabsList>

          {/* ABA BACKUP */}
          <TabsContent value="backup" className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={createBackup} disabled={creating} className="flex-1 sm:flex-none">
                {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                {creating ? 'Criando...' : 'Criar Backup'}
              </Button>
              <Button variant="ghost" size="icon" onClick={fetchData} className="ml-auto">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Histórico */}
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Histórico ({history.length})</span>
              </div>

              {history.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <FileArchive className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhum backup</p>
                </div>
              ) : (
                <div className="divide-y">
                  {displayHistory.map((b) => (
                    <div key={b.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-muted/30">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        b.status === 'success' ? 'bg-green-500/20' : b.status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {b.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                         b.status === 'failed' ? <XCircle className="w-4 h-4 text-red-500" /> :
                         <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2">
                          <span className="text-sm font-medium">{b.type === 'manual' ? 'Manual' : 'Auto'}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {b.status === 'success' ? `${formatSize(b.size)} • ${formatDuration(b.duration)}` :
                           b.status === 'failed' ? <span className="text-red-400">{b.error || 'Erro'}</span> : 'Em andamento...'}
                        </p>
                      </div>
                      {b.status === 'success' && (
                        <div className="flex items-center gap-1">
                          <Tooltip><TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadBackup(b.id)}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger><TooltipContent>Baixar</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => confirmDelete(b)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger><TooltipContent>Excluir</TooltipContent></Tooltip>
                        </div>
                      )}
                      {(b.status === 'failed' || b.status === 'in_progress') && (
                        <Tooltip><TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => confirmDelete(b)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger><TooltipContent>{b.status === 'in_progress' ? 'Remover travado' : 'Excluir'}</TooltipContent></Tooltip>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {history.length > 5 && (
                <button onClick={() => setShowAllHistory(!showAllHistory)} className="w-full p-2 text-xs text-muted-foreground hover:bg-muted/30 flex items-center justify-center gap-1 border-t">
                  {showAllHistory ? <><ChevronUp className="w-3 h-3" /> Menos</> : <><ChevronDown className="w-3 h-3" /> Mais ({history.length - 5})</>}
                </button>
              )}
            </div>
          </TabsContent>

          {/* ABA RESTAURAÇÃO */}
          <TabsContent value="restore" className="space-y-4">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-500"><strong>Atenção!</strong> A restauração substitui todo o banco atual.</p>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileArchive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Backups ({availableBackups.length})</span>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchAvailableBackups} disabled={loadingBackups}>
                  <RefreshCw className={`w-4 h-4 ${loadingBackups ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {loadingBackups ? (
                <div className="p-8 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
              ) : availableBackups.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">Nenhum backup</div>
              ) : (
                <div className="divide-y max-h-[300px] overflow-y-auto">
                  {availableBackups.map((b) => (
                    <div key={b.filePath} onClick={() => b.fileExists && setSelectedBackup(b.filePath)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                        !b.fileExists ? 'opacity-40 cursor-not-allowed' :
                        selectedBackup === b.filePath ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted/30'
                      }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${b.fileExists ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {b.fileExists ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{b.fileName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(b.date)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium">{formatSize(b.size)}</p>
                        <p className="text-xs text-muted-foreground">{b.isDirectory ? 'Pasta' : 'ZIP'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Switch checked={createSafetyBackup} onCheckedChange={setCreateSafetyBackup} id="safety" />
                <Label htmlFor="safety" className="text-sm cursor-pointer">
                  <span className="font-medium">Backup de segurança</span>
                  <span className="block text-xs text-muted-foreground">Salva o atual antes</span>
                </Label>
              </div>
              <Button onClick={executeRestore} disabled={!selectedBackup || restoring} className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700">
                {restoring ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                {restoring ? 'Restaurando...' : 'Restaurar'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Terminal */}
        {showTerminal && logs.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-800 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-zinc-300">Log</span>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip><TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white" onClick={clearLogs}>
                    <Eraser className="w-4 h-4" />
                  </Button>
                </TooltipTrigger><TooltipContent>Limpar</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white" onClick={() => setShowTerminal(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger><TooltipContent>Fechar</TooltipContent></Tooltip>
              </div>
            </div>
            <div ref={terminalRef} className="p-3 max-h-[180px] overflow-y-auto font-mono text-xs space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 ${
                  log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-zinc-400'
                }`}>
                  <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Config */}
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle><Settings className="w-5 h-5 inline mr-2" />Configurações</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Hospedagem</Label>
                <Select value={config.hostingType} onValueChange={(v) => setConfig({...config, hostingType: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vercel">Vercel</SelectItem>
                    <SelectItem value="vps">VPS</SelectItem>
                    <SelectItem value="dedicated">Dedicado</SelectItem>
                    <SelectItem value="hostinger">Hostinger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Storage</Label>
                <Select value={config.storageType} onValueChange={(v) => setConfig({...config, storageType: v})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="google_drive">Google Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <Label className="text-xs text-muted-foreground">Incluir</Label>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Banco de dados</p><p className="text-xs text-muted-foreground">~500KB</p></div>
                  <Switch checked={config.backupDatabase} onCheckedChange={(v) => setConfig({...config, backupDatabase: v})} />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Imagens</p><p className="text-xs text-muted-foreground">Pode ser grande</p></div>
                  <Switch checked={config.backupUploads} onCheckedChange={(v) => setConfig({...config, backupUploads: v})} />
                </div>
                {!config.backupDatabase && <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">⚠️ Sem banco = sem dados!</div>}
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div><p className="text-sm font-medium">Auto Backup</p><p className="text-xs text-muted-foreground">Requer CRON</p></div>
                <Switch checked={config.autoBackup} onCheckedChange={(v) => setConfig({...config, autoBackup: v})} />
              </div>
              {config.autoBackup && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Frequência</Label>
                    <Select value={config.frequency} onValueChange={(v) => setConfig({...config, frequency: v})}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="daily">Diário</SelectItem><SelectItem value="weekly">Semanal</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Horário</Label>
                    <Input type="time" value={config.backupTime} onChange={(e) => setConfig({...config, backupTime: e.target.value})} className="mt-1" />
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">Manter últimos</Label>
                <Select value={String(config.keepBackups)} onValueChange={(v) => setConfig({...config, keepBackups: parseInt(v)})}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{[3,5,7,14,30].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                <Switch checked={config.emailNotify} onCheckedChange={(v) => setConfig({...config, emailNotify: v})} />
              </div>
              {config.emailNotify && <Input type="email" placeholder="email@exemplo.com" value={config.notifyEmail} onChange={(e) => setConfig({...config, notifyEmail: e.target.value})} />}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setConfigOpen(false)}>Cancelar</Button>
              <Button onClick={saveConfig}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Delete */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle className="text-red-500"><Trash2 className="w-5 h-5 inline mr-2" />Excluir</DialogTitle></DialogHeader>
            {backupToDelete && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Tem certeza?</p>
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p><strong>Data:</strong> {formatDate(backupToDelete.createdAt)}</p>
                  <p><strong>Tamanho:</strong> {formatSize(backupToDelete.size)}</p>
                </div>
                <p className="text-xs text-red-400">Irreversível.</p>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
              <Button onClick={deleteBackup} disabled={deleting} className="bg-red-600 hover:bg-red-700">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

function StatusCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-500', purple: 'bg-purple-500/10 text-purple-500',
    green: 'bg-green-500/10 text-green-500', yellow: 'bg-yellow-500/10 text-yellow-500', gray: 'bg-muted text-muted-foreground',
  }
  return (
    <div className="bg-card border rounded-lg p-2.5 sm:p-3">
      <div className={`inline-flex items-center gap-1.5 text-xs mb-1 ${colors[color]} px-1.5 py-0.5 rounded`}>
        {icon}<span className="opacity-80">{label}</span>
      </div>
      <p className="text-sm font-semibold capitalize truncate">{value}</p>
    </div>
  )
}
