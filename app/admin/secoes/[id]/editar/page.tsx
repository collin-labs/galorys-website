"use client"

import type React from "react"
import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Layers, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const sectionsData: Record<
  string,
  { name: string; slug: string; description: string; order: number; isActive: boolean }
> = {
  "1": { name: "Hero Banner", slug: "hero", description: "Seção principal do site", order: 1, isActive: true },
  "2": { name: "Times", slug: "teams", description: "Exibição dos times", order: 2, isActive: true },
  "3": { name: "Conquistas", slug: "achievements", description: "Troféus da organização", order: 3, isActive: true },
}

export default function EditarSecaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const sectionData = sectionsData[id] || sectionsData["1"]

  const [formData, setFormData] = useState({
    name: sectionData.name,
    slug: sectionData.slug,
    description: sectionData.description,
    order: sectionData.order,
    isActive: sectionData.isActive,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updating section:", formData)
    router.push("/admin/secoes")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/secoes" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Editar Seção</h1>
            <p className="text-sm text-muted-foreground">{formData.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nome da Seção <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-foreground">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="bg-background border-border text-foreground"
              required
            />
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
              Seção ativa
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-1" /> Salvar Alterações
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
