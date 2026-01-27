"use client"

import { useState, useEffect } from "react"
import { 
  MessageSquare, Search, Mail, MailOpen, Trash2, Loader2, 
  Star, Archive, RotateCcw, Tag, StickyNote, Download, 
  Inbox, Clock, Calendar, Filter, MoreVertical, CheckSquare,
  Reply, ChevronDown, X, AlertCircle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  starred: boolean
  archived: boolean
  deleted: boolean
  deletedAt: string | null
  label: string | null
  notes: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  unread: number
  starred: number
  archived: number
  trash: number
  today: number
  week: number
  byLabel: Record<string, number>
}

const labels = [
  { value: 'parceria', label: 'Parceria', color: 'bg-blue-500' },
  { value: 'patrocinio', label: 'Patrocínio', color: 'bg-green-500' },
  { value: 'imprensa', label: 'Imprensa', color: 'bg-purple-500' },
  { value: 'suporte', label: 'Suporte', color: 'bg-orange-500' },
  { value: 'outro', label: 'Outro', color: 'bg-gray-500' },
]

const sidebarItems = [
  { id: 'inbox', icon: Inbox, label: 'Caixa de Entrada', color: 'text-blue-400' },
  { id: 'starred', icon: Star, label: 'Favoritas', color: 'text-yellow-400' },
  { id: 'archived', icon: Archive, label: 'Arquivadas', color: 'text-gray-400' },
  { id: 'trash', icon: Trash2, label: 'Lixeira', color: 'text-red-400' },
]

