"use client"

import type React from "react"
import { useState, use, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Gift, Save, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarRecompensaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    points: 0,
    stock: 0,
    isActive: true,
    isFeatured: false,
  })

  useEffect(() => {
    async function fetchReward() {
      try {
        const response = await fetch(`/api/admin/rewards/${id}`)
        if (response.ok) {
          const data = await response.json()
          const r = data.reward
          setFormData({
            name: r.name || "",
            description: r.description || "",
            points: r.cost || 0,
            stock: r.quantity || 0,
            isActive: r.active ?? true,
            isFeatured: r.type === 'featured',
          })
        }
      } catch (error) {
        console.error("Erro ao buscar recompensa:", error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchReward()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/rewards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          cost: formData.points,
          quantity: formData.stock,
          active: formData.isActive,
          type: formData.isFeatured ? 'featured' : 'digital',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar recompensa")
      }

      router.push("/admin/recompensas")
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar recompensa")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta recompensa?")) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/rewards/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erro ao excluir recompensa")
      router.push("/admin/recompensas")
    } catch (error: any) {
      alert(error.message || "Erro ao excluir recompensa")
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/recompensas" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Editar Recompensa</h1>
              <p className="text-sm text-muted-foreground">{formData.name}</p>
            </div>
          </div>
        </div>
        <Button onClick={handleDelete} variant="destructive" className="bg-red-600 hover:bg-red-700" disabled={loading}>
          <Trash2 className="w-4 h-4 mr-1" /> {loading ? "Excluindo..." : "Excluir"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nome da Recompensa <span className="text-red-500">*</span>
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
            <Label className="text-foreground">Imagem</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points" className="text-foreground">
                Pontos Necessários
              </Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) || 0 })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-foreground">
                Quantidade em Estoque
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                className="border-border data-[state=checked]:bg-primary"
              />
              <Label htmlFor="isActive" className="text-foreground cursor-pointer">
                Ativo
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked as boolean })}
                className="border-border data-[state=checked]:bg-yellow-500"
              />
              <Label htmlFor="isFeatured" className="text-foreground cursor-pointer">
                Destaque
              </Label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href="/admin/recompensas">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground" disabled={loading}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}