"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Menu, Plus, Trash2, Pencil, GripVertical, Loader2, Check, X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface MenuItem {
  id: string
  label: string
  href: string
  order: number
  active: boolean
  parentId: string | null
  children: MenuItem[]
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({ label: '', href: '', active: true })

  // Buscar dados
  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/admin/menu-items')
      const data = await response.json()
      setMenuItems(data.menuItems || [])
    } catch (error) {
      console.error('Erro ao buscar menu:', error)
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal para criar
  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ label: '', href: '', active: true })
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({ label: item.label, href: item.href, active: item.active })
    setIsModalOpen(true)
  }

  // Salvar (criar ou editar)
  const handleSave = async () => {
    try {
      if (editingItem) {
        // Editar
        const response = await fetch('/api/admin/menu-items', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...formData })
        })
        if (response.ok) {
          await fetchMenuItems()
        }
      } else {
        // Criar
        const response = await fetch('/api/admin/menu-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order: menuItems.length + 1 })
        })
        if (response.ok) {
          await fetchMenuItems()
        }
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Excluir
  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este item do menu?')) return

    try {
      const response = await fetch(`/api/admin/menu-items?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchMenuItems()
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Toggle ativo/inativo
  const toggleActive = async (item: MenuItem) => {
    try {
      await fetch('/api/admin/menu-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, label: item.label, href: item.href, active: !item.active })
      })
      await fetchMenuItems()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  // Mover para cima
  const moveUp = async (index: number) => {
    if (index === 0) return
    const newList = [...menuItems]
    ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
    
    const items = newList.map((item, i) => ({ id: item.id, order: i + 1 }))
    await fetch('/api/admin/menu-items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    
    await fetchMenuItems()
  }

  // Mover para baixo
  const moveDown = async (index: number) => {
    if (index === menuItems.length - 1) return
    const newList = [...menuItems]
    ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
    
    const items = newList.map((item, i) => ({ id: item.id, order: i + 1 }))
    await fetch('/api/admin/menu-items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    
    await fetchMenuItems()
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
            <Menu className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Menu do Site</h1>
              <p className="text-sm text-muted-foreground">
                {menuItems.length} itens no menu
              </p>
            </div>
          </div>
        </div>
        <Button onClick={openCreateModal} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-1" /> Novo Item
        </Button>
      </div>

      {/* Lista de itens */}
      <div className="space-y-2">
        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Menu className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum item de menu configurado.</p>
          </div>
        ) : (
          menuItems.map((item, index) => (
            <div 
              key={item.id}
              className={`flex items-center gap-4 p-4 bg-card border rounded-lg transition-opacity ${
                item.active ? 'border-border' : 'border-border/50 opacity-60'
              }`}
            >
              {/* Reordenar */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  <span className="text-xs">▲</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => moveDown(index)}
                  disabled={index === menuItems.length - 1}
                >
                  <span className="text-xs">▼</span>
                </Button>
              </div>

              <GripVertical className="w-4 h-4 text-muted-foreground" />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.label}</span>
                  {!item.active && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Oculto
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.href}</p>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(item)}
                  className="h-8 w-8"
                  title={item.active ? 'Ocultar' : 'Mostrar'}
                >
                  {item.active ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditModal(item)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="h-8 w-8 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Sobre"
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Visível no menu</label>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              {editingItem ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