export default function MensagensPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("inbox")
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState("")
  const [showLabelMenu, setShowLabelMenu] = useState(false)

  // Buscar mensagens
  useEffect(() => {
    fetchMessages()
  }, [activeFilter, activeLabel])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      let url = `/api/admin/messages?filter=${activeFilter}`
      if (activeLabel) url += `&label=${activeLabel}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      
      const response = await fetch(url)
      const data = await response.json()
      setMessages(data.messages || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  // Buscar ao pesquisar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== "") fetchMessages()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Ações
  const handleAction = async (action: string, messageId?: string, value?: any) => {
    try {
      const ids = messageId ? [messageId] : selectedIds
      if (ids.length === 0) return

      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action, value })
      })

      // Ações que movem a mensagem para outro lugar (deve limpar o painel)
      const movingActions = ['trash', 'restore', 'archive', 'unarchive']
      
      // Limpar painel se a mensagem selecionada foi afetada por ação de movimento
      if (selectedMessage && ids.includes(selectedMessage.id) && movingActions.includes(action)) {
        setSelectedMessage(null)
      }
      
      setSelectedIds([])
      
      // Recarregar lista
      fetchMessages()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Atualizar etiqueta
  const handleLabel = async (label: string, messageId?: string) => {
    const ids = messageId ? [messageId] : selectedIds
    if (ids.length === 0) return

    await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, action: 'label', value: label })
    })

    fetchMessages()
    setShowLabelMenu(false)
  }

  // Salvar notas
  const handleSaveNotes = async () => {
    if (!selectedMessage) return

    await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedMessage.id, notes: notesValue })
    })

    setMessages(messages.map(m => 
      m.id === selectedMessage.id ? { ...m, notes: notesValue } : m
    ))
    setSelectedMessage({ ...selectedMessage, notes: notesValue })
    setEditingNotes(false)
  }

  // Excluir permanentemente
  const handlePermanentDelete = async (id: string) => {
    if (!confirm('Excluir permanentemente esta mensagem? Esta ação não pode ser desfeita.')) return
    
    await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' })
    fetchMessages()
    if (selectedMessage?.id === id) setSelectedMessage(null)
  }

  // Esvaziar lixeira
  const handleEmptyTrash = async () => {
    if (!confirm('Esvaziar a lixeira? Todas as mensagens serão excluídas permanentemente.')) return
    
    await fetch('/api/admin/messages?action=empty-trash', { method: 'DELETE' })
    fetchMessages()
  }

  // Exportar CSV
  const handleExport = async () => {
    const response = await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'export', filter: activeFilter })
    })
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mensagens-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Selecionar mensagem
  const handleSelectMessage = async (msg: Message) => {
    setSelectedMessage(msg)
    setNotesValue(msg.notes || "")
    setEditingNotes(false)

    if (!msg.read) {
      await handleAction('read', msg.id)
    }
  }

  // Checkbox
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(messages.map(m => m.id))
    }
  }

  // Formatar data
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  // Obter cor da etiqueta
  const getLabelInfo = (labelValue: string | null) => {
    return labels.find(l => l.value === labelValue) || null
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header com Stats */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Central de Mensagens</h1>
              <p className="text-sm text-muted-foreground">Gerencie todas as mensagens do site</p>
            </div>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-2xl font-bold text-primary">{stats.unread}</div>
              <div className="text-xs text-muted-foreground">Não Lidas</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{stats.today}</div>
              <div className="text-xs text-muted-foreground">Hoje</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{stats.week}</div>
              <div className="text-xs text-muted-foreground">Esta Semana</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveFilter(item.id); setActiveLabel(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeFilter === item.id 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeFilter === item.id ? 'text-primary' : item.color}`} />
              <span>{item.label}</span>
              {item.id === 'inbox' && stats?.unread ? (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 rounded-full">
                  {stats.unread}
                </span>
              ) : null}
            </button>
          ))}

          <div className="border-t border-border my-3" />

          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
            Etiquetas
          </div>
          
          {labels.map(label => (
            <button
              key={label.value}
              onClick={() => { setActiveLabel(label.value); setActiveFilter('inbox'); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeLabel === label.value 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${label.color}`} />
              <span>{label.label}</span>
              {stats?.byLabel[label.value] ? (
                <span className="ml-auto text-xs text-muted-foreground">
                  {stats.byLabel[label.value]}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar mensagens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="p-2 border-b border-border bg-muted/30 flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll} className="h-7 px-2" title="Selecionar todas">
                <CheckSquare className="w-4 h-4 mr-1" />
                {selectedIds.length}
              </Button>
              {activeFilter === 'trash' ? (
                /* Ações específicas para lixeira */
                <>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('restore')} className="h-7 px-2 text-green-400 hover:text-green-300" title="Restaurar selecionadas">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    if (confirm(`Excluir permanentemente ${selectedIds.length} mensagem(s)? Esta ação não pode ser desfeita.`)) {
                      selectedIds.forEach(id => handlePermanentDelete(id))
                    }
                  }} className="h-7 px-2 text-red-400 hover:text-red-300" title="Excluir permanentemente">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : activeFilter === 'archived' ? (
                /* Ações específicas para arquivadas */
                <>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('read')} className="h-7 px-2" title="Marcar como lida">
                    <MailOpen className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('star')} className="h-7 px-2" title="Marcar com estrela">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('unarchive')} className="h-7 px-2 text-blue-400 hover:text-blue-300" title="Desarquivar">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('trash')} className="h-7 px-2 text-red-400" title="Mover para lixeira">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                /* Ações padrão (inbox, starred) */
                <>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('read')} className="h-7 px-2" title="Marcar como lida">
                    <MailOpen className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('star')} className="h-7 px-2" title="Marcar com estrela">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('archive')} className="h-7 px-2" title="Arquivar">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleAction('trash')} className="h-7 px-2 text-red-400" title="Mover para lixeira">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Trash Actions */}
          {activeFilter === 'trash' && messages.length > 0 && (
            <div className="p-2 border-b border-border bg-red-500/10">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEmptyTrash}
                className="h-7 text-red-400 hover:text-red-300 hover:bg-red-500/20 w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Esvaziar Lixeira
              </Button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MessageSquare className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">Nenhuma mensagem</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {messages.map((msg) => {
                  const labelInfo = getLabelInfo(msg.label)
                  return (
                    <div
                      key={msg.id}
                      className={`relative group ${selectedMessage?.id === msg.id ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                    >
                      <button
                        onClick={() => handleSelectMessage(msg)}
                        className="w-full p-3 text-left"
                      >
                        <div className="flex items-start gap-2">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(msg.id)}
                            onChange={(e) => { e.stopPropagation(); toggleSelect(msg.id); }}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 rounded border-border"
                          />

                          {/* Unread indicator */}
                          <div 
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.read ? 'bg-primary' : 'bg-transparent'}`}
                            title={!msg.read ? 'Não lida' : undefined}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm truncate ${!msg.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                {msg.name}
                              </p>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {formatDate(msg.createdAt)}
                              </span>
                            </div>
                            <p className={`text-sm truncate ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {msg.subject}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {msg.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" title="Favorita" />}
                              {labelInfo && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${labelInfo.color} text-white`} title={`Etiqueta: ${labelInfo.label}`}>
                                  {labelInfo.label}
                                </span>
                              )}
                              {msg.notes && <StickyNote className="w-3 h-3 text-muted-foreground" title="Possui notas" />}
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
          {selectedMessage ? (
            <>
              {/* Detail Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground">{selectedMessage.subject}</h2>
                    <p className="text-sm text-muted-foreground">
                      De: <span className="text-foreground">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFullDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Star */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(selectedMessage.starred ? 'unstar' : 'star', selectedMessage.id)}
                      className="h-8 w-8"
                      title={selectedMessage.starred ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star className={`w-4 h-4 ${selectedMessage.starred ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    </Button>

                    {/* Label Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Adicionar etiqueta">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {labels.map(label => (
                          <DropdownMenuItem
                            key={label.value}
                            onClick={() => handleLabel(label.value, selectedMessage.id)}
                            className="gap-2"
                          >
                            <span className={`w-2 h-2 rounded-full ${label.color}`} />
                            {label.label}
                            {selectedMessage.label === label.value && (
                              <span className="ml-auto">✓</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleLabel('', selectedMessage.id)}
                          className="text-muted-foreground"
                        >
                          Remover etiqueta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Archive/Restore */}
                    {activeFilter !== 'trash' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(selectedMessage.archived ? 'unarchive' : 'archive', selectedMessage.id)}
                        className="h-8 w-8"
                        title={selectedMessage.archived ? 'Desarquivar' : 'Arquivar'}
                      >
                        {selectedMessage.archived ? (
                          <RotateCcw className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Archive className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    )}

                    {/* Trash/Restore/Delete */}
                    {activeFilter === 'trash' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAction('restore', selectedMessage.id)}
                          className="h-8 w-8"
                          title="Restaurar"
                        >
                          <RotateCcw className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePermanentDelete(selectedMessage.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          title="Excluir permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction('trash', selectedMessage.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-400"
                        title="Mover para lixeira"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Label Badge */}
                {selectedMessage.label && (
                  <div className="mt-3">
                    {(() => {
                      const labelInfo = getLabelInfo(selectedMessage.label)
                      return labelInfo ? (
                        <span className={`text-xs px-2 py-1 rounded ${labelInfo.color} text-white`}>
                          {labelInfo.label}
                        </span>
                      ) : null
                    })()}
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-muted/50 rounded-lg p-4 text-foreground whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Notes Section */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <StickyNote className="w-4 h-4" />
                    Notas internas
                  </div>
                  {!editingNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNotes(true)}
                      className="h-7 text-xs"
                    >
                      {selectedMessage.notes ? 'Editar' : 'Adicionar nota'}
                    </Button>
                  )}
                </div>
                
                {editingNotes ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      placeholder="Adicione notas sobre esta mensagem..."
                      className="min-h-[80px] bg-background"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveNotes}>Salvar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingNotes(false)}>Cancelar</Button>
                    </div>
                  </div>
                ) : selectedMessage.notes ? (
                  <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded">
                    {selectedMessage.notes}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic">
                    Nenhuma nota adicionada
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Selecione uma mensagem</p>
              <p className="text-sm">Clique em uma mensagem para visualizar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
