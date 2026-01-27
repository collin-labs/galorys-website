"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Layers, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function NovaSecaoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    order: 1,
    isActive: true,
  })

  // Gerar slug automaticamente do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      const response = await fetch("/api/admin/home-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          order: formData.order,
          active: formData.isActive,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || "Erro ao criar seção")
        return
      }

      router.push("/admin/secoes")
    } catch (err) {
      setError("Erro ao criar seção")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/secoes" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Nova Seção</h1>
            <p className="text-sm text-muted-foreground">Adicione uma nova seção ao site</p>
          </div>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nome da Seção <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="bg-background border-border text-foreground"
              placeholder="Ex: Pioneiros Roblox"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-foreground">
              Slug (identificador) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-background border-border text-foreground"
              placeholder="Ex: pioneers"
              required
            />
            <p className="text-xs text-muted-foreground">
              Identificador único usado no código. Use apenas letras minúsculas, números e hífens.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background border-border text-foreground min-h-[100px]"
              placeholder="Descrição opcional da seção"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order" className="text-foreground">
              Ordem de exibição
            </Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
              className="bg-background border-border text-foreground w-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="isActive" className="text-foreground cursor-pointer">
              Seção ativa (visível no site)
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" /> Criar Seção
              </>
            )}
          </Button>
          <Link href="/admin/secoes">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
