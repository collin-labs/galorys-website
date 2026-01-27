"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Gamepad2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const games = [
  "Counter-Strike 2",
  "Call of Duty Mobile",
  "Valorant",
  "Gran Turismo",
  "Age of Empires",
  "CS2 Galorynhos",
  "League of Legends",
  "Fortnite",
]

export default function NovoTimePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    game: "",
    description: "",
    order: 0,
    isActive: true,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          game: formData.game,
          description: formData.description,
          active: formData.isActive,
          order: formData.order,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao criar time")
      }

      router.push("/admin/times")
    } catch (error: any) {
      alert(error.message || "Erro ao criar time. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/times" className="text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-white">Novo Time</h1>
            <p className="text-sm text-muted-foreground">Preencha os dados do novo time</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-[#14141b] border border-white/10 rounded-xl p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome do Time <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Counter-Strike 2"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-white">
              Slug (URL) <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">/times/</span>
              <Input
                id="slug"
                placeholder="counter-strike-2"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Game */}
          <div className="space-y-2">
            <Label htmlFor="game" className="text-white">
              Jogo <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
              <SelectTrigger className="bg-[#0d0d12] border-white/10 text-white">
                <SelectValue placeholder="Selecione o jogo" />
              </SelectTrigger>
              <SelectContent className="bg-[#14141b] border-white/10">
                {games.map((game) => (
                  <SelectItem key={game} value={game} className="text-white hover:bg-white/10">
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva o time..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#0d0d12] border-white/10 text-white placeholder:text-muted-foreground min-h-[100px]"
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order" className="text-white">
              Ordem de exibição
            </Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
              className="bg-[#0d0d12] border-white/10 text-white w-24"
            />
            <p className="text-xs text-muted-foreground">Menor número = aparece primeiro</p>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="isActive" className="text-white cursor-pointer">
              Time ativo (visível no site)
            </Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? "Criando..." : "Criar Time"}
          </Button>
          <Link href="/admin/times">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-white" disabled={loading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}