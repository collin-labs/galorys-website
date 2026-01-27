"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, LayoutGrid, Plus, Trash2, Pencil, Loader2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface FooterItem {
  id: string
  label: string
  href: string
  order: number
  active: boolean
  columnId: string
}

interface FooterColumn {
  id: string
  name: string
  slug: string
  order: number
  active: boolean
  items: FooterItem[]
}

export default function RodapePage() {
  const [columns, setColumns] = useState<FooterColumn[]>([])
  const [loading, setLoading] = useState(true)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FooterItem | null>(null)
  const [editingColumn, setEditingColumn] = useState<FooterColumn | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")
  const [formData, setFormData] = useState({ label: '', href: '', active: true })
  const [columnFormData, setColumnFormData] = useState({ name: '' })
  const [openColumns, setOpenColumns] = useState<string[]>([])

  // Buscar dados
  useEffect(() => {
    fetchFooter()
  }, [])

  const fetchFooter = async () => {
    try {
      const response = await fetch('/api/admin/footer')
      const data = await response.json()
      setColumns(data.columns || [])
      // Abrir todas as colunas por padrão
      setOpenColumns((data.columns || []).map((c: FooterColumn) => c.id))
    } catch (error) {
      console.error('Erro ao buscar rodapé:', error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle coluna aberta/fechada
  const toggleColumn = (columnId: string) => {
    setOpenColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  // Abrir modal para criar item
  const openCreateItemModal = (columnId: string) => {
    setEditingItem(null)
    setSelectedColumnId(columnId)
    setFormData({ label: '', href: '', active: true })
    setIsItemModalOpen(true)
  }

  // Abrir modal para editar item
  const openEditItemModal = (item: FooterItem) => {
    setEditingItem(item)
    setSelectedColumnId(item.columnId)
    setFormData({ label: item.label, href: item.href, active: item.active })
    setIsItemModalOpen(true)
  }

  // Abrir modal para editar nome da coluna
  const openEditColumnModal = (column: FooterColumn) => {
    setEditingColumn(column)
    setColumnFormData({ name: column.name })
    setIsColumnModalOpen(true)
  }

  // Salvar item
  const handleSaveItem = async () => {
    try {
      if (editingItem) {
        await fetch('/api/admin/footer', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'item', id: editingItem.id, ...formData })
        })
      } else {
        const column = columns.find(c => c.id === selectedColumnId)
        await fetch('/api/admin/footer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'item', 
            columnId: selectedColumnId,
            order: (column?.items.length || 0) + 1,
            ...formData 
          })
        })
      }
      await fetchFooter()
      setIsItemModalOpen(false)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Salvar coluna
  const handleSaveColumn = async () => {
    try {
      if (editingColumn) {
        await fetch('/api/admin/footer', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'column', id: editingColumn.id, ...columnFormData })
        })
        await fetchFooter()
      }
      setIsColumnModalOpen(false)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Excluir item
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Excluir este item do rodapé?')) return
    try {
      await fetch(`/api/admin/footer?type=item&id=${id}`, { method: 'DELETE' })
      await fetchFooter()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Toggle ativo/inativo da COLUNA
  const toggleColumnActive = async (column: FooterColumn) => {
    try {
      await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'column', id: column.id, name: column.name, active: !column.active })
      })
      await fetchFooter()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Toggle ativo/inativo do ITEM
  const toggleItemActive = async (item: FooterItem) => {
    try {
      await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', id: item.id, label: item.label, href: item.href, active: !item.active })
      })
      await fetchFooter()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Rodapé do Site</h1>
              <p className="text-sm text-muted-foreground">
                {columns.length} colunas configuradas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          <strong>Dica:</strong> Clique em <strong>"Visível/Oculta"</strong> para mostrar ou esconder a coluna no rodapé do site.
          Colunas ocultas não aparecem para os visitantes.
        </p>
      </div>

      {/* Colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {columns.map(column => (
          <Collapsible 
            key={column.id} 
            open={openColumns.includes(column.id)}
            onOpenChange={() => toggleColumn(column.id)}
            className={`bg-card border rounded-xl overflow-hidden transition-all ${
              column.active ? 'border-border' : 'border-border/50 opacity-70'
            }`}
          >
            {/* Header da coluna */}
            <div className={`flex items-center justify-between p-4 ${
              column.active ? 'bg-muted/30' : 'bg-muted/10'
            }`}>
              <CollapsibleTrigger className="flex items-center gap-2 flex-1">
                {openColumns.includes(column.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <h3 className={`font-semibold ${column.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {column.name}
                </h3>
                <span className="text-xs text-muted-foreground">
                  ({column.items.filter(i => i.active).length}/{column.items.length} itens)
                </span>
                {!column.active && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                    Oculta
                  </span>
                )}
              </CollapsibleTrigger>
              <div className="flex items-center gap-2">
                {/* Toggle Ativar/Desativar Coluna */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 text-xs gap-1 ${
                    column.active 
                      ? 'text-green-400 hover:text-green-300' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleColumnActive(column)
                  }}
                  title={column.active ? 'Ocultar coluna do rodapé' : 'Mostrar coluna no rodapé'}
                >
                  {column.active ? (
                    <>
                      <Eye className="w-3 h-3" />
                      Visível
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Oculta
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditColumnModal(column)
                  }}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    openCreateItemModal(column.id)
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
            </div>

            {/* Itens da coluna */}
            <CollapsibleContent>
              <div className="p-2 space-y-1">
                {column.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum item nesta coluna
                  </p>
                ) : (
                  column.items.map(item => (
                    <div 
                      key={item.id}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-opacity ${
                        item.active ? 'bg-background' : 'bg-background/50 opacity-60'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.href}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleItemActive(item)}
                        >
                          {item.active ? (
                            <Eye className="w-3 h-3 text-green-400" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => openEditItemModal(item)}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-400"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Modal Item */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingItem ? 'Editar Link' : 'Novo Link'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">Texto</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Sobre Nós"
                className="mt-1 bg-background border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Link</label>
              <Input
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                placeholder="Ex: /sobre"
                className="mt-1 bg-background border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveItem} className="bg-primary hover:bg-primary/90">
              {editingItem ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Coluna */}
      <Dialog open={isColumnModalOpen} onOpenChange={setIsColumnModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Editar Coluna
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nome da Coluna</label>
              <Input
                value={columnFormData.name}
                onChange={(e) => setColumnFormData({ ...columnFormData, name: e.target.value })}
                placeholder="Ex: Institucional"
                className="mt-1 bg-background border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsColumnModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveColumn} className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
